import nodemailer from 'nodemailer';

// E-posta Gönderme API Rotası
app.post('/api/auth/send-verification-email', async (req, res) => {
  try {
    const { email, fullName } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'E-posta adresi gereklidir.' });
    }

    // 6 Haneli Rastgele Onay Kodu Üret
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Nodemailer SMTP Ayarları (Render Environment Variables'dan Okur)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
        <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; border: 1px solid #e5e7eb;">
          <h2 style="color: #e11d48; margin-top: 0;">CepteModa</h2>
          <p>Merhaba <strong>${fullName || 'Değerli Üyemiz'}</strong>,</p>
          <p>CepteModa hesabınızı doğrulamak için aşağıdaki 6 haneli kodu kullanabilirsiniz:</p>
          <div style="background: #f1f5f9; padding: 15px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #e11d48; border-radius: 8px;">
            ${code}
          </div>
          <p style="font-size: 12px; color: #6b7280; margin-top: 20px;">Bu kod 10 dakika süreyle geçerlidir.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || `CepteModa <${process.env.SMTP_USER}>`,
      to: email,
      subject: `🔑 CepteModa E-Posta Onay Kodunuz: ${code}`,
      html: emailHtml,
    });

    console.log(`[SUCCESS] ${email} adresine onay kodu gönderildi: ${code}`);

    return res.status(200).json({
      success: true,
      message: 'Doğrulama e-postası başarıyla gönderildi.',
      code: code // Ön yüz doğrulaması için
    });

  } catch (error: any) {
    console.error('[SMTP ERROR]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'E-posta gönderilirken bir sunucu hatası oluştu.'
    });
  }
});
