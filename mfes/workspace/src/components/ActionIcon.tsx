import React, { useState } from "react";
import { Box, Typography, Tooltip, useTheme } from "@mui/material";
import DeleteConfirmation from "./DeleteConfirmation";

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

  // Hide delete button if prevStatus is "Live" and status is "Draft"
  const shouldHideDelete = rowData?.prevStatus === "Live" && rowData?.status === "Draft";

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
      <Tooltip title={"Delete"}>
        <Box
          onClick={() => {
            console.log(rowData);

            handleOpen();
          }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            backgroundColor: "#F8EFE7",
            p: "10px",
          }}
        >
          <img src={"/delete.png"} height="20px" alt="Image" />
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
