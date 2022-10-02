import { v4 as uuidv4 } from 'uuid';
// import { uniqueId } from 'lodash';
import { range } from 'lodash';
import moment from 'moment';

const SelectDay = (props) => {
  // const {} = props;
  const currentDay = props.day || moment().date(); // new Date().getDate();
  const month = props.month || moment().month() + 1; // new Date().getMonth() + 1
  const id = uuidv4(); // uniqueId(); // id-hash

  const getDaysInMonth = (month) => {
    const y = moment().year(); // new Date().getFullYear();
    const m = month < 10 ? `0${month}` : month;
    const days = moment(`${y}-${m}`, 'YYYY-MM').daysInMonth(); // => 31;
    return range(1, days + 1); //=> [1,...,31]
  };

  const days = getDaysInMonth(month);

  const handleChange = (e) => {
    const value = Number(e.currentTarget.value);
    props.onHandleChangeDay(value);
  };

  return (
    <div className='m-select-day mb-3'>
      <label htmlFor={`select-day-${id}`} className='form-label'>
        Day
      </label>
      <select className='form-select' name='day' id={`select-day-${id}`} value={currentDay} onChange={handleChange}>
        {days.map((day) => (
          <option key={`day-${day}`} value={day}>
            {day < 10 ? `0${day}` : day}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectDay;
