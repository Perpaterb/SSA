import React, { useEffect } from 'react';
import { doc, getDoc, updateDoc} from 'firebase/firestore';
import { db } from '../database/firebaseConfig';
import Board from './Board';

const Table = ({ roomCode, userID }) => {
  const [roomData, setRoomData] = React.useState(null);
  const [isRolling, setIsRolling] = React.useState(false);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomCode) {
        return;
      }
      const roomDocRef = doc(db, 'gameData', roomCode);
      const roomDoc = await getDoc(roomDocRef);
    
      if (roomDoc.exists()) {
        // set room data         
        setRoomData(roomDoc.data());
        setIsRolling(false);
        //start game 
        const roomData = roomDoc.data();

        if (roomData && !roomData.completed && roomData.log.length === roomData.maxNumberOfPlayers && roomData.nextPlayersTurn === null) {
          const roomDocRef = doc(db, 'gameData', roomCode);
          await updateDoc(roomDocRef, { nextPlayersTurn: 0 });
        }
      }
    };

    

    const intervalId = setInterval(() => {
      fetchRoomData();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [roomCode]);

  if (!roomData) {
    return <div>Loading...</div>;
  }

  const roomState = roomData.completed ? "Complete" : (roomData.log.length >= roomData.maxNumberOfPlayers) ? "In progress" : "Waiting for more players";

  let gameStatus;
  if (roomData.completed) {
    gameStatus = "Game is finished";
  } else if (roomData.log.length < roomData.maxNumberOfPlayers) {
    gameStatus = "Waiting for players";
  } else if (roomData.nextPlayersTurn !== null && roomData.log[roomData.nextPlayersTurn]) {
    gameStatus = `It's ${roomData.log[roomData.nextPlayersTurn].selectedPlayer}'s turn`;
  } else {
    gameStatus = "No one's turn";
  }

  const handleRollDice = async () => {
    setIsRolling(true);
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    const updatedLog = roomData.log.map((logEntry, index) => {
      if (index === roomData.nextPlayersTurn) {
        return { ...logEntry, diceRolls: [...logEntry.diceRolls, diceRoll] };
      }
      return logEntry;
    });
    const nextPlayersTurn = roomData.nextPlayersTurn === roomData.log.length - 1 ? 0 : roomData.nextPlayersTurn + 1;
    const roomDocRef = doc(db, 'gameData', roomCode);
    await updateDoc(roomDocRef, { log: updatedLog, nextPlayersTurn });
  };

  const currentPlayer = roomData && roomData.log[roomData.nextPlayersTurn];
  const isCurrentUsersTurn = currentPlayer && currentPlayer.userID === userID;
  const currentUser = localStorage.getItem('userID');
  const currentUserIndex = roomData.log.findIndex(logEntry => logEntry.userID === currentUser);
  const userPlayingAs = roomData.log[currentUserIndex].selectedPlayer;
  const playerColors = ['#fb7b77', '#fdc170', '#f3f87f', '#98f786', '#69ebfc', '#6d9efc', '#937df8', '#f78ef0'];
 
  return (
    <div>
      <h1 style={{ fontWeight: 'bold' }}>{`Room ID: ${roomCode} : You are playing as ${userPlayingAs}`}</h1>
      <div>{`Max Players: ${roomData.maxNumberOfPlayers}, Registered Players: ${roomData.log.length}`}</div>
      <div>${gameStatus}</div>
      <div style={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
        {roomData.log.map((entry, index) => (
          <div key={entry.userID} style={{ border: '1px solid #ccc', padding: '10px', margin: '2px', width: '24%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: playerColors[index], marginRight: '10px' }} />
              {`Player ${index + 1}: ${entry.selectedPlayer}`}
            </div>
            <div style={{ wordWrap: 'break-word' }}>
              {`Dice Rolls: ${entry.diceRolls.join(', ')} : Total = ${entry.diceRolls.reduce((a, b) => a + b, 0)}`}
            </div>
            <div>
              {`Score: ${entry.score}`}
            </div>
          </div>
        ))}
      </div>
      {isCurrentUsersTurn && !isRolling && <button onClick={handleRollDice}>Roll Dice</button>}
      <Board roomData={roomData} roomCode={roomCode}/>
    </div>
  );
};

export default Table;
