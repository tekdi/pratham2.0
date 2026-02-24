// @ts-nocheck
import React from 'react';
import { WidgetProps } from '@rjsf/utils';
import {
  Box,
  Typography,
  FormControl,
  FormHelperText,
} from '@mui/material';
import { useTranslation } from 'libs/shared-lib-v2/src/lib/context/LanguageContext';
import SecurityIcon from '@mui/icons-material/Security';
import CheckIcon from '@mui/icons-material/Check';

const ChildPocsoFraudPolicyAcknowledgementWidget = ({
  id,
  label,
  value,
  required,
  disabled,
  readonly,
  onChange,
  rawErrors = [],
}: WidgetProps) => {
  const { t } = useTranslation();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      // Set value to current date timestamp as string
      const timestamp = new Date().toISOString();
      onChange(timestamp);
    } else {
      // Clear value when unchecked
      onChange(undefined);
    }
  };

  // Check if checkbox should be checked (value exists and is a valid timestamp string)
  const isChecked = Boolean(value && typeof value === 'string');
  const handleChildProtectionPolicy = () => {
    // Get the selected language from localStorage (same key as Header.jsx uses)
    const selectedLanguage =
      typeof window !== 'undefined'
        ? localStorage.getItem('lang') || 'en'
        : 'en';

    // Map language codes to lowercase language names for PDF file naming
    // Using the same language codes as Header.jsx
    const languageFileMap: { [key: string]: string } = {
      en: 'english',
      hi: 'hindi',
      mr: 'marathi',
      bn: 'bengali',
      as: 'assamese',
      guj: 'gujarati',
      kan: 'kannada',
      odi: 'odia',
      tam: 'tamil',
      tel: 'telugu',
      ur: 'urdu',
    };

    // Get the language name from the map, default to 'hindi'
    const languageName = languageFileMap[selectedLanguage] || 'hindi';

    // Use PDF file naming convention: consent_form_below_18_<language>.pdf
    window.open(`/files/c2c/Child_Protection_Policy_${languageName}.pdf`, '_blank');
  }
  const handlePocsoPolicy = () => {
    // Get the selected language from localStorage (same key as Header.jsx uses)
    const selectedLanguage =
      typeof window !== 'undefined'
        ? localStorage.getItem('lang') || 'en'
        : 'en';

    // Map language codes to lowercase language names for PDF file naming
    // Using the same language codes as Header.jsx
    const languageFileMap: { [key: string]: string } = {
      en: 'english',
      hi: 'hindi',
      mr: 'marathi',
      bn: 'bengali',
      as: 'assamese',
      guj: 'gujarati',
      kan: 'kannada',
      odi: 'odia',
      tam: 'tamil',
      tel: 'telugu',
      ur: 'urdu',
    };

    // Get the language name from the map, default to 'hindi'
    const languageName = languageFileMap[selectedLanguage] || 'hindi';

    // Use PDF file naming convention: consent_form_below_18_<language>.pdf
    window.open(`/files/c2c/POCSO_Policy_${languageName}.pdf`, '_blank');
  }
  const handleFraudProtectionPolicy = () => {
    // Get the selected language from localStorage (same key as Header.jsx uses)
    const selectedLanguage =
      typeof window !== 'undefined'
        ? localStorage.getItem('lang') || 'en'
        : 'en';

    // Map language codes to lowercase language names for PDF file naming
    // Using the same language codes as Header.jsx
    const languageFileMap: { [key: string]: string } = {
      en: 'english',
      hi: 'hindi',
      mr: 'marathi',
      bn: 'bengali',
      as: 'assamese',
      guj: 'gujarati',
      kan: 'kannada',
      odi: 'odia',
      tam: 'tamil',
      tel: 'telugu',
      ur: 'urdu',
    };

    // Get the language name from the map, default to 'hindi'
    const languageName = languageFileMap[selectedLanguage] || 'hindi';

    // Use PDF file naming convention: consent_form_below_18_<language>.pdf
    window.open(`/files/c2c/Fraud_Protection_Policy_${languageName}.pdf`, '_blank');
  }
  return (
    <Box>
      {/* Checkbox Section */}
      <Box
        sx={{
          backgroundColor: '#fafafa', // Light beige/off-white
          borderRadius: 2,
          padding: 2,
        }}
      >
        <FormControl
          component="fieldset"
          error={rawErrors.length > 0}
          required={required}
          fullWidth
          disabled={disabled || readonly}
        >
          {/* Hidden input for native validation */}
          <input
            id={`${id}-hidden`}
            name={id}
            value={value || ''}
            required={required}
            onChange={() => { }}
            tabIndex={-1}
            style={{
              position: 'absolute',
              opacity: 0,
              pointerEvents: 'none',
              width: '1px',
              height: '1px',
              padding: 0,
              border: 0,
              margin: 0,
              clip: 'rect(0, 0, 0, 0)',
              overflow: 'hidden', marginLeft: 50, marginTop: 20,
            }}
            aria-hidden="true"
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            {/* Circular Checkbox */}
            <Box
              onClick={() => {
                if (!disabled && !readonly) {
                  if (isChecked) {
                    onChange(undefined);
                  } else {
                    const timestamp = new Date().toISOString();
                    onChange(timestamp);
                  }
                }
              }}
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: isChecked ? '2px solid #ffc107' : '2px solid #757575',
                backgroundColor: isChecked ? '#ffc107' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: disabled || readonly ? 'not-allowed' : 'pointer',
                flexShrink: 0,
                position: 'relative',
              }}
            >
              {isChecked && (
                <CheckIcon
                  sx={{
                    fontSize: 16,
                    color: '#424242',
                    fontWeight: 'bold',
                  }}
                />
              )}
            </Box>
            {/* Label */}
            <Typography
              component="span"
              sx={{
                color: '#424242',
                fontSize: '0.95rem',
              }}
            >
              {t('FORM.I_HAVE_READ_AND_AGREE', {
                defaultValue: 'I acknowledge that I have read and understood the ',
              })}
              <Typography
                component="span"
                sx={{
                  color: '#ff9800', // Yellow-orange color for link
                  // textDecoration: 'underline',
                  cursor: 'pointer',
                }}
                onClick={(e) => {
                  handleChildProtectionPolicy();
                }}
              >
                {t('FORM.CHILD_PROTECTION_POLICY', {
                  defaultValue: 'Child Protection Policy',
                })}
              </Typography>
              {required && (
                <Typography
                  component="span"
                  sx={{
                    color: '#f44336', // Red asterisk
                    marginLeft: 0.5,
                  }}
                >
                  *
                </Typography>
              )}
              {" "},{" "}
              <Typography
                component="span"
                sx={{
                  color: '#ff9800', // Yellow-orange color for link
                  // textDecoration: 'underline',
                  cursor: 'pointer',
                }}
                onClick={(e) => {
                  handlePocsoPolicy();
                }}
              >
                {t('FORM.POCSO_POLICY', {
                  defaultValue: 'POCSO Policy',
                })}
              </Typography>
              {required && (
                <Typography
                  component="span"
                  sx={{
                    color: '#f44336', // Red asterisk
                    marginLeft: 0.5,
                  }}
                >
                  *
                </Typography>
              )}
              {t('FORM.AND', {
                defaultValue: ' and ',
              })}
              <Typography
                component="span"
                sx={{
                  color: '#ff9800', // Yellow-orange color for link
                  // textDecoration: 'underline',
                  cursor: 'pointer',
                }}
                onClick={(e) => {
                  handleFraudProtectionPolicy();
                }}
              >
                {t('FORM.FRAUD_PROTECTION_POLICY', {
                  defaultValue: 'Fraud Protection Policy',
                })}
              </Typography>
              {required && (
                <Typography
                  component="span"
                  sx={{
                    color: '#f44336', // Red asterisk
                    marginLeft: 0.5,
                  }}
                >
                  *
                </Typography>
                  )}
                  {" "}
                  {t('FORM.AND_TO_COMPLY', {
                    defaultValue: ' and agree to comply.',
                  })}
            </Typography>
          </Box>
        </FormControl>
      </Box>
    </Box>
  );
};

export default ChildPocsoFraudPolicyAcknowledgementWidget;

