import React, { useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../database/firebaseConfig';

const Board = ({ roomCode, userID }) => {
  const [roomData, setRoomData] = React.useState(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomCode) {
        return;
      }
      const roomDocRef = doc(db, 'gameData', roomCode);
      const roomDoc = await getDoc(roomDocRef);

      if (roomDoc.exists()) {
        setRoomData(roomDoc.data());
      }
    };

    const intervalId = setInterval(fetchRoomData, 2000);

    return () => clearInterval(intervalId);
  }, [roomCode]);

  if (!roomData) {
    return <div>Loading...</div>;
  }

  const roomState = roomData.completed ? "Complete" : (roomData.log.length >= roomData.maxNumberOfPlayers) ? "In progress" : "Waiting for more players";
  const currentPlayerTurn = roomData.nextPlayersTurn ? `${roomData.nextPlayersTurn}'s` : "no one's";

  return (
    <div>
      <h1 style={{ fontWeight: 'bold' }}>{`Room ID: ${roomCode}`}</h1>
      <div>{`Max Players: ${roomData.maxNumberOfPlayers}, Registered Players: ${roomData.log.length}`}</div>
      <div>{`State: ${roomState}`}</div>
      <div>{`It's ${currentPlayerTurn} turn`}</div>
      <div>
        {roomData.log.map((entry, index) => (
          <div key={entry.userID} style={{ border: '1px solid #ccc', padding: '10px', margin: '5px' }}>
            {`Player ${index + 1}: ${entry.selectedPlayer}`}
            <div>
              {`Dice Rolls: ${entry.diceRolls.join(', ')}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
