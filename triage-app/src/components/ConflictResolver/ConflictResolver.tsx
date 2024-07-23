import React, { useState } from 'react'
import { ConflictResolverProps } from '../../interfaces/ConflictResolver'

const ConflictResolver: React.FC<ConflictResolverProps> = ({
  conflictData,
  onResolve,
  onAcceptCurrent,
  onCancel
}) => {
  const [mergedData, setMergedData] = useState<Record<string, string>>({})

  const handleFieldSelection = (field: string, value: string) => {
    setMergedData((prev) => ({ ...prev, [field]: value }))
  }

  const handleMergeSubmit = () => {
    onResolve(mergedData)
  }

  return (
    <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-35'>
      <div className='bg-white p-8 rounded-lg'>
        {conflictData ? (
          <>
            <h2>Conflicto de Datos</h2>
            <p>Selecciona los valores que deseas conservar:</p>
            <table>
              <thead>
                <tr>
                  <th>Campo</th>
                  <th>Valor Actual</th>
                  <th>Tu Valor</th>
                  <th>Seleccionar</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(conflictData.currentData).map((key) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{conflictData.currentData[key]}</td>
                    <td>{conflictData.newData[key]}</td>
                    <td>
                      <select
                        value={mergedData[key] || conflictData.currentData[key]}
                        onChange={(e) => handleFieldSelection(key, e.target.value)}
                      >
                        <option value={conflictData.currentData[key]}>Actual</option>
                        <option value={conflictData.newData[key]}>Tu Valor</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='flex justify-center mt-4 gap-2'>
              <button
                className='bg-red-500 text-white py-2 px-4 rounded'
                onClick={handleMergeSubmit}
              >
                Guardar Merge
              </button>
              <button
                className='bg-gray-500 text-white py-2 px-4 rounded'
                onClick={onAcceptCurrent}
              >
                Aceptar Cambios Actuales
              </button>
              <button className='bg-gray-500 text-white py-2 px-4 rounded' onClick={onCancel}>
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <p>No hay datos de conflicto para resolver</p>
        )}
      </div>
    </div>
  )
}

export default ConflictResolver
