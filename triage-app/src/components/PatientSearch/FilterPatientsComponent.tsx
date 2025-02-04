import React from 'react';
import Select from 'react-select';
import { Button } from '../ui';

const FilterPatientsComponent = ({options, onChangeSelect, filterPatientsTrigger,filterOptions }) => {
  return (
    <div className='mt-4'>
      <label className='text-sm font-medium text-gray-700 mb-2 px-4'>Filtrar pacientes:</label>
      <div className='flex px-4'>
        <Select
          className='w-full'
          options={options}
          isMulti
          closeMenuOnSelect={true}
          onChange={onChangeSelect}
          placeholder={'Seleccionar...'}
        />
        <Button
          className='ml-4 py-2 px-4 self-center text-white bg-green-500 hover:bg-green-700 flex-shrink-0 rounded-lg'
          color='green'
          onClick={() => filterPatientsTrigger(filterOptions)}
        >
          Filtrar
        </Button>
      </div>
    </div>
  );
};

export default FilterPatientsComponent;
