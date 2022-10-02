import Filterizr from 'filterizr';
import moment from 'moment';
import truncate from 'lodash/truncate';
import uniqueId from 'lodash/uniqueId';

const TvProgram = (el, opts = { width: 'auto' }) => {
  const { width = 'auto' } = opts;

  // === DOM & VARS ===
  const DOM = {};
  DOM.module = el || document.querySelector('.m-tv-program');
  DOM.wrapper = DOM.module.querySelector('.tv-program-wrapper');
  DOM.formDate = DOM.module.querySelector('.form-box form');

  DOM.labelDate = DOM.formDate.querySelector('label[for="input-date"]');
  DOM.labelSelect = DOM.formDate.querySelector('label[for="select-genre"]');
  DOM.inputDate = DOM.formDate.querySelector('input[type="date"]');
  DOM.selectGenre = DOM.formDate.querySelector('select[name="genre"]');
  DOM.buttonSend = DOM.formDate.querySelector('.button-send');
  DOM.tvProgramBox = DOM.module.querySelector('.tv-program-box');

  DOM.filterContainer = DOM.tvProgramBox.querySelector('.filter-container');
  DOM.dummyFilterItem = DOM.filterContainer.querySelector('.filtr-item');

  const id = uniqueId();
  let filterizr;

  // === INIT =========

  // https://www.tvmaze.com/api
  // https://yiotis.net/filterizr/#/documentation/vanilla/options

  const init = () => {
    console.log('Modul: TV Program');

    const currentDate = new Date().toISOString().substring(0, 10); // moment().format('YYYY-MM-DD');

    if (width === 'auto') {
      DOM.wrapper.classList.add('container');
      DOM.wrapper.classList.remove('container-fluid');
    } else if (width === 'full') {
      DOM.wrapper.classList.add('container-fluid');
      DOM.wrapper.classList.remove('container');
    }

    DOM.labelDate.htmlFor = DOM.inputDate.id = `input-date-${id}`;
    DOM.labelSelect.htmlFor = DOM.selectGenre.id = `input-select-${id}`;

    DOM.inputDate.value = currentDate;
    DOM.selectGenre.addEventListener('change', onChangeSelectGenre);
    DOM.formDate.addEventListener('submit', onSubmitForm);

    console.log(currentDate);

    fetchTvProgram(currentDate);
  };

  // === EVENTS / XHR =======
  const onSubmitForm = (e) => {
    e.preventDefault();
    const date = DOM.inputDate.value;
    fetchTvProgram(date);
  };

  const onChangeSelectGenre = (e) => {
    const value = e.target.value;
    filterizr.filter(value);
  };

  const fetchTvProgram = (date) => {
    fetch(`https://api.tvmaze.com/schedule?country=US&date=${date}`)
      .then((resp) => resp.json())
      .then((data) => generateTvProgram(data))
      .catch((err) => console.error(err));
  };

  // === FUNCTIONS ====
  const generateTvProgram = (programs) => {
    DOM.filterContainer.textContent = '';

    const allGenres = [];

    programs.forEach((program) => {
      const cardEl = createShowCard(program);
      allGenres.push(...getAllGenres(program.show.genres, allGenres));

      DOM.filterContainer.appendChild(cardEl);
    });
    console.log(allGenres.sort());

    createGenreOptionEls(allGenres);

    filterizr = new Filterizr(DOM.filterContainer, {
      gutterPixels: 20,
      layout: 'sameWidth',
    });
  };

  const createGenreOptionEls = (genres) => {
    DOM.selectGenre.textContent = '';

    const optionEl = document.createElement('option');
    optionEl.textContent = 'Alle';
    optionEl.value = 'all';

    DOM.selectGenre.appendChild(optionEl);

    genres.forEach((genre) => {
      const optionEl = document.createElement('option');
      optionEl.textContent = genre;
      optionEl.value = genre.toLowerCase();
      DOM.selectGenre.appendChild(optionEl);
    });
  };

  const getAllGenres = (currents, all = []) => {
    return currents.filter((genre) => !all.includes(genre));
  };

  const createShowCard = (program) => {
    const { name, url, airtime: time, airdate: date, summary } = program;
    const { genres, name: showName } = program.show;

    // console.log(program.show.image);

    const imgPath =
      program.show.image !== null && program.show.image.original !== null ? program.show.image.original : '';

    const filterItemEl = DOM.dummyFilterItem.cloneNode(true);
    const cardEl = filterItemEl.querySelector('.card');

    const imgEl = cardEl.querySelector('img');
    const titleEl = cardEl.querySelector('.card-title');
    const textEl = cardEl.querySelector('.card-text');
    const timeEl = cardEl.querySelector('.time');
    const genreEl = cardEl.querySelector('.genre');
    const linkMoreEl = cardEl.querySelector('.link-more');
    const dateEl = cardEl.querySelector('.date');
    const channelEl = cardEl.querySelector('.channel');

    filterItemEl.dataset.category = genres.map((genre) => genre.toLowerCase()).join(', ');

    imgEl.src = imgPath;
    titleEl.textContent = showName;
    textEl.innerHTML = truncate(summary, { length: 150 });
    genreEl.textContent = genres.join(', ');
    timeEl.textContent = time;
    linkMoreEl.href = url;
    dateEl.textContent = moment(date).format('DD.MM.YY');
    channelEl.textContent = truncate(name, { length: 20 });

    return filterItemEl;
  };

  init();
};

export default TvProgram;
