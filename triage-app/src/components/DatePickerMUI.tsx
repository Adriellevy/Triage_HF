import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers'
import dayjs from 'dayjs'

interface DatePickerMUIProps {
  onChangeExt: (newDate: string | null) => void
  selectedDateExt: string | null
  error_active: { value: boolean | null; message: string }
}

export const DatePickerMUI: React.FC<DatePickerMUIProps> = ({
  onChangeExt,
  selectedDateExt,
  error_active
}) => {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null)

  useEffect(() => {
    // Update the local state when the selected date changes from the parent
    setSelectedDate(selectedDateExt ? dayjs(selectedDateExt) : null)
  }, [selectedDateExt])

  const getFormatTime = (date: dayjs.Dayjs | null) => {
    if (date) {
      const dia = date.format('DD')
      const mes = date.format('MM')
      const anio = date.format('YYYY')
      return `${anio}-${mes}-${dia}`
    }
    return null
  }

  const handleChange = (newDate: dayjs.Dayjs | null) => {
    setSelectedDate(newDate)
    onChangeExt(getFormatTime(newDate))
  }

  const yesterday = dayjs().subtract(130, 'year')
  const today = dayjs()

  const errorBorder = error_active?.value === true ? 'border-red-500' : ''
  const errorMessage = error_active?.message

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className={`${errorBorder ? 'redBorderDataPick' : ''}`}>
          <DatePicker
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
