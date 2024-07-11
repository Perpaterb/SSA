import React, { useRef } from 'react';
import PoeDegreeBox from './PoeDegreeBox';
import PoeSubjectBox from './PoeSubjectBox'; 
import PoeLine from './PoeLine';
import { degreeBoxInfo, subjectBoxInfo, lines } from './Info';


const POE = ({active}) => {
 
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



// import React, { useRef, useEffect } from 'react';
// import PoeDegreeBox from './PoeDegreeBox';
// import PoeSubjectBox from './PoeSubjectBox';
// import PoeLine from './PoeLine';
// import { degreeBoxInfo, subjectBoxInfo, lines } from './Info';

// const PoeLineContainer = ({ children }) => {
//   const svgRef = useRef(null);

//   useEffect(() => {
//     if (svgRef.current) {
//       const svgElement = svgRef.current;
//       const elements = Array.from(svgElement.querySelectorAll('.poe-line'));
  
//       elements.sort((a, b) => {
//         const getClassState = (element) => {
//           const className = element.getAttribute('class');
//           const stateMatch = className.match(/state-(\d)-(\d)/);
//           if (stateMatch) {
//             return stateMatch.slice(1).map(numStr => parseInt(numStr));
//           }
//           return [0, 0]; // Default state if no match found
//         };
  
//         const [stateA1, stateA2] = getClassState(a);
//         const [stateB1, stateB2] = getClassState(b);
  
//         // Custom sorting logic
//         if (stateA1 !== stateB1) {
//           return stateA1 - stateB1; // Lower state1 values come first
//         } else {
//           return stateA2 - stateB2; // Lower state2 values come first within the same state1
//         }
//       });
  
//       elements.forEach((element, index) => {
//         console.log(`Element ${index + 1}: ${element.getAttribute('class')}`);
//       });
  
//       elements.forEach(element => {
//         svgElement.appendChild(element);
//       });
//     }
//   }, [children]);


//   return <svg ref={svgRef}>{children}</svg>;
// };

// const POE = () => {

//   const subjectBoxRefs = useRef(subjectBoxInfo.map(() => React.createRef()));
//   const degreeBoxRefs = useRef(degreeBoxInfo.map(() => React.createRef()));

//   const getRefByNumber = (number) => {
//     let index = subjectBoxInfo.findIndex(subject => subject.number === number);
//     if (index !== -1) return subjectBoxRefs.current[index];
    
//     index = degreeBoxInfo.findIndex(degree => degree.number === number);
//     if (index !== -1) return degreeBoxRefs.current[index];
    
//     return null;
//   };

//   return (
//     <div className="poe-container">
//       {subjectBoxInfo.map((subject, index) => {
//         const prereqRefs = subject.prerequisites.map(prereq => subjectBoxRefs.current[subjectBoxInfo.findIndex(sub => sub.number === prereq)]);

//         return (
//           <PoeSubjectBox
//             key={subject.number}
//             ref={subjectBoxRefs.current[index]}
//             prerequisitesRefs={prereqRefs}
//             {...subject}
//           />
//         );
//       })}

//       {degreeBoxInfo.map((degree, index) => {
//         const countedSubjectRefs = degree.countedSubjects.map(subject => {
//           const idx = subjectBoxInfo.findIndex(sub => sub.number === subject);
//           return { ref: subjectBoxRefs.current[idx], cp: subjectBoxInfo[idx].cp };
//         });

//         return (
//           <PoeDegreeBox
//             key={degree.number}
//             ref={degreeBoxRefs.current[index]}
//             countedSubjectRefs={countedSubjectRefs}
//             {...degree}
//           />
//         );
//       })}

//         <svg style={{ position: 'absolute', top: 0, left: 0, width: 20000, height: 20000 }}>
//           <PoeLineContainer>
//             {lines.map((line, index) => {
//               if (!line || !line.connections || !Array.isArray(line.connections.from) || !Array.isArray(line.connections.to)) {
//                 console.error(`Invalid line data for line at index ${index}`);
//                 return null;
//               }

//               const fromRefs = line.connections.from.map(getRefByNumber);
//               const toRefs = line.connections.to.map(getRefByNumber);

//               if (fromRefs.includes(null) || toRefs.includes(null)) {
//                 console.error(`References for line at index ${index} could not be found`);
//                 return null;
//               }

//               return (
//                 <PoeLine
//                   key={index}
//                   position={line.pos}
//                   connections={{ from: fromRefs, to: toRefs }}
//                   ends={line.ends}
//                 />
//               );
//             })}
//           </PoeLineContainer>
//         </svg>
//     </div>
//   );
// };

// export default POE;