// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { CalendarToday } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useTranslation } from 'libs/shared-lib-v2/src/lib/context/LanguageContext';

const CustomDateWidget = ({
  value,
  onChange,
  options,
  required,
  label,
  rawErrors = [],
  uiSchema = {}, // <-- include uiSchema
}: any) => {
  const { minValue, maxValue } = options;
  const { t } = useTranslation();

  const isDisabled = uiSchema?.['ui:disabled'] === true;

  const initialValue =
    typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)
      ? value
      : null;

  const [selectedDate, setSelectedDate] = useState(
    initialValue ? dayjs(initialValue, 'YYYY-MM-DD') : null
  );

  useEffect(() => {
    if (value && dayjs(value, 'YYYY-MM-DD').isValid()) {
      setSelectedDate(dayjs(value, 'YYYY-MM-DD'));
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  const handleDateChange = (date: any) => {
    if (date && date.isValid()) {
      const formattedDate = date.format('YYYY-MM-DD');
      setSelectedDate(date);
      onChange(formattedDate);
    } else {
      setSelectedDate(null);
      onChange(undefined);
    }
  };

  // Filter out 'is a required property' messages
  const displayErrors = rawErrors?.filter(
    (error) => !error.toLowerCase().includes('required')
  ) || [];
  
  const errorText = displayErrors.length > 0 ? displayErrors[0] : '';

  return (
    <>
     <input
        value={value ?? ''}
        required={required}
        onChange={() => { /* no-op */ }}
        tabIndex={-1}
        style={{
          height: 1,
          padding: 0,
          border: 0,
          ...(value && { visibility: 'hidden' }),
        }}
        aria-hidden="true"
                marginTop="50px"

      />
    <LocalizationProvider dateAdapter={AdapterDayjs} required={required}>
      <DatePicker
        disabled={isDisabled}
        label={`${t(`FORM.${label}`, {
          defaultValue: label,
        })}`}
        value={selectedDate || null}
        onChange={handleDateChange}
        minDate={minValue ? dayjs(minValue, 'YYYY-MM-DD') : undefined}
        maxDate={maxValue ? dayjs(maxValue, 'YYYY-MM-DD') : undefined}
        format="DD-MM-YYYY"
        openTo="day"
        views={['year', 'month', 'day']}
        slotProps={{
          textField: {
            fullWidth: true,
            variant: 'outlined',
            error: displayErrors.length > 0,
            helperText: errorText,
            required,
            inputProps: {
              readOnly: true,
            },
            InputProps: {
              endAdornment: <CalendarToday />,
            },
          },
          popper: {
            placement: 'bottom-start',
            modifiers: [
              {
                name: 'preventOverflow',
                options: {
                  boundary: 'viewport',
                },
              },
            ],
          },
          actionBar: {
            actions: ['clear', 'today', 'cancel', 'accept'],
          },
        }}
        required={required}
      />
      
    </LocalizationProvider>
    {/* Hidden text input to force native validation */}
     
    </>
  );
};

export default CustomDateWidget;
