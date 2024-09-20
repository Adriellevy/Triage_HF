import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../ui';
import { DatePickerMUI } from '../DatePickerMUI';

const PatientByDatePicker = ({ searchDate, setsearchDate, searchPatient, clearData }) => {
  return (
    <div className='w-full p-4'>
    <label className='block text-sm font-medium text-gray-700 mb-2'>Buscar paciente por fecha</label>
    <div className='flex items-center'>
      <DatePickerMUI
        onChangeExt={(e) => setsearchDate(e.target.value)}
        selectedDateExt={searchDate}
        />
    </div>
  </div>
  );
};

export default PatientByDatePicker;
