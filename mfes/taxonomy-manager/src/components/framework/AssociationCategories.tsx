import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import type { AssociationCategoriesProps } from '../../interfaces/AssociationInterface';

// This component renders a list of association categories as badges.
// It accepts an array of categories, a term name, a category name, and a callback function to handle badge clicks.
// The badges are displayed in a flex container, and if there are more than four categories,
// a "Show More" button is displayed to allow users to view additional categories.
// Each badge is clickable and triggers the provided callback function with the relevant parameters.
const AssociationCategories: React.FC<AssociationCategoriesProps> = ({
  categories,
  termName,
  categoryName,
  onBadgeClick,
}) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
    {categories.slice(0, 4).map((cat) => (
      <Button
        key={cat.identifier}
        variant="text"
        size="small"
        sx={{
          minWidth: 0,
          p: 0,
          lineHeight: 1,
          textTransform: 'none',
          display: 'inline-flex',
          alignItems: 'center',
        }}
        aria-label={`Show associations for ${cat.name}`}
      >
        <Chip
          label={cat.name}
          size="small"
          onClick={() =>
            onBadgeClick(categories, termName, categoryName, cat.identifier)
          }
          sx={{
            backgroundColor: 'transparent',
            borderColor: 'primary.main',
            color: 'primary.main',
            fontWeight: 500,
            fontSize: '12px',
            height: '24px',
            mr: 0.5,
            '&:hover': {
              backgroundColor: 'rgba(253, 190, 22, 0.05)',
              borderColor: 'primary.dark',
            },
          }}
        />
      </Button>
    ))}
    {categories.length > 4 && (
      <Button
        size="small"
        variant="outlined"
        sx={{
          ml: 1,
          px: 2,
          py: 0.5,
          fontSize: 12,
          borderColor: 'primary.main',
          color: 'primary.main',
          '&:hover': {
            borderColor: 'primary.dark',
            backgroundColor: 'rgba(253, 190, 22, 0.05)',
          },
        }}
        onClick={() => onBadgeClick(categories, termName, categoryName)}
      >
        Show More
      </Button>
    )}
  </Box>
);

export default AssociationCategories;
