import React, { useEffect, useState } from 'react';
import SelectDay from './content/SelectDay';
import SelectMonth from './content/SelectMonth';

import axios from 'axios';
import moment from 'moment';

// import localSigns from './data/horoskop_signs';

const Horoskop = (props) => {
  // const {} = props;
  const [day, setDay] = useState(moment().date());
  const [month, setMonth] = useState(moment().month() + 1);

  const [signs, setSigns] = useState([]);

  useEffect(() => {
    fetchSigns();
    return () => {
      // cleanup
    };
  }, []);

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
  // const fetchSigns = async () => {
  //   const result = await axios.get('http://localhost:3000/api/signs.json');
  //   setSigns(result.data);
  // };

  const fetchSigns = () => {
    axios
      .get('/api/signs.json')
      .then((json) => setSigns(json.data))
      .catch((err) => console.error(err));

    // fetch('http://localhost:3000/api/signs.json')
    //   .then((resp) => resp.json())
    //   .then((data) => {
    //     console.log(data);
    //     setSigns(data);
    //   })
    //   .catch((err) => console.error(err));
  };

  const handleChangeDay = (day) => {
    setDay(day);
  };

  const handleChangeMonth = (month) => {
    setMonth(month);
  };

  const isSignDate = (opts) => {
    const { from, to, month, day } = opts;

    const date = moment(`${month}-${day}`, 'MM-DD'); // Moment Date Object
    const fromDate = moment(from, `YYYY-MM-DD`);
    const toDate = moment(to, 'YYYY-MM-DD');

    // const isFromBeforeTo = fromDate.isBefore(toDate);

    // let result = false;
    // if (isFromBeforeTo) {
    //   result = date.isBetween(fromDate.subtract(1, 'year'), toDate) || date.isSame(fromDate) || date.isSame(toDate);
    // } else {
    //   result = date.isBetween(fromDate, toDate) || date.isSame(fromDate) || date.isSame(toDate);
    // }

    // return result;
    return date.isBetween(fromDate, toDate) || date.isSame(fromDate) || date.isSame(toDate);
  };

  const getSign = (d, m) => {
    const sign = signs.find((sign) =>
      isSignDate({
        day: d,
        month: m,
        from: sign.fromDate,
        to: sign.toDate,
      })
    );
    return sign ? sign : { name: 'kein valides Datum', image: '001-taurus.svg' };
  };

  const sign = getSign(day, month);
  console.log(sign);

  return (
    <div className='m-horoskop horoskop'>
      <div className='container py-5'>
        <div className='row'>
          <div className='col-12 col-sm-6'>
            <SelectDay day={day} month={month} onHandleChangeDay={handleChangeDay} />
          </div>

          <div className='col-12 col-sm-6'>
            <div className='m-select-month mb-3'>
              <SelectMonth month={month} onHandleChangeMonth={handleChangeMonth} />
            </div>
          </div>
        </div>

        <div className='row mt-5 justify-content-center'>
          <div className='col-10 col-md-4'>
            <div className='card'>
              <div className='card-header'>
                <img src={`../assets/img/horoskop/svg/${sign.image}`} alt='' />
              </div>
              <div className='card-body'>
                <h5 className='card-title text-center'>{sign.name}</h5>
              </div>
              <ul className='list-group list-group-flush'>
                <li className='list-group-item text-center'>
                  {moment(sign.fromDate).format('DD.MM.')} - {moment(sign.toDate).format('DD.MM.')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Horoskop;
