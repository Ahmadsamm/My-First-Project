import validator from 'validator';

const ContactPage = () => {
  // === DOM & VARS ===
  const DOM = {};
  DOM.formContact = document.querySelector('#form-contact');
  DOM.formRequiredFields = Array.from(DOM.formContact.querySelectorAll('input[required], textarea[required]'));
  DOM.genderGroup = DOM.formContact.querySelector('.form-gender-group');

  console.log(DOM);

  // === INIT =========

  const init = () => {
    DOM.formContact.noValidate = true;
    DOM.formRequiredFields.forEach((field) => {
      field.addEventListener('focus', onFocusFormField);
      field.addEventListener('blur', onBlurFormField);
    });

    DOM.formContact.addEventListener('submit', onFormSubmit);
  };

  // === EVENTS / XHR =======
  const sendFormContact = (formData) => {
    fetch('http://localhost:3000/contact/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((resp) => resp.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  };

  const onFormSubmit = (e) => {
    const formEl = e.currentTarget;
    e.preventDefault();

    // const formData = {
    //   firstName: DOM.inputFirsname.value
    // }

    const formData = getFormData(formEl);
    console.log(formData);

    formEl.classList.remove('was-validated');
    if (!isFormValid()) {
      formEl.classList.add('was-validated');

      console.error('Formular konnte nicht versendet werden');
    } else {
      console.log('Formular wird versendet.');

      sendFormContact(formData);
    }
  };

  const onFocusFormField = (e) => {
    const el = e.currentTarget;
    console.log('wurde fokusiert');
    el.dataset.touched = true;
  };

  const onBlurFormField = (e) => {
    const el = e.currentTarget;
    console.log(el);
    switch (el.name) {
      case 'firstname':
        validateTextField(el);
        break;
      case 'lastname':
        validateTextField(el, { min: 2, max: 20 });
        break;

      case 'message':
        validateTextField(el, { min: 2, max: 1000 });
        break;
      case 'email':
        validateEmailField(el);
        break;
      case 'agb':
        validateCheckbox(el);
    }
    validateRadioGroup(DOM.genderGroup);
  };

  // === FUNCTIONS ====
  const validateCheckbox = (el) => {
    if (!el.checked) {
      console.warn('checkbox not selected');
      el.classList.add('is-invalid');
      el.classList.remove('is-valid');
    } else {
      el.classList.remove('is-invalid');
      el.classList.add('is-valid');
    }
  };

  const validateRadioGroup = (groupEl) => {
    const radioEls = Array.from(groupEl.querySelectorAll('input[type="radio"]'));
    const isOneChecked = radioEls.some((el) => el.checked);

    if (!isOneChecked) {
      console.warn('no radio selected');
      groupEl.classList.add('is-invalid');
      groupEl.classList.remove('is-valid');
      radioEls.forEach((el) => {
        el.classList.add('is-invalid');
        el.classList.remove('is-valid');
      });
    } else {
      groupEl.classList.remove('is-invalid');
      groupEl.classList.add('is-valid');
      radioEls.forEach((el) => {
        el.classList.remove('is-invalid');
        el.classList.add('is-valid');
      });
    }
  };

  const validateEmailField = (el) => {
    const value = el.value;
    // const emailRegex = new RegExp(
    //   /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    // );

    // if (value === '' || !emailRegex.test(value)) {

    if (el.dataset.touched) {
      if (validator.isEmpty(value) || !validator.isEmail(value)) {
        console.warn('no valid input');
        el.classList.add('is-invalid');
        el.classList.remove('is-valid');
      } else {
        el.classList.remove('is-invalid');
        el.classList.add('is-valid');
      }
    }
  };

  const validateTextField = (el, opts = { min: 2, max: 40 }) => {
    const value = el.value;
    if (validator.isEmpty(value) || !validator.isLength(value, opts)) {
      console.warn('no valid input');
      el.classList.add('is-invalid');
      el.classList.remove('is-valid');
    } else {
      el.classList.remove('is-invalid');
      el.classList.add('is-valid');
    }
  };

  const isFormValid = () => {
    const validFields = DOM.formRequiredFields.filter((field) => field.classList.contains('is-valid'));
    console.log('requiredFields: ', DOM.formRequiredFields);
    console.log('validFields: ', validFields);

    return validFields.length === DOM.formRequiredFields.length;
  };

  const getFormData = (form, requiredFields = []) => {
    const formData = new FormData(form);

    // z.B. new FormData(form).entries()

    // [
    //  {},
    //    ['firstname', 'Max'],
    //    ['lastname', 'Mustermann']
    //  ...
    // ]

    //  {'firstname': 'Max', 'lastname:'Mustermann'}

    const formObj = Array.from(formData.entries()).reduce((obj, arr) => {
      if (requiredFields.length > 0) {
        if (!obj[arr[0]] && requiredFields.includes(arr[0])) {
          obj[arr[0]] = arr[1];
        }
      } else {
        if (!obj[arr[0]]) {
          obj[arr[0]] = arr[1];
        }
      }
      return obj;
    }, {});

    return formObj;
  };

  init();
};

export default ContactPage;
