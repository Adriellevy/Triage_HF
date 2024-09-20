import React from 'react';
import { Box } from '@mui/material';// Importa tu DatePickerMUI
import { DatePickerMUI } from '../DatePickerMUI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '../ui';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const PatientByDatePicker = ({ startDate, setStartDate, endDate, setEndDate, searchPatientByDate }) => {

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

  return (
    <Box display="flex" justifyContent="space-between" gap={2}>
      {/* Reemplazar el primer DatePicker */}
      <DatePickerMUI
        onChangeExt={handleStartDateChange}
        selectedDateExt={startDate}
        error_active={{ value: false, message: '' }} // Aquí puedes manejar los errores si es necesario
      />

      {/* Reemplazar el segundo DatePicker */}
      <DatePickerMUI
        onChangeExt={handleEndDateChange}
        selectedDateExt={endDate}
        error_active={{ value: false, message: '' }} // Ajusta el manejo de errores si es necesario
      />
      <Button
        className='ml-4 py-2 px-4 text-white bg-green-500 hover:bg-green-700 flex-shrink-0 rounded-lg'
        color='green'
        onClick={() => searchPatientByDate([startDate, endDate])}
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </Button>
    </Box>
  );
};

export default PatientByDatePicker;
