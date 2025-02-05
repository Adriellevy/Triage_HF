import React, { useState } from 'react'
import { Button } from '../ui'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'

interface Symptom {
  id: string
  name: string
}

interface SymptomEditingListProps {
  symptoms: Symptom[]
  onAddSymptom: (symptomName: string) => void
  onUpdateSymptom: (id: string, updatedName: string) => void
  onDeleteSymptom: (id: string) => void
}

const SymptomEditingList: React.FC<SymptomEditingListProps> = ({
  symptoms,
  onAddSymptom,
  onUpdateSymptom,
  onDeleteSymptom
}) => {
  const { t } = useTranslation('SymptomEditor')
  const [newSymptomName, setNewSymptomName] = useState('')
  const [editingSymptomId, setEditingSymptomId] = useState<string | null>(null)
  const [editingSymptomName, setEditingSymptomName] = useState('')

  const handleAdd = () => {
    if (newSymptomName.trim()) {
      onAddSymptom(newSymptomName.trim())
      setNewSymptomName('')
    }
  }

  const handleUpdate = () => {
    if (editingSymptomName.trim() && editingSymptomId) {
      onUpdateSymptom(editingSymptomId, editingSymptomName.trim())
      setEditingSymptomId(null)
      setEditingSymptomName('')
    }
  }

  const handleCancelEdit = () => {
    setEditingSymptomId(null)
    setEditingSymptomName('')
  }

  return (
    <div className='mx-4 my-4 space-y-4'>
      {/* Add New Symptom */}
      <div className='flex items-center gap-2'>
        <input
          type='text'
          placeholder={t('NewSymptom')}
          value={newSymptomName}
          onChange={(e) => setNewSymptomName(e.target.value)}
          className='border rounded px-4 py-2 w-full'
        />
        <Button color='green' className='py-2 px-4' onClick={handleAdd}>
          {t('Add')}
        </Button>
      </div>

      {/* Symptom List */}
      <table className='w-full border border-gray-300 mt-4'>
        <thead>
          <tr className='bg-blue-800 text-white'>
            <th className='border px-4 py-2'>{t('SymptomName')}</th>
            <th className='border px-4 py-2'>{t('Actions')}</th>
          </tr>
        </thead>
        <tbody>
          {symptoms.map((symptom, index) => {
            const isOdd = index % 2 !== 0
            const rowClass = isOdd ? 'bg-gray-100' : 'bg-white'
            return (
              <tr key={symptom.id} className={rowClass}>
                <td className='border px-4 py-2'>
                  {editingSymptomId === symptom.id ? (
                    <input
                      type='text'
                      value={editingSymptomName}
                      onChange={(e) => setEditingSymptomName(e.target.value)}
                      className='border rounded px-4 py-2 w-full'
                    />
                  ) : (
                    symptom.name
                  )}
                </td>
                <td className='border px-4 py-2 flex gap-2 justify-center'>
                  {editingSymptomId === symptom.id ? (
                    <>
                      <Button color='green' onClick={handleUpdate}>
                        {t('Save')}
                      </Button>
                      <Button color='grey' onClick={handleCancelEdit}>
                        {t('Cancel')}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        color='green'
                        onClick={() => {
                          setEditingSymptomId(symptom.id)
                          setEditingSymptomName(symptom.name)
                        }}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </Button>
                      <Button color='red' onClick={() => onDeleteSymptom(symptom.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default SymptomEditingList
