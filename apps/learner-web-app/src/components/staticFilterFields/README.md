# StaticFilterFields Component

A React component that retrieves and displays static filter fields based on the channelId stored in localStorage.

## Features

- Automatically retrieves `channelId` from localStorage
- Calls the `staticFilterContent` API with the channelId
- Displays available filter options as checkboxes
- Handles loading and error states
- Responsive design with CSS modules

## Usage

```tsx
import { StaticFilterFields } from './components/staticFilterFields';

// Basic usage
function MyPage() {
  return (
    <div>
      <h1>My Page</h1>
      <StaticFilterFields />
    </div>
  );
}

// With callback to handle filter changes
function MyPageWithCallback() {
  const handleFilterChange = (filters) => {
    console.log('Available filters:', filters);
  };

  return (
    <div>
      <h1>My Page</h1>
      <StaticFilterFields 
        onFilterChange={handleFilterChange}
        className="my-custom-class"
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onFilterChange` | `(filters: FilterField[]) => void` | `undefined` | Callback function called when filter fields are loaded |
| `className` | `string` | `''` | Additional CSS class name for styling |

## Requirements

- `channelId` must be stored in localStorage
- The component uses the `staticFilterContent` function from `@shared-lib-v2/utils/AuthService`

## States

- **Loading**: Shows "Loading filters..." message
- **Error**: Displays error message if channelId is missing or API call fails
- **Success**: Renders filter fields with checkboxes for each option

## CSS Classes

The component uses CSS modules with the following classes:
- `.staticFilterFields` - Main container
- `.filterContainer` - Inner container with white background
- `.filterField` - Individual filter field container
- `.filterOptions` - Container for filter options
- `.filterOption` - Individual checkbox option
- `.loading` - Loading state styling
- `.error` - Error state styling 