// import React, { useState } from 'react';
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate
// } from 'react-router-dom';
// import Admin from './Admin';
// import Main from './Main.js';

// const MainPage = () => {
//   return (
//     <Main />
//   );
// };

// const AdminPage = () => {
//   return (
//     <Admin />
//   );
// };

// const Routing = () => {
//   // Check if running in the browser before accessing document
//   if (typeof document === 'undefined') {
//     // If not in the browser, display a "Please wait..." message
//     return <div>Please wait...</div>;
//   }

//   // return (
//   //   <Router>
//   //     <Routes>
//   //       <Route path="/admin" element={<AdminPage />} />
//   //       <Route path="/" element={<MainPage />} />
//   //     </Routes>
//   //   </Router>
//   // );
//   return (
//     <MainPage/>
//   );

// }

// export default Routing;


import React, { useState } from 'react';
import Admin from './Admin';
import Main from './Main.js';

const MainPage = () => {
  return <Main />;
};

const AdminPage = () => {
  return <Admin />;
};

const Routing = () => {
  const [currentPage, setCurrentPage] = useState('main');

  const switchPage = () => {
    setCurrentPage((prevPage) => (prevPage === 'main' ? 'admin' : 'main'));
  };

  if (typeof document === 'undefined') {
    return <div>Please wait...</div>;
  }

  return (
    <div>
      <button onClick={switchPage}>
        {currentPage === 'main' ? 'Go to Admin' : 'Go to Main'}
      </button>

      {currentPage === 'main' ? <MainPage /> : <AdminPage />}
    </div>
  );
};

export default Routing;
