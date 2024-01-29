import { useState, useEffect } from 'react'
import BoxList from '../components/BoxList'
import SearchBox from './SearchBoxForm'
import LoadingModal from '@/components/LoadingModal'
import { getBoxes } from '../services/boxService'
import Cookies from 'js-cookie'
import { Box } from '../interfaces/Boxes'
import SearchBoxForm from './SearchBoxForm'

function BoxConfig() {
  const token = Cookies.get('authToken')

  const [boxData, setBoxesData] = useState<Box[] | null>(null)
  const onDelete = (box_id: string) => {
    console.log('Se intento borrar el box: ' + box_id)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          //const dataUsers = await getAllUsers() Arreglar el post en userService
          const dataBoxes = await getBoxes()
          //TODO: add searchTerm
          //const data = await getPatients(token, searchTerm);
          setBoxesData(dataBoxes)
          setIsLoading(false)
        } else {
          console.log('Error en fetch data de Patients.tsx')
        }
      } catch (error) {
        // console.error('Error al obtener pacientes:', error.message)
      }
    }
    fetchData()
  }, [token])
  return (
    <div
      style={{
        // Add your CSS styles here
        borderRadius: '5px'
      }}
    >
      <SearchBoxForm onSearch={() => console.log('123')} />
      {boxData ? <BoxList boxes={boxData} /> : <LoadingModal />}
    </div>
  )
}

export default BoxConfig
