import React, { useState, forwardRef, useEffect } from 'react';
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

const PoeSubjectBox = forwardRef(({
  number,
  position,
  cp,
  faculty,
  prerequisitesRefs,
  buttonText,
  popUpText
}, ref) => {
  const [state, setState] = useState(0); // 0: Off, 1: On, 2: Prerequisites not met, 3: Being searched for
  const [showPopup, setShowPopup] = useState(false);

  const checkPrerequisitesAndUpdateState = () => {
    if (state === 1 || state === 2) {
      const allPrereqsMet = prerequisitesRefs.every(ref => {
        const className = ref.current && ref.current.className;
        return className && className.includes('state-1');
      });
      setState(allPrereqsMet ? 1 : 2);
    }
  };

  const handleClick = () => {
    if (state === 1 || state === 2) {
        setState(0);
    } else {
        const allPrereqsMet = prerequisitesRefs.every(ref => {
            const className = ref.current && ref.current.className;
            return className && className.includes('state-1');
          });
          setState(allPrereqsMet ? 1 : 2);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      checkPrerequisitesAndUpdateState();
    }, 1000); // Check every 1 second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [state]);

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
      className={`poe-subject-box state-${state}`}
      style={{ top: position.y, left: position.x, position: 'absolute' }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showPopup && <PopupInfo text={popUpText} />}
      <img 
        className="poe-button-img"
        src={image} 
        alt={faculty}  
      />
      <svg viewBox="0 0 150 150">
        <circle cx="75" cy="75" r="60" />
      </svg>
      <div className="button-text">{buttonText}</div>
    </div>
  );
});

export default PoeSubjectBox;
