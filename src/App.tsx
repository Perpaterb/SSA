import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import DivHandler from './DivHandler';
import reportWebVitals from './reportWebVitals';
import nameImg from './img/background-Name.png';
import backImg from './img/background.png';

export default function App() {
  return (
    <div>
        <img src={backImg} style={{height: "100%", width: "100%",position: 'fixed', bottom: 0, left: 0, zIndex: -999}} alt={"name"} />
        <img src={nameImg} style={{height:45 , position: 'fixed', bottom: 10, left: 10}} alt={"name"} />
        <DivHandler/>
    </div>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
