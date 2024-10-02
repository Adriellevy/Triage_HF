import React from 'react';
import { DatePickerMUI } from '../DatePickerMUI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '../ui';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';

const PatientByDatePicker = ({ startDate, setStartDate, endDate, setEndDate, searchPatientByDate, clearData }) => {

  const handleStartDateChange = (newDate: string | null) => {
    setStartDate(newDate);
    // Verificar que la fecha de inicio no sea mayor que la de fin
    if (newDate && endDate && new Date(newDate).getTime() > new Date(endDate).getTime()) {
      setEndDate(null); // Resetear la fecha de fin si es anterior a la fecha de inicio
    }
  };

  const handleEndDateChange = (newDate: string | null) => {
    setEndDate(newDate);
  };

  const handleClearData = () => {
    setStartDate(null)
    setEndDate(null)
    clearData()
  }

  return (
    <div className='bg-white flex px-4 gap-3 min-h-[64px] mt-4 justify-center flex-col md:flex-row'>
      <div className='flex flex-col mr-3 mb-3 md:mb-0'>
        <label  className='text-sm font-medium text-gray-700 mb-1'>Desde:</label>
        <DatePickerMUI
          onChangeExt={handleStartDateChange}
          selectedDateExt={startDate}
          error_active={{ value: false, message: '' }} // Aquí puedes manejar los errores si es necesario
          />
      </div>

      <div className='flex flex-col mr-3 '>
      <label  className='text-sm font-medium text-gray-700 mb-1'>Hasta:</label>
      <DatePickerMUI
        onChangeExt={handleEndDateChange}
        selectedDateExt={endDate}
        error_active={{ value: false, message: '' }} // Ajusta el manejo de errores si es necesario
      />
      </div>
      <div className='flex self-center'>
      <Button
        className='mt-[24px] py-2 px-4 text-white bg-red-500 hover:bg-red-700 flex-shrink-0 rounded-lg'
        color='red'
        onClick={() => handleClearData()}
        >
        <FontAwesomeIcon icon={faXmark} />
      </Button>
      <Button
        className='ml-4 mt-[24px] py-2 px-4 self-center text-white bg-green-500 hover:bg-green-700  rounded-lg'
        color='green'
        onClick={() => searchPatientByDate([startDate, endDate])}
        >
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </Button>
      </div>
    </div>
  );
};

export default PatientByDatePicker;
