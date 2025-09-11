import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  ArrowBack,
  Business,
  School,
  CheckCircle,
  Person,
} from '@mui/icons-material';

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
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTenant, setSelectedTenant] = useState<TenantData | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setSelectedTenant(null);
      setSelectedRole(null);
    }
  }, [open]);

  const handleTenantSelect = (tenant: TenantData) => {
    setSelectedTenant(tenant);
    setSelectedRole(null);
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

  const steps = ['Select Tenant', 'Select Role'];

  const renderTenantSelection = () => (
    <Box>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <Business color="primary" />
        Select Your Organization
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose the organization you want to access
      </Typography>

      <List>
        {authResponse?.map((tenant, index) => (
          <Card
            key={tenant.tenantId}
            sx={{
              mb: 2,
              cursor: 'pointer',
              border: selectedTenant?.tenantId === tenant.tenantId ? 2 : 1,
              borderColor:
                selectedTenant?.tenantId === tenant.tenantId
                  ? 'primary.main'
                  : 'divider',
              '&:hover': {
                boxShadow: 2,
              },
            }}
            onClick={() => handleTenantSelect(tenant)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Business />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">{tenant.tenantName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tenant.tenantType}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    {tenant.roles.map((role) => (
                      <Chip
                        key={role.roleId}
                        label={role.roleName}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
                {selectedTenant?.tenantId === tenant.tenantId && (
                  <CheckCircle color="primary" />
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </List>
    </Box>
  );

  const renderRoleSelection = () => (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={handleBack} size="small">
          <ArrowBack />
        </IconButton>
        <Typography variant="h6">
          Select Role for {selectedTenant?.tenantName}
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose the role you want to access
      </Typography>

      <List>
        {selectedTenant?.roles?.map((role) => (
          <Card
            key={role.roleId}
            sx={{
              mb: 2,
              cursor: 'pointer',
              border: selectedRole?.roleId === role.roleId ? 2 : 1,
              borderColor:
                selectedRole?.roleId === role.roleId
                  ? 'primary.main'
                  : 'divider',
              '&:hover': {
                boxShadow: 2,
              },
            }}
            onClick={() => handleRoleSelect(role)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <Person />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">{role.roleName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Role ID: {role.roleId}
                  </Typography>
                </Box>
                {selectedRole?.roleId === role.roleId && (
                  <CheckCircle color="primary" />
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </List>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '500px' },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Person color="primary" />
          Switch Account
        </Box>
        <Stepper activeStep={activeStep} sx={{ mt: 2 }}>
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

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        {activeStep === 1 && (
          <Button
            onClick={handleBack}
            color="inherit"
            startIcon={<ArrowBack />}
          >
            Back
          </Button>
        )}
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!selectedTenant || !selectedRole}
        >
          Confirm Selection
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SwitchAccountDialog;
