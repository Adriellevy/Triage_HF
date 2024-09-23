import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../ui';

const PatientSearchBar = ({ searchName, setSearchName, searchPatient, clearData }) => {
  return (
    <div className='w-full px-4 my-4'>
    <label className='block text-sm font-medium text-gray-700 mb-2'>Buscar paciente por nombre</label>
    <div className='flex items-center'>
      <input
        className='flex-1 p-[0.44rem] border rounded-s-lg'
        type="text"
        id="namesearch"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        placeholder="Buscar paciente..."
      />
      
      <Button
        className=' py-2 px-4 text-white bg-red-500 hover:bg-red-700 flex-shrink-0 rounded-e-lg'
        color='red'
        onClick={() => clearData()}
      >
        <FontAwesomeIcon icon={faXmark} />
      </Button>
      <Button
        className='ml-4 py-2 px-4 text-white bg-green-500 hover:bg-green-700 flex-shrink-0 rounded-lg'
        color='green'
        onClick={() => searchPatient(searchName)}
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </Button>
    </div>
  </div>
  );
};

export default PatientSearchBar;
