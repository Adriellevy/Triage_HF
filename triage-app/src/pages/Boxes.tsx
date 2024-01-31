import { useState, useEffect } from 'react'
import BoxList from '../components/BoxList'
import LoadingModal from '@/components/LoadingModal'
import { getBoxes } from '../services/boxService'
import { Box } from '../interfaces/Boxes'

function Boxes() {
  const [isLoading, setIsLoading] = useState(false)
  const [boxesData, setboxesData] = useState<Box[] | null>(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await getBoxes()
        setboxesData(data)
        setIsLoading(false)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error(error.message)
      }
    }
    fetchData()
  }, [])

  return <div>{!isLoading ? <BoxList boxes={boxesData} /> : <LoadingModal />}</div>
}

export default Boxes
