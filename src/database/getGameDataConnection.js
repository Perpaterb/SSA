import { getFirestore, collection } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';

const getGameDataConnection = () => {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  return collection(db, 'gameData');
};

export default getGameDataConnection;
