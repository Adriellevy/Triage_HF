import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { getAllShifts } from '../services/ShiftService'
// import { Shift } from '../interfaces/Shift.ts'
import type { ShiftChange } from '@/interfaces/Shift-change.ts'
import ShiftLists from '@/components/ShiftChangeList/ShiftLists.tsx'
import { Shift } from '@/interfaces/Shift'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'

function ShiftChange() {
  const token = Cookies.get('authToken')
  const [shiftsData, setShiftsData] = useState<Shift[] | null>(null)

  const { t } = useTranslation('ShiftList')
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const data = await getAllShifts()
          console.log('data', data)
          setShiftsData(data)
        }
      } catch (error) {
        console.error((error as Error).message)
      }
    }
    fetchData()
  }, [token])

  return shiftsData ? (
    <>
      <ShiftLists shifts={shiftsData} />
      {/*><ShiftChangeList shiftChanges={shiftsData} /> */}
    </>
  ) : (
    <div className='flex flex-col items-center justify-center h-full'>
      <FontAwesomeIcon icon={faChevronRight} className='text-6xl text-gray-400 mb-4' />
      <p className='text-xl text-gray-500'>{t('noshift')}</p>
    </div>
  )
}
export default ShiftChange
