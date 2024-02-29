import { useState, ChangeEvent } from 'react'

interface optionitem {
  value: string
  text: string
}

interface PropsSearch {
  onSearch: ({ term, by }: { term: string; by: string }) => void
  options: optionitem[]
}

function Search({ onSearch, options }: PropsSearch) {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchBy, setSearchBy] = useState<string>(options[0].value)

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
    <div className='bg-white p-4'>
      <h2 className='text-xl font-semibold mb-4'>Search</h2>
      <div className='flex space-x-4'>
        <div className='flex-1'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Term:</label>
          <input
            type='text'
            value={searchTerm}
            onChange={handleInputChange}
            className='w-full p-2 border rounded-md'
            placeholder='Enter search term'
          />
        </div>
        <div className='flex-1'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>By:</label>
          <select
            value={searchBy}
            onChange={handleSelectChange}
            className='w-full p-2 border rounded-md'
          >
            {options.map((option) => (
              <option value={option.value}>{option.text}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default Search
