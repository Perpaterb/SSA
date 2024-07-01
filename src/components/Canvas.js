import React, { useRef, useState, useEffect, useCallback } from 'react';
import Stage1 from './Stage1';
import InteractiveLineDrawer from './InteractiveLineDrawer';

const Canvas = () => {
    const canvasRef = useRef(null);
    const [scale, setScale] = useState(0.1);
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
                // Dynamically adjust the zoom sensitivity based on the current scal
                const sensitivity = 0.001 * Math.pow(prevScale, 1.5);
                const newScale = Math.min(Math.max(0.01, prevScale + (event.deltaY * -sensitivity)), 2);

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
                cursor: dragging ? 'grabbing' : 'auto',
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
                
                <div style={{
                    width: 'calc(20000px + 20px)', // Add borders
                    height: 'calc(10000px + 20px)', // Add borders
                    marginBottom: '10px',
                    border: '10px solid black',
                    boxSizing: 'content-box',
                    position: 'relative',
                }}>
                    <Stage1 scale={scale} position={position} />
                </div>

                <div style={{
                    width: 'calc(20000px + 20px)', // Add borders
                    height: 'calc(20000px + 20px)', // Add borders
                    border: '10px solid black',
                    boxSizing: 'content-box',
                    position: 'relative',
                }}>
                    <InteractiveLineDrawer/>
                </div>
                           
            </div>
        </div>
    );
};

export default Canvas;
