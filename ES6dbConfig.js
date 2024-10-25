import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyACeVvvLQFqfxGzwvxU3ZOZfLOrsLv3iQw",
  authDomain: "task-manager-b5c0d.firebaseapp.com",
  projectId: "task-manager-b5c0d",
  storageBucket: "task-manager-b5c0d.appspot.com",
  messagingSenderId: "544077679089",
  appId: "1:544077679089:web:58de3e7a84d2bc3ec41c50",
  measurementId: "G-0HV0GDB8N5"
};

const initializeFBapp = () => {
  try {
    const app = initializeApp(firebaseConfig);
    console.log("Initialized app.");
    return app;
  } catch (error) {
    console.log("Couldn't initialize app.", error);
  }
};

const app = initializeFBapp();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, auth, provider };