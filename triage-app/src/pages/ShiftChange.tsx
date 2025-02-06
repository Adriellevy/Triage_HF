import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { getAllShifts } from '../services/ShiftService'
// import { Shift } from '../interfaces/Shift.ts'
import type { ShiftChange } from '@/interfaces/Shift-change.ts'
import ShiftLists from '@/components/ShiftChangeList/ShiftLists.tsx'
import { Shift } from '@/interfaces/Shift'

function ShiftChange() {
  const token = Cookies.get('authToken')
  const [shiftsData, setShiftsData] = useState<Shift[] | null>(null)

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
