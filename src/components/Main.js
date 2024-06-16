import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../database/firebaseConfig';
import Room from './Room';
import PlayerSelection from './PlayerSelection';
import Table from './Table';

const Main = () => {
  const [stage, setStage] = useState('enterRoom');
  const [roomCode, setRoomCode] = useState('');
  const [userID, setUserID] = useState(localStorage.getItem('userID') || Math.random().toString(36).substr(2, 10));
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem('userID')) {
      localStorage.setItem('userID', userID);
    }
  }, [userID]);

  useEffect(() => {
    if (stage === 'board' && roomCode) {
      const fetchRoomData = async () => {
        const roomDoc = await getDoc(doc(db, 'gameData', roomCode));
        if (roomDoc.exists()) {
          const roomData = roomDoc.data();
          const userLog = roomData.log.find(entry => entry.userID === userID);
          if (userLog && userLog.selectedPlayer) {
            setStage('board');
          }
        }
      };

      const id = setInterval(fetchRoomData, 2000);
      setIntervalId(id);

      return () => clearInterval(id);
    }
  }, [stage, roomCode, userID]);

  return (
    <div className="App">
      {stage === 'enterRoom' && (
        <Room 
          setStage={setStage} 
          setRoomCode={setRoomCode} 
          userID={userID} 
        />
      )}
      {stage === 'selectPlayer' && (
        <PlayerSelection
          setStage={setStage}
          roomCode={roomCode}
          userID={userID}
        />
      )}
      {stage === 'board' && (
        <Table 
          roomCode={roomCode} 
          userID={userID} 
        />
      )}
    </div>
  );
}

export default Main;
