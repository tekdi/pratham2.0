import React from "react";
import { Link } from "@mui/material";
import Image from "next/image";
import LogoDark from "../../../../public/images/Logo.svg";

const LogoIcon = () => {
  return (
    <>
      <Image src={LogoDark} alt={"LogoDark"} width={100} height={100} />
    </>
  );
};

export default LogoIcon;
