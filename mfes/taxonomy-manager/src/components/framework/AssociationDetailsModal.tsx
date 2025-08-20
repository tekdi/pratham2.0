import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import type { AssociationDetailsModalProps } from '../../interfaces/AssociationInterface';

// This component renders a modal displaying association details for a specific term and category.
// It includes a list of categories, each with an expandable section showing associated terms.
// The modal can be opened or closed, and it allows users to click on categories to expand or collapse their details.
// The modal header displays the term and category names, and the categories are displayed as buttons with an expandable icon indicating whether the category is expanded or collapsed.
// The categories are passed as props, along with the term and category names, and a callback function to handle category clicks. The expanded category state is also managed to control which category's terms are currently visible.
const AssociationDetailsModal: React.FC<AssociationDetailsModalProps> = ({
  open,
  onClose,
  categories,
  termName,
  categoryName,
  expandedCategory,
  onCategoryClick,
}) => (
  <Modal open={open} onClose={onClose}>
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: '0px 2px 8px rgba(0,0,0,0.06)',
        p: 4,
        borderRadius: '12px',
        minWidth: 350,
        maxWidth: '90vw',
        outline: 'none',
        maxHeight: '90vh',
        overflow: 'visible',
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h2" component="div" color="text.primary">
          {termName && categoryName ? (
            <span>
              Association for Term{' '}
              <span style={{ fontWeight: 600, color: '#FDBE16' }}>
                {termName}
              </span>{' '}
              of Category{' '}
              <span style={{ fontWeight: 600, color: '#FDBE16' }}>
                {categoryName}
              </span>
            </span>
          ) : (
            'All Categories'
          )}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            ml: 2,
            bgcolor: 'rgba(0,0,0,0.04)',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.08)',
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box
        sx={{
          maxHeight: '60vh',
          overflowY: 'auto',
          pr: 1,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {categories.map((cat) => (
          <Box key={cat.identifier} mb={2}>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                textAlign: 'left',
                fontWeight: 500,
                bgcolor: 'rgba(248, 239, 231, 0.5)',
                color: 'text.primary',
                mb: 1,
                justifyContent: 'space-between',
                border: '1px solid rgba(30, 27, 22, 0.12)',
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'rgba(248, 239, 231, 0.8)',
                  borderColor: 'primary.main',
                },
              }}
              endIcon={
                <span
                  style={{
                    display: 'inline-block',
                    transform:
                      expandedCategory === cat.identifier
                        ? 'rotate(90deg)'
                        : 'none',
                    transition: 'transform 0.2s',
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 8L10 12L14 8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              }
              onClick={() => onCategoryClick(cat.identifier)}
            >
              <span style={{ color: 'inherit', fontWeight: 600 }}>
                {cat.name}
              </span>
            </Button>
            {expandedCategory === cat.identifier && (
              <Box pl={2} py={1}>
                {cat.terms && cat.terms.length > 0 ? (
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 18,
                      listStyleType: 'disc',
                    }}
                  >
                    {cat.terms.map((term) => (
                      <li
                        key={term.identifier}
                        style={{
                          padding: '4px 0',
                          color: '#1E1B16',
                          fontSize: '14px',
                          lineHeight: '20px',
                        }}
                      >
                        <span style={{ color: '#1E1B16' }}>{term.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No terms
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  </Modal>
);

export default AssociationDetailsModal;
