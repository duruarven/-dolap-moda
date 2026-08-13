import nodemailer from 'nodemailer';
import crypto from 'crypto';

const VERIFICATION_SALT = process.env.VERIFICATION_SALT || 'ceptemoda_secure_verification_salt_2026';

function hashVerificationCode(code: string, email: string): string {
  return crypto
    .createHash('sha256')
    .update(`${code.trim()}:${email.toLowerCase().trim()}:${VERIFICATION_SALT}`)
    .digest('hex');
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email, fullName, code: customCode } = req.body || {};

    if (!email) {
      return res.status(400).json({ success: false, error: 'E-posta adresi zorunludur.' });
    }

    const code = customCode || Math.floor(100000 + Math.random() * 900000).toString();
    const hashCode = hashVerificationCode(code, email);
    const expiresAt = Date.now() + 10 * 60 * 1000;

    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const fromAddress = process.env.SMTP_FROM || `CepteModa <${user}>`;

    if (!user || !pass) {
      return res.status(500).json({ 
        success: false, 
        error: 'SMTP ayarları Vercel üzerinde tanımlı değil (SMTP_USER veya SMTP_PASS eksik).' 
      });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px;">
        <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0;">
          <h1 style="color: #e11d48; margin-top:0;">CepteModa</h1>
          <p>Merhaba <strong>${fullName || 'Değerli Üyemiz'}</strong>,</p>
          <p>CepteModa doğrulama kodunuz:</p>
          <div style="background: #f1f5f9; text-align: center; padding: 16px; border-radius: 12px; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #e11d48;">
            ${code}
          </div>
          <p style="font-size: 12px; color: #64748b; margin-top: 20px;">Bu kod 10 dakika geçerlidir.</p>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: `🔑 CepteModa E-Posta Onay Kodunuz: ${code}`,
      html: emailHtml,
    });

    return res.status(200).json({
      success: true,
      hashCode,
      expiresAt,
      smtpConfigured: true,
      message: `${email} adresine doğrulama kodu e-posta olarak gönderildi.`,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'E-posta gönderilemedi.',
    });
  }
}
