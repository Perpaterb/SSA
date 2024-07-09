import React, { useEffect, useState, useRef } from 'react';

const PoeLine = ({ position, connections }) => {
  const [state, setState] = useState([0, 0]);
  const [pathPoints, setPathPoints] = useState(null);
  const moveDistance = 4; // Distance to move the short lines
  const holeDiameter = 16;
  const holeColor = "#222222";
  const svgRef = useRef(null);

  const updateState = () => {
    if (connections.from.length > 0) {
      const inConnection = connections.from.some(ref => ref.current?.classList.contains('state-1')) ? 1 : 0;
      const outConnection = connections.to.some(ref => ref.current?.classList.contains('state-2')) ? 1 : 0;
      setState([inConnection, outConnection]);
    }
  };

  useEffect(() => {
    updateState();
    const intervalId = setInterval(updateState, 1000);
    return () => clearInterval(intervalId);
  }, [connections]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const getPathPoints = (d) => {
        const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svgPath.setAttribute('d', d);
        const pathLength = svgPath.getTotalLength();
        const startPoint = svgPath.getPointAtLength(0);
        const endPoint = svgPath.getPointAtLength(pathLength);
        return { startPoint, endPoint };
      };

      setPathPoints(getPathPoints(position));
    }
  }, [position]);

  const extractControlPoints = (d) => {
    const commands = d.split(/(?=[MmLlHhVvCcSsQqTtAaZz])/);
    let controlPoint1 = null;
    let controlPoint2 = null;

    for (const command of commands) {
      const type = command[0];
      if (type === 'C' || type === 'c') {
        const points = command.slice(1).trim().split(/[\s,]+/).map(parseFloat);
        if (points.length >= 4) {
          controlPoint1 = { x: points[0], y: points[1] };
          controlPoint2 = { x: points[2], y: points[3] };
          break;
        }
      }
    }

    if (!controlPoint1 || !controlPoint2) {
      return { controlPoint1: { x: NaN, y: NaN }, controlPoint2: { x: NaN, y: NaN }};
    }

    return { controlPoint1, controlPoint2 };
  };

  // Gets direction vector ensuring it is not zero length
  const getDirectionVector = (point1, point2) => {
    let dx = point2.x - point1.x;
    let dy = point2.y - point1.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    return { dx: dx / length, dy: dy / length };
  };

  const movePoint = (point, direction, distance) => ({
    x: point.x + direction.dx * distance,
    y: point.y + direction.dy * distance
  });

  if (!pathPoints) return null;

  const { startPoint, endPoint } = pathPoints;

  const { controlPoint1, controlPoint2 } = extractControlPoints(position);

  if (isNaN(controlPoint1.x) || isNaN(controlPoint1.y) || isNaN(controlPoint2.x) || isNaN(controlPoint2.y)) {
    console.error('Invalid control points:', controlPoint1, controlPoint2);
    return null;
  }

  const startToFirstControlDirection = getDirectionVector(startPoint, controlPoint1);

  const endToSecondControlDirection = getDirectionVector(endPoint, controlPoint2);

  let shortLineStartPoint = movePoint(startPoint, startToFirstControlDirection, moveDistance);
  let shortLineEndStartPoint = movePoint(endPoint, endToSecondControlDirection, moveDistance);


  return (
    <svg ref={svgRef}>
      {/* Start hole at the end of blue line */}
      <circle
        cx={shortLineStartPoint.x}
        cy={shortLineStartPoint.y}
        r={holeDiameter / 2}
        fill={holeColor}
      />

      {/* End hole at the end of red line */}
      <circle
        cx={shortLineEndStartPoint.x}
        cy={shortLineEndStartPoint.y}
        r={holeDiameter / 2}
        fill={holeColor}
      />
      
      {/* Main line */}
      <path className={`poe-line state-${state[0]}-${state[1]}`} d={position} />

      {/* Blue line from start */}
      {/* <path
        d={`M ${startPoint.x} ${startPoint.y} L ${shortLineStartPoint.x} ${shortLineStartPoint.y}`}
        stroke="blue"
        strokeWidth="3"
        fill="none"
      /> */}

      {/* Red line from end */}
      {/* <path
        d={`M ${endPoint.x} ${endPoint.y} L ${shortLineEndStartPoint.x} ${shortLineEndStartPoint.y}`}
        stroke="red"
        strokeWidth="3"
        fill="none"
      /> */}
    </svg>
  );
};

export default PoeLine;
