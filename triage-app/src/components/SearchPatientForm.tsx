import { useState, ChangeEvent } from 'react'

interface PropsSearchPatientForm {
  onSearch: ({ term, by }: { term: string; by: string }) => void
}

function SearchPatientForm({ onSearch }: PropsSearchPatientForm) {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchBy, setSearchBy] = useState<string>('name')

  const handleSearch = () => {
    onSearch({ term: searchTerm, by: searchBy })
  }

  return (
    <div className='bg-white p-4 rounded-md shadow-md'>
      <h2 className='text-xl font-semibold mb-4'>Search Patients</h2>
      <div className='flex space-x-4'>
        <div className='flex-1'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Search Term:
          </label>
          <input
            type='text'
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            className='w-full p-2 border rounded-md'
            placeholder='Enter search term'
          />
        </div>
        <div className='flex-1'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Search By:
          </label>
          <select
            value={searchBy}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setSearchBy(e.target.value)
            }
            className='w-full p-2 border rounded-md'
          >
            <option value='name'>Name</option>
            <option value='dob'>Date of Birth</option>
          </select>
        </div>
        <button
          onClick={handleSearch}
          className='bg-blue-500 text-white p-2 rounded-md'
        >
          Search
        </button>
      </div>
    </div>
  )
}

export default SearchPatientForm
