import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers'
import dayjs from 'dayjs'


interface DatePickerMUIProps {
  onChangeExt: (newDate: Date | null) => void
  selectedDateExt: Date | null;
  error_active:any
}


export const DatePickerMUI: React.FC<DatePickerMUIProps> = ({ onChangeExt,selectedDateExt,error_active }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    // Actualiza el estado local cuando cambia la fecha seleccionada desde el padre
    setSelectedDate(selectedDateExt);
  }, [selectedDateExt]);


  const getFormatTime = (date: Date | null) => {
    if (date) {
      const fecha = new Date(date)
      const dia = fecha.getDate().toString().padStart(2, '0') // Obtiene el día y lo convierte a string con dos dígitos
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0') // Obtiene el mes (los meses empiezan desde 0)
      const anio = fecha.getFullYear()
      return `${anio}-${mes}-${dia}`
    }
  }

  const handleChange = (newDate: Date | null) => {
    setSelectedDate(newDate)
    onChangeExt(getFormatTime(newDate))
  }

  const yesterday = dayjs().subtract(130, 'year');
  const today = dayjs()

  const errorBorder = error_active?.value == true ? 'border-red-500' : ''
  const errorMessage = error_active?.message

 
  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className={`${errorBorder?'redBorderDataPick':''}`}>
        <DatePicker
          // label="Seleccionar fecha"
          views={['year', 'month', 'day']}
          openTo='year'
          minDate={yesterday}
          maxDate={today}
          value={selectedDate}
          onChange={handleChange}
          format='DD/MM/YYYY'
          className={`w-full h-0 m-0 p-0 text-sm datePick`}
          />
          </div>
      </LocalizationProvider>
      {errorBorder && <span className='text-red-500 relative'>{errorMessage}</span>}

    </div>
  )
}
