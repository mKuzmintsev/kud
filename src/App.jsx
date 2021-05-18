import React from 'react';
import './App.css';
import MainMenu from './components/Menu/MainMenu';
import MainContent from './components/MainContent';
import Header from './components/Header/Header';

function App() {
  return (
    <div className="mainWrapper">
      <Header></Header>
      <div className="contentWrapper">
        <div className="menu">
          <MainMenu></MainMenu>
        </div>
        <div className="content">
          <MainContent></MainContent>
        </div>
      </div>
    </div>
  );
}

export default App;
