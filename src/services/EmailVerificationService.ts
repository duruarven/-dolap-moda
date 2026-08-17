import { db } from '../lib/firebase';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export interface VerificationRecord {
  email: string;
  fullName: string;
  code: string;
  purpose: 'register' | 'login';
  createdAt: string;
  expiresAt: number;
  attempts: number;
  isUsed: boolean;
  verifiedAt?: string | null;
}

export interface SendCodeResult {
  success: boolean;
  expiresAt?: number;
  message?: string;
  error?: string;
  hashCode?: string;
  code?: string;
  simulatedCode?: string;
  verificationLink?: string;
  smtpConfigured?: boolean;
}

export interface VerifyCodeResult {
  success: boolean;
  verified: boolean;
  message?: string;
  error?: string;
}

class EmailVerificationServiceClass {
  // Collection name in Firestore for temporary verification documents
  private collectionName = 'verification_codes';
  // Code expiration duration: 10 minutes in milliseconds
  private codeValidityMs = 10 * 60 * 1000;
  // Maximum allowed attempts before invalidating the code
  private maxAttempts = 5;

  /**
   * Helper to generate a safe document ID from email address
   */
  private getDocId(email: string): string {
    return email.toLowerCase().trim().replace(/[^a-z0-9]/gi, '_');
  }

  /**
   * Generates a 6-digit verification code, persists it temporarily in Firestore,
   * and dispatches the verification email to the user's address.
   */
  public async sendVerificationCode(
    email: string,
    fullName: string = 'Değerli Üyemiz',
    purpose: 'register' | 'login' = 'register',
    customCode?: string
  ): Promise<SendCodeResult> {
    const cleanEmail = email.toLowerCase().trim();
    const cleanName = fullName.trim() || 'Değerli Üyemiz';

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return {
        success: false,
        error: 'Lütfen geçerli bir e-posta adresi giriniz.'
      };
    }

    const clientOrigin = typeof window !== 'undefined' ? window.location.origin : '';

    // Dispatch Email via Server-side SMTP endpoint
    try {
      const response = await fetch('/api/auth/send-verification-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          fullName: cleanName,
          purpose,
          code: customCode,
          origin: clientOrigin
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'E-posta gönderimi sırasında bir hata oluştu.'
        };
      }

      return {
        success: true,
        expiresAt: data.expiresAt,
        hashCode: data.hashCode,
        code: data.code,
        simulatedCode: data.simulatedCode,
        verificationLink: data.verificationLink,
        smtpConfigured: data.smtpConfigured,
        message: data.message || `${cleanEmail} adresine aktivasyon linki ve 6 haneli onay kodu gönderildi.`
      };
    } catch (networkErr: any) {
      console.error('[EmailVerificationService] Network error sending email:', networkErr);
      return {
        success: false,
        error: 'E-posta servisine ulaşılamadı. Lütfen internet bağlantınızı kontrol ediniz.'
      };
    }
  }

  /**
   * Checks whether the user's verification status is already completed
   */
  public async checkVerificationStatus(email: string): Promise<boolean> {
    const cleanEmail = email.toLowerCase().trim();
    const docId = this.getDocId(cleanEmail);

    try {
      const docRef = doc(db, this.collectionName, docId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as VerificationRecord;
        if (data.isUsed) return true;
      }
    } catch (e) {
      // ignore
    }

    try {
      const userSnap = await getDoc(doc(db, 'users', cleanEmail));
      if (userSnap.exists() && userSnap.data()?.isEmailVerified) {
        return true;
      }
    } catch (e) {
      // ignore
    }

    return false;
  }

  /**
   * Verifies the 6-digit code against the Firestore database temporary record.
   */
  public async verifyCode(
    email: string,
    inputCode: string,
    purpose?: 'register' | 'login',
    hashCode?: string,
    expiresAt?: number
  ): Promise<VerifyCodeResult> {
    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = inputCode.trim();

    if (!cleanEmail || !cleanCode) {
      return {
        success: false,
        verified: false,
        error: 'E-posta veya doğrulama kodu eksik.'
      };
    }

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          code: cleanCode,
          hashCode,
          expiresAt
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          verified: true,
          message: data.message || 'E-posta doğrulama kodu başarıyla onaylandı.'
        };
      } else {
        return {
          success: false,
          verified: false,
          error: data.error || 'Doğrulama işlemi başarısız oldu.'
        };
      }
    } catch (err) {
      console.error('[EmailVerificationService] Verify code network error:', err);
      return {
        success: false,
        verified: false,
        error: 'Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edip tekrar deneyiniz.'
      };
    }
  }

  /**
   * Invalidates or cleans up temporary verification record
   */
  public async invalidateVerification(email: string): Promise<void> {
    const docId = this.getDocId(email);
    try {
      const docRef = doc(db, this.collectionName, docId);
      await deleteDoc(docRef);
    } catch (e) {
      // ignore
    }
    try {
      localStorage.removeItem(`cm_verify_${docId}`);
    } catch (e) {
      // ignore
    }
  }
}

// Export singleton instance and class
export const EmailVerificationService = new EmailVerificationServiceClass();
export default EmailVerificationService;
