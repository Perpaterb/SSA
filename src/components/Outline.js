import React from 'react';

const Outline = () => {
    const centerX = 10000;
    const centerY = 10000;
    const lineLength = 8000;
    const numLines = 11;
    const angleIncrement = 360 / numLines;

    const lines = [];

    for (let i = 0; i < numLines; i++) {
        const angle = angleIncrement * i;
        const radians = (angle * Math.PI) / 180;
        const x1 = centerX;
        const y1 = centerY;
        const x2 = centerX + lineLength * Math.sin(radians);
        const y2 = centerY - lineLength * Math.cos(radians);

        lines.push(
            <line 
                key={i}
                x1={x1} 
                y1={y1} 
                x2={x2} 
                y2={y2} 
                stroke="black" 
                strokeWidth="2" 
            />
        );
    }

    return (
        <svg 
            width="20000" 
            height="20000"
            style={{ position: 'absolute', top: 0, left: 0 }}
        >
            {lines}
        </svg>
    );
};

export default Outline;
