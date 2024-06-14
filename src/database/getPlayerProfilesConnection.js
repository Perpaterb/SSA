import { getFirestore, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';

const getPlayerProfilesConnection = () => {
  const db = getFirestore();
  return collection(db, 'playerProfiles');
};

export default getPlayerProfilesConnection;
