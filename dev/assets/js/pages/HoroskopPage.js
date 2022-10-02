import React from 'react';

import Horoskop from '../components/Horoskop';
import { createRoot } from 'react-dom/client';

const HoroskopPage = (props) => {
  // === DOM & VARS ===
  const DOM = {};
  const horoskopEl = createRoot(document.querySelector('#react-horoskop'));

  // === INIT =========

  const init = () => {
    console.log('horoskop');
    horoskopEl.render(
      <>
        <Horoskop />
      </>
    );
  };

  // === EVENTS / XHR =======

  // === FUNCTIONS ====

  init();
};

export default HoroskopPage;
