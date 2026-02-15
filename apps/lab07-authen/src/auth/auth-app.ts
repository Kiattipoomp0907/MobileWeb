
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import type { IAuthService, AuthUser, EmailPasswordCredentials, PhoneCredentials } from "./auth-interface";

function mapUser(u: any): AuthUser {
  return {
    uid: u.uid,
    email: u.email ?? null,
    phoneNumber: u.phoneNumber ?? null,
    displayName: u.displayName ?? null,
    photoUrl: u.photoUrl ?? null,
  };
}

export class FirebaseAppAuthService implements IAuthService {
  async getCurrentUser(): Promise<AuthUser | null> {
    const { user } = await FirebaseAuthentication.getCurrentUser();
    return user ? mapUser(user) : null;
  }

  async loginWithEmailPassword(creds: EmailPasswordCredentials): Promise<AuthUser> {
    const { user } = await FirebaseAuthentication.signInWithEmailAndPassword(creds);
    return mapUser(user);
  }

  async loginWithGoogle(): Promise<AuthUser> {
    const { user } = await FirebaseAuthentication.signInWithGoogle();
    return mapUser(user);
  }

  // Phone Login: Native จะใช้ Event Listener ในการดักจับ OTP
  async startPhoneLogin(creds: PhoneCredentials): Promise<{ verificationId: string }> {
    return new Promise(async (resolve, reject) => {
      // 1. ดักจับกรณีส่งไม่ผ่าน
      const offFailed = await FirebaseAuthentication.addListener("phoneVerificationFailed", (e) => {
        offFailed.remove(); // ลบ listener ออกเพื่อคืน memory
        offSent.remove();
        reject(new Error(e.message ?? "Phone verification failed"));
      });

      // 2. ดักจับกรณีส่ง OTP สำเร็จ (จะได้ verificationId มา)
      const offSent = await FirebaseAuthentication.addListener("phoneCodeSent", (e) => {
        offFailed.remove();
        offSent.remove();
        resolve({ verificationId: e.verificationId });
      });

      // 3. เริ่มส่งคำขอ
      await FirebaseAuthentication.signInWithPhoneNumber({
        phoneNumber: creds.phoneNumberE164,
      });
    });
  }

  async confirmPhoneCode(payload: { verificationId: string; verificationCode: string }): Promise<AuthUser> {
    const { user } = await FirebaseAuthentication.confirmVerificationCode(payload);
    return mapUser(user);
  }

  async logout(): Promise<void> {
    await FirebaseAuthentication.signOut();
  }
}
