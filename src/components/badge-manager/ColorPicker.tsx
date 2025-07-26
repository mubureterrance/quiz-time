import React from 'react';
import Input from '../ui/Input';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ 
  value, 
  onChange, 
  label 
}) => {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <Input
          type="color"
          value={value}
          onChange={handleColorChange}
          className="w-12 h-12 p-1 border-2 border-slate-300 rounded-lg cursor-pointer"
        />
        <div className="flex-1">
          <Input
            type="text"
            value={value}
            onChange={handleColorChange}
            className="w-full font-mono text-sm"
            placeholder="#888888"
          />
        </div>
      </div>
    </div>
  );
};