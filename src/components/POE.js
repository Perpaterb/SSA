
import React, { useRef, useState, useEffect } from 'react';
import PoeDegreeBox from './PoeDegreeBox';
import PoeSubjectBox from './PoeSubjectBox'; 
import PoeLine from './PoeLine';

const POE = (props) => {

  const subjectBoxInfo = [
    { number: "s12345", position: { y: 10130, x: 9400 }, cp: 6, faculty: "com", prerequisites: [], buttonText:"12345", popUpText: "12345 Subject Name1. 6cp This subject is all about doing stuff" },
    { number: "s23456", position: { y: 10330, x: 9400 }, cp: 6, faculty: "com", prerequisites: [], buttonText:"23456", popUpText: "23456 Subject Name1. 6cp This subject is all about doing stuff" },
    { number: "s34567", position: { y: 10530, x: 9400 }, cp: 6, faculty: "com", prerequisites: [], buttonText:"34567", popUpText: "34567 Subject Name1. 6cp This subject is all about doing stuff" },
    { number: "s45678", position: { y: 10730, x: 9400 }, cp: 6, faculty: "com", prerequisites: [], buttonText:"45678", popUpText: "45678 Subject Name1. 6cp This subject is all about doing stuff" },
    { number: "s32165", position: { y: 10130, x: 9800 }, cp: 6, faculty: "com", prerequisites: [], buttonText:"32165", popUpText: "32165 Subject Name1. 6cp This subject is all about doing stuff" },
    { number: "s98765", position: { y: 10330, x: 9800 }, cp: 6, faculty: "com", prerequisites: ["s12345", "s23456"], buttonText:"98765", popUpText: "98765 Subject Name1. 6cp This subject is all about doing stuff" },
    { number: "s65498", position: { y: 10530, x: 9800 }, cp: 6, faculty: "com", prerequisites: [], buttonText:"654987", popUpText: "65498 Subject Name1. 6cp This subject is all about doing stuff" },
    { number: "s45612", position: { y: 10730, x: 9800 }, cp: 6, faculty: "com", prerequisites: ["s12345", "s34567"], buttonText:"45612", popUpText: "45612 Subject Name1. 6cp This subject is all about doing stuff" }
  ];
 
  const degreeBoxInfo = [
    { number: "d12345", position: { y: 10130, x: 10300 }, cpNeeded: 30, faculty: "com", buttonText:"12345", popUpText: "Bachelor of Computing Science", countedSubjects: ["s12345", "s23456", "s34567", "s45678", "s98765", "s65498"]},
    { number: "d34567", position: { y: 10330, x: 10300 }, cpNeeded: 30, faculty: "com", buttonText:"34567", popUpText: "Bachelor of Information Systems", countedSubjects: ["s12345", "s23456", "s34567", "s45678", "s98765", "s65498"]},
    { number: "d23456", position: { y: 10530, x: 10300 }, cpNeeded: 30, faculty: "com", buttonText:"23456", popUpText: "Bachelor of Information Technology", countedSubjects: ["s12345", "s23456", "s34567", "s32165", "s98765", "s65498", "s45612"]},
  ];
 
  // conections: {from:[all from number],to:[all to numbers]}
  // ends 0 = nothing, 1 = in hole
    const lines = [
    {pos: "M 10036 9799 C 10136 9799, 10192 9415, 10092 9415", conections: {from:[],to:[]}, ends: [[],[]]},
    {pos: "M 9952 9834 C 10052 9834, 9852 9398, 9752 9398", conections: {from:[],to:[]}, ends: [[],[]]},
    {pos: "M 9992 9887 C 10092 9887, 10643 9577, 10543 9577", conections: {from:[],to:[]}, ends: [[],[]]},
  ];
  
  const subjectBoxRefs = useRef(subjectBoxInfo.map(() => React.createRef()));
  const degreeBoxRefs = useRef(degreeBoxInfo.map(() => React.createRef()));

  // Subject Buttons logic / Degree Button Logic
  // A button is defaulted to Off (state 0)
  // A degree button show all the CP added together of all the buttons that are countedSubjects that are on (state 1)
  // A degree button seperates it's connected to states and it 's connected from states. A line connected from a degree button can see a diforent state to a line connected to a degree button.
  // toState --- degree button --- fromState
  // state --- subject button
  // If a subject button is clicked and the all prerequisites are On then it will turn On (state 1).
  // If a subject button is clicked and the not all Prerequisites are On then it goes in to (state 3).
  // If a degree button's toState acts like a subject button's state But it's fromState just turns on and off without testing anything. This is so that Post degree things like job titles and mentor and interviews can be interacted with.  
  // Buttons has states that are all independently visualy identifyable.
  // 0. Off
  // 1. On
  // 2. Prerequisites not met after attemped turn on.
  // 3. Is being searched for
 
  // Line logic by testing the buttons of degrees that they are connected to.
  // Lines have 4 states.
  // [In Connection state, Out Connection state]
  // 0. [0, not 2] = [0,0]
  // 1. [0, 2] = [0,1]
  // 2. [1, not 2] = [1,0]
  // 3. [1, 2] = [1,1]
  // a line can have 1 or more in and out connections. if any of the "in" connection are in state 1 then state array [0] = 1 . If any of the "out" connection are in state 2 then state array [1] = 1.

  return (
    <div className="poe-container">
      {subjectBoxInfo.map((subject, index) => {
        const prereqRefs = subject.prerequisites.map(prereq => 
          subjectBoxRefs.current[subjectBoxInfo.findIndex(sub => sub.number === prereq)]
        );

        return (
          <PoeSubjectBox
            key={subject.number}
            ref={subjectBoxRefs.current[index]}
            prerequisitesRefs={prereqRefs}
            {...subject}
          />
        );
      })}

      {degreeBoxInfo.map((degree, index) => {
        const countedSubjectRefs = degree.countedSubjects.map(subject => {
          const idx = subjectBoxInfo.findIndex(sub => sub.number === subject);
          return { ref: subjectBoxRefs.current[idx], cp: subjectBoxInfo[idx].cp };
        });

        return (
          <PoeDegreeBox
            key={degree.number}
            ref={degreeBoxRefs.current[index]}
            countedSubjectRefs={countedSubjectRefs}
            {...degree}
          />
        );
      })}

      <svg className="poe-lines">
        {lines.map((line, index) => (
          <PoeLine
            key={index}
            position={line.position}
            connections={line.connections}
            ends={line.ends}
          />
        ))}
      </svg>
    </div>
  );
};

export default POE;
