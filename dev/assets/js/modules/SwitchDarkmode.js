const SwitchDarkmode = () => {
  // === DOM & VARS ===
  const DOM = {};
  DOM.html = document.querySelector('html');
  DOM.switchDarkmode = document.querySelector('.m-switch-darkmode input');
  // === INIT =========

  const init = () => {
    setCurrentLightMode();

    // darkmode switch
    DOM.switchDarkmode.addEventListener('change', onToggleSwitchDarkmode);
  };

  // === EVENTS & XHR =======
  const onToggleSwitchDarkmode = (e) => {
    setCurrentLightMode();
  };
  // === FUNCTIONS ====
  const setCurrentLightMode = () => {
    if (DOM.switchDarkmode.checked) {
      DOM.html.classList.add('bg-dark');
    } else {
      DOM.html.classList.remove('bg-dark');
    }
  };

  init();
};

export default SwitchDarkmode;
