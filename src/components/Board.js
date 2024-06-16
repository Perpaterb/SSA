import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../database/firebaseConfig';

const colors = ['#fb7b77', '#fdc170', '#f3f87f', '#98f786', '#69ebfc', '#6d9efc', '#937df8', '#f78ef0'];

const Board = ({ roomData , roomCode}) => {

    const roomDocRef = doc(db, 'gameData', roomCode);
    const boardData = [
        {name: 'start', modifier: 'plus', amount:100 },
        {name: '1', modifier: 'plus', amount:100 },
        {name: '2', modifier: 'multiply', amount:1.2 },
        {name: '3', modifier: 'divide', amount:2 },
        {name: '4', modifier: 'plus', amount:300 },
        {name: '5', modifier: 'subtract', amount:50},
        {name: '6', modifier: 'multiply', amount:2 },
        {name: '7', modifier: 'divide', amount:1.2 },
        {name: '8', modifier: 'plus', amount:100},
        {name: '9', modifier: 'subtract', amount:350},
        {name: '10', modifier: 'multiply', amount:4 },
        {name: '11', modifier: 'divide', amount:2 },
        {name: '12', modifier: 'plus', amount:20},
        {name: '13', modifier: 'plus', amount:100 },
        {name: '14', modifier: 'multiply', amount:1.5 },
        {name: '15', modifier: 'divide', amount:1.5 },
        {name: '16', modifier: 'plus', amount:50},
        {name: '17', modifier: 'subtract', amount:100 },
        {name: '18', modifier: 'multiply', amount:4 },
        {name: '19', modifier: 'divide', amount:2 },
        {name: '20', modifier: 'plus', amount:450 },
        {name: '21', modifier: 'plus', amount:100 },
        {name: '22', modifier: 'multiply', amount:1.5 },
        {name: '23', modifier: 'divide', amount:2 },
        {name: '24', modifier: 'plus', amount:200},
        {name: '25', modifier: 'subtract', amount:20},
        {name: '26', modifier: 'multiply', amount:3 },
        {name: '27', modifier: 'divide', amount:2 }
    ];


    const [positions, setPositions] = useState(new Array(roomData.log.length).fill(0));
    const [scores, setScores] = useState(new Array(roomData.log.length).fill(100));
    const [turnCounter, setTurnCounter] = useState(new Array(roomData.log.length).fill(0));

    useEffect(() => {
        const newPositions = [...positions];
        let newScores = [...scores]; // Use let instead of const
        const newTurnCounter = [...turnCounter];
        let isUpdated = false; // flag to check if there's an update
      
        roomData.log.forEach((logEntry, player) => {
            // Start from the last processed dice roll
            for (let round = turnCounter[player]; round < logEntry.diceRolls.length; round++) {
                let diceRoll = logEntry.diceRolls[round];
                newPositions[player] = (newPositions[player] + diceRoll) % boardData.length;
                switch (boardData[newPositions[player]].modifier) {
                    case 'plus':
                        newScores[player] = Math.round(newScores[player] + boardData[newPositions[player]].amount);
                        break;
                    case 'subtract':
                        newScores[player] = Math.round(newScores[player] - boardData[newPositions[player]].amount);
                        if (newScores[player] < 0) newScores[player] = 0;
                        break;
                    case 'multiply':
                        newScores[player] = Math.round(newScores[player] * boardData[newPositions[player]].amount);
                        if (newScores[player] < 0) newScores[player] = 0;
                        break;
                    case 'divide':
                        newScores[player] = Math.round(newScores[player] / boardData[newPositions[player]].amount);
                        if (newScores[player] < 0) newScores[player] = 0;
                        break;
                    default:
                        break;
                }
                newTurnCounter[player]++; // Increment the turn counter for the player
                isUpdated = true;
            }
        });
        
          
      
        setPositions(newPositions);
        setScores(newScores);
        setTurnCounter(newTurnCounter);
      
        // Only update the document if there's an update
        if (isUpdated) {
            // Identify the current user
            const currentUser = localStorage.getItem('userID');
            const currentUserIndex = roomData.log.findIndex(logEntry => logEntry.userID === currentUser);


        
            // Update the score of the current user in the database
            const updatedLog = roomData.log.map((logEntry, index) => {
                if (index === currentUserIndex) {
                return { ...logEntry, score: newScores[index] }; // Use newScores directly
                } else {
                return logEntry;
                }
            });
        
            console.log("updatedLog", updatedLog)
        
            // Define an async function to update the document
            const updateDocument = async () => {
                await updateDoc(roomDocRef, { log: updatedLog });
            };
        
            // Call the async function
            updateDocument();
        }
    }, [roomData]);
      

    return (
        <div style={{ display: 'grid', gridTemplateRows: 'repeat(6, 1fr)', gridTemplateColumns: 'repeat(10, 1fr)', width: '95vw', height: '57vw', position: 'relative' }}>
        {boardData.map((square, index) => {
            let row, column;
            if (index < 10) {
                row = 1;
                column = index + 1;
              } else if (index < 15) {
                row = index - 8;
                column = 10;
              } else if (index < 24) {
                row = 6;
                column = 33 - index -9;
              } else {
                row = 29 - index;
                column = 1;
              }
            return (
            <div key={index} style={{ gridRow: row, gridColumn: column, border: '1px solid black', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div>{`${index} ${square.modifier} ${square.amount}`}</div>
                {positions.map((position, player) => position === index && (
                <div key={player} style={{ 
                    position: 'absolute', 
                    top: `${player < 4 ? 0 : 75}%`, // If player index is less than 4, position at the top, else at the bottom
                    left: `${(player % 4) * 25}%`, // Position the boxes next to each other
                    width: '25%', 
                    height: '25%', 
                    backgroundColor: colors[player] 
                }} />
                ))}
            </div>
            );
        })}
        </div>
    );
};

export default Board;
