import React from 'react';

import GameOfLife from '../components/GameOfLife';
import { createRoot } from 'react-dom/client';

const GameOfLifePage = (props) => {
  // === DOM & VARS ===
  const DOM = {};
  const reactEl = createRoot(document.querySelector('#react-game-of-life'));

  // === INIT =========

  const init = () => {
    console.log('horoskop');
    reactEl.render(
      <>
        <GameOfLife />
      </>
    );
  };

  // === EVENTS / XHR =======

  // === FUNCTIONS ====

  init();
};

export default GameOfLifePage;
