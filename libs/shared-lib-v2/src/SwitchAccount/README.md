# SwitchAccountDialog Component

A comprehensive Material-UI dialog component for tenant and role selection with callback function support.

## Features

- **Two-step selection process**: Tenant selection followed by role selection
- **Modern UI design**: Clean, intuitive interface with Material-UI components
- **Callback function support**: Calls provided function with selected parameters
- **TypeScript support**: Fully typed with comprehensive interfaces
- **Responsive design**: Works on all screen sizes
- **Loading states**: Smooth loading indicators during data fetching
- **Role management**: Displays and handles multiple roles per tenant

## Props

| Prop               | Type                                               | Required | Description                                  |
| ------------------ | -------------------------------------------------- | -------- | -------------------------------------------- |
| `open`             | `boolean`                                          | Yes      | Controls dialog visibility                   |
| `onClose`          | `() => void`                                       | Yes      | Callback when dialog is closed               |
| `callbackFunction` | `(tenantId, tenantName, roleId, roleName) => void` | Yes      | Callback function with 4 required parameters |
| `authResponse`     | `TenantData[]`                                     | Yes      | Array of tenant data objects                 |

## Data Structure

### TenantData Interface

```typescript
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
```

### Role Interface

```typescript
interface Role {
  roleId: string;
  roleName: string;
}
```

## Usage Example

```tsx
import React, { useState } from 'react';
import { Button } from '@mui/material';
import { SwitchAccountDialog } from './SwitchAccount';

const MyComponent = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const authResponse = [
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
  ];

  const handleCallbackFunction = (tenantId, tenantName, roleId, roleName) => {
    console.log('Callback Function Called:', { tenantId, tenantName, roleId, roleName });
    // Handle the selection - e.g., redirect to dashboard
    // window.location.href = `/dashboard?tenantId=${tenantId}&roleId=${roleId}`;
  };

  return (
    <>
      <Button onClick={() => setDialogOpen(true)}>Switch Account</Button>

      <SwitchAccountDialog open={dialogOpen} onClose={() => setDialogOpen(false)} callbackFunction={handleCallbackFunction} authResponse={authResponse} />
    </>
  );
};
```

## Callback Function

The component calls the provided `callbackFunction` with the following 4 required parameters:

- `tenantId`: Selected tenant ID
- `tenantName`: Selected tenant name
- `roleId`: Selected role ID
- `roleName`: Selected role name

The callback function is called when the user confirms their selection. You can use this function to:

- Redirect to a specific URL with the selected parameters
- Update your application state
- Make API calls with the selected tenant/role information
- Perform any other action based on the selection

Example callback function:

```typescript
const handleCallbackFunction = (tenantId, tenantName, roleId, roleName) => {
  // Redirect to dashboard with parameters
  window.location.href = `/dashboard?tenantId=${tenantId}&roleId=${roleId}`;

  // Or update application state
  setSelectedTenant({ tenantId, tenantName, roleId, roleName });

  // Or make an API call
  // api.updateUserContext({ tenantId, roleId });
};
```

## Customization

The component uses Material-UI theming and can be customized through:

- Theme overrides
- Custom styling via `sx` prop
- Custom icons and colors
- Program data source (currently uses mock data)

## Dependencies

- React
- Material-UI (MUI)
- TypeScript

## Notes

- The component currently uses mock program data. Replace the `mockPrograms` array with actual API calls in production.
- The loading state is simulated with a 1-second timeout. Replace with actual API loading logic.
- All tenant roles are displayed as chips for easy selection.
- Inactive programs are shown but not selectable.
