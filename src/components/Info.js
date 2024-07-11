export const degreeBoxInfo = [
    { number: "d12345", position: { y: 7618, x: 2655 }, cpNeeded: 30, faculty: "com", buttonText:"12345", popUpText: "Bachelor of Computing Science", countedSubjects: ["s12345", "s23456", "s34567", "s45678", "s56789", "s67890"]},
    { number: "d23456", position: { y: 8352, x: 2652 }, cpNeeded: 30, faculty: "com", buttonText:"23456", popUpText: "Bachelor of Information Systems", countedSubjects: ["s12345", "s23456", "s34567", "s45678", "s56789", "s67890"]},
    { number: "d34567", position: { y: 8908, x: 2587 }, cpNeeded: 30, faculty: "com", buttonText:"34567", popUpText: "Bachelor of Information Technology", countedSubjects: ["s12345", "s23456", "s34567", "s45678", "s56789", "s67890", "s78901"]},
    { number: "d45678", position: { y: 9464, x: 2587 }, cpNeeded: 30, faculty: "com", buttonText:"45678", popUpText: "Bachelor of Information Blag", countedSubjects: ["s12345", "s23456", "s34567", "s45678", "s56789", "s67890"]},
    { number: "d56789", position: { y: 10287, x: 2573 }, cpNeeded: 30, faculty: "com", buttonText:"56789", popUpText: "Bachelor of Information bling", countedSubjects: ["s12345", "s23456", "s34567", "s45678", "s56789", "s67890", "s78901"]},
];

export const subjectBoxInfo = [
    { number: "s12345", position: { y: 10020, x: 9089 }, cp: 6, faculty: "com", prerequisites: [], buttonText:"12345", popUpText: "12345 Subject Name1. 6cp This subject is all about doing stuff" },
    { number: "s23456", position: { y: 9901, x: 9328 }, cp: 6, faculty: "com", prerequisites: [], buttonText:"23456", popUpText: "23456 Subject Name1. 6cp This subject is all about doing stuff" },
    { number: "s34567", position: { y: 9830, x: 9500 }, cp: 6, faculty: "com", prerequisites: [], buttonText:"34567", popUpText: "34567 Subject Name1. 6cp This subject is all about doing stuff" },
    { number: "s45678", position: { y: 9710, x: 9307 }, cp: 6, faculty: "com", prerequisites: [], buttonText:"45678", popUpText: "45678 Subject Name1. 6cp This subject is all about doing stuff" },
    { number: "s56789", position: { y: 9865, x: 9100 }, cp: 6, faculty: "com", prerequisites: [], buttonText:"56789", popUpText: "56789 Subject Name1. 6cp This subject is all about doing stuff" },
    { number: "s67890", position: { y: 10000, x: 8750 }, cp: 6, faculty: "com", prerequisites: ["s12345", "s23456"], buttonText:"67890", popUpText: "67890 Subject Name1. 6cp This subject is all about doing stuff" },
    { number: "s78901", position: { y: 10070, x: 8510 }, cp: 6, faculty: "com", prerequisites: ["s12345", "s23456"], buttonText:"78901", popUpText: "78901 Subject Name1. 6cp This subject is all about doing stuff" },
    { number: "s89012", position: { y: 9900, x: 8500 }, cp: 6, faculty: "com", prerequisites: ["s12345", "s23456"], buttonText:"89012", popUpText: "89012 Subject Name1. 6cp This subject is all about doing stuff" }
];
  
export const lines = [
    { pos: "M 9866 10010 C 9766 9980, 9161 10134, 9136 10043", connections: { from: [], to: [] }, ends: [0, 0]}, //from start to s12345
    { pos: "M 9818 9986 C 9718 9986, 9525 10052, 9400 9961", connections: { from: [], to: [] }, ends: [0, 0]},
    { pos: "M 9840 9959 C 9755 9906, 9612 9889, 9550 9892", connections: { from: [], to: [] }, ends: [0, 0]}, //from start to s34567
    { pos: "M 9842 9943 C 9746 9914, 9533 9782, 9381 9758", connections: { from: [], to: [] }, ends: [0, 0]},
    { pos: "M 9427 10056 C 9329 10070, 9275 9961, 9182 9925", connections: { from: [], to: [] }, ends: [0, 0]},
    //from s23456 to s67890 s78901 s89012
    { pos: "M 9374 9943 C 9328 9962, 9334 9956, 9288 9976", connections: { from: ["s23456"], to: ["s67890","s78901","s89012"] }, ends: [0, 1]},
    { pos: "M 9245 9987 C 9148 10011, 9052 10019, 8952 10019", connections: { from: ["s23456"], to: ["s67890","s78901","s89012"] }, ends: [1, 0]}, 
    { pos: "M 8951 10019 C 8901 10020, 8881 10042, 8831 10042", connections: { from: ["s23456"], to: ["s67890"] }, ends: [0, 0]},
    { pos: "M 8951 10019 C 8901 10021, 8828 9976, 8778 9970", connections: { from: ["s23456"], to: ["s78901","s89012"] }, ends: [0, 0]},
    { pos: "M 8776 9970 C 8676 9965, 8682 10098, 8582 10098 ", connections: { from: ["s23456"], to: ["s78901"] }, ends: [0, 0]},
    { pos: "M 8777 9970 C 8678 9954, 8678 9956, 8578 9956 ", connections: { from: ["s23456"], to: ["s89012"] }, ends: [0, 0]},
    //from s12345 to s67890 s78901 s89012
    { pos: "M 9122 10059 C 9074 10054, 9000 10084, 8903 10108", connections: { from: ["s12345"], to: ["s67890","s78901","s89012"] }, ends: [0, 0]},
    { pos: "M 8903 10108 C 8853 10114, 8863 10087, 8815 10073", connections: { from: ["s12345"], to: ["s67890"] }, ends: [0, 0]},
    { pos: "M 8903 10108 C 8853 10114, 8776 10123, 8728 10108", connections: { from: ["s12345"], to: ["s78901","s89012"] }, ends: [0, 0]},
    { pos: "M 8728 10108 C 8683 10085, 8643 10110, 8595 10123", connections: { from: ["s12345"], to: ["s78901"] }, ends: [0, 0]},
    { pos: "M 8727 10107 C 8689 10075, 8703 10093, 8683 10047", connections: { from: ["s12345"], to: ["s89012"] }, ends: [0, 1]},
    { pos: "M 8669 10014 C 8649 9968, 8627 9975, 8578 9964", connections: { from: ["s12345"], to: ["s89012"] }, ends: [1, 0]},
];

