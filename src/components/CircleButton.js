import React from 'react';

const CircleButton = ({ isPressed, onClick }) => {
  return (
    <button
      className={isPressed ? 'pressedButton' : 'notPressedButton'}
      onClick={onClick}
    />
  );
};

export default CircleButton;
