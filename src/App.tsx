import React, { useState, useEffect } from 'react';
import ITwitterUser from './interfaces/ITwitterUser';
import Wheel from './components/wheel/Wheel';
import users from './mock/users.json';
import './App.css';

function App() {
  const [winner, setWinner] = useState<ITwitterUser>();
  const [showWinner, setShowWinner] = useState(false);

  useEffect(() => {
    if (!winner) {
      return;
    }

    setTimeout(() => {
      setShowWinner(true);
    }, 20000);
  }, [winner]);

  const handleSelectUser = (index: number) => {
    const winnerFromIndex = users[index];
    setWinner(winnerFromIndex);
  };

  const winnerStyle = winner ? { backgroundImage: `url(${winner.profileImage})` } : {};

  return (
    <div className='App'>
      <canvas id='canvas' style={{ opacity: showWinner ? 1 : 0 }} />
      <div className={`winner-container ${showWinner ? 'show' : ''}`} style={winnerStyle}></div>
      <div className='text-container' style={{ opacity: showWinner ? 1 : 0 }}>
        <div className='text'>{winner?.username}</div>
        <div className='subtext'>{winner?.handle}</div>
      </div>
      <Wheel twitterUsers={users} onSelectUser={handleSelectUser} hide={showWinner} />
    </div>
  );
}

export default App;
