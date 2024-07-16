// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApu3392X9GOhQcHq1msIRtVXPc9TPZZwc",
  authDomain: "test-01-47043.firebaseapp.com",
  projectId: "test-01-47043",
  storageBucket: "test-01-47043.appspot.com",
  messagingSenderId: "126151689830",
  appId: "1:126151689830:web:656b616b41e9baf8968fa7",
  measurementId: "G-HZL3Z2YD6B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
