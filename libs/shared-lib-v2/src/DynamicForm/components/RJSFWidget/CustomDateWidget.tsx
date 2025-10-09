// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { TextField, IconButton, Box } from '@mui/material';
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
  uiSchema = {},
}: any) => {
  const { minValue, maxValue } = options;
  const { t } = useTranslation();

  const isDisabled = uiSchema?.['ui:disabled'] === true;

  const [isMobile, setIsMobile] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const handleCalendarIconClick = () => setIsCalendarOpen(true);
  const handleCalendarClose = () => setIsCalendarOpen(false);

  const displayErrors = rawErrors.filter(
    (error) => !error.toLowerCase().includes('required')
  );
  const errorText = displayErrors?.[0] || '';
  const hasError =
    displayErrors && displayErrors.length > 0 && errorText.trim() !== '';

  // Block all keyboard inputs (typing, arrow, tab navigation)
  const blockKeyboardInput = (e) => {
    const keysToBlock = [
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'Enter',
      ' ',
      'Tab',
    ];
    if (keysToBlock.includes(e.key) || e.key.length === 1) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} required={required}>
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
      {isMobile ? (
        <>
          {/* Mobile TextField */}
          <TextField
            disabled={isDisabled}
            label={`${t(`FORM.${label}`, { defaultValue: label })}`}
            value={selectedDate ? selectedDate.format('DD-MM-YYYY') : ''}
            fullWidth
            variant="outlined"
            required={required}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <IconButton
                  onClick={handleCalendarIconClick}
                  disabled={isDisabled}
                  edge="end"
                  size="small"
                >
                  <CalendarToday />
                </IconButton>
              ),
            }}
            onClick={!isDisabled ? handleCalendarIconClick : undefined}
            onKeyDown={blockKeyboardInput}
            error={hasError}
            helperText={hasError ? errorText : ''}
          />

          {/* Mobile popup calendar */}
          {isCalendarOpen && (
            <DatePicker
              open
              onClose={handleCalendarClose}
              disabled={isDisabled}
              value={selectedDate || null}
              onChange={(date) => {
                handleDateChange(date);
                handleCalendarClose();
              }}
              minDate={minValue ? dayjs(minValue, 'YYYY-MM-DD') : undefined}
              maxDate={maxValue ? dayjs(maxValue, 'YYYY-MM-DD') : undefined}
              format="DD-MM-YYYY"
              slotProps={{ popper: { placement: 'bottom-start' } }}
              renderInput={() => null}
            />
          )}
        </>
      ) : (
        // Desktop DatePicker (wrapped in Box to block key events)
        <Box onKeyDownCapture={blockKeyboardInput}>
          <DatePicker
            disabled={isDisabled}
            label={`${t(`FORM.${label}`, { defaultValue: label })}`}
            value={selectedDate || null}
            onChange={handleDateChange}
            minDate={minValue ? dayjs(minValue, 'YYYY-MM-DD') : undefined}
            maxDate={maxValue ? dayjs(maxValue, 'YYYY-MM-DD') : undefined}
            format="DD-MM-YYYY"
            slotProps={{
              textField: {
                fullWidth: true,
                variant: 'outlined',
                error: hasError,
                helperText: hasError ? errorText : '',
                required,
                inputProps: { readOnly: true },
              },
            }}
            required={required}
          />
        </Box>
      )}
    </LocalizationProvider>
  );
};

export default CustomDateWidget;
