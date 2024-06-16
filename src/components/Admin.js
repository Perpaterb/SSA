// src/components/Admin.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../database/firebaseConfig';

const Admin = () => {
  const [userID, setUserID] = useState(localStorage.getItem('userID') || Math.random().toString(36).substr(2, 10));
  const [openRooms, setOpenRooms] = useState([]);
  const [activeRooms, setActiveRooms] = useState([]);
  const [completedRooms, setCompletedRooms] = useState([]);
  const [newRoomMaxPlayers, setNewRoomMaxPlayers] = useState(4);


  useEffect(() => {
    if (!localStorage.getItem('userID')) {
      localStorage.setItem('userID', userID);
    }
  }, [userID]);

  useEffect(() => {
    fetchRooms();
  }, [userID]);

  const fetchRooms = async () => {
    try {
      const roomsQuery = query(collection(db, 'gameData'), where('admin', '==', userID));
      const roomsSnapshot = await getDocs(roomsQuery);

      const openRooms = [];
      const activeRooms = [];
      const completedRooms = [];

      roomsSnapshot.forEach(doc => {
        const room = { ...doc.data(), id: doc.id };
        if (room.completed) {
          completedRooms.push(room);
        } else if (room.log.length < room.maxNumberOfPlayers) {
          openRooms.push(room);
        } else {
          activeRooms.push(room);
        }
      });

      setOpenRooms(openRooms);
      setActiveRooms(activeRooms);
      setCompletedRooms(completedRooms);
    } catch (error) {
      console.error("Error fetching rooms: ", error);
    }
  };

  const generateAlphanumericCode = () => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return code;
  };

  const handleCreateRoom = async () => {
    if (!newRoomMaxPlayers) return;
    
    const roomId = generateAlphanumericCode();
    const newRoom = {
      completed: false,
      maxNumberOfPlayers: parseInt(newRoomMaxPlayers),
      log: [],
      nextPlayersTurn: null,
      admin: userID,
    };

    try {
      await setDoc(doc(db, 'gameData', roomId), newRoom);
      setNewRoomMaxPlayers('');
      fetchRooms();
    } catch (error) {
      console.error("Error creating room: ", error);
    }
  };

  const handleForceStart = async (roomId, currentPlayers) => {
    try {
      await setDoc(doc(db, 'gameData', roomId), { maxNumberOfPlayers: currentPlayers }, { merge: true });
      fetchRooms();
    } catch (error) {
      console.error("Error forcing start: ", error);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      await deleteDoc(doc(db, 'gameData', roomId));
      fetchRooms();
    } catch (error) {
      console.error("Error deleting room: ", error);
    }
  };

  const renderRoomDetails = (room) => (
    <div>
      <div>{"Max Players: " + room.maxNumberOfPlayers}</div>
      <div>{"Current Players: " + room.log.length}</div>
      <div>
        {room.log.map((entry, index) => (
          <div key={entry.userID}>
            {"Player " + (index + 1) + ": " + entry.selectedPlayer}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <h1>Admin Page</h1>
      <button onClick={fetchRooms}>Refresh</button>

      <h2>Open Rooms</h2>
      <ul>
        {openRooms.map(room => (
          <li key={room.id}>
            <div>{"Room ID: " + room.id}</div>
            {renderRoomDetails(room)}
            {room.log.length > 0 && (
              <button onClick={() => handleForceStart(room.id, room.log.length)}>Force Start</button>
            )}
            <button onClick={() => handleDeleteRoom(room.id)}>Delete Room</button>
          </li>
        ))}
      </ul>

      <h2>Create New Room</h2>
        <div>
          <span>Number of players : {newRoomMaxPlayers}  </span>
          <button onClick={() => setNewRoomMaxPlayers(Math.max(newRoomMaxPlayers - 1, 1))}>-</button>
          <button onClick={() => setNewRoomMaxPlayers(Math.min(newRoomMaxPlayers + 1, 8))}>+</button>
        </div>
      <button onClick={handleCreateRoom}>Create Room</button>

      <h2>Active Rooms</h2>
      <ul>
        {activeRooms.map(room => (
          <li key={room.id}>
            <div>{"Room ID: " + room.id}</div>
            {renderRoomDetails(room)}
          </li>
        ))}
      </ul>

      <h2>Completed Rooms</h2>
      <ul>
        {completedRooms.map(room => (
          <li key={room.id}>
            <div>{"Room ID: " + room.id}</div>
            {renderRoomDetails(room)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
