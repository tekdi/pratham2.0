// @ts-nocheck
import React from 'react';
import { WidgetProps } from '@rjsf/utils';
import {
  FormControl,
  FormLabel,
  Box,
  Typography,
  Card,
  CardContent,
  Tooltip,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import { useTranslation } from 'libs/shared-lib-v2/src/lib/context/LanguageContext';

const OrganizationRegistredWidget = ({
  id,
  label,
  value,
  required,
  disabled,
  readonly,
  onChange,
  rawErrors = [],
  options = {},
}: WidgetProps) => {
  const { t } = useTranslation();

  // Get options from enumOptions (RJSF merges ui:options into options prop)
  const { enumOptions = [] } = options;

  // Default options if not provided
  const defaultOptions = [
    {
      label: 'THIS_IS_THE_FIRST_TIME_MY_ORGANISATION_IS_REGISTERING',
      value: 'this_is_the_first_time_my_organisation_is_registering',
      description: 'FIRST_TIME_ORGANISATION_DESCRIPTION',
      helpText: 'FIRST_TIME_ORGANISATION_HELP_TEXT',
      icon: DescriptionIcon,
    },
    {
      label: 'MY_ORGANISATION_IS_ALREADY_REGISTERED',
      value: 'my_organisation_is_already_registered',
      description: 'ALREADY_REGISTERED_ORGANISATION_DESCRIPTION',
      helpText: 'ALREADY_REGISTERED_ORGANISATION_HELP_TEXT',
      icon: SearchIcon,
    },
  ];

  // Map enumOptions to include icons and descriptions
  const mappedOptions = enumOptions.length > 0
    ? enumOptions.map((option: any) => {
      const defaultOption = defaultOptions.find(
        (def) => def.value === option.value
      );
      return {
        ...option,
        description: defaultOption?.description || option.description || '',
        helpText: option.helpText || defaultOption?.helpText || '',
        icon: defaultOption?.icon || DescriptionIcon,
      };
    })
    : defaultOptions;

  const handleOptionClick = (optionValue: string) => {
    if (!disabled && !readonly) {
      onChange(optionValue);
    }
  };

  const isSelected = (optionValue: string) => {
    return value === optionValue;
  };

  return (
    <FormControl
      fullWidth
      required={required}
      error={rawErrors.length > 0}
      disabled={disabled || readonly}
    >
      <FormLabel
        component="legend"
        sx={{
          color: 'black',
          marginBottom: 2,
          fontWeight: 600,
          fontSize: '1.25rem',
          '&.Mui-error': {
            color: 'black',
          },
          '&.Mui-disabled': {
            color: 'black',
          },
        }}
      >
        {t('FORM.IS_YOUR_ORGANISATION_REGISTERED', { defaultValue: 'Is Your Organisation Registered?' })}
      </FormLabel>

      <Typography
        variant="body2"
        sx={{
          marginBottom: 2,
          color: '#757575',
        }}
      >
        {t('FORM.LET_US_KNOW_SO_WE_CAN_GUIDE_YOU', { defaultValue: 'Let us know so we can guide you to the right step.' })}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          marginBottom: 3,
          color: '#212121',
          fontWeight: 500,
        }}
      >
        {t('FORM.IS_THIS_YOUR_ORGANISATIONS_FIRST_TIME', { defaultValue: 'Is this your organisation\'s first time on the platform?' })}
      </Typography>

      {/* Hidden input for form validation */}
      <input
        name={id}
        id={`${id}-hidden`}
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
          overflow: 'hidden',
          marginLeft: 100,
          marginTop: 65,
        }}
        aria-hidden="true"
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {mappedOptions.map((option: any) => {
          const IconComponent = option.icon;
          const selected = isSelected(option.value);

          return (
            <Card
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              sx={{
                border: selected
                  ? '2px solid #ff9800'
                  : '1px solid #e0e0e0',
                borderRadius: 2,
                cursor: disabled || readonly ? 'default' : 'pointer',
                transition: 'all 0.2s ease-in-out',
                backgroundColor: selected ? '#fff3e0' : '#ffffff',
                '&:hover': {
                  borderColor: disabled || readonly ? '#e0e0e0' : '#ff9800',
                  backgroundColor: disabled || readonly ? '#ffffff' : '#fff8e1',
                },
              }}
            >
              <CardContent
                sx={{
                  padding: 2.5,
                  '&:last-child': {
                    paddingBottom: 2.5,
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                  }}
                >
                  {/* Icon */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: selected ? '#ff9800' : '#f5f5f5',
                      color: selected ? '#ffffff' : '#757575',
                      flexShrink: 0,
                    }}
                  >
                    <IconComponent sx={{ fontSize: 28 }} />
                  </Box>

                  {/* Content */}
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        marginBottom: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          fontSize: '1rem',
                          color: '#212121',
                        }}
                      >
                        {t(`FORM.${option.label}`, { defaultValue: option.label })}
                      </Typography>
                      {option.helpText && (
                        <Tooltip
                          title={t(`FORM.${option.helpText}`, { defaultValue: option.helpText })}
                          arrow
                          placement="top"
                          componentsProps={{
                            tooltip: {
                              sx: {
                                bgcolor: '#424242',
                                fontSize: '0.875rem',
                                maxWidth: 300,
                                padding: 1.5,
                              },
                            },
                            arrow: {
                              sx: {
                                color: '#424242',
                              },
                            },
                          }}
                        >
                          <InfoIcon
                            sx={{
                              fontSize: 18,
                              color: '#757575',
                              cursor: 'help',
                              '&:hover': {
                                color: '#ff9800',
                              },
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />
                        </Tooltip>
                      )}
                      {!option.helpText && (
                        <InfoIcon
                          sx={{
                            fontSize: 18,
                            color: '#757575',
                          }}
                        />
                      )}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#757575',
                        fontSize: '0.875rem',
                        lineHeight: 1.5,
                      }}
                    >
                      {t(`FORM.${option.description}`, { defaultValue: option.description })}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </FormControl>
  );
};

export default OrganizationRegistredWidget;

