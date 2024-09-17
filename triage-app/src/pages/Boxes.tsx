import { useState, useEffect, useContext } from 'react'
import Cookies from 'js-cookie'
import { SocketContext } from '@/contex/SocketContext'
import BoxList from '@/components/BoxList/BoxList'
import Search from '@/components/Search'
import { getAllBoxes } from '@/services/boxService'
import { Box } from '@/interfaces/Boxes'
import { SocketEvent, UpdateEvent } from '@/interfaces/Socket'
import { useTranslation } from 'react-i18next'
import LoaderSpin from '@/components/LoaderSpin'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contex/AuthContext'

function Boxes() {
  const { t } = useTranslation('Boxes')
  const socket = useContext(SocketContext)
  const [isLoading, setIsLoading] = useState(false)
  const [boxesData, setboxesData] = useState<Box[] | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filteredBoxes, setFilteredBoxes] = useState<Box[] | null>(null)
  const { logout } = useAuth()

  const SearchOption = [
    {
      value: 'box_code',
      text: t('SearchOption.CodeText')
    },
    {
      value: 'patient_name',
      text: t('SearchOption.PatientText')
    }
  ]

  const handleonSearch = ({ term, by }: { term: string; by: string }) => {
    setSearchTerm(term)
    const filterOptions: Record<string, (box: Box) => boolean> = {
      box_code: (box) => box.box_code.toLowerCase().includes(term.toLowerCase()),
      patient_name: (box) =>
        box.patient_name ? box.patient_name.toLowerCase().includes(term.toLowerCase()) : false
    }
    const filtered = boxesData?.filter((box) => {
      const filterFunction = filterOptions[by]
      return filterFunction(box)
    })
    if (filtered?.length === 0 || filtered === undefined) setFilteredBoxes(null)
    else setFilteredBoxes(filtered)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await getAllBoxes()
        setboxesData(data)
        setIsLoading(false)
      } catch (error) {
        console.error((error as Error).message)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const token = Cookies.get('authToken')
    const fetchData = async () => {
      try {
        if (token) {
          const data = await getAllBoxes()
          setboxesData(data)
        }
      } catch (error) {
        if (error.message === 'Cerrar sesion') {
          logout()
        } else {
          console.error((error as Error).message)
        }
      }
    }
    if (socket) {
      socket.on(SocketEvent.UPDATE, (data) => {
        if (data.message == UpdateEvent.BOX_UPDATE) {
          fetchData()
        }
      })
      return () => {
        socket.off(SocketEvent.UPDATE)
      }
    }
  }, [socket])

  return (
    <div className='bg-white pb-4'>
      <Search onSearch={handleonSearch} options={SearchOption} />
      {isLoading ? (
        <LoaderSpin></LoaderSpin>
      ) : searchTerm === '' && boxesData ? (
        <BoxList boxes={boxesData} />
      ) : searchTerm !== '' && filteredBoxes ? (
        <BoxList boxes={filteredBoxes} />
      ) : (
        <p>No se encontraron resultados.</p>
      )}
    </div>
  )
}

export default Boxes
