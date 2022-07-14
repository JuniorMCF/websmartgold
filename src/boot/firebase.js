// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/compat/app"

import "firebase/compat/auth"

 // Undefined

// Agregar configuración firebase:
const firebaseConfig = {
  apiKey: "AIzaSyAFCnGf6H7TjrwAhAhr_Zg6umPpoZBjhjg",
  authDomain: "smartgold-a0c76.firebaseapp.com",
  projectId: "smartgold-a0c76",
  storageBucket: "smartgold-a0c76.appspot.com",
  messagingSenderId: "900414686957",
  appId: "1:900414686957:web:92e9e0509aada7454feee4",
  measurementId: "G-HBNFGSCR8G"
}

const firebaseApp = firebase.initializeApp(firebaseConfig)

const firebaseAuth = firebaseApp.auth()


export { firebaseAuth , firebase }