import React, { useState } from 'react';
import { Box, BoxType, BoxStatus } from '@/interfaces/Boxes';

interface BoxEditorProps {
  box: Box;
  onUpdate: (updatedBox: Box) => void;
  onDelete: (boxId: string) => void;
}

const BoxEditor: React.FC<BoxEditorProps> = ({ box, onUpdate, onDelete }) => {
  const [editableBox, setEditableBox] = useState<Box>({...box});

  const handleChange = (field: keyof Box, value: any) => {
    setEditableBox(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onUpdate(editableBox);
  };

  return (
    <div className="box-editor">
      <input
        type="text"
        value={editableBox.box_code}
        onChange={(e) => handleChange('box_code', e.target.value)}
      />
      <select
        value={editableBox.box_type}
        onChange={(e) => handleChange('box_type', e.target.value as BoxType)}
      >
        {Object.values(BoxType).map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
      
      <button onClick={handleSave}>Guardar</button>
      <button onClick={() => onDelete(editableBox.box_id)}>Eliminar</button>
    </div>
  );
};

export default BoxEditor;
