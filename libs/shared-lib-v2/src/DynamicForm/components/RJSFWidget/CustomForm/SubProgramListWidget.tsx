// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { WidgetProps } from '@rjsf/utils';
import {
    FormControl,
    FormLabel,
    Radio,
    RadioGroup,
    FormControlLabel,
    Checkbox,
    Box,
    CircularProgress,
    Typography,
} from '@mui/material';
import axios from 'axios';
import API_ENDPOINTS from '../../../utils/API/APIEndpoints';
import { useTranslation } from 'libs/shared-lib-v2/src/lib/context/LanguageContext';
import { fetchActiveAcademicYearId } from '../../../utils/Helper';
import { readUserIdTrue } from '../../../services/NotificationService';

interface Cohort {
    tenantId: string;
    name: string;
    status: string;
}


const SubProgramListWidget = ({
    id,
    label,
    value,
    required,
    disabled,
    readonly,
    onChange,
    rawErrors = [],
    uiSchema = {},
    options = {},
}: WidgetProps) => {
    const { t } = useTranslation();
    const [cohorts, setCohorts] = useState<Cohort[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch cohorts
    const fetchCohorts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Get current userId from localStorage
            const userId = localStorage.getItem('userId');
            
            // Fetch both cohorts and user details in parallel
            const [cohortResponse, userInfoResponse] = await Promise.all([
                axios.get(
                    API_ENDPOINTS.tenantRead,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                ),
                userId ? readUserIdTrue(userId) : Promise.resolve(null)
            ]);

            const cohortDetails: Cohort[] = cohortResponse.data?.result?.[0]?.children || [];

            // Filter only VolunteerOnboarding cohorts
            const activeCohorts = cohortDetails.filter(
                (cohort) => cohort.type === 'VolunteerOnboarding'
            );
            console.log('activeCohorts', activeCohorts);
            // Get volunteer program lead tenant IDs to filter out
            let volunteerProgramLeadTenantIds: string[] = [];
            if (userInfoResponse?.result?.userData?.tenantData) {
                const tenants = userInfoResponse.result.userData.tenantData;
                volunteerProgramLeadTenantIds = tenants
                    .filter((tenant: any) =>
                        tenant.tenantType === 'VolunteerOnboarding' &&
                        tenant.roles?.some(
                            (role: any) => role.roleName?.toLowerCase() === 'lead'
                        )
                    )
                    .map((tenant: any) => tenant.tenantId);
                
                console.log('volunteerProgramLeadTenantIds to filter out:', volunteerProgramLeadTenantIds);
            }

            // Filter out cohorts where user has lead role
            const filteredCohorts = activeCohorts.filter(
                (cohort) => !volunteerProgramLeadTenantIds.includes(cohort.tenantId)
            );
            
            console.log('filteredCohorts after removing lead tenants:', filteredCohorts);

            setCohorts(filteredCohorts);
        } catch (err: any) {
            console.error('Error fetching cohorts:', err);
            // setError('Failed to fetch cohorts');
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial data fetch
    useEffect(() => {
        let isMounted = true;

        const loadCohorts = async () => {
            if (isMounted) {
                await fetchCohorts();
            }
        };

        loadCohorts();

        return () => {
            isMounted = false;
        };
    }, [fetchCohorts]);

    // Check if multiple selection is enabled
    // Check options (RJSF merges ui:options into options), ui:options, and direct uiSchema property
    const isMultiple =
        options?.multiple === true ||
        uiSchema?.['ui:options']?.multiple === true ||
        uiSchema?.multiple === true;

    // Normalize value - ensure it's always an array (even for single selection)
    // This needs to happen synchronously to avoid validation errors
    const normalizedValue = Array.isArray(value)
        ? value
        : value !== undefined && value !== null
            ? [value]
            : [];

    // Update value if it needs normalization (always ensure it's an array)
    useEffect(() => {
        if (!Array.isArray(value)) {
            // If value is not an array, normalize it to array
            const normalized = value !== undefined && value !== null ? [value] : [];
            onChange(normalized);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount

    // Handle single selection (radio) - return array with one item
    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedValue = event.target.value;
        onChange([selectedValue]); // Always return as array
    };

    // Handle multiple selection (checkbox)
    const handleCheckboxChange = (tenantId: string) => {
        const currentValue = normalizedValue;
        const isSelected = currentValue.includes(tenantId);

        if (isSelected) {
            // Remove from selection
            const newValue = currentValue.filter((id) => id !== tenantId);
            // Always return an array for multiple selection (even if empty)
            onChange(newValue);
        } else {
            // Add to selection
            onChange([...currentValue, tenantId]);
        }
    };

    // Check if a cohort is selected (for both single and multiple)
    // Always check against array since we always use arrays
    const isSelected = (tenantId: string) => {
        return Array.isArray(normalizedValue) && normalizedValue.includes(tenantId);
    };

    const capitalizeWords = (str: string): string => {
        return str
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    return (
        <Box>
            <Typography
                variant="h1"
                sx={{
                    fontWeight: 600,
                    marginBottom: 2,
                    color: 'black',
                }}
            >
                {t('FORM.PROGRAM_PREFERENCES', { defaultValue: 'Program Preferences' })}
            </Typography>
            <FormControl
                component="fieldset"
                error={rawErrors.length > 0}
                required={required}
                fullWidth
                disabled={disabled || readonly}
            >
                <FormLabel
                    component="legend"
                    sx={{
                        color: 'black',
                        marginBottom: 2,
                        '&.Mui-error': {
                            color: 'black',
                        },
                        '&.Mui-disabled': {
                            color: 'black',
                        },
                    }}
                >
                    {t('FORM.CHOOSE_SUB_PROGRAM', { defaultValue: 'Choose Sub-Program' })}
                    {/* {required && <span style={{ color: 'red' }}> *</span>} */}
                </FormLabel>

                {/* Hidden text input to force native validation */}
                <input
                    name={id}
                    id={`${id}-hidden`}
                    value={
                        Array.isArray(normalizedValue) && normalizedValue.length > 0
                            ? normalizedValue.join(',')
                            : ''
                    }
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
                        overflow: 'hidden', marginLeft: 50,
                    }}
                    aria-hidden="true"
                />
                {loading && (
                    <Box display="flex" justifyContent="center" alignItems="center" p={3}>
                        <CircularProgress size={24} />
                    </Box>
                )}

                {error && (
                    <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                {!loading && !error && cohorts.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        No active cohorts found
                    </Typography>
                )}

                {!loading && cohorts.length > 0 && (
                    <>
                        {isMultiple ? (
                            // Multiple selection with checkboxes
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                }}
                            >
                                {cohorts.map((cohort) => (
                                    <Box
                                        key={cohort.tenantId}
                                        sx={{
                                            border: isSelected(cohort.tenantId)
                                                ? '2px solid #ff9800'
                                                : '1px solid #e0e0e0',
                                            borderRadius: 2,
                                            padding: 2,
                                            backgroundColor: isSelected(cohort.tenantId)
                                                ? '#fff3e0'
                                                : '#f5f5f5',
                                            cursor: disabled || readonly ? 'default' : 'pointer',
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                                borderColor: disabled || readonly ? '#e0e0e0' : '#ff9800',
                                                backgroundColor: disabled || readonly ? '#f5f5f5' : '#fff8e1',
                                            },
                                        }}
                                        onClick={(e) => {
                                            // Only handle clicks on the Box itself, not on FormControlLabel or its children
                                            const target = e.target as HTMLElement;
                                            if (!disabled && !readonly &&
                                                target === e.currentTarget) {
                                                // Only fire if clicking directly on the Box, not on any child
                                                handleCheckboxChange(cohort.tenantId);
                                            }
                                        }}
                                    >
                                        <Box
                                            onClick={(e) => {
                                                // Stop propagation so parent Box onClick doesn't fire
                                                e.stopPropagation();
                                            }}
                                            sx={{ width: '100%' }}
                                        >
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={isSelected(cohort.tenantId)}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            if (!disabled && !readonly) {
                                                                handleCheckboxChange(cohort.tenantId);
                                                            }
                                                        }}
                                                        sx={{
                                                            color: isSelected(cohort.tenantId) ? '#ff9800' : '#757575',
                                                            '&.Mui-checked': {
                                                                color: '#ff9800',
                                                            },
                                                        }}
                                                    />
                                                }
                                                label={capitalizeWords(cohort.name)}
                                                sx={{
                                                    margin: 0,
                                                    width: '100%',
                                                    cursor: disabled || readonly ? 'default' : 'pointer',
                                                    '& .MuiFormControlLabel-label': {
                                                        fontSize: '1rem',
                                                        fontWeight: isSelected(cohort.tenantId) ? 500 : 400,
                                                        cursor: disabled || readonly ? 'default' : 'pointer',
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            // Single selection with radio buttons
                            <RadioGroup
                                id={id}
                                name={id}
                                value={Array.isArray(normalizedValue) && normalizedValue.length > 0 ? normalizedValue[0] : ''}
                                onChange={handleRadioChange}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                }}
                            >
                                {cohorts.map((cohort) => (
                                    <Box
                                        key={cohort.tenantId}
                                        sx={{
                                            border: isSelected(cohort.tenantId)
                                                ? '2px solid #ff9800'
                                                : '1px solid #e0e0e0',
                                            borderRadius: 2,
                                            padding: 2,
                                            backgroundColor: isSelected(cohort.tenantId)
                                                ? '#fff3e0'
                                                : '#f5f5f5',
                                            cursor: disabled || readonly ? 'default' : 'pointer',
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                                borderColor: disabled || readonly ? '#e0e0e0' : '#ff9800',
                                                backgroundColor: disabled || readonly ? '#f5f5f5' : '#fff8e1',
                                            },
                                        }}
                                        onClick={() => {
                                            if (!disabled && !readonly) {
                                                onChange([cohort.tenantId]); // Always return as array
                                            }
                                        }}
                                    >
                                        <FormControlLabel
                                            value={cohort.tenantId}
                                            control={
                                                <Radio
                                                    sx={{
                                                        color: isSelected(cohort.tenantId) ? '#ff9800' : '#757575',
                                                        '&.Mui-checked': {
                                                            color: '#ff9800',
                                                        },
                                                    }}
                                                />
                                            }
                                            label={capitalizeWords(cohort.name)}
                                            sx={{
                                                margin: 0,
                                                '& .MuiFormControlLabel-label': {
                                                    fontSize: '1rem',
                                                    fontWeight: isSelected(cohort.tenantId) ? 500 : 400,
                                                },
                                            }}
                                        />
                                    </Box>
                                ))}
                            </RadioGroup>
                        )}
                    </>
                )}

                {rawErrors.length > 0 && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                        {rawErrors[0]}
                    </Typography>
                )}
            </FormControl>
        </Box>
    );
};

export default SubProgramListWidget;

