'use strict';

// Modules
import SwitchDarkmode from './modules/SwitchDarkmode';

// Pages Module
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import GameOfLifePage from './pages/GameOfLifePage';
import HomePage from './pages/HomePage';
import HoroskopPage from './pages/HoroskopPage';
import StudentZitatePage from './pages/StudentZitatePage';
import TvProgramPage from './pages/TvProgramPage';

(() => {
  // === INIT =========

  const init = () => {
    const page = document.querySelector('body').dataset.page;

    SwitchDarkmode();

    switch (page) {
      case 'home':
        HomePage();
        break;
      case 'contact':
        ContactPage();
        break;
      case 'projekte/tv-programm':
        TvProgramPage();

        break;
      case 'projekte/student-zitate':
        StudentZitatePage();

        break;

      case 'projekte/horoskop':
        HoroskopPage();

        break;
      case 'projekte/game-of-life':
        GameOfLifePage();

        break;

      case 'ueber-uns':
        AboutUsPage();
        break;
    }
  };

  init();
})();
