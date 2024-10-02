import React from 'react';
import { Button } from '../ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faUserGroup, faUsersBetweenLines } from '@fortawesome/free-solid-svg-icons';

const SearchTypeSelector = ({ searchType, setSearchType , setAnimation}) => {
  const options = ['Filtro', 'Nombre', 'Fecha'];

  const handleSearchTypeChange = (type) => {
    let animationIn;
    let animationOut;
    switch (type) {
      case 'Filtro':
        animationIn = 'animate-slideInFromLeft';
        animationOut = 'animate-slideOutToLeft';
        break;
      case 'Fecha':
        animationIn = 'animate-slideInFromRight';
        animationOut = 'animate-slideOutToRight';  
        break;
      default:
        animationIn = 'animate-slideInFromRight'; 
        animationOut = 'animate-slideOutToRight'; 
        break;
    }
    setAnimation(animationOut);  // Definir animación de salida
    setTimeout(() => {
      setSearchType(type);  // Cambiar el componente después de la animación de salida
      setAnimation(animationIn);  // Definir animación de entrada
    }, 450);  // Duración de la animación de salida
  };

  return (
    <div className="flex items-center space-x-6 self-center mt-4 md:mt-0">
      {options.map((option, index) => (
        <Button 
          key={index}
          className={`px-1 py-1 md:px-4 md:py-2 rounded-lg transition-transform duration-300 ${
            searchType === option ? 'bg-blue-800 text-white transform scale-125' : 'bg-gray-200 text-black'
          }`}
          color='blue'
          onClick={() => handleSearchTypeChange(option)}
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
