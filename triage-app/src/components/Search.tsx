import { useState, ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

interface OptionItem {
  value: string
  text: string
}

interface PropsSearch {
  onSearch: ({ term, by }: { term: string; by: string }) => void
  options: OptionItem[]
}

function Search({ onSearch, options }: PropsSearch) {
  const { t } = useTranslation('Search')
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
    <div className="bg-white shadow-md rounded-b-2xl p-6 w-full max-w-lg mx-auto">
      <h2 className=" lg:text-xl font-bold text-gray-800 mb-4">{t('title')}</h2>
      <div className="flex flex-col md:flex-row md:space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('TermLabel')}
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder={t('TermPlaceholder')}
          />
        </div>
        <div className="flex-1 mt-4 md:mt-0">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('ByLabel')}
          </label>
          <select
            value={searchBy}
            onChange={handleSelectChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
          >
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default Search
