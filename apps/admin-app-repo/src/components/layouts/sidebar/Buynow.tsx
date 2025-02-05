import React from "react";
import { Box } from "@mui/material";
import sidebarBuynowsvg from "../../../../public/images/backgrounds/sidebar-buynow-bg.svg";

const Buynow = () => (
  <Box pb={5} mt={5}>
    <Box
      pl={3}
      pr={3}
      m={1}
      textAlign="center"
      sx={{
        backgroundColor: (theme) => theme.palette.secondary.light,
        borderRadius: "10px",
        overflow: "hidden",
      }}
    ></Box>
  </Box>
);
export default Buynow;
