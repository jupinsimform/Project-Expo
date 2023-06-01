import firebase from "firebase/compat/app";
import "firebase/compat/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbeGfVTPc95VF_5mypbJ-gpVI6F4DUwNM",
  authDomain: "reactprojectfair.firebaseapp.com",
  projectId: "reactprojectfair",
  storageBucket: "reactprojectfair.appspot.com",
  messagingSenderId: "752301656758",
  appId: "1:752301656758:web:9d113fc256cda3ed73f417",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
