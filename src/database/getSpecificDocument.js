import { getFirestore, doc, getDoc } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';

const getSpecificDocument = async (collectionName, documentId) => {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const specificDocRef = doc(db, collectionName, documentId);
  const docSnap = await getDoc(specificDocRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export default getSpecificDocument;
