// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
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
  schema = {},
}: any) => {
  const { t } = useTranslation();
  console.log('CustomDateWidget===========>', schema);
  schema={
    "type": "string",
    "title": "Date of Birth",
    "coreField": 1,
    "fieldId": null,
    "field_type": "date",
    "minValue": 0,
    "maxValue": 14,
    "maxLength": 14,
    "format": "date"
}

  const isDisabled = uiSchema?.['ui:disabled'] === true;

  // Convert age values to actual dates
  const getDateFromAge = (ageInYears: number) => {
    if (typeof ageInYears === 'number') {
      return dayjs().subtract(ageInYears, 'years');
    }
    return null;
  };

  // Get validation data directly from schema
  const schemaMaxValue = schema.maxValue; // 14 (maximum age allowed)
  const schemaMinValue = schema.minValue; // 0 (minimum age allowed)

  console.log('Schema maxValue:', schemaMaxValue, 'Schema minValue:', schemaMinValue);

  // Calculate min and max dates based on age constraints
  // maxValue (e.g., 14) = maximum age allowed = minimum birth date (14 years ago)
  // minValue (e.g., 0) = minimum age allowed = maximum birth date (today)
  const minDate = schemaMaxValue !== undefined ? getDateFromAge(schemaMaxValue) : undefined; // 14 years ago (oldest birth date)
  const maxDate = schemaMinValue !== undefined ? getDateFromAge(schemaMinValue) : undefined; // today (youngest birth date)

  console.log('Calculated minDate:', minDate?.format('YYYY-MM-DD'));
  console.log('Calculated maxDate:', maxDate?.format('YYYY-MM-DD'));

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

  const errorText = rawErrors?.length > 0 ? rawErrors[0] : '';

  return (
    <>
     <input
        value={value ?? ''}
        required={required}
        onChange={() => {}}
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
        minDate={minDate}
        maxDate={maxDate}
        format="DD-MM-YYYY"
        slotProps={{
          textField: {
            fullWidth: true,
            variant: 'outlined',
            // error: rawErrors.length > 0,
            // helperText: errorText,
            required
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
