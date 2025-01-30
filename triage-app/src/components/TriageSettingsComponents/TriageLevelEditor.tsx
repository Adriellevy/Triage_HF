import React, { useState } from 'react'
import { Button } from '../ui'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPenToSquare,
  faTrash,
  faPalette,
  faArrowUp,
  faArrowDown
} from '@fortawesome/free-solid-svg-icons'
import { HexColorPicker } from 'react-colorful'
import Modal from './Modal'
import { v4 as uuidv4 } from 'uuid' // Para generar IDs únicos
import { TriageLevel_noId } from '@/interfaces/TriageLevel'

interface TriageLevel {
  id: string
  level: string
  color: string // Formato HEX (ejemplo: "#ffffff")
}

interface TriageLevelEditorProps {
  levels?: TriageLevel[]
  onAddLevel?: (name: string, color: string) => void
  onUpdateLevel?: (oldlevel: string, updatedName: string, updatedColor: string) => void
  onDeleteLevel?: (id: string) => void
  onUpdateOrder?: (updatedLevels: TriageLevel_noId[]) => void
}

const TriageLevelEditor: React.FC<TriageLevelEditorProps> = ({
  levels = [],
  onAddLevel,
  onUpdateLevel,
  onDeleteLevel,
  onUpdateOrder
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
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)

  const hexToRgb = (hex: string): string => {
    const bigint = parseInt(hex.slice(1), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `${r}, ${g}, ${b}`
  }
  const rgbToHex = (rgb: string): string => {
    const match = rgb.match(/\d+/g) // Extrae los valores numéricos del rgb()
    if (!match || match.length < 3) return '#ffffff' // Valor por defecto en caso de error

    const [r, g, b] = match.map(Number) // Convierte los valores extraídos a números
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}` // Convierte a HEX
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

  const moveUp = (id: string) => {
    const changes: { oldLevel: string; color: string; newLevel: string }[] = []

    setLocalLevels((prevLevels) => {
      const index = prevLevels.findIndex((level) => level.id === id)

      if (index > 0) {
        const updatedLevels = [...prevLevels]

        // Intercambiamos el nivel actual con el anterior
        const temp = updatedLevels[index]
        updatedLevels[index] = updatedLevels[index - 1]
        updatedLevels[index - 1] = temp

        // Verificamos si el orden cambió antes de notificar al backend
        if (JSON.stringify(prevLevels) !== JSON.stringify(updatedLevels)) {
          // Llamamos al servicio para actualizar el orden en la base de datos
          console.log('Calling onUpdateOrder with:', updatedLevels)
          if (onUpdateOrder) {
            onUpdateOrder(updatedLevels.map(({ id, ...rest }) => rest))
          }
        }

        return updatedLevels
      }

      return prevLevels
    })

    // Devolvemos la lista de cambios
    return changes
  }
  const moveDown = (id: string) => {
    const changes: { oldLevel: string; color: string; newLevel: string }[] = []

    setLocalLevels((prevLevels) => {
      const index = prevLevels.findIndex((level) => level.id === id)

      if (index < prevLevels.length - 1) {
        const updatedLevels = [...prevLevels]

        // Intercambiamos el nivel actual con el siguiente
        const temp = updatedLevels[index]
        updatedLevels[index] = updatedLevels[index + 1]
        updatedLevels[index + 1] = temp

        // Verificamos si el orden cambió antes de notificar al backend
        if (JSON.stringify(prevLevels) !== JSON.stringify(updatedLevels)) {
          console.log('Calling onUpdateOrder with:', updatedLevels)
          if (onUpdateOrder) {
            onUpdateOrder(updatedLevels.map(({ id, ...rest }) => rest))
          }
        }

        return updatedLevels
      }

      return prevLevels
    })

    // Devolvemos la lista de cambios
    return changes
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
            <th className='border px-4 py-2 w-1/4'>{t('LevelName')}</th>
            <th className='border px-4 py-2 w-1/4'>{t('Color')}</th>
            <th className='border px-4 py-2 w-1/4'>{t('Order')}</th>
            <th className='border px-4 py-2 w-1/4'>{t('Actions')}</th>
          </tr>
        </thead>
        <tbody>
          {levelsToDisplay.map((level, index) => {
            const isOdd = index % 2 !== 0
            const rowClass = isOdd ? 'bg-gray-100' : 'bg-white'
            return (
              <tr key={level.id} className={rowClass}>
                <td className='border px-4 py-2 text-center'>
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
                      style={{ backgroundColor: editingLevelColor }}
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
                <td className='border px-4 py-2  text-center whitespace-nowrap'>
                  <>
                    {index > 0 && (
                      <Button className='mx-2' color='blue' onClick={() => moveUp(level.id)}>
                        <FontAwesomeIcon icon={faArrowUp} /> {t('MoveUp')}
                      </Button>
                    )}
                    {index < levelsToDisplay.length - 1 && (
                      <Button className='mx-2' color='blue' onClick={() => moveDown(level.id)}>
                        <FontAwesomeIcon icon={faArrowDown} /> {t('MoveDown')}
                      </Button>
                    )}
                  </>
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
                          setEditingLevelColor(rgbToHex(level.color))
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
