import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../database/firebaseConfig';

const PlayerSelection = ({ setStage, roomCode, userID }) => {
  const players = [
    { name: 'Bob', age: 25 },
    { name: 'Sam', age: 40 },
    { name: 'Steve', age: 35 },
    { name: 'Andrew', age: 22 },
    { name: 'Jenny', age: 32 },
    { name: 'Kate', age: 39 },
    { name: 'Angela', age: 21 },
    { name: 'Rebecca', age: 23 },
  ];

  const [shuffledPlayers, setShuffledPlayers] = useState([]);

  useEffect(() => {
    const shuffleArray = (array) => {
      let shuffled = array.slice();
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    setShuffledPlayers(shuffleArray(players));
  }, []);

  const handleSelect = async (index) => {
    const selectedPlayer = shuffledPlayers[index];
  
    // Update the selectedPlayer in the database
    try {
      const roomDocRef = doc(db, 'gameData', roomCode);
      const roomDoc = await getDoc(roomDocRef);
  
      if (roomDoc.exists()) {
        const roomData = roomDoc.data();
  
        // Check if the selected player's name has already been taken
        const takenNames = roomData.log.map(logEntry => logEntry.selectedPlayer);
        if (takenNames.includes(selectedPlayer.name)) {
          // If the selected player's name has been taken, select a random player from the list of players whose names have not been taken
          const availablePlayers = shuffledPlayers.filter(player => !takenNames.includes(player.name));
          const randomIndex = Math.floor(Math.random() * availablePlayers.length);
          selectedPlayer = availablePlayers[randomIndex];
        }
  
        const updatedLog = roomData.log.map(logEntry =>
          logEntry.userID === userID ? { ...logEntry, selectedPlayer: selectedPlayer.name, lastAction: Date.now() } : logEntry
        );
        await updateDoc(roomDocRef, { log: updatedLog });
  
        setStage('board');
      }
    } catch (error) {
      console.error('Error updating room data:', error);
      alert('An error occurred while updating the player selection. Please try again.');
    }
  };
  

  return (
    <div>
      <h2>Select Your Player</h2>
      <div className="player-cards">
        {shuffledPlayers.map((player, index) => (
          <div
            key={index}
            className="player-card"
            onClick={() => handleSelect(index)}
          >
            Player Card
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerSelection;
