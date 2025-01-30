import React from 'react';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import TextField from '@mui/material/TextField';

interface CustomDateTimePickerProps {
  label: string;
  value: Date | null;
  onChange: (newValue: Date | null) => void;
  type?: 'date' | 'time';
}

const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
  label,
  value,
  onChange,
  type = 'date',
}) => {
  return type === 'date' ? (
    <DatePicker
      label={label}
      value={value}
      onChange={onChange}
      slots={{ textField: TextField }}
    />
  ) : (
    <TimePicker
      label={label}
      value={value}
      onChange={onChange}
      slots={{ textField: TextField }}
    />
  );
};

export default CustomDateTimePicker;
