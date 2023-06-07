import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  collection,
  query,
  where,
  deleteDoc,
  DocumentReference,
  CollectionReference,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

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
const storage = getStorage(app);
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

const uploadImage = (
  file: File,
  progressCallback: (progress: number) => void,
  urlCallback: (url: string) => void,
  errorCallback: (error: string) => void
) => {
  if (!file) {
    errorCallback("File not found");
    return;
  }

  const fileType = file.type;
  const fileSize = file.size / 1024 / 1024;

  if (!fileType.includes("image")) {
    errorCallback("File must an image");
    return;
  }
  if (fileSize > 2) {
    errorCallback("File must smaller than 2MB");
    return;
  }

  const storageRef = ref(storage, `images/${file.name}`);

  const task = uploadBytesResumable(storageRef, file);

  task.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progressCallback(progress);
    },
    (error) => {
      errorCallback(error.message);
    },
    () => {
      getDownloadURL(storageRef).then((url) => {
        urlCallback(url);
      });
    }
  );
};

const addProjectInDatabase = async (project: object) => {
  if (typeof project !== "object") return;

  const collectionRef: CollectionReference = collection(database, "projects");
  await addDoc(collectionRef, { ...project });
};

const updateProjectInDatabase = async (project: object, pid: string) => {
  if (typeof project !== "object") return;

  const docRef = doc(database, "projects", pid);
  await setDoc(docRef, { ...project });
};

const getAllProjects = async () => {
  return await getDocs(collection(database, "projects"));
};

const getAllProjectsForUser = async (uid: string) => {
  if (!uid) return;

  const collectionRef = collection(database, "projects");
  const condition = where("refUser", "==", uid);
  const dbQuery = query(collectionRef, condition);

  return await getDocs(dbQuery);
};

const deleteProject = async (pid: string) => {
  const docRef = doc(database, "projects", pid);
  await deleteDoc(docRef);
};

export {
  app as default,
  auth,
  database,
  updateUserDatabase,
  getUserFromDatabase,
  uploadImage,
  addProjectInDatabase,
  updateProjectInDatabase,
  getAllProjects,
  getAllProjectsForUser,
  deleteProject,
};
