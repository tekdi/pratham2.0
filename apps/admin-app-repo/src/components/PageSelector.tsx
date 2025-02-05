import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useTranslation } from "next-i18next";
import React from "react";


export interface IPageSelectorProps {
  handleChange: (event: SelectChangeEvent) => void;
  pageSize: number;
  options: number[];
}

const PageSizeSelector = ({ handleChange, pageSize, options }: any) => {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="page-size-selector-label">{t("COMMON.PAGE_SIZE")}</InputLabel>
      <Select
        labelId="page-size-selector-label"
        id="page-size-selector"
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        value={pageSize}
        label={t("COMMON.PAGE_SIZE")}
        onChange={handleChange}
      >
        {options?.map((option: any) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default PageSizeSelector;
