import React, { useState, forwardRef, useEffect, useCallback } from 'react';
import PopupInfo from './PopupInfo';
import CommunicationImage from '../img/Communication.png';

const getFacultyImage = (faculty) => {
  switch (faculty) {
    case 'com':
      return CommunicationImage;
    // other cases can be added here for different faculty images
    default:
      return CommunicationImage; // default image if faculty is not matched
  }
};

const PoeDegreeBox = forwardRef(({
  number,
  position,
  cpNeeded,
  faculty,
  countedSubjectRefs,
  buttonText,
  popUpText,
}, ref) => {

  const [state, setState] = useState(0); // 0: Off, 1: On
  const [showPopup, setShowPopup] = useState(false);
  const [cpCount, setCpCount] = useState(0);

  const updateCPCountAndState = useCallback(() => {
    const totalCP = countedSubjectRefs.reduce((acc, subj) => acc + (subj.ref.current?.className.includes('state-1') ? subj.cp : 0), 0);
    setCpCount(totalCP);

    // Updated: use state setter function to ensure correct state update
    setState(prevState => {
      if (totalCP >= cpNeeded) {
        return 1;
      } else if (prevState === 1) {
        return 2;
      } else {
        return prevState;
      }
    });
  }, [countedSubjectRefs, cpNeeded]);

  useEffect(() => {
    const intervalId = setInterval(updateCPCountAndState, 1000); // Check every 1 second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [countedSubjectRefs, cpNeeded]);

  const handleClick = () => {
    if (cpCount >= cpNeeded) {
      setState(1);
    } else {
      setState(state === 0 ? 2 : 0);
    }
  };

  const handleMouseEnter = () => {
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    setShowPopup(false);
  };
 
  const image = getFacultyImage(faculty);

    return (
      <div
          ref={ref}
          className={`poe-degree-box state-${state}`}
          style={{ top: position.y, left: position.x }}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
      >
          {showPopup && <PopupInfo text={popUpText} />}
          <img 
              className="poe-degree-img"
              src={image} 
              alt={faculty}  
          />
          <svg viewBox="0 0 225 225">
              <circle cx="112.5" cy="112.5" r="90" />
          </svg>
          <div className="degree-text">{buttonText}</div>
          <div className="degree-cp-count">{cpCount}/{cpNeeded}</div>
      </div>
    
    );
});

export default PoeDegreeBox;
