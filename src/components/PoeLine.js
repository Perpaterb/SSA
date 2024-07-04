import React from 'react';

const PoeLine = ({ position, connections, ends }) => {
  // Logic to determine the class for the line based on the states
  return <path className='poe-line' d={position} />;
};

export default PoeLine;
