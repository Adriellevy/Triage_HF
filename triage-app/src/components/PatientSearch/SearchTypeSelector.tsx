import React from 'react';
import { Button } from '../ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faUserGroup, faUsersBetweenLines } from '@fortawesome/free-solid-svg-icons';

const SearchTypeSelector = ({ searchType, setSearchType }) => {
  const options = ['Filtro', 'Nombre', 'Fecha'];

  return (
    <div className="flex items-center space-x-6 self-center">
      {options.map((option, index) => (
        <Button 
          key={index}
          className={`px-4 py-2 rounded-lg transition-transform duration-300 ${
            searchType === option ? 'bg-blue-800 text-white transform scale-125' : 'bg-gray-200 text-black'
          }`}
          color='blue'
          onClick={() => setSearchType(option)}
        >
          <div className='flex items-center'>
    <span className='mr-2'>Por {option}</span>
    {searchType === option ? (
      searchType === 'Nombre' ? (
        <FontAwesomeIcon icon={faUserGroup} />
      ) : searchType === 'Filtro' ? (
        <FontAwesomeIcon icon={faUsersBetweenLines} />
      ) : (
        <FontAwesomeIcon icon={faCalendarDays} />
      )
    ) : null}
  </div>
        </Button>
      ))}
    </div>
  );
};

export default SearchTypeSelector;
