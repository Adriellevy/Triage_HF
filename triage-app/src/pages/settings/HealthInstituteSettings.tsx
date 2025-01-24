import { useState, useEffect, useContext } from 'react'
import {
  getAllSymptoms,
  createSymptom,
  updateSymptom,
  deleteSymptom
} from '@/services/symtomService'
import LoaderSpin from '@/components/LoaderSpin'
import SymptomEditingList from '@/components/SymptomSettingsComponents/SymptomEditingList'
import { SocketEvent, UpdateEvent } from '@/interfaces/Socket'
import { SocketContext } from '@/contex/SocketContext'
import { useAuth } from '@/contex/AuthContext'

function SymptomSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [symptomsData, setSymptomsData] = useState([])
  const socket = useContext(SocketContext)
  const { logout } = useAuth()
  const fetchSymptoms = async () => {
    try {
      setIsLoading(true)
      const { success, data } = await getAllSymptoms()
      if (success) {
        setSymptomsData(data || [])
      }
      setIsLoading(false)
    } catch (error) {
      if (error.message === 'Cerrar sesion') {
        logout()
      } else {
        console.error('Error al obtener síntomas:', error)
      }
    }
  }

  const handleAddSymptom = async (name) => {
    try {
      const { success, message } = await createSymptom(name)
      if (success) {
        await fetchSymptoms()
        console.log(message)
      }
    } catch (error) {
      console.error('Error al agregar síntoma:', error)
    }
  }

  const handleUpdateSymptom = async (id, name) => {
    try {
      const { success, message } = await updateSymptom(id, name)
      if (success) {
        await fetchSymptoms()
        console.log(message)
      }
    } catch (error) {
      console.error('Error al actualizar síntoma:', error)
    }
  }

  const handleDeleteSymptom = async (id) => {
    try {
      const { success, message } = await deleteSymptom(id)
      if (success) {
        await fetchSymptoms()
        console.log(message)
      }
    } catch (error) {
      console.error('Error al eliminar síntoma:', error)
    }
  }

  useEffect(() => {
    fetchSymptoms()
  }, [])

  // useEffect(() => {
  //   if (socket) {
  //     socket.on(SocketEvent.UPDATE, (data) => {
  //       if (data.message === UpdateEvent.SYMPTOM_UPDATE) {
  //         fetchSymptoms()
  //       }
  //     })
  //     return () => {
  //       socket.off(SocketEvent.UPDATE)
  //     }
  //   }
  // }, [socket])

  return (
    <div className='bg-white pb-4 mt-20 ml-2 md:mt-0 md:ml-0'>
      {isLoading ? (
        <LoaderSpin />
      ) : (
        <SymptomEditingList
          symptoms={symptomsData}
          onAddSymptom={handleAddSymptom}
          onUpdateSymptom={handleUpdateSymptom}
          onDeleteSymptom={handleDeleteSymptom}
        />
      )}
    </div>
  )
}

export default SymptomSettings
