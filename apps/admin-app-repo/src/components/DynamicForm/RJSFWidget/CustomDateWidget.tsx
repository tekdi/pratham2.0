// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const CustomDateWidget = ({ value, onChange, options }: any) => {
  const { minValue, maxValue } = options;

  console.log('###### DOB Received in Widget:', value);

  // Ensure valid initial value
  const initialValue =
    typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)
      ? value
      : null;

  // State for selected date
  const [selectedDate, setSelectedDate] = useState(
    initialValue ? dayjs(initialValue, 'YYYY-MM-DD') : null
  );

  // Update state if value changes dynamically
  useEffect(() => {
    if (value && dayjs(value, 'YYYY-MM-DD').isValid()) {
      setSelectedDate(dayjs(value, 'YYYY-MM-DD'));
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  // Handle date change and update parent form
  const handleDateChange = (date: any) => {
    if (date && date.isValid()) {
      const formattedDate = date.format('YYYY-MM-DD'); // Send as MySQL format
      setSelectedDate(date);
      onChange(formattedDate);
    } else {
      setSelectedDate(null);
      onChange(undefined);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Select Date of Birth"
        value={selectedDate || null}
        onChange={handleDateChange}
        minDate={minValue ? dayjs(minValue, 'YYYY-MM-DD') : undefined}
        maxDate={maxValue ? dayjs(maxValue, 'YYYY-MM-DD') : undefined}
        // 👇 Set display format to DD-MM-YYYY
        format="DD-MM-YYYY"
        renderInput={(params: any) => (
          <TextField
            {...params}
            fullWidth
            variant="outlined"
            helperText={
              selectedDate &&
              (selectedDate.isBefore(dayjs(minValue)) ||
                selectedDate.isAfter(dayjs(maxValue)))
                ? `Date must be between ${dayjs(minValue).format(
                    'DD-MM-YYYY'
                  )} and ${dayjs(maxValue).format('DD-MM-YYYY')}`
                : ''
            }
            error={
              selectedDate &&
              (selectedDate.isBefore(dayjs(minValue)) ||
                selectedDate.isAfter(dayjs(maxValue)))
            }
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default CustomDateWidget;
