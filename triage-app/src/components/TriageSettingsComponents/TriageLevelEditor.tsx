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
  level: string
  color: string // Formato HEX (ejemplo: "#ffffff")
}

interface TriageLevelEditorProps {
  levels?: TriageLevel[]
  onAddLevel?: (name: string, color: string) => void
  onUpdateLevel?: (updatedName: string, updatedColor: string) => void
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

  const hexToRgb = (hex: string): string => {
    const bigint = parseInt(hex.slice(1), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `${r}, ${g}, ${b}`
  }

  const handleAdd = () => {
    const rgbColor = hexToRgb(newLevelColor)
    if (newLevelName.trim()) {
      const newLevel: TriageLevel = {
        id: uuidv4(),
        level: newLevelName.trim(),
        color: rgbColor
      }
      if (onAddLevel) {
        onAddLevel(newLevel.level, rgbColor)
      } else {
        setLocalLevels((prevLevels) => [...prevLevels, newLevel])
      }
      setNewLevelName('')
      setNewLevelColor('#ffffff')
    }
  }

  // Usar esta función antes de actualizar el nivel
  const handleUpdate = (oldlevel: string) => {
    if (editingLevelName.trim() && editingLevelId) {
      const rgbColor = hexToRgb(editingLevelColor)
      if (onUpdateLevel) {
        onUpdateLevel(oldlevel, rgbColor, editingLevelName.trim())
      } else {
        setLocalLevels((prevLevels) =>
          prevLevels.map((level) =>
            level.id === editingLevelId
              ? { ...level, name: editingLevelName.trim(), color: rgbColor }
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
      console.log('Deleting level with ID:', id)
      onDeleteLevel(id)
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
                    level.level
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
                      className='w-8 h-8 rounded-full mx-auto flex justify-center items-center border-2 border-gray-300'
                      style={{ backgroundColor: `rgb(${level.color})` }}
                    ></div>
                  )}
                </td>
                <td className='border px-4 py-2 flex gap-2 justify-center'>
                  {editingLevelId === level.id ? (
                    <>
                      <Button color='green' onClick={() => handleUpdate(level.level)}>
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
                          setEditingLevelName(level.level)
                          setEditingLevelColor(level.color)
                        }}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </Button>
                      <Button color='red' onClick={() => handleDelete(level.level)}>
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
            className='p-5 rounded-lg text-center'
            style={{ backgroundColor: editingLevelId ? editingLevelColor : newLevelColor }}
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
