// SelectDinamico.js
import React, { useState, useEffect } from 'react';

const SelectDinamico = () => {
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');

  useEffect(() => {
    // Realizar el fetch a la IP y actualizar el estado con las opciones obtenidas
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.0.19:3000/users/doctor');
        const data = await response.json();
        setOptions(data.opciones); // Asegúrate de ajustar la propiedad de las opciones según la respuesta de tu API
      } catch (error) {
        console.error('Error al obtener las opciones:', error);
      }
    };

    fetchData();
  }, []); // El segundo argumento asegura que el efecto se ejecute solo una vez al montar el componente

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <select value={selectedValue} onChange={handleChange}>
      <option value="" disabled>
        Selecciona una opción
      </option>
      {options.map((option) => (
        <option key={option.id} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectDinamico;
