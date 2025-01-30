import { Box, Typography } from "@mui/material";
import React from "react";

interface NoDataFoundProps {
  title?: string;
  bgColor?: string;
}

const NoDataFound: React.FC<NoDataFoundProps> = ({
  title = "No Data Found",
  bgColor,
}) => {
  return (
    <Box
      sx={{
        m: "1.125rem",
        width: "100%",
        bgcolor: bgColor ?? "inherit",
      }}
    >
      <Typography
        style={{ fontWeight: "500", textAlign: "center", width: "100%" }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default NoDataFound;
