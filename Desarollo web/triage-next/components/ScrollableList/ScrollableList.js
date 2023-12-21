import React, { useState, useEffect, useRef } from 'react';
import { FaExpand } from 'react-icons/fa6';

// ... (importaciones y código previo)

const ScrollableList = ({ data, columns, onRowClick }) => {
  const [expandida, setExpandida] = useState(false);
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);

  const handleExpandirLista = () => {
    setExpandida(!expandida);
  };

  const handleSeleccionarFila = (index) => {
    const selectedRowData = data[index];
    setFilaSeleccionada(selectedRowData);
    if (onRowClick) {
      onRowClick(selectedRowData);
    }
  };

  const listaRef = useRef(null);

  const handleClickOutside = (event) => {
    if (listaRef.current && !listaRef.current.contains(event.target)) {
      setExpandida(false);
      setFilaSeleccionada(null);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const numColumns = columns.length;
  const headerStyle = {
    gridTemplateColumns: `repeat(${numColumns}, 1fr)`,
  };

  const itemStyle = {
    gridTemplateColumns: `repeat(${numColumns}, 1fr)`,
  };

  return (
    <div id="BordeRedondo" className={`scrollable-list ${expandida ? 'expandida' : ''}`} ref={listaRef}>
      {expandida && <div className="fondo-opaco" onClick={handleExpandirLista} />}

      <div>
        <button className="expandir-lista-btn" onClick={handleExpandirLista}>
          <FaExpand color="black" />
        </button>

        <ul>
          <li className="list-header" style={headerStyle}>
            {columns.map((column, index) => (
              <span key={index}>
                <strong>{column.label}</strong>
              </span>
            ))}
          </li>
          {data &&
            data.map((item, index) => (
              <li
                key={index}
                className={`list-item ${index % 2 === 0 ? 'even-row' : 'odd-row'} ${
                  filaSeleccionada === item ? 'selected-row' : ''
                }`}
                style={itemStyle}
                onClick={() => handleSeleccionarFila(index)}
              >
                {columns.map((column, i) => (
                  <span key={i} className="list-item-span">
                    {item[column.propiedad]}
                  </span>
                ))}
              </li>
            ))}
        </ul>
      </div>

      {/*{filaSeleccionada && (
        <div className="advertencia-default">
          <h3>Datos de la fila seleccionada:</h3>
          <ul>
            {columns.map((column, i) => (
              <li key={i}>
                <strong>{column.label}:</strong> {filaSeleccionada[column.propiedad]}
              </li>
            ))}
          </ul>
        </div>
      )}*/}
    </div>
  );
};

export default ScrollableList;
