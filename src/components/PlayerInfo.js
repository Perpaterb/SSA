// src/components/PlayerInfo.js
import React from 'react';

const PlayerInfo = ({ selectedPlayer, setStage, updateRoomData, userID }) => {
  const handleNext = () => {
    setStage('board');
  };

  return (
    <div>
      <h2>Player Info</h2>
      <div>Name: {selectedPlayer.name}</div>
      <div>Age: {selectedPlayer.age}</div>
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default PlayerInfo;
