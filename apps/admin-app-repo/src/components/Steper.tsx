import React from "react";
import { Box } from "@mui/material";

const CustomStepper = ({ completedSteps = 0 }) => {
  const totalSteps = 3;
  const stepWidth = "24px";
  const stepHeight = "4px";

  return (
    <Box sx={{ display: "flex", gap: "4px", alignItems: "center" }}>
      {[...Array(totalSteps)]?.map((_, index) => (
        <Box
          key={index}
          sx={{
            width: stepWidth,
            height: stepHeight,
            backgroundColor: index < completedSteps ? "#06A816" : "#E2D9CC",
            borderRadius: "2px",
          }}
        />
      ))}
    </Box>
  );
};

export default CustomStepper;
