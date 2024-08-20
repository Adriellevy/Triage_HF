import React, { useState } from 'react';
import BoxEditor from '@/components/BoxSettingsComponents/BoxEditor';
import { Box, BoxType, BoxStatus } from '@/interfaces/Boxes';
import { useTranslation } from 'react-i18next';

interface BoxEdittingListProps {
  initialBoxes: Box[];
}

const BoxEdittingList: React.FC<BoxEdittingListProps> = ({ initialBoxes }) => {
  
 const { t } = useTranslation('BoxEditor')
  const [boxes, setBoxes] = useState<Box[]>(initialBoxes);
  const [visibleTypes, setVisibleTypes] = useState<Record<BoxType, boolean>>({
    [BoxType.CONSULTORIO]: true,
    [BoxType.OTHER_TYPE_1]: true,  // Puedes añadir más tipos de boxes aquí
    [BoxType.OTHER_TYPE_2]: true,
  });

  const handleUpdate = (updatedBox: Box) => {
    setBoxes(prev => prev.map(box => box.box_id === updatedBox.box_id ? updatedBox : box));
  };

  const handleDelete = (boxId: string) => {
    setBoxes(prev => prev.filter(box => box.box_id !== boxId));
  };

  const handleAddBox = () => {
    const newBox: Box = {
      box_id: `new-${Date.now()}`,
      box_code: 'Nuevo Box',
      box_type: BoxType.CONSULTORIO,
      box_status: BoxStatus.LIBRE,
      box_time: new Date().toISOString(),
      patient_name: '',
    };
    setBoxes(prev => [...prev, newBox]);
  };

  const toggleVisibility = (type: BoxType) => {
    setVisibleTypes(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div className="box-list-container p-4 bg-white shadow rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Lista de Boxes</h2>
      </div>

      {Object.keys(BoxType).map((type) => {
        const boxType = type as BoxType;
        return (
          <div key={boxType}>
            <button
              className="bg-gray-200 text-gray-800 my-2 py-2 px-4 rounded hover:bg-gray-300 transition duration-300"
              onClick={() => toggleVisibility(boxType)}
            >
              {visibleTypes[boxType] ? `${t('MinimizeList')} ${boxType}` :  `${t('ExpandList')} ${boxType}`}
            </button>

            {visibleTypes[boxType] && (
              <ul className="space-y-4">
                {boxes
                  .filter((box) => box.box_type === boxType)
                  .map((box) => (
                    <li key={box.box_id} className="box-item bg-gray-100 p-4 rounded-lg shadow">
                      <BoxEditor
                        box={box}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                      />
                    </li>
                  ))}
              </ul>
            )}
          </div>
        );
      })}

      <button 
        className="bg-blue-500 text-white my-3 py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        onClick={handleAddBox}
      >
        Agregar Box
      </button>
    </div>
  );
};

export default BoxEdittingList;
