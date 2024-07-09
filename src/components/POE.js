import React, { useRef } from 'react';
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
    { number: "s65498", position: { y: 10530, x: 9800 }, cp: 6, faculty: "com", prerequisites: [], buttonText:"65498", popUpText: "65498 Subject Name1. 6cp This subject is all about doing stuff" },
    { number: "s45612", position: { y: 10730, x: 9800 }, cp: 6, faculty: "com", prerequisites: ["s12345", "s34567"], buttonText:"45612", popUpText: "45612 Subject Name1. 6cp This subject is all about doing stuff" }
  ];
 
  const degreeBoxInfo = [
    { number: "d12345", position: { y: 10130, x: 10300 }, cpNeeded: 30, faculty: "com", buttonText:"12345", popUpText: "Bachelor of Computing Science", countedSubjects: ["s12345", "s23456", "s34567", "s45678", "s98765", "s65498"]},
    { number: "d34567", position: { y: 10330, x: 10300 }, cpNeeded: 30, faculty: "com", buttonText:"34567", popUpText: "Bachelor of Information Systems", countedSubjects: ["s12345", "s23456", "s34567", "s45678", "s98765", "s65498"]},
    { number: "d23456", position: { y: 10530, x: 10300 }, cpNeeded: 30, faculty: "com", buttonText:"23456", popUpText: "Bachelor of Information Technology", countedSubjects: ["s12345", "s23456", "s34567", "s32165", "s98765", "s65498", "s45612"]},
  ];
 
  const lines = [
    { pos: "M 9036 9799 C 10136 9799, 10192 9415, 10092 9415", connections: { from: ["s12345"], to: ["d12345", "d34567"] }, ends: [1, 1] },
    { pos: "M 9652 9634 C 10052 9834, 9852 9398, 9752 9398", connections: { from: ["s12345"], to: ["s98765"] }, ends: [1, 1] },
    { pos: "M 9792 9687 C 10092 9887, 10643 9577, 10543 9577", connections: { from: ["s23456"], to: ["s98765"] }, ends: [1, 1] },
    { pos: "M 11315 10107 C 11210 10107, 10988 9401, 10844 9401", connections: { from: ["s12345"], to: ["d12345", "d34567"] }, ends: [1, 1] },
    { pos: "M 11732 9655 C 11627 9655, 11880 9926, 11736 9926", connections: { from: ["s12345"], to: ["s98765"] }, ends: [1, 1] },
    { pos: "M 11162 10153 C 11262 10153, 11996 9404, 11896 9404", connections: { from: ["s23456"], to: ["s98765"] }, ends: [1, 1] },
    { pos: "M 11729 10220 C 11770 10192, 12193 9610, 12233 9580", connections: { from: ["s12345"], to: ["s98765"] }, ends: [1, 1] },
    { pos: "M 11364 10075 C 11426 10033, 11788 9568, 11848 9523", connections: { from: ["s23456"], to: ["s98765"] }, ends: [1, 1] },
  ];




  const subjectBoxRefs = useRef(subjectBoxInfo.map(() => React.createRef()));
  const degreeBoxRefs = useRef(degreeBoxInfo.map(() => React.createRef()));

  const getRefByNumber = (number) => {
    let index = subjectBoxInfo.findIndex(subject => subject.number === number);
    if (index !== -1) return subjectBoxRefs.current[index];
    index = degreeBoxInfo.findIndex(degree => degree.number === number);
    if (index !== -1) return degreeBoxRefs.current[index];
    return null;
  };

  return (
    
    <div className="poe-container">
      {subjectBoxInfo.map((subject, index) => {
        const prereqRefs = subject.prerequisites.map(prereq => subjectBoxRefs.current[subjectBoxInfo.findIndex(sub => sub.number === prereq)]);

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
      <svg style={{ position: 'absolute', top: 0, left: 0, width: 20000, height: 20000 }}>
        {lines.map((line, index) => {
          // Add a check to ensure line.connections.from is defined and is an array
          if (!line?.connections?.from || !Array.isArray(line.connections.from)) {
            console.error(`Line connections.from is not defined or not an array for line at index ${index}`);
            return null;
          }

          const fromRefs = line.connections.from.map(getRefByNumber);
          const toRefs = line.connections.to.map(getRefByNumber);

          if (fromRefs.includes(null) || toRefs.includes(null)) {
            console.error(`References for line at index ${index} could not be found`);
            return null;
          }

          return (
            <PoeLine
              key={index}
              position={line.pos}
              connections={{ from: fromRefs, to: toRefs }}
              ends={line.ends}
            />
          );
        })}
      </svg>

    </div>
  );
};

export default POE;
