import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faPenToSquare, faXmark } from '@fortawesome/free-solid-svg-icons'
import { Button } from '../ui'
import ConfirmationDialog from '../ConfirmationDialog'
import EditModal from '../UserSettingsComponents/EditModal'
import { deleteBox, updateBox } from '@/services/boxService'
import { toast } from 'sonner'
import { Box, BoxStatus, BoxType } from '../../interfaces/Boxes'

interface PropsBoxItem {
  box: Box
  index: number
}

function BoxItem({ box, index }: PropsBoxItem) {
  const { t } = useTranslation('BoxEditor')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { box_code, box_type, box_status, patient_name } = box

  const fieldTranslations = {
    box_code: t('Boxcode'),
    box_type: t('TypeBox'),
    box_status: t('StatusBoxString'),
    patient_name: t('PatientName'),
    'BoxType.CONSULTORIO': t('BoxType.CONSULTORIO'),
    'BoxType.SHOOCKROOM': t('BoxType.SHOOCKROOM'),
    'BoxType.HOSPITALIZATION': t('BoxType.HOSPITALIZATION'),
    'BoxType.OBSERVACION': t('BoxType.OBSERVACION')
  }

  const boxWithDetails: Partial<Box> = {
    box_code: box.box_code,
    box_type: box.box_type,
    box_time: box.box_time,
    box_status: box.box_status,
    patient_name: box.patient_name || t('NoPatient')
  }

  const isOdd = index % 2 !== 0
  const bgClass = isOdd ? 'bg-white' : 'bg-gray-100'

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleClose = () => {
    setIsEditing(false)
  }

  const confirmDelete = async () => {
    setShowDeleteConfirm(false)
    try {
      await deleteBox(box.box_id)
      setIsEditing(false)
      toast.success('Box eliminado', { duration: 2000 })
    } catch (error) {
      console.error('Error al eliminar el box:', error)
      toast.error('Error al intentar eliminar el Box', { duration: 2000 })
    } finally {
      setIsLoading(false) // Ocultar Loader
    }
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
  }

  const handleShowDeleteConfirmation = async () => {
    setShowDeleteConfirm(true)
  }

  const handleSaveBox = async (updatedObject: {
    box_code: string
    box_type: BoxType
    box_time: string
    box_status: BoxStatus
    patient_name: string
  }) => {
    setIsLoading(true) // Mostrar Loader
    try {
      await updateBox(box.box_id, updatedObject)
      setIsEditing(false)
      toast.success('Box actualizado', { duration: 2000 })
    } catch (error) {
      console.error('Error al actualizar el box:', error)
      toast.error('Error al intentar actualizar el Box', { duration: 2000 })
    } finally {
      setIsLoading(false) // Ocultar Loader
    }
  }

  return (
    <tr className={bgClass}>
      <td className='border p-1 lg:p-2 font-bold'>{box_code}</td>
      <td className='border p-1 lg:p-2 text-sm hidden lg:table-cell'>{t(`${box_type}`)}</td>

      <td className='border p-1 lg:p-2 '>
        <div
          className={`rounded-md p-2 text-white ${
            box_status === BoxStatus.OCUPADO ? 'bg-red-500 shadow-md' : 'bg-green-500 shadow-md'
          }`}
        >
          {t(`BoxStatus.${box_status}`)}
        </div>
      </td>
      <td className='border lg:p-2 text-sm'>{patient_name || t('NoPatient')}</td>
      <td className='border p-1 lg:p-2 '>
        <div className='flex gap-2'>
          <div>
            <div className='mb-2'>
              {/* TODO:PASARLE EL ID DEL BOX PARA QUE SE ILUMINE */}
              <Link to={`/boxes`}>
                <Button color='green'>
                  <FontAwesomeIcon icon={faCircleInfo}></FontAwesomeIcon>
                </Button>
              </Link>
            </div>
            <div>
              <Button wfull color='green' onClick={handleEdit}>
                <FontAwesomeIcon icon={faPenToSquare} />
              </Button>
            </div>
          </div>
          <Button wfull color='red' onClick={handleShowDeleteConfirmation}>
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </div>
      </td>
      {isEditing && (
        <EditModal
          object={boxWithDetails}
          onClose={handleClose}
          title={t('EditBoxTitle')}
          onSave={handleSaveBox}
          fieldTranslations={fieldTranslations}
          confirm={t('Confirm')}
          cancel={t('Cancel')}
          loading={isLoading}
          ignoreFields={['patient_name', 'box_time']}
        />
      )}

      <ConfirmationDialog
        show={showDeleteConfirm}
        title={t('ConfirmDeleteTitle')}
        message={t('ConfirmDeleteMessage')}
        confirm={t('Confirm')}
        cancel={t('Cancel')}
        object={box}
        confirmDelete={confirmDelete}
        cancelDelete={cancelDelete}
        fieldTranslations={fieldTranslations}
        recomendation={t('ChangeLocationRecommendation')}
        warning={t('Warning')}
        warningField='patient_name'
        ignoreFields={['box_id', 'box_time', 'patient_id']}
      />
    </tr>
  )
}

export default BoxItem
