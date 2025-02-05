import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  SelectChangeEvent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Search, ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import CustomStepper from "./Steper";
import { useTranslation } from "next-i18next";

interface FilterSearchBarProps {
  grade: string;
  medium: string;
  searchQuery: string;
  handleGradeChange: (event: SelectChangeEvent<string>) => void;
  handleMediumChange: (event: SelectChangeEvent<string>) => void;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedOption: string;
  handleDropdownChange: (event: SelectChangeEvent<string>) => void;
  card?: {
    state: string;
    boardsUploaded: number;
    totalBoards: number;
  };
  selectFilter?: string;
  onBackClick?: () => void;
  showGradeMedium?: boolean;
  showFoundaitonCourse?: boolean;
}

const FilterSearchBar: React.FC<FilterSearchBarProps> = ({
  grade,
  medium,
  searchQuery,
  handleGradeChange,
  handleMediumChange,
  handleSearchChange,
  selectedOption,
  handleDropdownChange,
  card,
  selectFilter = "",
  onBackClick = () => {},
  showGradeMedium = true,
  showFoundaitonCourse = true,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

  return (
    <>
      {showFoundaitonCourse && (
        <Box>
          <Typography
            variant="h1"
            sx={{
              fontSize: "24px",
              fontWeight: "bold",
              mb: 2,
            }}
          >
            {t("SIDEBAR.FOUNDATION_COURSE")}
          </Typography>
        </Box>
      )}
     

      {card && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            mb: 2,
            flexWrap: "wrap",
          }}
        >
          <IconButton onClick={onBackClick}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h2"
            sx={{
              fontSize: "24px",
            }}
          >
            {card.state}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <CustomStepper completedSteps={card.boardsUploaded} />
            <Typography sx={{ fontSize: "14px", color: "#7C766F" }}>
              ({card.boardsUploaded}/{card.totalBoards}{" "}
              {t("COURSE_PLANNER.BOARDS_FULLY_UPLOADED")})
            </Typography>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          gap: "8px",
          width: "100%",
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <TextField
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={t("COURSE_PLANNER.SEARCH")}
          variant="outlined"
          size="small"
          sx={{
            flexGrow: 1,
            width: isSmallScreen ? "100%" : "calc(80% - 16px)",
            height: "48px",
            borderRadius: "28px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "28px",
              height: "100%",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <FormControl
          variant="outlined"
          size="small"
          sx={{
            minWidth: isSmallScreen ? "100px" : "120px",
            padding: "3px",
          }}
        >
          <InputLabel id="filter-label">
            {t("COURSE_PLANNER.FILTER")}
          </InputLabel>
          <Select
            labelId="filter-label"
            value={selectFilter}
            onChange={handleDropdownChange}
            label="Filter"
          >
            <MenuItem value="Option 1">Option 1</MenuItem>
            <MenuItem value="Option 2">Option 2</MenuItem>
            <MenuItem value="Option 3">Option 3</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </>
  );
};

export default FilterSearchBar;
