import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuiegZ_CNMW9Gt0BNBGDaRp7phVj19CQc",
  authDomain: "mobileapp-3fc09.firebaseapp.com",
  projectId: "mobileapp-3fc09",
  storageBucket: "mobileapp-3fc09.firebasestorage.app",
  messagingSenderId: "682665399312",
  appId: "1:682665399312:web:dc0d553eaa805818ffa695",
  measurementId: "G-7K6L5J3BDY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore instance
export const db = getFirestore(app);