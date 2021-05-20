import React, { useState } from 'react';
import './App.scss';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header/Header';
import Main from '../Main/Main';

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const handleUserButtonClick = () => {
    if (isAuthorized) setIsAuthorized(false);
    else setIsAuthorized(true);
  };
  return (
    <BrowserRouter>
      <div className="page">
        <Header isAuthorized={isAuthorized} handleUserButtonClick={handleUserButtonClick} />
        <Main isAuthorized={isAuthorized} />
      </div>
    </BrowserRouter>
  );
}

export default App;
