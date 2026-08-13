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

const currentDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper to initialize Nodemailer SMTP transporter safely
  const getTransporter = () => {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
      return null;
    }

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for 587
      auth: {
        user,
        pass,
      },
    });
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
      const { email, fullName, code: customCode } = req.body;

      if (!email) {
        return res.status(400).json({ 
          success: false, 
          error: 'E-posta adresi zorunludur.' 
        });
      }

      // Generate 6-digit verification code if not provided
      const code = customCode || Math.floor(100000 + Math.random() * 900000).toString();
      const hashCode = hashVerificationCode(code, email);
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

      const transporter = getTransporter();
      const fromAddress = process.env.SMTP_FROM || 'CepteModa <noreply@ceptemoda.com>';

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
            .container { max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
            .header { background: linear-gradient(135deg, #e11d48 0%, #db2777 100%); padding: 30px 20px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 800; tracking: -0.5px; }
            .header p { margin: 6px 0 0 0; opacity: 0.9; font-size: 13px; }
            .content { padding: 30px 24px; }
            .code-box { background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 16px; text-align: center; padding: 20px; margin: 20px 0; }
            .code { font-family: monospace; font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #e11d48; margin: 0; }
            .footer { background: #f8fafc; padding: 16px 20px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #f1f5f9; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>CepteModa</h1>
              <p>İkinci El Moda & Lüks Alışveriş Platformu</p>
            </div>
            <div class="content">
              <h2 style="font-size: 18px; margin-top:0;">Merhaba ${fullName || 'Değerli Üyemiz'},</h2>
              <p style="font-size: 14px; color: #475569; line-height: 1.6;">
                CepteModa hesabınızı oluşturmak için e-posta doğrulama adımındasınız. Lütfen aşağıdaki 6 haneli güvenlik kodunu üyelik ekranına giriniz:
              </p>
              
              <div class="code-box">
                <div class="code">${code}</div>
              </div>

              <p style="font-size: 12px; color: #94a3b8; text-align: center;">
                Bu onay kodu 10 dakika boyunca geçerlidir. Lütfen bu kodu kimseyle paylaşmayınız.
              </p>
            </div>
            <div class="footer">
              Bu e-posta otomasyon sistemi tarafından otomatik oluşturulmuştur. Cevap vermeyiniz.<br>
              &copy; 2026 CepteModa A.Ş. Tüm hakları saklıdır.
            </div>
          </div>
        </body>
        </html>
      `;

      if (transporter) {
        try {
          // Real SMTP Delivery
          await transporter.sendMail({
            from: fromAddress,
            to: email,
            subject: `🔑 CepteModa E-Posta Onay Kodunuz: ${code}`,
            html: emailHtml,
          });

          console.log(`[SMTP EMAIL SENT] Real email delivered to ${email} with code ${code}`);
          return res.json({
            success: true,
            hashCode,
            expiresAt,
            smtpConfigured: true,
            message: `${email} adresine doğrulama kodu başarıyla e-posta olarak gönderildi.`,
          });
        } catch (smtpError: any) {
          console.warn(`[SMTP DELIVERY WARNING] SMTP authentication or sending failed (${smtpError.message}). Falling back to simulation mode.`);
          return res.json({
            success: true,
            hashCode,
            expiresAt,
            smtpConfigured: false,
            simulated: true,
            message: `${email} adresine doğrulama e-postası tetiklendi (SMTP bağlantı uyarısı: Güvenli simülasyon modunda devam ediliyor).`,
          });
        }
      } else {
        // Fallback preview mode (Log to console & return hashed code for app state verification)
        console.log(`[SMTP SIMULATION MODE] Verification code generated for ${email}: ${code} (Configure SMTP_USER & SMTP_PASS in .env.example for live delivery)`);
        return res.json({
          success: true,
          hashCode,
          expiresAt,
          smtpConfigured: false,
          simulated: true,
          message: `${email} adresine doğrulama e-postası tetiklendi (Güvenlik Önizleme Modu).`,
        });
      }
    } catch (error: any) {
      console.error('[SMTP ERROR]', error);
      res.status(500).json({
        success: false,
        error: error.message || 'E-posta gönderimi sırasında bir sunucu hatası oluştu.',
      });
    }
  });

  // API Route: Verify 6-digit confirmation code against temporary hashed code
  app.post('/api/auth/verify-code', (req, res) => {
    try {
      const { email, code, hashCode, expiresAt } = req.body;

      if (!email || !code || !hashCode) {
        return res.status(400).json({
          success: false,
          error: 'E-posta adresi, 6 haneli onay kodu ve doğrulama anahtarı zorunludur.',
        });
      }

      if (expiresAt && Date.now() > Number(expiresAt)) {
        return res.status(400).json({
          success: false,
          error: 'Doğrulama kodunun süresi dolmuş (10 dakika geçerli). Lütfen yeni kod isteyiniz.',
        });
      }

      const expectedHash = hashVerificationCode(code, email);

      if (expectedHash === hashCode) {
        return res.json({
          success: true,
          verified: true,
          message: 'E-posta adresi başarıyla doğrulandı.',
        });
      } else {
        return res.status(400).json({
          success: false,
          error: 'Girdiğiniz 6 haneli onay kodu hatalı. Lütfen e-postanızı kontrol edip tekrar deneyiniz.',
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
