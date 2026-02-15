import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  type ConfirmationResult 
} from "firebase/auth";
import type { AuthUser, IAuthService, EmailPasswordCredentials, PhoneCredentials } from "./auth-interface";
// 🔴 ใส่ config จาก Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBuiegZ_CNMW9Gt0BNBGDaRp7phVj19CQc",
  authDomain: "mobileapp-3fc09.firebaseapp.com",
  projectId: "mobileapp-3fc09",
  storageBucket: "mobileapp-3fc09.firebasestorage.app",
  messagingSenderId: "682665399312",
  appId: "1:682665399312:web:dc0d553eaa805818ffa695",
  measurementId: "G-7K6L5J3BDY"
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);

function mapUser(u: any): AuthUser {
  return {
    uid: u.uid,
    email: u.email,
    phoneNumber: u.phoneNumber, // บนเว็บอาจจะเป็น null ได้ถ้า login ด้วยวิธีอื่น
    displayName: u.displayName,
    photoUrl: u.photoURL,
  };
}

// ตัวแปรเก็บ state สำหรับ Phone Login
let appVerifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;
const recaptchaContainerId = "recaptcha-container"; // ⚠️ ต้องมี <div id="recaptcha-container"> ในหน้า Login

export function getRecaptchaVerifier(): RecaptchaVerifier {
  // ล้างค่าเก่าทิ้งถ้าเคยมี เพื่อป้องกันอาการค้าง (Timeout)
  if (appVerifier) {
    appVerifier.clear();
    appVerifier = null;
  }

  appVerifier = new RecaptchaVerifier(firebaseAuth, recaptchaContainerId, {
    size: "normal", // เปลี่ยนเป็น 'normal' ก่อนเพื่อเช็คว่าปุ่มขึ้นไหม ถ้าผ่านค่อยแก้เป็น 'invisible'
    callback: (response: any) => {
      console.log("reCAPTCHA solved!");
    },
    "expired-callback": () => {
      console.log("reCAPTCHA expired, please solve again.");
    }
  });

  return appVerifier;
}

export class FirebaseWebAuthService implements IAuthService {
  async getCurrentUser(): Promise<AuthUser | null> {
     // รอให้ Firebase เช็คสถานะเสร็จก่อน (optional wrapper could be used here)
     // แต่เบื้องต้นเช็คจาก currentUser ได้เลย
    return firebaseAuth.currentUser ? mapUser(firebaseAuth.currentUser) : null;
  }

  async loginWithEmailPassword(creds: EmailPasswordCredentials): Promise<AuthUser> {
    const r = await signInWithEmailAndPassword(firebaseAuth, creds.email, creds.password);
    return mapUser(r.user);
  }

  async loginWithGoogle(): Promise<AuthUser> {
    const provider = new GoogleAuthProvider();
    const r = await signInWithPopup(firebaseAuth, provider);
    return mapUser(r.user);
  }

  async startPhoneLogin(creds: PhoneCredentials): Promise<{ verificationId: string }> {
    try {
      const verifier = getRecaptchaVerifier();
      
      // บังคับให้ reCAPTCHA วาดตัวตนออกมาบนหน้าจอก่อน
      await verifier.render(); 

      // ส่ง SMS
      confirmationResult = await signInWithPhoneNumber(firebaseAuth, creds.phoneNumberE164, verifier);
      
      return { verificationId: confirmationResult.verificationId };
    } catch (error: any) {
      console.error("Phone Login Error:", error);
      // ถ้าพัง ให้ล้างค่า verifier ทิ้งเพื่อให้กดใหม่ได้
      if (appVerifier) {
        appVerifier.clear();
        appVerifier = null;
      }
      throw error;
    }
  }

  async confirmPhoneCode(payload: { verificationId: string; verificationCode: string }): Promise<AuthUser> {
    if (!confirmationResult) {
      throw new Error("No confirmation result available (Web)");
    }
    const r = await confirmationResult.confirm(payload.verificationCode);
    return mapUser(r.user);
  }

  async logout(): Promise<void> {
    await firebaseAuth.signOut();
  }
}