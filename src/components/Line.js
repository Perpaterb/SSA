import React, { useEffect, useState } from 'react';

const Line = ({ box1Ref, box2Ref, box1State, box2State }) => {
  const [linePath, setLinePath] = useState('');

  const updateLine = () => {
    const box1Pos = box1Ref.current?.getPosition();
    const box2Pos = box2Ref.current?.getPosition();

    if (box1Pos && box2Pos) {
      const x1 = box1Pos.x + 150; // Offset adjustment
      const y1 = box1Pos.y + 50;  // Offset adjustment
      const x2 = box2Pos.x;       // Offset adjustment
      const y2 = box2Pos.y + 50;  // Offset adjustment

      const path = `M ${x1} ${y1} C ${x1 + 100} ${y1}, ${x2 - 100} ${y2}, ${x2} ${y2}`;
      setLinePath(path);
    }
  };

  useEffect(() => {
    let animationFrameId;

    const update = () => {
      updateLine();
      animationFrameId = requestAnimationFrame(update);
    };
    
    update();
    return () => cancelAnimationFrame(animationFrameId);
  }, [box1Ref, box2Ref]);

  // Determine the line state based on the button states
  const lineState = 
    box1State && box2State ? 3 :
    box1State ? 2 :
    box2State ? 1 : 0;
  // Set the class based on the determined state
  const lineClass = 
    lineState === 3 ? 'line-state-3' :
    lineState === 2 ? 'line-state-2' :
    lineState === 1 ? 'line-state-1' : 'line-state-0';

  return (
    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      <path
        d={linePath}
        className={lineClass}
        fill="none"
      />
    </svg>
  );
};

export default Line;
