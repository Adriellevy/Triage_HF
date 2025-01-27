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

function SymptomSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [symptomsData, setSymptomsData] = useState([])

  const [isSymptomsExpanded, setIsSymptomsExpanded] = useState(true)
  const [isTriageExpanded, setIsTriageExpanded] = useState(false)
  const socket = useContext(SocketContext)
  const { logout } = useAuth()

  const { t } = useTranslation('TriageEditor')

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

  const TriageLevels = [
    { id: '1', name: 'I', color: '#999999' },
    { id: '2', name: 'II', color: '#FF3300' },
    { id: '3', name: 'III', color: '#FFFF66' },
    { id: '4', name: 'IV', color: '#69A84F' }
  ]

  return (
    <div className='bg-white pb-4 mt-20 ml-2 md:mt-0 md:ml-0'>
      {isLoading ? (
        <LoaderSpin />
      ) : (
        <>
          {/* Configuración de Síntomas */}
          <div className='border-b mb-4'>
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
          <div className='border-b'>
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
                levels={TriageLevels}
                onAddLevel={null}
                onUpdateLevel={null}
                onDeleteLevel={null}
              />
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default SymptomSettings
