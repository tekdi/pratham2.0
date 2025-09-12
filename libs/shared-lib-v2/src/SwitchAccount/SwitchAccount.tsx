import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  Box,
  Chip,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  ArrowBack,
  Business,
  School,
  CheckCircle,
  Person,
} from '@mui/icons-material';
import { useTranslation } from '../lib/context/LanguageContext';
import switchAccountConfig from './SwitchAccount.config';

// TypeScript interfaces
interface Role {
  roleId: string;
  roleName: string;
}

interface TenantData {
  tenantName: string;
  tenantId: string;
  templateId: string;
  contentFramework: string | null;
  collectionFramework: string | null;
  channelId: string | null;
  userTenantMappingId: string;
  params: {
    uiConfig: {
      showSignIn: boolean;
      showSignup: boolean;
      showContent: string[];
      showProgram: boolean;
      isDoTracking: boolean;
      isEditProfile: boolean;
      isTrackingShow: boolean;
      isCompleteProfile: boolean;
    };
  };
  roles: Role[];
  tenantType: string;
}

interface Program {
  programId: string;
  programName: string;
  description?: string;
  isActive: boolean;
}

interface SwitchAccountDialogProps {
  open: boolean;
  onClose: () => void;
  callbackFunction: (
    tenantId: string,
    tenantName: string,
    roleId: string,
    roleName: string
  ) => void;
  authResponse: TenantData[];
}

const SwitchAccountDialog: React.FC<SwitchAccountDialogProps> = ({
  open,
  onClose,
  callbackFunction,
  authResponse,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTenant, setSelectedTenant] = useState<TenantData | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);

  const host = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.location.host;
    }
    return '';
  }, []);

  const allowedRoleIds = useMemo(() => {
    const allowed = (switchAccountConfig as any)?.[host];
    return Array.isArray(allowed) ? (allowed as string[]) : [];
  }, [host]);

  const visibleTenants: TenantData[] = useMemo(() => {
    const tenants = authResponse ?? [];
    return tenants.map((tenant) => ({
      ...tenant,
      roles: (tenant?.roles ?? []).filter((r) =>
        allowedRoleIds.includes(r.roleId)
      ),
    }));
  }, [authResponse, allowedRoleIds]);

  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setSelectedTenant(null);
      setSelectedRole(null);
    }
  }, [open]);

  // Auto-select or bypass based on tenant/role counts (uses filtered roles)
  useEffect(() => {
    if (!open) return;

    const tenants = visibleTenants ?? [];
    if (tenants.length === 1) {
      const tenant = tenants[0];
      const roles = tenant?.roles ?? [];
      if (roles.length === 1) {
        // Single tenant & single role: confirm and close
        const role = roles[0];
        setSelectedTenant(tenant);
        setSelectedRole(role);
        callbackFunction(
          tenant.tenantId,
          tenant.tenantName,
          role.roleId,
          role.roleName
        );
        onClose();
      } else if (roles.length > 1) {
        // Single tenant & multiple roles: preselect tenant and open role selection
        setSelectedTenant(tenant);
        setActiveStep(1);
      }
    } else {
      // Multiple tenants: start at tenant selection
      setActiveStep(0);
    }
  }, [open, visibleTenants, callbackFunction, onClose]);

  const handleTenantSelect = (tenant: TenantData) => {
    setSelectedTenant(tenant);
    const roles = tenant?.roles ?? [];
    if (roles.length === 1) {
      const role = roles[0];
      setSelectedRole(role);
      // Auto-confirm when only one role exists for the selected tenant
      callbackFunction(
        tenant.tenantId,
        tenant.tenantName,
        role.roleId,
        role.roleName
      );
      onClose();
      return;
    } else {
      setSelectedRole(null);
    }
    setActiveStep(1);
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
  };

  const handleBack = () => {
    if (activeStep === 1) {
      setActiveStep(0);
      setSelectedTenant(null);
      setSelectedRole(null);
    }
  };

  const handleConfirm = () => {
    if (selectedTenant && selectedRole) {
      // Call the callback function with the 4 required parameters
      callbackFunction(
        selectedTenant.tenantId,
        selectedTenant.tenantName,
        selectedRole.roleId,
        selectedRole.roleName
      );

      onClose();
    }
  };

  const steps = [
    t('SWITCH_ACCOUNT.STEP_SELECT_TENANT', { defaultValue: 'Select Tenant' }),
    t('SWITCH_ACCOUNT.STEP_SELECT_ROLE', { defaultValue: 'Select Role' }),
  ];

  const renderTenantSelection = () => (
    <Box>
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontWeight: 700,
          color: theme.palette.text.primary,
        }}
      >
        <Business color="primary" />
        {t('SWITCH_ACCOUNT.SELECT_YOUR_ORGANIZATION', {
          defaultValue: 'Select Your Organization',
        })}
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 3, fontWeight: 500 }}
      >
        {t('SWITCH_ACCOUNT.CHOOSE_ORGANIZATION_SUBTEXT', {
          defaultValue: 'Choose the organization you want to access',
        })}
      </Typography>

      <Box sx={{ flexGrow: 1 }}>
        <Box component={require('@mui/material').Grid} container spacing={2}>
          {visibleTenants?.map((tenant) => (
            <Box
              key={tenant.tenantId}
              component={require('@mui/material').Grid}
              item
              xs={12}
              sm={6}
            >
              <Card
                sx={{
                  cursor: 'pointer',
                  borderRadius: 2,
                  border: selectedTenant?.tenantId === tenant.tenantId ? 2 : 1,
                  borderColor:
                    selectedTenant?.tenantId === tenant.tenantId
                      ? 'primary.main'
                      : 'divider',
                  '&:hover': {
                    boxShadow: 4,
                  },
                  transition: 'box-shadow 0.2s ease',
                }}
                onClick={() => handleTenantSelect(tenant)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                      }}
                    >
                      <Business />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        color={theme.palette.text.primary}
                      >
                        {tenant.tenantName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {tenant.tenantType}
                      </Typography>

                      {/* <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        {tenant.roles.map((role) => (
                          <Chip
                            key={role.roleId}
                            label={role.roleName}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box> */}
                    </Box>
                    {selectedTenant?.tenantId === tenant.tenantId && (
                      <CheckCircle color="primary" />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );

  const renderRoleSelection = () => (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={handleBack} size="small">
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h4"
          fontWeight={700}
          color={theme.palette.text.primary}
        >
          {`${t('SWITCH_ACCOUNT.SELECT_ROLE_FOR', {
            defaultValue: 'Select Role for',
          })} ${selectedTenant?.tenantName ?? ''}`}
        </Typography>
      </Box>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 3, fontWeight: 500 }}
      >
        {t('SWITCH_ACCOUNT.CHOOSE_ROLE_SUBTEXT', {
          defaultValue: 'Choose the role you want to access',
        })}
      </Typography>

      <Box sx={{ flexGrow: 1 }}>
        {selectedTenant?.roles?.length ? (
          <Box component={require('@mui/material').Grid} container spacing={2}>
            {selectedTenant?.roles?.map((role) => (
              <Box
                key={role.roleId}
                component={require('@mui/material').Grid}
                item
                xs={12}
                sm={6}
              >
                <Card
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 2,
                    border: selectedRole?.roleId === role.roleId ? 2 : 1,
                    borderColor:
                      selectedRole?.roleId === role.roleId
                        ? 'primary.main'
                        : 'divider',
                    '&:hover': {
                      boxShadow: 4,
                    },
                    transition: 'box-shadow 0.2s ease',
                  }}
                  onClick={() => handleRoleSelect(role)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: 'warning.main',
                          color: 'warning.contrastText',
                        }}
                      >
                        <Person />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={700}
                          color={theme.palette.text.primary}
                        >
                          {role.roleName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('SWITCH_ACCOUNT.ROLE_ID_LABEL', {
                            defaultValue: 'Role ID:',
                          })}{' '}
                          {role.roleId}
                        </Typography>
                      </Box>
                      {selectedRole?.roleId === role.roleId && (
                        <CheckCircle color="primary" />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>
            {t('COMMON.UNAUTHORIZED', {
              defaultValue: 'You are not authorise to access this site',
            })}
          </Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 6,
          m: { xs: 1, sm: 2, md: 3 },
          width: {
            xs: 'calc(100vw - 16px)',
            sm: 'calc(100vw - 32px)',
            md: 'calc(100vw - 48px)',
          },
          height: {
            xs: 'calc(100vh - 16px)',
            sm: 'calc(100vh - 32px)',
            md: 'calc(100vh - 48px)',
          },
          maxWidth: 'none',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Person color="primary" />
          <Typography
            variant="h1"
            fontWeight={700}
            color={theme.palette.text.primary}
            mt={2}
          >
            {t('SWITCH_ACCOUNT.TITLE', { defaultValue: 'Switch Account' })}
          </Typography>
        </Box>
        <Stepper
          activeStep={activeStep}
          sx={{
            mt: 2,
            '.MuiStepLabel-label': { fontWeight: 600, fontSize: '1.25rem' },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 3 }}>
        {activeStep === 0 && renderTenantSelection()}
        {activeStep === 1 && renderRoleSelection()}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, gap: 1.5 }}>
        {activeStep === 1 && (
          <Button
            onClick={handleBack}
            color="inherit"
            startIcon={<ArrowBack />}
          >
            {t('COMMON.BACK', { defaultValue: 'Back' })}
          </Button>
        )}
        <Button onClick={onClose} color="inherit">
          {t('COMMON.CANCEL', { defaultValue: 'Cancel' })}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          size="large"
          disabled={!selectedTenant || !selectedRole}
        >
          {t('SWITCH_ACCOUNT.CONFIRM_SELECTION', {
            defaultValue: 'Confirm Selection',
          })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SwitchAccountDialog;
