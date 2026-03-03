// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WidgetProps } from '@rjsf/utils';
import {
    FormControl,
    FormLabel,
    TextField,
    Box,
    Typography,
    CircularProgress,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    InputAdornment,
    Paper,
    Popper,
    ClickAwayListener,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';
import API_ENDPOINTS from '../../../utils/API/APIEndpoints';
import { useTranslation } from 'libs/shared-lib-v2/src/lib/context/LanguageContext';

interface User {
    userId: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    name: string;
}

interface UserOption {
    label: string;
    value: string;
}

const POCNameSelectWidget = ({
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
    const [users, setUsers] = useState<UserOption[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
    const [academicYearId, setAcademicYearId] = useState<string | null>(null);
    const [orgId, setOrgId] = useState<string | null>(null);

    const anchorRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const orgIdRef = useRef<string | null>(null);

    const limit = 100;

    // Fetch active academic year ID on mount
    useEffect(() => {
        const loadAcademicYear = async () => {
            if (typeof window !== 'undefined') {
                const yearId = localStorage.getItem('temp_academicYearId') || '';
                setAcademicYearId(yearId);
            }
        };
        loadAcademicYear();
    }, []);

    // Update ref when orgId changes
    useEffect(() => {
        orgIdRef.current = orgId;
    }, [orgId]);

    // Initialize and monitor localStorage for temp_org_id changes
    useEffect(() => {
        const checkOrgId = () => {
            if (typeof window !== 'undefined') {
                const storedOrgId = localStorage.getItem('temp_org_id');
                const currentOrgId = orgIdRef.current;
                // console.log('POCNameSelectWidget: Checking orgId', { storedOrgId, currentOrgId });
                if (storedOrgId !== currentOrgId) {
                    // console.log('POCNameSelectWidget: orgId changed, updating state', { from: currentOrgId, to: storedOrgId });
                    setOrgId(storedOrgId);
                    // Clear users if org_id is removed
                    if (!storedOrgId) {
                        setUsers([]);
                        setSelectedUser(null);
                        onChange(undefined);
                    }
                }
            }
        };

        // Check immediately on mount
        checkOrgId();

        // Set up interval to check for changes (for same-tab updates)
        const interval = setInterval(checkOrgId, 200);

        // Also listen to storage events (for cross-tab updates)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'temp_org_id') {
                console.log('POCNameSelectWidget: Storage event detected for temp_org_id');
                checkOrgId();
            }
        };

        // Custom event listener for same-tab localStorage changes
        const handleCustomStorageChange = (e: CustomEvent) => {
            if (e.detail?.key === 'temp_org_id') {
                console.log('POCNameSelectWidget: Custom storage event detected');
                checkOrgId();
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('storage', handleStorageChange);
            window.addEventListener('localStorageChange', handleCustomStorageChange as EventListener);
        }

        return () => {
            clearInterval(interval);
            if (typeof window !== 'undefined') {
                window.removeEventListener('storage', handleStorageChange);
                window.removeEventListener('localStorageChange', handleCustomStorageChange as EventListener);
            }
        };
    }, [onChange]);

    // Format user name: firstName + middleName (if exists) + lastName
    const formatUserName = useCallback((user: User): string => {
        const parts = [user.firstName];
        if (user.middleName) {
            parts.push(user.middleName);
        }
        if (user.lastName) {
            parts.push(user.lastName);
        }
        return parts.join(' ');
    }, []);

    // Fetch users from API
    const fetchUsers = useCallback(async () => {
        if (!academicYearId || !orgId) {
            console.log('POCNameSelectWidget: Cannot fetch - missing academicYearId or orgId', {
                academicYearId,
                orgId,
            });
            return;
        }

        try {
            console.log('POCNameSelectWidget: Fetching users with orgId:', orgId);
            setLoading(true);
            setError(null);

            const tenantId = localStorage.getItem('onboardTenantId') || '';
            const token = localStorage.getItem('token') || '';

            if (!tenantId || !token) {
                setError('Missing tenant ID or token');
                console.error('POCNameSelectWidget: Missing tenant ID or token');
                return;
            }

            const requestBody = {
                limit,
                offset: 0,
                filters: {
                    center: [orgId],
                    status: ['active'],
                },
                role: ['Learner'],
                // customfields: [''],
                sort: ['firstName', 'asc'],
            };

            console.log('POCNameSelectWidget: API request body:', requestBody);

            const response = await axios.post(
                API_ENDPOINTS.hierarchialSearch,
                requestBody,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                        tenantid: tenantId,
                        academicyearid: academicYearId,
                    },
                }
            );

            const result = response.data?.result || {};
            const fetchedUsers: User[] = result.users || [];
            const total = result.totalCount || 0;

            console.log('POCNameSelectWidget: Fetched users:', fetchedUsers.length, 'total:', total);

            setError(null);

            // Transform users to options format
            const userOptions: UserOption[] = fetchedUsers.map((user) => ({
                label: formatUserName(user),
                value: user.userId,
            }));

            setUsers(userOptions);
        } catch (err: any) {
            console.error('POCNameSelectWidget: Error fetching users:', err);
            setError('API_FAILED');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [academicYearId, orgId, formatUserName]);

    // Fetch users when orgId or academicYearId changes
    useEffect(() => {
        console.log('POCNameSelectWidget: useEffect triggered', { orgId, academicYearId });
        if (orgId && academicYearId) {
            console.log('POCNameSelectWidget: Calling fetchUsers');
            fetchUsers();
        } else {
            console.log('POCNameSelectWidget: Clearing users - missing orgId or academicYearId');
            setUsers([]);
            setSelectedUser(null);
            if (!orgId && !academicYearId) {
                onChange(undefined);
            }
        }
    }, [orgId, academicYearId, fetchUsers]);

    // Set selected user when value changes
    useEffect(() => {
        if (value && users.length > 0) {
            const found = users.find((u) => u.value === value);
            if (found) {
                setSelectedUser(found);
            } else {
                // If value exists but not in current list, set a placeholder
                setSelectedUser({ label: 'Selected', value });
            }
        } else if (!value) {
            setSelectedUser(null);
        }
    }, [value, users]);

    // Handle user selection
    const handleUserSelect = (user: UserOption) => {
        setSelectedUser(user);
        onChange(user.value);
        setOpen(false);
    };

    // Handle dropdown toggle
    const handleToggle = () => {
        if (disabled || readonly || !orgId) return;
        setOpen((prev) => !prev);
    };

    // Handle click away
    const handleClickAway = () => {
        setOpen(false);
    };

    return (
        <FormControl
            fullWidth
            required={required}
            error={rawErrors.length > 0}
            disabled={disabled || readonly || !orgId}
        >
            <FormLabel
                sx={{
                    color: 'black',
                    marginBottom: 1,
                    fontWeight: 600,
                    fontSize: '1rem',
                    '&.Mui-error': {
                        color: 'black',
                    },
                    '&.Mui-disabled': {
                        color: 'black',
                    },
                }}
            >
                {label || t('FORM.POC_NAME', { defaultValue: 'POC Name' })}
            </FormLabel>

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
                    marginLeft: 50,
                    marginTop: 20,
                }}
                aria-hidden="true"
            />

            {/* Main input field */}
            <Box
                ref={anchorRef}
                onClick={handleToggle}
                sx={{
                    position: 'relative',
                    cursor: disabled || readonly || !orgId ? 'default' : 'pointer',
                }}
            >
                <TextField
                    fullWidth
                    placeholder={
                        !orgId
                            ? t('FORM.PLEASE_SELECT_AN_ORGANIZATION_FIRST', { defaultValue: 'Please select an organization first' })
                            : t('FORM.SELECT_POC_NAME', { defaultValue: 'Select POC Name' })
                    }
                    value={selectedUser ? selectedUser.label : ''}
                    InputProps={{
                        readOnly: true,
                        endAdornment: (
                            <InputAdornment position="end">
                                {open ? (
                                    <KeyboardArrowUpIcon
                                        sx={{ color: '#757575', fontSize: '1.25rem' }}
                                    />
                                ) : (
                                    <KeyboardArrowDownIcon
                                        sx={{ color: '#757575', fontSize: '1.25rem' }}
                                    />
                                )}
                            </InputAdornment>
                        ),
                        sx: {
                            backgroundColor: '#f5f5f5',
                            cursor: disabled || readonly || !orgId ? 'default' : 'pointer',
                            borderRadius: '4px',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#e0e0e0',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor:
                                    disabled || readonly || !orgId ? '#e0e0e0' : '#bdbdbd',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#bdbdbd',
                            },
                        },
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '4px',
                        },
                    }}
                />
            </Box>

            {/* Dropdown Popper */}
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                placement="bottom-start"
                style={{ zIndex: 1300, width: anchorRef.current?.clientWidth }}
            >
                <ClickAwayListener onClickAway={handleClickAway}>
                    <Paper
                        elevation={8}
                        sx={{
                            width: '100%',
                            maxHeight: '400px',
                            display: 'flex',
                            flexDirection: 'column',
                            mt: 0.5,
                            borderRadius: '4px',
                            overflow: 'hidden',
                        }}
                    >
                        {/* User list */}
                        <Box
                            ref={listRef}
                            sx={{
                                overflowY: 'auto',
                                maxHeight: '400px',
                                flex: 1,
                            }}
                        >
                            {loading && users.length === 0 && (
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    p={3}
                                >
                                    <CircularProgress size={24} />
                                </Box>
                            )}

                            {!loading && (error || users.length === 0) && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ p: 2, textAlign: 'center' }}
                                >
                                    {error
                                        ? t('FORM.FAILED_TO_LOAD_USERS', { defaultValue: 'Failed to load users' })
                                        : t('FORM.NO_USERS_FOUND', { defaultValue: 'No users found' })}
                                </Typography>
                            )}

                            {users.length > 0 && (
                                <List sx={{ p: 0 }}>
                                    {users.map((user) => (
                                        <ListItem key={user.value} disablePadding>
                                            <ListItemButton
                                                onClick={() => handleUserSelect(user)}
                                                selected={selectedUser?.value === user.value}
                                                sx={{
                                                    px: 2,
                                                    py: 1.5,
                                                    '&.Mui-selected': {
                                                        backgroundColor: '#e3f2fd',
                                                        '&:hover': {
                                                            backgroundColor: '#bbdefb',
                                                        },
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: '#f5f5f5',
                                                    },
                                                }}
                                            >
                                                <ListItemText
                                                    primary={user.label}
                                                    primaryTypographyProps={{
                                                        sx: {
                                                            fontWeight:
                                                                selectedUser?.value === user.value ? 500 : 400,
                                                            fontSize: '0.9375rem',
                                                            color: '#212121',
                                                        },
                                                    }}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </Box>
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </FormControl>
    );
};

export default POCNameSelectWidget;

