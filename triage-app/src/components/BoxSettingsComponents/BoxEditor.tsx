import React, { useState } from 'react';
import { Box, BoxType, BoxStatus } from '@/interfaces/Boxes';
import { Button, Input, Label, Select } from '@/components/ui';

interface BoxEditorProps {
  box: Box;
  onUpdate: (updatedBox: Box) => void;
  onDelete: (boxId: string) => void;
}

const BoxEditor: React.FC<BoxEditorProps> = ({ box, onUpdate, onDelete }) => {
  const [editableBox, setEditableBox] = useState<Box>({ ...box });

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
    <div className="box-editor p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="mb-4">
        <Label htmlFor={`box_code-${editableBox.box_id}`} className="text-gray-700 font-semibold">
          Código del Box
        </Label>
        <Input
          id={`box_code-${editableBox.box_id}`}
          type="text"
          value={editableBox.box_code}
          onChange={(e) => handleChange('box_code', e.target.value)}
          className="mt-1 block w-full"
        />
      </div>

      <div className="mb-4">
        <Label htmlFor={`box_type-${editableBox.box_id}`} className="text-gray-700 font-semibold">
          Tipo de Box
        </Label>
        <Select
          id={`box_type-${editableBox.box_id}`}
          value={editableBox.box_type}
          onChange={(e) => handleChange('box_type', e.target.value as BoxType)}
          className="mt-1 block w-full"
        >
          {Object.values(BoxType).map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </Select>
      </div>

      <div className="flex justify-between">
        <Button 
                  onClick={handleSave}
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300" color={'green'}        >
          Guardar
        </Button>
        <Button 
                  onClick={() => onDelete(editableBox.box_id)}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300" color={'green'}        >
          Eliminar
        </Button>
      </div>
    </div>
  );
};

export default BoxEditor;
