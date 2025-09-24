import React, { useState } from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';
import SwitchAccountDialog from './SwitchAccount';

// Example usage of the SwitchAccountDialog component
const ExampleUsage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Sample auth response data - now directly an array of tenant data
  const sampleAuthResponse = [
    {
      tenantName: 'Second Chance Program',
      tenantId: 'ef99949b-7f3a-4a5f-806a-e67e683e38f3',
      templateId: 'cm96nsvuf0002lh0i0uonf2dd',
      contentFramework: null,
      collectionFramework: null,
      channelId: null,
      userTenantMappingId: '32f310ff-842e-4977-85b2-ae5c8f7bfdfc',
      params: {
        uiConfig: {
          showSignIn: true,
          showSignup: false,
          showContent: ['contents', 'courses'],
          showProgram: true,
          isDoTracking: true,
          isEditProfile: false,
          isTrackingShow: true,
          isCompleteProfile: false,
        },
      },
      roles: [
        {
          roleId: '4a3493aa-a4f7-4e2b-b141-f213084b5599',
          roleName: 'State Lead',
        },
      ],
      tenantType: 'smartclassroom',
    },
    {
      tenantName: 'Digital Learning Initiative',
      tenantId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      templateId: 'template123',
      contentFramework: 'framework1',
      collectionFramework: 'collection1',
      channelId: 'channel1',
      userTenantMappingId: 'mapping123',
      params: {
        uiConfig: {
          showSignIn: true,
          showSignup: true,
          showContent: ['contents', 'courses', 'assessments'],
          showProgram: true,
          isDoTracking: true,
          isEditProfile: true,
          isTrackingShow: true,
          isCompleteProfile: true,
        },
      },
      roles: [
        {
          roleId: 'role123',
          roleName: 'Teacher',
        },
        {
          roleId: 'role456',
          roleName: 'Coordinator',
        },
      ],
      tenantType: 'education',
    },
  ];

  const handleCallbackFunction = (
    tenantId: string,
    tenantName: string,
    roleId: string,
    roleName: string
  ) => {
    console.log('Callback Function Called:', {
      tenantId,
      tenantName,
      roleId,
      roleName,
    });

    // Here you can handle the selection, e.g., redirect to a URL
    // or update your application state
    // Example: window.location.href = `/dashboard?tenantId=${tenantId}&roleId=${roleId}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Switch Account Dialog Example
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          How to use the SwitchAccountDialog component:
        </Typography>
        <Typography variant="body2" component="div">
          <pre>{`
import SwitchAccountDialog from './SwitchAccount';

<SwitchAccountDialog
  open={dialogOpen}
  onClose={() => setDialogOpen(false)}
  callbackFunction={handleCallbackFunction}
  authResponse={sampleAuthResponse}
/>
          `}</pre>
        </Typography>
      </Paper>

      <Button
        variant="contained"
        onClick={() => setDialogOpen(true)}
        size="large"
      >
        Open Switch Account Dialog
      </Button>

      <SwitchAccountDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        callbackFunction={handleCallbackFunction}
        authResponse={sampleAuthResponse}
      />
    </Box>
  );
};

export default ExampleUsage;
