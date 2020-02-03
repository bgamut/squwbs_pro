import React from 'react';
import logo from './logo.svg';
import './App.css';
import DirectoryOpen from './components/DirectoryOpen'


function App() {
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <DirectoryOpen/>
      </header>
    </div>
  );
}

export default App;
