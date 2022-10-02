import { v4 as uuidv4 } from 'uuid';
// import { uniqueId } from 'lodash';
import moment from 'moment';
import 'moment/locale/de';
import 'moment/locale/fr';
import 'moment/locale/es';

const SelectMonth = (props) => {
  // const {} = props;
  const currentMonth = props.month || moment().month() + 1; // new Date().getMonth() + 1;

  const id = uuidv4(); // uniqueId(); // id-hash

  moment.locale(props.lang || 'en');

  const months = moment.months(); //=>  ['January',...]

  const handleChange = (e) => {
    const value = Number(e.currentTarget.value);
    props.onHandleChangeMonth(value);
  };

  return (
    <div className='m-select-month mb-3'>
      <label htmlFor={`select-month-${id}`} className='form-label'>
        Month
      </label>
      <select
        className='form-select'
        name='month'
        id={`select-month-${id}`}
        value={currentMonth}
        onChange={handleChange}
      >
        {months.map((month, idx) => (
          <option key={`month-${idx}`} value={idx + 1}>
            {month}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectMonth;
