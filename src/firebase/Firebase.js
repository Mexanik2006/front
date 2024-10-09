// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCrEdM_it4uA6P5NTPmvsUEtvtgNjI_wKk",
    authDomain: "server-e8551.firebaseapp.com",
    projectId: "server-e8551",
    storageBucket: "server-e8551.appspot.com",
    messagingSenderId: "36682661296",
    appId: "1:36682661296:web:1a368127333a856eb7ea75",
    measurementId: "G-EJQW1LF3Q6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const imageDB = getStorage(app)
export default app