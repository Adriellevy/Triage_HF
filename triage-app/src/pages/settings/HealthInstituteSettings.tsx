import { useState, useEffect, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import {
  getAllSymptoms,
  createSymptom,
  updateSymptom,
  deleteSymptom
} from '@/services/symtomService'
import LoaderSpin from '@/components/LoaderSpin'
import SymptomEditingList from '@/components/SymptomSettingsComponents/SymptomEditingList'
import TriageLevelEditor from '@/components/TriageSettingsComponents/TriageLevelEditor'
import { useTranslation } from 'react-i18next'
import { SocketContext } from '@/contex/SocketContext'
import { useAuth } from '@/contex/AuthContext'
import {
  createTriage,
  deleteTriage,
  getAllTriages,
  sortTriageLevels,
  updateTriage
} from '@/services/triageLevelsService'

function SymptomSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [symptomsData, setSymptomsData] = useState([])
  const [triageLevels, setTriageLevels] = useState([])

  const [isSymptomsExpanded, setIsSymptomsExpanded] = useState(true)
  const [isTriageExpanded, setIsTriageExpanded] = useState(false)
  const socket = useContext(SocketContext)
  const { logout } = useAuth()

  const { t } = useTranslation('TriageEditor')

  useEffect(() => {
    fetchSymptoms()
    fetchTriageLevels()
  }, [])
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

  // Fetch triage levels
  const fetchTriageLevels = async () => {
    try {
      setIsLoading(true)
      const { success, data } = await getAllTriages()
      console.log(data)
      if (success) {
        setTriageLevels(data || [])
      }
      setIsLoading(false)
    } catch (error) {
      if (error.message === 'Cerrar sesion') {
        logout()
      } else {
        console.error('Error al obtener niveles de triage:', error)
      }
    }
  }

  const handleAddTriageLevel = async (level, color) => {
    try {
      const { success, message } = await createTriage(level, color)
      if (success) {
        await fetchTriageLevels()
        console.log(message)
      }
    } catch (error) {
      console.error('Error al agregar nivel de triage:', error)
    }
  }

  const handleUpdateTriageLevel = async (oldlevel, color, newLevel) => {
    try {
      const { success, message } = await updateTriage(oldlevel, color, newLevel)
      if (success) {
        await fetchTriageLevels()
        console.log(message)
      }
    } catch (error) {
      console.error('Error al actualizar nivel de triage:', error)
    }
  }

  const handleDeleteTriageLevel = async (level) => {
    try {
      const { success, message } = await deleteTriage(level)
      if (success) {
        await fetchTriageLevels()
        console.log(message)
      }
    } catch (error) {
      console.error('Error al eliminar nivel de triage:', error)
    }
  }
  const handleUpdateOrder = async (changedLevels) => {
    try {
      console.log('infoRecivida', changedLevels)
      const { success, message } = await sortTriageLevels(changedLevels)
      if (!success) {
        console.error(`Error al actualizar los niveles ${changedLevels}: ${message}`)
        return // Detenemos el proceso si alguna actualización falla
      }
      // Refresca los niveles de triage una vez completadas todas las actualizaciones
      await fetchTriageLevels()
      console.log('Todos los niveles de triage actualizados con éxito.')
    } catch (error) {
      console.error('Error general al actualizar niveles de triage:', error)
    }
  }

  return (
    <div className=' pb-4 mt-5 ml-2 md:mt-0 md:ml-0 h-[100vh] lg:h-auto'>
      {isLoading ? (
        <LoaderSpin />
      ) : (
        <>
          {/* Configuración de Síntomas */}
          <div className='border-b '>
            <button
              onClick={() => setIsSymptomsExpanded(!isSymptomsExpanded)}
              className='w-full text-left py-2 px-4 bg-gray-100 hover:bg-gray-200 font-bold flex items-center justify-between'
            >
              <h2 className='text-2xl font-semibold'>{t('SymptomList')}</h2>
              <FontAwesomeIcon
                icon={isSymptomsExpanded ? faChevronDown : faChevronRight}
                className='text-gray-600'
              />
            </button>
            {isSymptomsExpanded && (
              <SymptomEditingList
                symptoms={symptomsData}
                onAddSymptom={handleAddSymptom}
                onUpdateSymptom={handleUpdateSymptom}
                onDeleteSymptom={handleDeleteSymptom}
              />
            )}
          </div>

          {/* Configuración de Niveles de Triage */}
          <div className='border-b '>
            <button
              onClick={() => setIsTriageExpanded(!isTriageExpanded)}
              className='w-full text-left py-2 px-4 bg-gray-100 hover:bg-gray-200 font-bold flex items-center justify-between'
            >
              <h2 className='text-2xl font-semibold'>{t('TriageLevels')}</h2>
              <FontAwesomeIcon
                icon={isTriageExpanded ? faChevronDown : faChevronRight}
                className='text-gray-600'
              />
            </button>
            {isTriageExpanded && (
              <TriageLevelEditor
                levels={triageLevels}
                onAddLevel={handleAddTriageLevel}
                onUpdateLevel={handleUpdateTriageLevel}
                onDeleteLevel={handleDeleteTriageLevel}
                onUpdateOrder={handleUpdateOrder}
              />
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default SymptomSettings
