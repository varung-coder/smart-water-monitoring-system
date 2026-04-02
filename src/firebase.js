import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCq_vO2cPVhC44bSgAeFB9wFz7pxT6HK_g",
  authDomain: "water-monitoring-system-5acfe.firebaseapp.com",
  projectId: "water-monitoring-system-5acfe",
  storageBucket: "water-monitoring-system-5acfe.firebasestorage.app",
  messagingSenderId: "839236886948",
  appId: "1:839236886948:web:493a8f168dfe4262446131",
  measurementId: "G-S6872P4N6R"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider, analytics };
