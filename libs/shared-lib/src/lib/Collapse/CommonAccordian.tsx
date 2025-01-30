import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
interface CommonAccordionProps {
  identifier: string;
  title: string;
  content: [];
  data: NestedItem[]; // Nested data structure
  actions?: { label: string; onClick: () => void }[];
  defaultExpanded?: boolean;
  showIcon?: boolean;
  icon?: React.ReactNode;
  status?: string;
}

interface NestedItem {
  identifier: string;
  name: string;
  streamingUrl?: string;
  downloadUrl?: string;
  children?: NestedItem[];
  leafNodesCount?: number;
}

// Recursive function to render nested data
const renderNestedData = (
  data: NestedItem[],
  expandedItems: Set<string>, // Track expanded items by name
  toggleExpanded: (name: string) => void, // Toggle expand/collapse by name
  showIcon: boolean,
  icon: React.ReactNode,
  status: string
) => {
  return data?.map((val: any) => {
    return (
      <Box
        key={val.identifier}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          // margin: '10px',
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          {val?.name}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          {val?.leafNodesCount}
        </Typography>

        {/* Render nested children if expanded */}
        <Box sx={{ paddingLeft: '0px' }}>
          {renderNestedData(
            val?.children,
            expandedItems,
            toggleExpanded,
            showIcon,
            icon,
            status
          )}
        </Box>
      </Box>
    );
  });
};

// Main component that renders the Accordion
export const CommonAccordian: React.FC<CommonAccordionProps> = ({
  identifier,
  title,
  content = [],
  data,
  actions = [],
  defaultExpanded = false,
  showIcon = false,
  icon = <CheckCircleIcon />,
  status,
}) => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    // Navigate to /content with optional data or query params
    navigate(`/content`, { state: { identifier, data } });
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', margin: '10px' }}>
      <Accordion defaultExpanded={defaultExpanded}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`${identifier}-content`}
          id={`${identifier}-header`}
          aria-expanded={defaultExpanded}
          sx={{
            backgroundColor: '#E9DDFF',
          }}
        >
          <Typography component="h3" variant="subtitle1">
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              width: '100%',
            }}
          >
            {/* <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {data?.name}
            </Typography> */}
            <Typography
              variant="body1"
              sx={{ fontWeight: 'bold' }}
              onClick={handleNavigate}
            >
              {/* @ts-ignore */}
              {data?.leafNodesCount} Resources
            </Typography>

            {/* Render nested children if expanded */}
          </Box>
        </AccordionDetails>
        {actions.length > 0 && (
          <AccordionActions>
            {actions.map((action) => (
              <Button key={action.label} onClick={action.onClick}>
                {action.label}
              </Button>
            ))}
          </AccordionActions>
        )}
      </Accordion>
    </Box>
  );
};

export default CommonAccordian;
