import React, { useState } from 'react';
import BoxEditor from '@/components/BoxSettingsComponents/BoxEditor';
import { Box, BoxType, BoxStatus } from '@/interfaces/Boxes';

interface BoxEdittingListProps {
  initialBoxes: Box[];
}

const BoxEdittingList: React.FC<BoxEdittingListProps> = ({ initialBoxes }) => {
  const [boxes, setBoxes] = useState<Box[]>(initialBoxes);

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

  return (
    <div className="box-list">
      <button onClick={handleAddBox}>Agregar Box</button>
      {boxes.map((box) => (
        <BoxEditor
          key={box.box_id}
          box={box}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default BoxEdittingList;
