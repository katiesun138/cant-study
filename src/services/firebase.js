import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBN_4np39LsMH_Mn7Y96e4GJzMXd28aWYQ",
  authDomain: "webrtc-call-aea74.firebaseapp.com",
  projectId: "webrtc-call-aea74",
  storageBucket: "webrtc-call-aea74.firebasestorage.app",
  messagingSenderId: "791401647517",
  appId: "1:791401647517:web:760782f831ef10d0f87374",
  measurementId: "G-GZBR5G5TBJ",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
