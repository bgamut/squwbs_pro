import React from 'react';
import logo from './logo.svg';
import './App.css';
import DirectoryOpen from './components/DirectoryOpen'
var fs = require('fs');
var path = require('path')
var isWav = require('is-wav');
const wavefile = require('wavefile');
const FileType = require('file-type');
const child_process=require('child_process')
const commonPath=require('common-path')

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
