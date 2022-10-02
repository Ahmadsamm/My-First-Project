import TvProgram from '../modules/TvProgram';

const TvProgramPage = () => {
  const $ = (qs) => document.querySelector(qs);
  const $$ = (qs) => Array.from(document.querySelectorAll(qs));

  // === DOM & VARS ===
  const DOM = {};
  DOM.tvPrograms = $$('.m-tv-program');

  // === INIT =========

  const init = () => {
    console.log('init tv-program-page');

    DOM.tvPrograms.forEach((el) => {
      TvProgram(el, { width: 'full' });
    });
  };

  // === EVENTS / XHR =======

  // === FUNCTIONS ====

  init();
};

export default TvProgramPage;
