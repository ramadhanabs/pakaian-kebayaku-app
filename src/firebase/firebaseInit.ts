import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import {getStorage} from "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwOZU82FAG42xtf-CBsRV-UD0OTEb5f8I",
  authDomain: "pakaian-kebayaku-app.firebaseapp.com",
  projectId: "pakaian-kebayaku-app",
  storageBucket: "pakaian-kebayaku-app.appspot.com",
  messagingSenderId: "718776298019",
  appId: "1:718776298019:web:f27468d3bcc58110e9df96",
}

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig)
export const storage = getStorage(app)
export default app.firestore()
