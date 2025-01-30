import React, { useState } from 'react';
import { Box, Tooltip, useTheme } from '@mui/material';
import DeleteConfirmation from './DeleteConfirmation';

interface ActionCellProps {
  rowData?: any;
}

const ActionIcon: React.FC<ActionCellProps> = ({
  rowData,
  //  onEdit,
}) => {
  const theme = useTheme<any>();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',
        alignItems: 'center',
      }}
    >
      <Tooltip title={'Delete'}>
        <Box
          onClick={() => {
            console.log(rowData);

            handleOpen();
          }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: '#F8EFE7',
            p: '10px',
          }}
        >
          <img src={'/delete.png'} height="20px" alt="Image" />
        </Box>
      </Tooltip>

      <DeleteConfirmation
        open={open}
        handleClose={handleClose}
        rowData={rowData}
      />
    </Box>
  );
};

export default ActionIcon;
