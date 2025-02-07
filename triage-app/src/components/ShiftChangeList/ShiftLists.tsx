import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import ShiftChangeList from './ShiftChangeList'
import { Shift } from '../../interfaces/Shift'
import { useTranslation } from 'react-i18next'

interface ShiftListsProps {
  shifts: Shift[]
}

const ShiftLists: React.FC<ShiftListsProps> = ({ shifts }) => {
  const [expandedShiftId, setExpandedShiftId] = useState<string | null>(null)
  const { t } = useTranslation('ShiftList')
  const toggleExpand = (id: string) => {
    setExpandedShiftId(expandedShiftId === id ? null : id)
  }
  return (
    <div className='space-y-4 p-4'>
      {shifts.map((shift) => (
        <div key={shift.id} className='p-4 rounded-lg shadow-lg border bg-white'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-lg font-semibold'>
                {t('Shift on:')}
                <p>{new Date(shift.shift_day).toLocaleDateString()}</p>
                <p>{new Date(shift.shift_day).toLocaleTimeString()}</p>
              </h3>
              <p className='text-sm text-gray-500'>
                {shift.shift_start_time} - {shift.shift_end_time}
              </p>
              <p>{shift.id}</p>
            </div>
            <Button
              onClick={() => toggleExpand(shift.id)}
              variant='ghost'
              className='flex items-center'
            >
              {expandedShiftId === shift.id ? t('Hide Details') : t('Show Details')}
              <FontAwesomeIcon
                icon={expandedShiftId === shift.id ? faChevronDown : faChevronRight}
                className='ml-2 text-gray-600'
              />
            </Button>
          </div>
          {expandedShiftId === shift.id && (
            <div className='mt-4 overflow-x-auto'>
              <ShiftChangeList shift_id={expandedShiftId} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ShiftLists
