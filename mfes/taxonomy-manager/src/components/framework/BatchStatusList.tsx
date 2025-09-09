import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import type { BatchStatusListProps } from '../../interfaces/BaseInterface';

const BatchStatusList: React.FC<BatchStatusListProps> = ({
  title,
  items,
  statuses,
  onRetry,
  typeLabel,
  getItemLabel,
}) => {
  if (!items.length) return null;
  return (
    <Box mt={4}>
      <Typography variant="subtitle2" fontSize={16} fontWeight={600} mb={2}>
        {title}
      </Typography>
      <List>
        {items.map((item, idx) => {
          let statusDisplay;
          if (statuses[idx]?.status === 'success') {
            statusDisplay = (
              <span style={{ color: 'green' }}>Successfully created</span>
            );
          } else if (statuses[idx]?.status === 'pending') {
            statusDisplay = <CircularProgress size={16} />;
          } else {
            statusDisplay = (
              <span style={{ color: 'red' }}>
                Failed
                {statuses[idx]?.message ? ` - ${statuses[idx]?.message}` : ''}
              </span>
            );
          }
          return (
            <ListItem
              key={item.code + idx}
              sx={{ display: 'flex', alignItems: 'center', py: 1, gap: 1 }}
            >
              <Typography variant="body2" sx={{ flex: 1 }}>
                {typeLabel}{' '}
                <b>{getItemLabel ? getItemLabel(item) : item.name}</b>:{' '}
                {statusDisplay}
              </Typography>
              {statuses[idx]?.status === 'failed' && (
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={() => onRetry(idx)}
                >
                  Retry
                </Button>
              )}
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default BatchStatusList;
