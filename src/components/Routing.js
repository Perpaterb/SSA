import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import Admin from './Admin';
import Main from './Main.js';

const MainPage = () => {
  return (
    <Main />
  );
};

const AdminPage = () => {
  return (
    <Admin />
  );
};

const Routing = () => {
  // Check if running in the browser before accessing document
  if (typeof document === 'undefined') {
    // If not in the browser, display a "Please wait..." message
    return <div>Please wait...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default Routing;
