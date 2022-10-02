const StudentZitatePage = () => {
  const persons = [
    {
      id: 'phil',
      image: 'persons/phil.png',
      title: 'Chief Phil',
      quotes: [
        '"Kaffee - Pause."',
        '"Ich brauche mehr Kaffee."',
        '"Jeder verstanden? - Mmh, gut, keine Reaktion, ja dann , machen wir weiter!"',
        '"5 Minuten Pause."',
      ],
    },
    {
      id: 'ahmad',
      image: 'persons/ahmad.png',
      title: 'Student Ahmad',
      quotes: [
        '"Philippe, ich habe eine Frage."',
        '"Ist diese Variation des Codes auch möglich?"',
        '"Kann ich Dir es eben zeigen?"',
      ],
    },
    {
      id: 'daria',
      image: 'persons/daria.png',
      title: 'Studentin Daria',
      quotes: ['"Ich kanns mal versuchen..."', '"Meine Lösung wäre..."', '"Ein bißchen habe ich was."'],
    },
    {
      id: 'deeba',
      image: 'persons/deeba.png',
      title: 'Studentin Deeba',
      quotes: ['"Philippe, eine Frage!"', '"Ah, gut zu wissen."', '"Ich fasse noch mal für mich zusammen."'],
    },
    {
      id: 'dominic',
      image: 'persons/dominic.png',
      title: 'Student Dominic',
      quotes: ['"Mein Mac zeigt was anderes an."'],
    },
    {
      id: 'henry',
      image: 'persons/henry.png',
      title: 'Student Henry',
      quotes: [
        '"Mein Mac zeigt was anderes an."',
        '"Welchen Befehl brauche ich da dann bei meinem Mac?"',
        '"Ich kanns Dir nicht zeigen, weil ich auf meinem Mac bin, nicht am GFN Rechner."',
        '"Wäre das bei Krypto mit dem Modul XY dann auch in Echtzeit...?"',
      ],
    },
    {
      id: 'kevin',
      image: 'persons/kevin.png',
      title: 'Student Kevin',
      quotes: [
        '"Die Antwort wäre...',
        '"Die Lösung zur folgender Aufgabe lautet..."',
        '"...und die Antwort zur der Frage wäre..."',
        '"Die Coderedundanz (das Maß für nutzlos vorhandene Bits) beträgt: R = L - H = 1,3 - 1,157 = 0,143 [bit] (11 % relativ)."',
      ],
    },
    {
      id: 'patrick',
      image: 'persons/patrick.png',
      title: 'Student Patrick',
      quotes: [
        '"Dasselbe habe ich auch."',
        '"Kaffee - Pause bitte."',
        '"Ich hab´s gemacht! (auf Frage, wer hat die Hausaufgabe gemacht..."',
        '"Hier habe ich ein Snippet für Alle bzw. wer will."',
      ],
    },
    {
      id: 'susanne',
      image: 'persons/susanne.png',
      title: 'Studentin Susanne',
      quotes: [
        '"Sorry, hier herrscht maximales Chaos, alles rot!"',
        '"Ich brauch´ ne Zigarette',
        '"I habe eine Frage.',
        '"Phil ich bräuchte kurz Deine Hilfe!"',
        '"Kaffee bräuchte ich auch!',
        '"Muß mal wieder die Kamera auslassen, mein Internet ist verstopft, es laggt ohne Ende, sorry an Alle!"',
      ],
    },
  ];

  // === DOM & VARS ===
  const DOM = {};
  DOM.personQuotes = document.querySelector('.m-person-quotes');
  DOM.row = DOM.personQuotes.querySelector('.row');
  DOM.dummyCard = DOM.personQuotes.querySelector('.card-person');

  // === INIT =========

  const init = () => {
    createCards(persons);
  };

  // === EVENTS & XHR =======
  const onClickNextQuote = (e) => {
    const btnEl = e.currentTarget;
    const cardContentEl = btnEl.previousElementSibling;
    const id = btnEl.dataset.id;
    const quotes = getQuotesById(id);

    cardContentEl.textContent = newQuote(quotes);
  };

  // === FUNCTIONS ====
  const createCards = (persons) => {
    DOM.row.textContent = '';

    persons.forEach((person) => {
      const cardEl = DOM.dummyCard.cloneNode(true);
      DOM.row.appendChild(cardEl);

      const title = cardEl.querySelector('.card-title');
      const img = cardEl.querySelector('img');
      const buttonNextQuote = cardEl.querySelector('button');

      title.textContent = person.title;
      img.src = `../assets/img/${person.image}`;
      img.alt = person.id;

      buttonNextQuote.dataset.id = person.id;
      buttonNextQuote.addEventListener('click', onClickNextQuote);
    });
  };

  const newQuote = (quotes) => {
    const randomNumber = Math.floor(Math.random() * quotes.length);
    return quotes[randomNumber];
  };

  const getQuotesById = (id) => {
    const person = persons.find((person) => person.id === id);
    return person !== -1 ? person.quotes : [];
  };

  init();
};

export default StudentZitatePage;
