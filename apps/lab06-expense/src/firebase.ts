// 1. นำเข้าฟังก์ชันที่จำเป็น (เพิ่ม getFirestore เข้ามา)
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // <--- บรรทัดสำคัญที่ต้องเพิ่ม

// 2. ค่า Config ของคุณ (อันเดิม)
const firebaseConfig = {
  apiKey: "AIzaSyBuiegZ_CNMW9Gt0BNBGDaRp7phVj19CQc",
  authDomain: "mobileapp-3fc09.firebaseapp.com",
  projectId: "mobileapp-3fc09",
  storageBucket: "mobileapp-3fc09.firebasestorage.app",
  messagingSenderId: "682665399312",
  appId: "1:682665399312:web:dc0d553eaa805818ffa695",
  measurementId: "G-7K6L5J3BDY"
};
// 3. เริ่มต้น Firebase App
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 4. เริ่มต้น Database และส่งออกตัวแปร db (สำคัญที่สุดสำหรับ Lab นี้)
export const db = getFirestore(app);