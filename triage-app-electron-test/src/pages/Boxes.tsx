import { useState, useEffect } from 'react'
import BoxList from '../components/BoxList'
import LoadingModal from '../components/LoadingModal'
import { getBoxes } from '../services/boxService'
import { Box } from '../interfaces/Boxes'

function Boxes() {
  const [isLoading, setIsLoading] = useState(false)
  const [boxesData, setboxesData] = useState<Box[] | null>(null)

  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkRyLiBTbWl0aCIsImlhdCI6MTcwMzIwNjE1N30.TNYMTte4XaVExpZmUMgcoX_dzpBbt84QnyN81RsExiw'

  useEffect(() => {
    const fetchData = async () => {
      try {
        // setIsLoading(true)
        const data = await getBoxes(token)
        setboxesData(data)
        setIsLoading(false)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error(error.message)
      }
    }
    fetchData()
  }, [token])

  return <div>{!isLoading ? <BoxList boxes={boxesData} /> : <LoadingModal />}</div>
}

export default Boxes
