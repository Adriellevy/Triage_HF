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
import ShiftChangeList from '@/components/ShiftChangeList/ShiftChangeList'
import ShiftLists, { Shift } from '@/components/ShiftChangeList/shiftLists'

function ShiftChange() {
  const token = Cookies.get('authToken')
  const [shiftsData, setShiftsData] = useState<Shift[] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

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
    <p>No shifts found.</p>
  )
}
export default ShiftChange
