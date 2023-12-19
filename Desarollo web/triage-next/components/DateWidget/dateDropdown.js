// DateDropdown.js

import React from 'react';

const DateDropdown = ({ id, options }) => {
  return (
    <select className='ingreso-agrupado-text-box02' id={id} name={id}>
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default DateDropdown;
