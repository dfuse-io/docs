import React, { useState } from 'react';
import { checkBalance } from './query';
import './App.css';

const App = () => {
  const [balance, setBalance] = useState(null);
  const [account, setAccount] = useState('');

  return (
    <div className='App'>
      <header className='App-header'>
        <h2>Check Balance Example</h2>
      </header>
      <div className='App-main'>
        <input
          className='App-input'
          type='text'
          name='setAccount'
          onChange={e => setAccount(e.target.value)}
        />
        <div className='App-buttons'>
          <button
            className='App-button'
            onClick={() => checkBalance(account, setBalance)}
          >
            Check
          </button>
        </div>
        <h3>{`Balance: ${balance}`}</h3>
      </div>
    </div>
  );
};

export default App;
