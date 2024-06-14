import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';

const updateDocument = async (collectionName, documentId, updateData) => {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const specificDocRef = doc(db, collectionName, documentId);

  try {
    await updateDoc(specificDocRef, updateData);
    return "Document updated successfully";
  } catch (error) {
    return error;
  }
};

export default updateDocument;
