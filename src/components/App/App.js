import React from 'react';
import './App.scss';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header/Header';
import Main from '../Main/Main';

function App() {
  return (
    <BrowserRouter>
      <div className="page">
        <Header />
        <Main />
      </div>
    </BrowserRouter>
  );
}

export default App;
