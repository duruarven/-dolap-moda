import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

dotenv.config();

const VERIFICATION_SALT = process.env.VERIFICATION_SALT || 'ceptemoda_secure_verification_salt_2026';

function hashVerificationCode(code: string, email: string): string {
  return crypto
    .createHash('sha256')
    .update(`${code.trim()}:${email.toLowerCase().trim()}:${VERIFICATION_SALT}`)
    .digest('hex');
}

import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

const currentDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

// Initialize Firebase for Backend Service
let db: any = null;
try {
  const firebaseConfigPath = path.join(currentDir, 'firebase-applet-config.json');
  if (fs.existsSync(firebaseConfigPath)) {
    const config = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
    const firebaseApp = initializeApp(config);
    db = getFirestore(firebaseApp, config.firestoreDatabaseId);
  }
} catch (err) {
  console.warn('[SERVER] Could not initialize Firebase Admin/Client for backend:', err);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper to initialize Nodemailer SMTP transporter safely
  let isSmtpDisabled = false;

  const getTransporter = () => {
    if (isSmtpDisabled) return null;

    const host = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = (process.env.SMTP_USER || '').trim();
    const pass = (process.env.SMTP_PASS || '').trim().replace(/\s+/g, ''); // strip spaces if copied from Google App Password

    // Check if user and pass exist and are not empty placeholders
    if (!user || !pass || user === 'your_email@gmail.com' || pass === 'your_app_password' || user === 'user@example.com') {
      return null;
    }

    try {
      if (host.toLowerCase().includes('gmail.com')) {
        return nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user,
            pass,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });
      }

      return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
    } catch {
      return null;
    }
  };

  // Helper to initialize Gemini safely
  const getAi = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY eksik. Lütfen ortam değişkenlerini kontrol edin.');
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // In-memory verification cache for instantaneous and robust code matching
  const serverVerificationStore = new Map<string, { code: string; expiresAt: number; fullName: string; purpose: string }>();

  // Health check API
  app.get('/api/health', (req, res) => {
    const smtpConfigured = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
    res.json({ 
      status: 'ok', 
      app: 'CepteModa API',
      smtpService: smtpConfigured ? 'SMTP Configured' : 'Preview Simulation Mode'
    });
  });

  // API Route: Send Email Verification Code via SMTP / Notification Service
  app.post('/api/auth/send-verification-email', async (req, res) => {
    try {
      const { email, fullName, code: customCode, purpose = 'register', origin: clientOrigin } = req.body;

      if (!email) {
        return res.status(400).json({ 
          success: false, 
          error: 'E-posta adresi zorunludur.' 
        });
      }

      const cleanEmail = email.toLowerCase().trim();

      // Generate 6-digit verification code if not provided
      const code = (customCode && String(customCode).length === 6) 
        ? String(customCode) 
        : Math.floor(100000 + Math.random() * 900000).toString();
      const hashCode = hashVerificationCode(code, cleanEmail);
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

      // Save to in-memory store for instant zero-latency check
      serverVerificationStore.set(cleanEmail, {
        code,
        expiresAt,
        fullName: fullName || 'Değerli Üyemiz',
        purpose
      });

      if (db) {
        try {
          const docId = cleanEmail.replace(/[^a-z0-9]/gi, '_');
          await setDoc(doc(db, 'pending_verification', docId), {
            email: cleanEmail,
            fullName: fullName || 'Değerli Üyemiz',
            code,
            purpose,
            createdAt: new Date().toISOString(),
            expiresAt,
            attempts: 0,
            isUsed: false,
            verifiedAt: null
          }, { merge: true });

          // Also update users table verificationCode if user already created
          try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', cleanEmail));
            const userSnap = await getDocs(q);
            if (!userSnap.empty) {
              await updateDoc(userSnap.docs[0].ref, {
                verificationCode: code
              });
            }
          } catch (e) {
            // non-fatal
          }
        } catch (dbErr) {
          console.warn('[SERVER] Could not store code in Firestore:', dbErr);
        }
      }

      // Compute verification URL
      const hostOrigin = clientOrigin || (req.headers.origin ? `${req.headers.origin}` : `https://${req.headers.host || 'ceptemoda.com'}`);
      const verificationLink = `${hostOrigin}/?verify_email=${encodeURIComponent(email)}&verify_code=${code}&purpose=${purpose}`;

      const transporter = getTransporter();
      const fromAddress = process.env.SMTP_FROM || 'CepteModa <noreply@ceptemoda.com>';

      const isLogin = purpose === 'login';
      const subjectTitle = isLogin 
        ? `🔑 CepteModa Güvenli Giriş Kodunuz: ${code}`
        : `✨ CepteModa Hesabınızı Doğrulayın (Onay Kodu: ${code})`;
      const actionTitle = isLogin ? 'Güvenli Giriş Onayı' : 'E-Posta Doğrulama & Aktivasyon';
      const actionText = isLogin
        ? 'CepteModa hesabınıza güvenli bir şekilde giriş yapmak üzeresiniz. Lütfen aşağıdaki 6 haneli güvenlik kodunu giriş ekranına yazın:'
        : 'CepteModa ailesine hoş geldiniz! Hesabınızı aktifleştirmek ve güvenle alışverişe başlamak için lütfen aşağıdaki 6 haneli onay kodunu kayıt ekranına giriniz:';

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
            body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 40px 20px; color: #0f172a; }
            .container { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
            .header { background: #ffffff; padding: 32px 24px 24px; text-align: center; border-bottom: 1px solid #f1f5f9; }
            .header-logo { display: inline-block; background: linear-gradient(135deg, #e11d48 0%, #be123c 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 28px; font-weight: 800; letter-spacing: -1px; margin: 0; }
            .header p { margin: 8px 0 0 0; color: #64748b; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; }
            .content { padding: 32px 32px 40px; text-align: center; }
            .content h2 { font-size: 20px; margin-top:0; color: #0f172a; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 12px; }
            .content p { font-size: 15px; color: #475569; line-height: 1.6; margin: 0 0 24px; }
            .code-box { background: #fff1f2; border: 2px dashed #fda4af; border-radius: 16px; padding: 24px; margin: 0 0 24px; }
            .code { font-family: 'Plus Jakarta Sans', monospace; font-size: 40px; font-weight: 800; letter-spacing: 12px; color: #be123c; margin: 0; padding-left: 12px; }
            .security-notice { font-size: 13px; color: #64748b; line-height: 1.5; background: #f8fafc; padding: 16px; border-radius: 12px; }
            .footer { background: #f8fafc; padding: 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
            .footer a { color: #e11d48; text-decoration: none; font-weight: 500; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="header-logo">CepteModa</h1>
              <p>İkinci El Lüks Moda</p>
            </div>
            <div class="content">
              <h2>Merhaba ${fullName || 'Değerli Üyemiz'},</h2>
              <p>
                ${actionText}
              </p>

              <div class="code-box">
                <div class="code">${code}</div>
              </div>

              <div class="security-notice">
                🔒 <strong>Güvenlik Notu:</strong> Bu onay kodu <strong>10 dakika</strong> boyunca geçerlidir. Güvenliğiniz için bu kodu kimseyle paylaşmayınız.
              </div>
            </div>
            <div class="footer">
              Eğer bu işlemi siz yapmadıysanız lütfen bu e-postayı dikkate almayınız.<br><br>
              &copy; ${new Date().getFullYear()} CepteModa. Tüm hakları saklıdır.<br>
              <a href="https://ceptemoda.com">ceptemoda.com</a>
            </div>
          </div>
        </body>
        </html>
      `;

      if (!transporter) {
        console.warn('[SMTP WARNING] Transporter is not configured. Falling back to simulation mode.');
        console.log(`[SIMULATION MODE] Verification code for ${email} is: ${code}`);
        return res.json({
          success: true,
          hashCode,
          expiresAt,
          smtpConfigured: false,
          simulated: true,
          verificationLink,
          message: `[TEST MODU] SMTP Yapılandırılmadı. Onay Kodunuz: ${code}`,
        });
      }

      try {
        // Real SMTP Delivery
        await transporter.sendMail({
          from: fromAddress,
          to: email,
          subject: subjectTitle,
          html: emailHtml,
        });

        console.log(`[SMTP EMAIL SENT] Real email delivered to ${email}`);
        return res.json({
          success: true,
          hashCode,
          expiresAt,
          smtpConfigured: true,
          verificationLink,
          message: `${email} adresinize doğrulama bağlantısı ve onay kodu e-posta olarak gönderildi.`,
        });
      } catch (smtpError: any) {
        const errorMsg = smtpError?.message || String(smtpError);
        console.warn(`[SMTP WARN] Failed to send email to ${email}:`, errorMsg);
        
        if (errorMsg.includes('535') && errorMsg.includes('5.7.8')) {
          console.warn(`[SMTP HINT] Gmail kullanıyorsanız, normal şifrenizi değil "Uygulama Şifresi" (App Password) kullanmalısınız. Hesabınızda 2 Adımlı Doğrulama'yı açıp bir Uygulama Şifresi oluşturun ve SMTP_PASS alanına yapıştırın.`);
        }
        
        // DEV/PREVIEW FALLBACK: If SMTP is misconfigured, don't completely lock out the user.
        console.log(`[SIMULATION MODE] Verification code for ${email} is: ${code}`);
        return res.json({
          success: true,
          hashCode,
          expiresAt,
          smtpConfigured: false,
          simulated: true,
          verificationLink,
          message: `[TEST MODU] SMTP Hatalı (535). Onay Kodunuz: ${code}`,
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'E-posta doğrulama kodu oluşturulurken bir sorun oluştu.',
      });
    }
  });

  // API Route: Verify 6-digit confirmation code against temporary hashed code
  app.post('/api/auth/verify-code', async (req, res) => {
    try {
      const { email, code, hashCode, expiresAt } = req.body;

      if (!email || !code) {
        return res.status(400).json({
          success: false,
          error: 'E-posta adresi ve 6 haneli onay kodu zorunludur.',
        });
      }

      const cleanEmail = email.toLowerCase().trim();
      const cleanCode = String(code).trim();

      if (expiresAt && Date.now() > Number(expiresAt)) {
        return res.status(400).json({
          success: false,
          error: 'Doğrulama kodunun süresi dolmuş (10 dakika geçerli). Lütfen yeni kod isteyiniz.',
        });
      }

      let isCodeValid = false;

      // 1. Check in-memory verification cache first (instant and reliable)
      const cached = serverVerificationStore.get(cleanEmail);
      if (cached) {
        if (Date.now() > cached.expiresAt) {
          serverVerificationStore.delete(cleanEmail);
          return res.status(400).json({
            success: false,
            error: 'Doğrulama kodunun süresi dolmuş. Lütfen yeni kod isteyiniz.'
          });
        }

        if (cached.code === cleanCode) {
          isCodeValid = true;
          serverVerificationStore.delete(cleanEmail); // Single use
        }
      }

      // 2. Check via Firestore pending_verification and users collections
      if (!isCodeValid && db) {
        try {
          const docId = cleanEmail.replace(/[^a-z0-9]/gi, '_');
          const snap = await getDoc(doc(db, 'pending_verification', docId));
          if (snap.exists()) {
            const data = snap.data();
            
            // Check expiry
            if (data.expiresAt && Date.now() > data.expiresAt) {
              return res.status(400).json({
                success: false,
                error: 'Doğrulama kodunun süresi dolmuş. Lütfen yeni kod isteyiniz.'
              });
            }

            // Check code match
            if (data.code === cleanCode) {
              isCodeValid = true;
              await updateDoc(doc(db, 'pending_verification', docId), {
                isUsed: true,
                verifiedAt: new Date().toISOString()
              });
            }
          }

          // Also check users collection directly
          if (!isCodeValid) {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', cleanEmail));
            const userSnap = await getDocs(q);
            if (!userSnap.empty) {
              const uData = userSnap.docs[0].data();
              if (uData.verificationCode === cleanCode) {
                isCodeValid = true;
              }
            }
          }
        } catch (dbErr) {
          console.warn('[SERVER] Firestore verification check warning:', dbErr);
        }
      }

      // 3. Fallback to Hash verification
      if (!isCodeValid && hashCode) {
        const expectedHash = hashVerificationCode(cleanCode, cleanEmail);
        if (expectedHash === hashCode) {
          isCodeValid = true;
        }
      }

      if (isCodeValid) {
        // Auto-activate user in Firestore if user profile exists
        if (db) {
          try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', cleanEmail));
            const userSnap = await getDocs(q);
            if (!userSnap.empty) {
              await updateDoc(userSnap.docs[0].ref, {
                status: 'active',
                isEmailVerified: true,
                isVerified: true,
                verificationCode: null,
                verifiedAt: new Date().toISOString()
              });
            }
          } catch (activateErr) {
            console.warn('[SERVER] Could not auto-activate user document:', activateErr);
          }
        }

        return res.json({
          success: true,
          verified: true,
          message: 'E-posta adresi başarıyla doğrulandı.'
        });
      } else {
        return res.status(400).json({
          success: false,
          verified: false,
          error: 'Girdiğiniz 6 haneli onay kodu hatalı. Lütfen e-postanızı veya ekrandaki bildirim kodunu kontrol ediniz.'
        });
      }
    } catch (error: any) {
      console.error('[VERIFY ERROR]', error);
      res.status(500).json({
        success: false,
        error: 'Doğrulama işlemi sırasında bir sunucu hatası oluştu.',
      });
    }
  });

  // API Route: AI Product Analysis (Auto title, category, brand, condition, description, suggested price)
  app.post('/api/ai/analyze-product', async (req, res) => {
    try {
      const { title, imageBase64, categoryPrompt } = req.body;
      const ai = getAi();

      const prompt = `Sen Türkiye'nin en popüler ikinci el moda pazaryerinin (Dolap/Gardrops benzeri) yapay zeka ürün uzmanısın.
Kullanıcının eklemek istediği kıyafet/moda ürünü için şu bilgileri Türkçe olarak JSON formatında üret:
1. "suggestedTitle": Ürün için çekici, SEO uyumlu ve öz kısa başlık (örn: "Zara Siyah Hakiki Deri Ceket - S Beden")
2. "suggestedCategory": En uygun kategori ("Kadın", "Erkek", "Çocuk", "Lüks", "Ayakkabı", "Çanta", "Aksesuar")
3. "suggestedBrand": Marka tahmini (Zara, Mango, Nike, Adidas, Gucci, LCW, Stradivarius, Pull&Bear, Massimo Dutti)
4. "suggestedCondition": "Yeni & Etiketli", "Az Kullanılmış" veya "Makul Durumda"
5. "estimatedPrice": İkinci el piyasasına göre uygun önerilen satış fiyatı (TL cinsinden tamsayı, örn: 450)
6. "originalPrice": Tahmini sıfır mağaza fiyatı (TL cinsinden tamsayı, örn: 1250)
7. "autoDescription": Detaylı, ilgi çekici ve satışı kolaylaştıracak açıklama metni.

Kullanıcı Girdisi: "${title || categoryPrompt || 'Şık moda ürünü'}"

Sadece geçerli bir JSON yanıtı döndür:
{
  "suggestedTitle": "...",
  "suggestedCategory": "...",
  "suggestedBrand": "...",
  "suggestedCondition": "...",
  "estimatedPrice": 450,
  "originalPrice": 1250,
  "autoDescription": "..."
}`;

      let contents: any[] = [prompt];

      if (imageBase64 && imageBase64.startsWith('data:image')) {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        contents = [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/jpeg',
            },
          },
          prompt,
        ];
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'AI analizi yapılırken bir hata oluştu.' 
      });
    }
  });

  // API Route: AI Fashion Advisor & Price Negotiator
  app.post('/api/ai/fashion-assistant', async (req, res) => {
    try {
      const { userMessage, contextProduct } = req.body;
      const ai = getAi();

      const systemPrompt = `Sen CepteModa ikinci el moda platformunun akıllı moda asistanısın.
Adın: "CepteModa AI Asistanı".
Amacın: Kullanıcılara ürün seçimi, kombin önerileri, pazarlık ve teklif verme stratejisi, kargo süreci ve alıcı güvencesi hakkında Türkçe profesyonel ve samimi bilgi vermektir.

İncelenen Ürün Detayı (Varsa):
${contextProduct ? JSON.stringify(contextProduct) : 'Genel Moda Sorusu'}

Kullanıcının Mesajı: "${userMessage}"

Lütfen samimi, moda bilgisi yüksek, kısa ve öz yanıt ver. Ayrıca kullanıcının tıklayabileceği 2 hızlı yanıt önerisi üret.
JSON Formatı:
{
  "reply": "Kullanıcıya vereceğin samimi yanıt...",
  "quickSuggestions": ["Bu fiyata teklif verilmeli mi?", "Nasıl kombinlenir?"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [systemPrompt],
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.error('Gemini Assistant Error:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'AI Asistan yanıtı alınamadı.' 
      });
    }
  });

  // Serve static files or Vite dev middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CepteModa server listening on http://localhost:${PORT}`);
  });
}

startServer();
