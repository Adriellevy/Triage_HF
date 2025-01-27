import React, { useState } from 'react'
import { Button } from '../ui'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash, faPalette } from '@fortawesome/free-solid-svg-icons'
import { HexColorPicker } from 'react-colorful'
import Modal from './Modal'
import { v4 as uuidv4 } from 'uuid' // Para generar IDs únicos

interface TriageLevel {
  id: string
  name: string
  color: string // Formato HEX (ejemplo: "#ffffff")
}

interface TriageLevelEditorProps {
  levels?: TriageLevel[]
  onAddLevel?: (name: string, color: string) => void
  onUpdateLevel?: (id: string, updatedName: string, updatedColor: string) => void
  onDeleteLevel?: (id: string) => void
}

const TriageLevelEditor: React.FC<TriageLevelEditorProps> = ({
  levels = [],
  onAddLevel,
  onUpdateLevel,
  onDeleteLevel
}) => {
  const { t } = useTranslation('TriageEditor')

  // Estado local para los niveles si no se pasan props
  const [localLevels, setLocalLevels] = useState<TriageLevel[]>(levels)
  const [newLevelName, setNewLevelName] = useState('')
  const [newLevelColor, setNewLevelColor] = useState('#3B82F6')
  const [editingLevelId, setEditingLevelId] = useState<string | null>(null)
  const [editingLevelName, setEditingLevelName] = useState('')
  const [editingLevelColor, setEditingLevelColor] = useState('#ffffff')
  const [colorPickerOpen, setColorPickerOpen] = useState(false)

  const handleAdd = () => {
    if (newLevelName.trim()) {
      const newLevel = {
        id: uuidv4(),
        name: newLevelName.trim(),
        color: newLevelColor
      }
      if (onAddLevel) {
        onAddLevel(newLevel.name, newLevel.color)
      } else {
        setLocalLevels((prevLevels) => [...prevLevels, newLevel])
      }
      setNewLevelName('')
      setNewLevelColor('#ffffff')
    }
  }

  const handleUpdate = () => {
    if (editingLevelName.trim() && editingLevelId) {
      if (onUpdateLevel) {
        onUpdateLevel(editingLevelId, editingLevelName.trim(), editingLevelColor)
      } else {
        setLocalLevels((prevLevels) =>
          prevLevels.map((level) =>
            level.id === editingLevelId
              ? { ...level, name: editingLevelName.trim(), color: editingLevelColor }
              : level
          )
        )
      }
      setEditingLevelId(null)
      setEditingLevelName('')
      setEditingLevelColor('#ffffff')
    }
  }

  const handleDelete = (id: string) => {
    if (onDeleteLevel) {
      onDeleteLevel(id)
    } else {
      setLocalLevels((prevLevels) => prevLevels.filter((level) => level.id !== id))
    }
  }

  const handleCancelEdit = () => {
    setEditingLevelId(null)
    setEditingLevelName('')
    setEditingLevelColor('#ffffff')
  }

  const levelsToDisplay = onAddLevel || onUpdateLevel || onDeleteLevel ? levels : localLevels

  return (
    <div className='mx-4 mt-4 space-y-4'>
      {/* Agregar Nuevo Nivel */}
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2'>
          <input
            type='text'
            placeholder={t('NewLevel')}
            value={newLevelName}
            onChange={(e) => setNewLevelName(e.target.value)}
            className='border rounded px-4 py-2 w-full'
          />
          <Button color='green' className='py-2 px-4' onClick={handleAdd}>
            {t('Add')}
          </Button>
        </div>
        <Button
          style={{ backgroundColor: newLevelColor }}
          color='blue'
          onClick={() => setColorPickerOpen(true)}
          className='flex items-center gap-2'
        >
          <FontAwesomeIcon icon={faPalette} />
          {t('PickColor')}
        </Button>
      </div>

      {/* Lista de Niveles */}
      <table className='w-full border border-gray-300 mt-4'>
        <thead>
          <tr className='bg-blue-800 text-white'>
            <th className='border px-4 py-2'>{t('LevelName')}</th>
            <th className='border px-4 py-2'>{t('Color')}</th>
            <th className='border px-4 py-2'>{t('Actions')}</th>
          </tr>
        </thead>
        <tbody>
          {levelsToDisplay.map((level, index) => {
            const isOdd = index % 2 !== 0
            const rowClass = isOdd ? 'bg-gray-100' : 'bg-white'
            return (
              <tr key={level.id} className={rowClass}>
                <td className='border px-4 py-2'>
                  {editingLevelId === level.id ? (
                    <input
                      type='text'
                      value={editingLevelName}
                      onChange={(e) => setEditingLevelName(e.target.value)}
                      className='border rounded px-4 py-2 w-full'
                    />
                  ) : (
                    level.name
                  )}
                </td>
                <td className='border px-4 py-2'>
                  {editingLevelId === level.id ? (
                    <Button
                      color='blue'
                      onClick={() => setColorPickerOpen(true)}
                      className='flex items-center gap-2'
                    >
                      {t('PickColor')}
                    </Button>
                  ) : (
                    <div
                      style={{
                        backgroundColor: level.color,
                        width: '30px',
                        height: '30px',
                        border: '1px solid black'
                      }}
                    ></div>
                  )}
                </td>
                <td className='border px-4 py-2 flex gap-2 justify-center'>
                  {editingLevelId === level.id ? (
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
                          setEditingLevelId(level.id)
                          setEditingLevelName(level.name)
                          setEditingLevelColor(level.color)
                        }}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </Button>
                      <Button color='red' onClick={() => handleDelete(level.id)}>
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

      {/* Modal para el selector de colores */}
      {colorPickerOpen && (
        <Modal onClose={() => setColorPickerOpen(false)}>
          <div
            style={{
              backgroundColor: editingLevelId ? editingLevelColor : newLevelColor,
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center'
            }}
          >
            <HexColorPicker
              color={editingLevelId ? editingLevelColor : newLevelColor}
              onChange={(color) => {
                if (editingLevelId) {
                  setEditingLevelColor(color)
                } else {
                  setNewLevelColor(color)
                }
              }}
            />
            <div className='mt-4 flex justify-center gap-4'>
              <Button color='green' onClick={() => setColorPickerOpen(false)}>
                {t('Accept')}
              </Button>
              <Button color='red' onClick={() => setColorPickerOpen(false)}>
                {t('Cancel')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default TriageLevelEditor
