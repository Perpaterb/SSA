import React from 'react';

const PopupInfo = ({ text }) => {
    let width = 400
    let height = 200

  return (
    <div className="popupInfo"
        style={{
            width: {width},
            height: {height},
            top: {height} + 60,
            left: {width} / 2,
            cursor: 'pointer',
            touchAction: 'none',
            backgroundColor: "#ffffff"
        }}
        >
      {text}
    </div>
  );
};

export default PopupInfo;
