import React, { useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../database/firebaseConfig';

const Room = ({ setStage, setRoomCode, userID }) => {
  const [inputRoomCode, setInputRoomCode] = useState('');

  const handleEnterRoom = async () => {
    try {
      const roomCode = inputRoomCode.toUpperCase();
      const roomDocRef = doc(db, 'gameData', roomCode);
      const roomDoc = await getDoc(roomDocRef);

      if (roomDoc.exists()) {
        const roomData = roomDoc.data();
        const userLogEntry = roomData.log.find(logEntry => logEntry.userID === userID);

        if (userLogEntry) {
          if (userLogEntry.selectedPlayer) {
            setStage('board');
          } else {
            setStage('selectPlayer');
          }
        } else {
          if (roomData.log.length >= roomData.maxNumberOfPlayers) {
            alert('Room is full');
            return;
          }

          const updatedLog = [...roomData.log, { userID, selectedPlayer: '', diceRolls: [], lastAction: Date.now(), score: 100 }];
          await updateDoc(roomDocRef, { log: updatedLog });
          setStage('selectPlayer');
        }

        setRoomCode(roomCode);
      } else {
        alert('Room does not exist');
      }
    } catch (error) {
      console.error('Error fetching room:', error.message);
      alert('An error occurred while fetching the room. Please try again.');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={inputRoomCode}
        onChange={(e) => setInputRoomCode(e.target.value)}
        placeholder="Enter room code"
      />
      <button onClick={handleEnterRoom}>Enter Room</button>
    </div>
  );
};

export default Room;
