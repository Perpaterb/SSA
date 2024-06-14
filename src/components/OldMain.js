import React, { useState } from 'react';
import { getFirestore, collection, getDocs, where, query, doc, getDoc } from 'firebase/firestore';
import getGameDataConnection from '../database/getGameDataConnection';

const Main = () => {
  const [gameCode, setGameCode] = useState('');

  const handleInputChange = (event) => {
    setGameCode(event.target.value);
  };

  const handleJoinClick = async () => {
    const db = getFirestore();
    const gameDataCollection = getGameDataConnection();

    try {
      const gameDataSnapshot = await getDocs(collection(db, gameDataCollection));

      gameDataSnapshot.forEach((doc) => {
        console.log('Game Data Document:', doc.data());
      });
    } catch(error) {
      console.error('Error fetching game data:', error);
    }
  };

  return (
    <div>
      <h1>Enter Game Code:</h1>
      <input type="text" placeholder="Enter Game Code" value={gameCode} onChange={handleInputChange} />
      {gameCode.length === 6 ? (
        <button onClick={handleJoinClick}>Join</button>
      ) : (
        <button disabled>Join</button>
      )}
    </div>
  );
};

export default Main;