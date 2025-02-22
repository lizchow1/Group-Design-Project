import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "YOUR-API-KEY",
  authDomain: "group-design-project-79e91.firebaseapp.com",
  projectId: "group-design-project-79e91",
  storageBucket: "group-design-project-79e91.appspot.com", 
  messagingSenderId: "915209196163",
  appId: "1:915209196163:web:889c48e3d81e4d4eb4c1b6",
  measurementId: "G-JDXDDYGQSQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 
const analytics = getAnalytics(app);

export { auth };
