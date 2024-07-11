import React, { useState, useRef, useEffect } from 'react';
import Outline from './Outline';
import PoeStart from './PoeStart';
import POE from './POE';

const InteractiveLineDrawer = ({ onLineCreate }) => {
  const poeRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [points, setPoints] = useState([]);
  const [linePath, setLinePath] = useState('');
  const [angleA, setAngleA] = useState(0);
  const [angleB, setAngleB] = useState(0);
  const [lengthA, setLengthA] = useState(100);
  const [lengthB, setLengthB] = useState(100);
  const [controlPanelOffset, setControlPanelOffset] = useState(100);
  const controlPanelInitialHeight = 100; // Default height above Point A
  const svgRef = useRef(null);

  const handleClick = (e) => {
    if (poeRef.current) {
      poeRef.current.querySelector('button').click();
      console.log("click")
    }
    if (e.ctrlKey && e.altKey) {
      const svg = svgRef.current;
      const point = svg.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;
      const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());

      if (points.length === 1) {
        setPoints([...points, { x: Math.round(svgPoint.x), y: Math.round(svgPoint.y) }]);
        setIsActive(false);
      } else {
        setPoints([{ x: Math.round(svgPoint.x), y: Math.round(svgPoint.y) }]);
        setIsActive(true);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!isActive || points.length !== 1) return;

    const svg = svgRef.current;
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());

    const [start] = points;
    const path = `M ${Math.round(start.x)} ${Math.round(start.y)} C ${Math.round(start.x + 100)} ${Math.round(start.y)}, ${Math.round(svgPoint.x - 100)} ${Math.round(svgPoint.y)}, ${Math.round(svgPoint.x)} ${Math.round(svgPoint.y)}`;
    setLinePath(path);
  };

  const updateLinePath = () => {
    if (points.length === 2) {
      const [start, end] = points;
      const control1X = Math.round(start.x + lengthA * Math.cos(angleA * (Math.PI / 180)));
      const control1Y = Math.round(start.y + lengthA * Math.sin(angleA * (Math.PI / 180)));
      const control2X = Math.round(end.x + lengthB * Math.cos(angleB * (Math.PI / 180)));
      const control2Y = Math.round(end.y + lengthB * Math.sin(angleB * (Math.PI / 180)));
      const path = `M ${Math.round(start.x)} ${Math.round(start.y)} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${Math.round(end.x)} ${Math.round(end.y)}`;
      setLinePath(path);
    }
  };

  useEffect(() => {
    updateLinePath();
  }, [points, angleA, angleB, lengthA, lengthB]);

  const handleDone = () => {
    console.log(linePath);
    onLineCreate && onLineCreate(linePath);
  };

  const handleLengthChange = (setter, value) => {
    const length = Math.max(50, Math.round(parseFloat(value)));
    setter(length);
  };

  return (
    <div>
      <svg
        ref={svgRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        style={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid #000', zIndex: 3 }}
      >
        <path
          d={linePath}
          stroke="red"
          fill="none"
        />
      </svg>
      {points.length === 2 && (
        <div
          style={{
            position: 'absolute',
            top: points[0].y - controlPanelInitialHeight - controlPanelOffset,
            left: points[0].x,
            backgroundColor: 'white',
            padding: '10px',
            zIndex: 4
          }}
        >
          <label>
            Angle A: 
            <input 
              type="number" 
              value={angleA} 
              onChange={(e) => setAngleA(Math.round(parseFloat(e.target.value)))} 
            />
          </label>
          <label>
            Length A: 
            <input 
              type="number" 
              value={lengthA} 
              onChange={(e) => handleLengthChange(setLengthA, e.target.value)}
            />
          </label>
          <label>
            Angle B: 
            <input 
              type="number" 
              value={angleB} 
              onChange={(e) => setAngleB(Math.round(parseFloat(e.target.value)))} 
            />
          </label>
          <label>
            Length B: 
            <input 
              type="number" 
              value={lengthB} 
              onChange={(e) => handleLengthChange(setLengthB, e.target.value)}
            />
          </label>
          <label>
            Control Panel Offset:
            <input 
              type="number" 
              value={controlPanelOffset} 
              onChange={(e) => setControlPanelOffset(Math.round(parseFloat(e.target.value)))}
            />
          </label>
          <button onClick={handleDone}>Done</button>
        </div>
      )}
    </div>
  );
};

export default InteractiveLineDrawer;

// Usage example (in another component/file):
// <InteractiveLineDrawer onLineCreate={(path) => console.log(path)} />
