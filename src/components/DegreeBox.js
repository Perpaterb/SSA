import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useSpring, animated } from '@react-spring/web';
import CircleButton from './CircleButton';
import PopupInfo from './PopupInfo';

const DegreeBox = forwardRef(({ id, initialPosition, boxtext, cpNeeded, boxPopupInfo, onButtonToggle, connectedBoxes, scale, canvasPosition  }, ref) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [cp, setCp] = useState(0);
  const containerRef = useRef();  
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const handleButtonClick = () => {
    setIsButtonPressed(!isButtonPressed);
    onButtonToggle(id);
  };

  useEffect(() => {
    const calculateCp = () => {
      let totalCp = 0;
      connectedBoxes.forEach(box => {
        if (box.current && box.current.isButtonPressed) {
          totalCp += box.current.cp;
        }
      });
      setCp(totalCp);
    };

    calculateCp();
  }, [isButtonPressed, connectedBoxes]);

  const [{ x, y }, api] = useSpring(() => ({
    x: initialPosition.x,
    y: initialPosition.y,
    config: { tension: 1000, friction: 60 }
  }));

  useImperativeHandle(ref, () => ({
    getPosition: () => ({
      x: x.get(),
      y: y.get()
    })
  }));

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newOffset = {
            x: (e.clientX - offsetX) / scale - canvasPosition.x / scale,
            y: (e.clientY - offsetY) / scale - canvasPosition.y / scale,
        };

        api.start({ x: newOffset.x, y: newOffset.y });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, api, offsetX, offsetY, scale, canvasPosition]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    const containerRect = containerRef.current.getBoundingClientRect();
    setOffsetX(e.clientX - containerRect.left);
    setOffsetY(e.clientY - containerRect.top);
    setIsDragging(true);
  };

  const handleMouseEnter = () => {
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      setShowPopup(false);
    }
  };

  return (
    <animated.div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="degreeNotPressedBox"
      style={{
        width: '400px',
        height: '150px',
        position: 'absolute',
        top: 0,
        left: 0,
        transform: x.to((xVal) => `translate(${xVal}px, ${y.get()}px)`),
        cursor: 'pointer',
        touchAction: 'none',
        backgroundColor: isDragging ? '#cde7e7' : '#dde1e7',
      }}
    >
      <div className='degreeBoxtext'>
        {boxtext}
      </div>

      <div className='cptext'>
        {cp} / {cpNeeded} Credit Points
      </div>

      <CircleButton isPressed={isButtonPressed} onClick={handleButtonClick} />
      {showPopup && <PopupInfo text={boxPopupInfo} />} {/* Show the popup info when the component is hovered */}
    </animated.div>
  );
});

export default DegreeBox;
