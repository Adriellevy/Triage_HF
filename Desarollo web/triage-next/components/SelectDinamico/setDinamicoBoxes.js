// SelectDinamico.js
import React, { useState, useEffect } from 'react';

const SelectDinamico = () => {
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');

  useEffect(() => {
    const headersList = {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkRyLiBTbWl0aCIsImlhdCI6MTcwMzIwNjE1N30.TNYMTte4XaVExpZmUMgcoX_dzpBbt84QnyN81RsExiw",
      "Content-Type": "application/json",
    };
    // Realizar el fetch a la IP y actualizar el estado con las opciones obtenidas
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.0.19:3000/box', {
          method: "GET",
          headers: headersList,
        });
        const data = await response.json();
        setOptions(data)
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
    <select value={selectedValue} onChange={handleChange} style={{ "border-radius": "2vw" , "backgroundColor": "#F3F3F3" }} >
      <option value="" disabled>
        Selecciona un BOX
      </option>
      {options.map((option) => (
        <option key={option.box_id}>
          {option.box_id} 
        </option>
      ))}
    </select>
  );
};

export default SelectDinamico;
