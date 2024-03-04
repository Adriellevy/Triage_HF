import BoxItem from '@/components/BoxItem'
import { Box } from '@/interfaces/Boxes'
import { useState } from 'react'

interface PropsBoxList {
  boxes: Box[]
}

function BoxList({ boxes }: PropsBoxList) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const sortedPatients = [...boxes].sort((a, b) => {
    if (!sortColumn) {
      return 0
    }
    const columnA = a[sortColumn as keyof Box]
    const columnB = b[sortColumn as keyof Box]
    if (typeof columnA === 'string' && typeof columnB === 'string') {
      return sortDirection === 'asc'
        ? columnA.localeCompare(columnB)
        : columnB.localeCompare(columnA)
    } else if (typeof columnA === 'number' && typeof columnB === 'number') {
      return sortDirection === 'asc' ? columnA - columnB : columnB - columnA
    } else {
      return 0
    }
  })

  const columns = [
    { label: 'Code', field: 'box_code', showOnLargeScreen: true, sortable: true },
    { label: 'Type', field: 'box_type', showOnLargeScreen: false, sortable: true },
    { label: 'Status', field: 'box_status', showOnLargeScreen: true, sortable: true },
    { label: 'Patient', field: 'patient_name', showOnLargeScreen: true, sortable: false },
    { label: 'Time', field: 'box_time', showOnLargeScreen: false, sortable: false },
    { label: 'Action', field: 'action', showOnLargeScreen: true, sortable: false }
  ]

  return (
    <div className='mx-0 mt-4 lg:mx-8'>
      <table className='w-full border border-gray-300'>
        <thead>
          <tr className='min-w-full bg-blue-800 text-white'>
            {columns.map((column) => (
              <th
                key={column.field}
                className={`border p-2 ${column.showOnLargeScreen ? '' : 'hidden lg:table-cell'}`}
                onClick={() => (column.sortable ? handleSort(column.field) : null)}
              >
                {column.label}{' '}
                {column.sortable && sortColumn === column.field && (
                  <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='text-center text-black'>
          {sortedPatients.map(
            (Item, index) => boxes && <BoxItem key={Item.box_id} box={Item} index={index} />
          )}
        </tbody>
      </table>
    </div>
  )
}

export default BoxList
