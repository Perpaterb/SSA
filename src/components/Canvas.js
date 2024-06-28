// import React, { useRef, useState, useEffect } from 'react';
// import Stage1 from './Stage1';

// const Canvas = () => {
//     const canvasRef = useRef(null);
//     const [scale, setScale] = useState(1);
//     const [dragging, setDragging] = useState(false);
//     const [position, setPosition] = useState({ x: 0, y: 0 });
//     const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

//     useEffect(() => {
//         const handleWheel = (event) => {
//             event.preventDefault();
//             const rect = canvasRef.current.getBoundingClientRect();

//             // Mouse position relative to the entire canvas
//             const mouseX = (event.clientX - rect.left - position.x) / scale;
//             const mouseY = (event.clientY - rect.top - position.y) / scale;

//             setScale(prevScale => {
//                 const newScale = Math.min(Math.max(0.1, prevScale + (event.deltaY * -0.001)), 5);
//                 const scaleRatio = newScale / prevScale;

//                 // Adjust the position to zoom in/out around the mouse position
//                 setPosition(prevPosition => ({
//                     x: event.clientX - rect.left - mouseX * newScale,
//                     y: event.clientY - rect.top - mouseY * newScale,
//                 }));

//                 return newScale;
//             });
//         };

//         const canvasElement = canvasRef.current;
//         canvasElement.addEventListener('wheel', handleWheel);

//         return () => {
//             canvasElement.removeEventListener('wheel', handleWheel);
//         };
//     }, [position, scale]);

//     const handleMouseDown = (event) => {
//         if (event.button === 2) {
//             setDragging(true);
//             setLastPosition({ x: event.clientX, y: event.clientY });
//         }
//     };

//     const handleMouseMove = (event) => {
//         if (dragging) {
//             const dx = event.clientX - lastPosition.x;
//             const dy = event.clientY - lastPosition.y;
//             setPosition(prevPosition => ({
//                 x: prevPosition.x + dx,
//                 y: prevPosition.y + dy,
//             }));
//             setLastPosition({ x: event.clientX, y: event.clientY });
//         }
//     };

//     const handleMouseUp = () => {
//         setDragging(false);
//     };

//     return (
//         <div
//             ref={canvasRef}
//             onMouseDown={handleMouseDown}
//             onMouseMove={handleMouseMove}
//             onMouseUp={handleMouseUp}
//             onContextMenu={(e) => e.preventDefault()}
//             style={{
//                 width: '100vw',
//                 height: '100vh',
//                 overflow: 'hidden',
//                 position: 'relative',
//                 cursor: dragging ? 'grabbing' : 'grab',
//                 userSelect: 'none',
//             }}
//         >
//             <div
//                 style={{
//                     width: 4000,
//                     height: 4000,
//                     transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
//                     transformOrigin: '0 0',
//                     background: 'lightgray',
//                 }}
//             >
//                 <Stage1/>
//             </div>
//         </div>
//     );
// };

// export default Canvas;

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Stage1 from './Stage1';

const Canvas = () => {
    const canvasRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [dragging, setDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
    const requestRef = useRef(null);

    useEffect(() => {
        const handleWheel = (event) => {
            event.preventDefault();
            const rect = canvasRef.current.getBoundingClientRect();

            // Mouse position relative to the entire canvas
            const mouseX = (event.clientX - rect.left - position.x) / scale;
            const mouseY = (event.clientY - rect.top - position.y) / scale;

            setScale(prevScale => {
                const newScale = Math.min(Math.max(0.05, prevScale + (event.deltaY * -0.0005)), 5);
                const scaleRatio = newScale / prevScale;

                // Adjust the position to zoom in/out around the mouse position
                setPosition(prevPosition => ({
                    x: event.clientX - rect.left - mouseX * newScale,
                    y: event.clientY - rect.top - mouseY * newScale,
                }));

                return newScale;
            });
        };

        const canvasElement = canvasRef.current;
        canvasElement.addEventListener('wheel', handleWheel);

        return () => {
            canvasElement.removeEventListener('wheel', handleWheel);
        };
    }, [position, scale]);

    const handleMouseDown = (event) => {
        if (event.button === 2) {
            setDragging(true);
            setLastPosition({ x: event.clientX, y: event.clientY });
        }
    };

    const handleMouseMove = useCallback((event) => {
        if (dragging) {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }

            requestRef.current = requestAnimationFrame(() => {
                const dx = event.clientX - lastPosition.x;
                const dy = event.clientY - lastPosition.y;
                setPosition(prevPosition => ({
                    x: prevPosition.x + dx,
                    y: prevPosition.y + dy,
                }));
                setLastPosition({ x: event.clientX, y: event.clientY });
            });
        }
    }, [dragging, lastPosition]);

    const handleMouseUp = () => {
        setDragging(false);
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
        }
    };

    return (
        <div
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onContextMenu={(e) => e.preventDefault()}
            style={{
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
                position: 'relative',
                cursor: dragging ? 'grabbing' : 'grab',
                userSelect: 'none',
            }}
        >
            <div
                style={{
                    width: 40000,
                    height: 40000,
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: '0 0',
                    background: 'lightgray',
                }}
            >
                <Stage1 scale={scale} position={position} />
            </div>
        </div>
    );
};

export default Canvas;
