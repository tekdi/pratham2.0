import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Checkbox,
  FormControlLabel,
  Paper,
  Grid,
  ButtonBase,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getStateBlockDistrictList } from "mfes/youthNet/src/services/youthNet/Dashboard/VillageServices";
// import DynamicForm from '../../components/DynamicForm/DynamicForm';

const VillageSelection = ({  blockId, blockName, onBack, selectedVillages: initialSelectedVillages, onSelectionChange }: any) => {
  const [selectedVillages, setSelectedVillages] = useState<number[]>(initialSelectedVillages || []);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [villages, setVillages] = useState<any>([]);

  const categorizedVillages = villages
  .sort((a: any, b: any) => a.name.localeCompare(b.name))
  .reduce((acc: any, village: any) => {
    const firstLetter = village.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(village);
    return acc;
  }, {} as Record<string, { id: number; name: string }[]>);
  useEffect(() => {
    setSelectedVillages(initialSelectedVillages || []);
  }, [initialSelectedVillages]);

  const handleToggle = (villageId: number) => {
    setSelectedVillages((prev) => {
      const newSelection = prev.includes(villageId)
        ? prev.filter((id) => id !== villageId)
        : [...prev, villageId];

      onSelectionChange(newSelection);
      return newSelection;
    });
  };

  const handleSelectAll = (event: any) => {
    const newSelection = event.target.checked ? villages.map((v: any) => v.id) : [];
    setSelectedVillages(newSelection);
    onSelectionChange(newSelection);
  };

  const filteredVillages = Object.keys(categorizedVillages)
    .sort()
    .reduce((acc, letter) => {
      const villagesInCategory = categorizedVillages[letter]
        .filter((village: any) =>
          village.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a: any, b: any) => a.name.localeCompare(b.name));

      if (villagesInCategory.length) {
        acc[letter] = villagesInCategory;
      }
      return acc;
    }, {} as Record<string, { id: number; name: string }[]>);
 useEffect(() => {
    const getVillageList = async () => {
      try {
       
          const controllingfieldfk = [blockId];
          const fieldName = 'village';
          const villageResponce = await getStateBlockDistrictList({
            controllingfieldfk,
            fieldName,
          });

          const transformedVillageData = villageResponce?.result?.values?.map(
            (item: any) => ({
              id: item?.value,
              name: item?.label,
            })
          );

          setVillages(transformedVillageData);
        
      } catch (error) {
        console.log(error);
      }
    };
    getVillageList();
  }, []);
  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Box display="flex" alignItems="center" gap={1} mt={2} sx={{ border: "1px solid #ccc", borderRadius: "8px", p: 1 }}>
        <SearchIcon color="disabled" />
        <TextField
          variant="standard"
          placeholder="Search Village.."
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{ disableUnderline: true }}
        />
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Box sx={{ fontSize: "14px", fontWeight: "500", color:'#1F1B13'}}>{blockName} Block</Box>
        {/* <IconButton>
          <SortIcon />
        </IconButton> */}
      </Box>

      <FormControlLabel
        control={<Checkbox onChange={handleSelectAll} checked={selectedVillages.length === villages.length} />}
        label={`Select All (${villages.length} Villages)`}
        sx={{ mt: 1, mb: 2, backgroundColor: "#F5F5F5", p: 1, borderRadius: "8px" , width
          : "100%", background:"#F8EFE7"
         }}
      />
        
      <Paper sx={{ maxHeight: "31vh", overflowY: "auto", p: 2, borderRadius: "8px" }}>
        {Object.keys(filteredVillages).map((letter) => (
          <Box key={letter} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">{letter}</Typography>
            <Box sx={{display:"flex" , flexWrap:"wrap" , gap:"8px"}}>
              {filteredVillages[letter].map((village) => {
                const isSelected = selectedVillages.includes(village.id);

                return (
                  <Box key={village.id}>
                    <Box
                      onClick={() => handleToggle(village.id)}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        borderRadius: "16px",
                        backgroundColor: isSelected ? "#FFC107" : "#FFF",
                        color: isSelected ? "#1E1B16" : "#4D4639",
                        border: "1px solid #DADADA",
                        fontWeight:'500',
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                        padding: "5px 15px",
                        gap: "8px",
                        fontSize:'14px'
                      }}
                    >
                      <Box >{village.name}</Box>
                      <Checkbox
                        checked={isSelected}
                        sx={{
                          color: isSelected ? "#000" : "#999",
                          "&.Mui-checked": {
                            color: "#000",
                          },
                          p: 0,
                          pointerEvents: "none", // Prevents Checkbox from triggering separate events
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>


          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default VillageSelection;
