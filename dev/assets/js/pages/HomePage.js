import Splide from '@splidejs/splide';

const HomePage = () => {
  // === DOM & VARS ===
  const DOM = {};
  DOM.slider = document.querySelector('.m-slider');
  // === INIT =========

  const init = () => {
    new Splide(DOM.slider, {
      type: 'loop',
    }).mount();

    console.log('home');
  };

  // === EVENTS / XHR =======

  // === FUNCTIONS ====

  init();
};

export default HomePage;
