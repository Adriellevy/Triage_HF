import React, { useState } from 'react'; // Ruta relativa desde la carpeta 'public'
import { FaExpand } from "react-icons/fa6";

const ScrollableList = ({ data, columns }) => {
  const [expandida, setExpandida] = useState(false);

  const handleExpandirLista = () => {
    setExpandida(!expandida);
  };

  return (
    <div className={`scrollable-list ${expandida ? 'expandida' : ''}`}>
      {/* Capa opaca */}
      {expandida && <div className="fondo-opaco" onClick={handleExpandirLista} />}

      {/* Contenedor de lista */}
      <div>
        {/* Botón fijo en la esquina superior derecha */}
        <button className="expandir-lista-btn" onClick={handleExpandirLista}>
          <FaExpand color='black'/> 
        </button>

        <ul>
          <li className="list-header">
            {columns.map((column, index) => (
              <span key={index}>
                <strong>{column.label}</strong>
              </span>
            ))}
          </li>
          {data && data.map((item, index) => (
            <li key={index} className={`list-item ${index % 2 === 0 ? 'even-row' : 'odd-row'}`}>
              {columns.map((column, i) => (
                <span key={i} className="list-item-span">
                  {item[column.propiedad]}
                </span>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ScrollableList;