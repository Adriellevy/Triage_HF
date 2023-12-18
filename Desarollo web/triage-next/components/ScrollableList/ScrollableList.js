import React from 'react';
const ScrollableList = ({ data, columns }) => {
  return (
    <div className="scrollable-list">
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
  );
};

export default ScrollableList;
