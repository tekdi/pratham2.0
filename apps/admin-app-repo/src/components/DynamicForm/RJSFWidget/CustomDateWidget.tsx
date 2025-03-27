// @ts-nocheck
// MUIDateWidget.jsx
import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const CustomDateWidget = ({ value, onChange, options }: any) => {
  const { minValue, maxValue } = options;

  // Convert min and max values to Date objects using dayjs
  const minDate = dayjs(minValue); // e.g., 1975-03-25
  const maxDate = dayjs(maxValue); // e.g., 2007-03-25

  // State to hold the selected date
  const [selectedDate, setSelectedDate] = useState(value ? dayjs(value) : null);

  // Handle date change and update parent form
  const handleDateChange = (date: any) => {
    if (date && date.isValid()) {
      const formattedDate = date.format('YYYY-MM-DD');
      setSelectedDate(date);
      onChange(formattedDate);
    } else {
      onChange(undefined);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Select Date of Birth"
        value={selectedDate}
        onChange={handleDateChange}
        minDate={minDate}
        maxDate={maxDate}
        format="YYYY-MM-DD"
        renderInput={(params: any) => (
          <TextField
            {...params}
            fullWidth
            variant="outlined"
            helperText={
              selectedDate &&
              (selectedDate.isBefore(minDate) || selectedDate.isAfter(maxDate))
                ? `Date must be between ${minDate.format(
                    'YYYY-MM-DD'
                  )} and ${maxDate.format('YYYY-MM-DD')}`
                : ''
            }
            error={
              selectedDate &&
              (selectedDate.isBefore(minDate) || selectedDate.isAfter(maxDate))
            }
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default CustomDateWidget;
