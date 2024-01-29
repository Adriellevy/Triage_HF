import { useState, ChangeEvent } from 'react'

interface PropsSearchTeamForm {
  onSearch: ({ box, by }: { box: string; by: string }) => void
}

function SearchBoxForm({ onSearch }: PropsSearchTeamForm) {
  const [searchBox, setSearchbox] = useState<string>('')
  const [searchBy, setSearchBy] = useState<string>('name')

  const handleSearch = () => {
    onSearch({ box: searchBox, by: searchBy })
  }

  return (
    <div className='bg-white p-4 rounded-md shadow-md'>
      <h2 className='text-xl font-semibold mb-4'>Search Box</h2>
      <div className='flex space-x-4'>
        <div className='flex-1'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Search box:
          </label>
          <input
            type='text'
            value={searchBox}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchbox(e.target.value)
            }
            className='w-full p-2 border rounded-md'
            placeholder='Enter search box'
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

export default SearchBoxForm
