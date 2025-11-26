import React, { useState } from "react";
import { Box, Typography, Tooltip, useTheme } from "@mui/material";
import DeleteConfirmation from "./DeleteConfirmation";
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import PublishIcon from '@mui/icons-material/Publish';

interface ActionCellProps {
  rowData?: any;
}

const ActionIcon: React.FC<ActionCellProps> = ({
  rowData,
  //  onEdit,
}) => {
  const theme = useTheme<any>();
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState<string>('delete');

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = (type: string) => {
    setActionType(type);
    setOpen(true);
  };

  // Hide delete button if prevStatus is "Live" and status is "Draft"
  console.log("rowData====>", rowData);
  const shouldHideDelete = rowData?.prevStatus === "Live" && (rowData?.status === "Draft" || rowData?.status === "Review");

  if (shouldHideDelete) {
    return null; // Don't render anything if delete should be hidden
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "20px",
        alignItems: "center",
      }}
    >
      <Tooltip title="Delete">
        <Box
          onClick={() => {
            console.log(rowData);
            handleOpen('delete');
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

      {rowData?.status === 'Live' && (
        <Tooltip title="Unpublish">
          <Box
            onClick={() => {
              console.log(rowData);
              handleOpen('unpublish');
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
            <UnpublishedIcon sx={{ color: 'red' }} />
          </Box>
        </Tooltip>
      )}

      {rowData?.status === 'Unlisted' && (
        <Tooltip title="Publish">
          <Box
            onClick={() => {
              console.log(rowData);
              handleOpen('publish');
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
            <PublishIcon sx={{ color: 'green' }} />
          </Box>
        </Tooltip>
      )}

      <DeleteConfirmation
        open={open}
        handleClose={handleClose}
        rowData={rowData}
        actionType={actionType}
      />
    </Box>
  );
};

export default ActionIcon;
