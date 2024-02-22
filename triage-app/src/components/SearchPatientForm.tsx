import { useState, ChangeEvent } from 'react'

interface PropsSearchPatientForm {
  onSearch: ({ term, by }: { term: string; by: string }) => void
}

function SearchPatientForm({ onSearch }: PropsSearchPatientForm) {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchBy, setSearchBy] = useState<string>('name')

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    onSearch({ term, by: searchBy })
  }

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const by = e.target.value
    setSearchBy(by)
    onSearch({ term: searchTerm, by })
  }

  return (
    <div className='bg-white p-4 rounded-md shadow-md'>
      <h2 className='text-xl font-semibold mb-4'>Search Patients</h2>
      <div className='flex space-x-4'>
        <div className='flex-1'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Search Term:</label>
          <input
            type='text'
            value={searchTerm}
            onChange={handleInputChange}
            className='w-full p-2 border rounded-md'
            placeholder='Enter search term'
          />
        </div>
        <div className='flex-1'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Search By:</label>
          <select
            value={searchBy}
            onChange={handleSelectChange}
            className='w-full p-2 border rounded-md'
          >
            <option value='name'>Name</option>
            <option value='date_of_birth'>Date of Birth</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default SearchPatientForm
