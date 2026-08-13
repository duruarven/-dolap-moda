import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware (İstek izinleri ve JSON ayrıştırma)
app.use(cors({ origin: '*' }));
app.use(express.json());

// Sağlık Kontrolü (Health Check)
app.get('/', (req, res) => {
  res.send('CepteModa Backend Sunucusu Yayında! 🚀');
});

// ------------------------------------------------------------------
// 🔑 E-POSTA DOĞRULAMA KODU GÖNDERME API ROTASI
// ------------------------------------------------------------------
app.post('/api/auth/send-verification-email', async (req, res) => {
  try {
    const { email, fullName } = req.body || {};

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'E-posta adresi zorunludur.' 
      });
    }

    // 6 Haneli Rastgele Onay Kodu Üret
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // SMTP Yapılandırması (Render Environment Variables üzerinden okunur)
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
      console.error('[SMTP ERROR] SMTP_USER veya SMTP_PASS Render değişkenlerinde tanımlı değil.');
      return res.status(500).json({
        success: false,
        error: 'Sunucuda e-posta ayarları (SMTP) eksik.'
      });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // 465 ise true, 587 ise false
      auth: { user, pass },
    });

    // Şık HTML E-posta Şablonu
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px;">
        <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
          <h1 style="color: #e11d48; margin-top: 0; font-size: 24px;">CepteModa</h1>
          <p style="color: #334155; font-size: 16px;">Merhaba <strong>${fullName || 'Değerli Üyemiz'}</strong>,</p>
          <p style="color: #475569; font-size: 14px;">CepteModa üyeliğinizi tamamlamak için e-posta doğrulama kodunuz:</p>
          <div style="background: #f1f5f9; text-align: center; padding: 18px; border-radius: 12px; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #e11d48; margin: 20px 0;">
            ${code}
          </div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">Bu kod 10 dakika boyunca geçerlidir. Kodunuzu kimseyle paylaşmayınız.</p>
        </div>
      </body>
      </html>
    `;

    // E-postayı Gönder
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `CepteModa <${user}>`,
      to: email,
      subject: `🔑 CepteModa E-Posta Onay Kodunuz: ${code}`,
      html: emailHtml,
    });

    console.log(`[SUCCESS] ${email} adresine onay kodu başarıyla gönderildi: ${code}`);

    return res.status(200).json({
      success: true,
      code: code, // Ön yüzde kullanıcının girdiği kodla eşleştirmek için
      message: `${email} adresine doğrulama kodu e-posta olarak gönderildi.`
    });

  } catch (error: any) {
    console.error('[SMTP GÖNDERİM HATASI]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'E-posta gönderimi sırasında bir hata oluştu.'
    });
  }
});

// Sunucuyu Dinlemeye Başla
app.listen(PORT, () => {
  console.log(`CepteModa backend sunucusu ${PORT} portunda çalışıyor.`);
});
