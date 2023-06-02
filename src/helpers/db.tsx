import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  DocumentReference,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDbeGfVTPc95VF_5mypbJ-gpVI6F4DUwNM",
  authDomain: "reactprojectfair.firebaseapp.com",
  projectId: "reactprojectfair",
  storageBucket: "reactprojectfair.appspot.com",
  messagingSenderId: "752301656758",
  appId: "1:752301656758:web:9d113fc256cda3ed73f417",
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const auth = getAuth(app);

const updateUserDatabase = async (user: object, uid: string) => {
  if (typeof user !== "object") return;

  const docRef: DocumentReference = doc(database, "users", uid);
  await setDoc(docRef, { ...user, uid });
};

const getUserFromDatabase = async (uid: string) => {
  const docRef: DocumentReference = doc(database, "users", uid);
  const result = await getDoc(docRef);

  if (!result.exists()) {
    return null;
  }
  return result.data();
};

export {
  app as default,
  auth,
  database,
  updateUserDatabase,
  getUserFromDatabase,
};
