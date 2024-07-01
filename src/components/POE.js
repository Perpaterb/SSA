
import React, { useRef, useState, useEffect } from 'react';
import SubjectDraggableBox from './SubjectDraggableBox';
import DegreeBox from './DegreeBox'; 
import Line from './Line';

const POE = () => {
  const [buttonStates, setButtonStates] = useState({});

  const subjectBoxInfo = [
    { number: 123456, pos: { y: 130, x: 400 }, cp: 6, prerequisites: [], text: "123456 Subject Name1. 6cp This subject is all about doing stuff" },
    { number: 234567, pos: { y: 330, x: 400 }, cp: 6, prerequisites: [], text: "234567 Subject Name1. 6cp This subject is all about doing stuff" },
    { number: 345678, pos: { y: 530, x: 400 }, cp: 6, prerequisites: [], text: "345678 Subject Name1. 6cp This subject is all about doing stuff" },
    { number: 456789, pos: { y: 730, x: 400 }, cp: 6, prerequisites: [], text: "456789 Subject Name1. 6cp This subject is all about doing stuff" },
    { number: 321654, pos: { y: 130, x: 1000 }, cp: 6, prerequisites: [], text: "321654 Subject Name1. 6cp This subject is all about doing stuff" },
    { number: 987654, pos: { y: 330, x: 1000 }, cp: 6, prerequisites: [123456, 234567], text: "987654 Subject Name1. 6cp This subject is all about doing stuff" },
    { number: 654987, pos: { y: 530, x: 1000 }, cp: 6, prerequisites: [], text: "654987 Subject Name1. 6cp This subject is all about doing stuff" },
    { number: 456123, pos: { y: 730, x: 1000 }, cp: 6, prerequisites: [123456, 345678], text: "456123 Subject Name1. 6cp This subject is all about doing stuff" }
  ];

  const degreeBoxInfo = [
    { number: 12345, pos: { y: 130, x: 1300 }, cpNeeded: 30, text: "Bachelor of Computing Science", countedSubjects: [123456, 234567, 345678, 456789, 987654, 654987] },
    { number: 34567, pos: { y: 330, x: 1300 }, cpNeeded: 30, text: "Bachelor of Information Systems", countedSubjects: [123456, 234567, 345678, 456789, 987654, 654987] },
    { number: 23456, pos: { y: 530, x: 1300 }, cpNeeded: 30, text: "Bachelor of Information Technology", countedSubjects: [123456, 234567, 345678, 321654, 987654, 654987, 456123] },
  ];

  const lineInfo = [
    {pos: "M 10036 9799 C 10136 9799, 10192 9415, 10092 9415", conection: 0},
    {pos: "M 9952 9834 C 10052 9834, 9852 9398, 9752 9398", conection: 0},
    {pos: "M 9992 9887 C 10092 9887, 10643 9577, 10543 9577", conection: 0},
  ];


  const subjectBoxRefs = useRef(subjectBoxInfo.map(() => React.createRef()));
  const degreeBoxRefs = useRef(degreeBoxInfo.map(() => React.createRef()));

  const getButtonState = (boxRef, boxType) => {
    const index = boxType === 'subject' 
      ? subjectBoxRefs.current.indexOf(boxRef)
      : degreeBoxRefs.current.indexOf(boxRef);

    return index !== -1 && buttonStates[boxType === 'subject' ? subjectBoxInfo[index].number : degreeBoxInfo[index].number];
  };

  return (
    <div>
      
      {degreeBoxInfo.map((degreeBox, degreeIndex) =>
        degreeBox.countedSubjects.map((subjectNumber, subjectIndex) => {
          const subjectIndexRef = subjectBoxInfo.findIndex(subject => subject.number === subjectNumber);
          if (subjectIndexRef === -1) return null; // Skip if no matching subject found

          return (
            <Line
              key={`degree-line-${degreeIndex}-${subjectIndex}`}
              box1Ref={subjectBoxRefs.current[subjectIndexRef]}
              box2Ref={degreeBoxRefs.current[degreeIndex]}
              box1State={getButtonState(subjectBoxRefs.current[subjectIndexRef], 'subject')}
              box2State={getButtonState(degreeBoxRefs.current[degreeIndex], 'degree')}
            />
          );
        })
      )}

      {subjectBoxInfo.map((subjectBox, subjectIndex) =>
        subjectBox.prerequisites.map((prereqNumber, prereqIndex) => {
          const prereqIndexRef = subjectBoxInfo.findIndex(subject => subject.number === prereqNumber);
          if (prereqIndexRef === -1) return null; // Skip if no matching prerequisite found

          return (
            <Line
              key={`subject-line-${subjectIndex}-${prereqIndex}`}
              box1Ref={subjectBoxRefs.current[prereqIndexRef]}
              box2Ref={subjectBoxRefs.current[subjectIndex]}
              box1State={getButtonState(subjectBoxRefs.current[prereqIndexRef], 'subject')}
              box2State={getButtonState(subjectBoxRefs.current[subjectIndex], 'subject')}
            />
          );
        })
      )}
      
      {subjectBoxInfo.map((a, index) => (
        <SubjectDraggableBox
          key={index}
          id={index + 1}
          boxtext={a.number}
          boxPopupInfo={a.text}
          initialPosition={a.initpos}
          ref={subjectBoxRefs.current[index]}
          onButtonToggle={handleButtonToggle}
          connectedBoxes={subjectBoxInfo
            .filter(subject => a.prerequisites.includes(subject.number))
            .map(subject => subjectBoxRefs.current[subjectBoxInfo.indexOf(subject)])}
          cp={a.cp}
          scale={scale}
          canvasPosition={position}
        />
      ))}

      {degreeBoxInfo.map((a, index) => (
        <DegreeBox
          key={index}
          id={a.number}
          boxtext={a.text}
          boxPopupInfo={a.text}
          cpNeeded={a.cpNeeded}
          initialPosition={a.initpos}
          ref={degreeBoxRefs.current[index]}
          onButtonToggle={handleButtonToggle}
          connectedBoxes={subjectBoxInfo
            .filter(subject => a.countedSubjects.includes(subject.number))
            .map(subject => subjectBoxRefs.current[subjectBoxInfo.indexOf(subject)])}
          scale={scale}
          canvasPosition={position}
        />
      ))}
      
    </div>
  );
};

export default POE;
