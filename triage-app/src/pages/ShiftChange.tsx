import { useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import {
  getCurrentShift,
  getAllShifts,
  getShiftChanges,
  getShiftById
} from '../services/ShiftService'
// import { Shift } from '../interfaces/Shift.ts'
import type { ShiftChange } from '@/interfaces/Shift-change.ts'
import ShiftList from '@/components/ShiftChangeList/ShiftList.tsx'

function ShiftChange() {
  const token = Cookies.get('authToken')
  const [shiftsData, setShiftsData] = useState<ShiftChange[] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const data = await getShiftChanges()
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
      <>llego la data</>
      <ShiftList shiftChanges={shiftsData} />
    </>
  ) : (
    <p>No shifts found.</p>
  )
}
export default ShiftChange
