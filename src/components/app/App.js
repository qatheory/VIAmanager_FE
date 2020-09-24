import React from 'react';
import logo from '../logo/logo.svg';
import './App.css';
import WelcomeText from "../welcome/welcome"
import Link from "../link/link"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <WelcomeText link="test abcd" />
        <Link />
      </header>
    </div>
  );
}

export default App;
