import React from 'react';

const PlayerCard = ({ index, onSelect }) => {
  return (
    <div className="player-card" onClick={() => onSelect(index)}>
      Player Card
    </div>
  );
};

export default PlayerCard;
