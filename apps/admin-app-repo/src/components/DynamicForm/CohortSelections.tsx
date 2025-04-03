import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Checkbox,
  FormControlLabel,
  Paper,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';

import SortIcon from '@mui/icons-material/Sort';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  getCenterList,
  getStateBlockDistrictList,
} from '@/services/MasterDataService';
import { FormContextType } from '@/utils/app.constant';
// import { getStateBlockDistrictList } from "mfes/youthNet/src/services/youthNet/Dashboard/VillageServices";
// import DynamicForm from '../../components/DynamicForm/DynamicForm';
interface VillageSelectionProps {
  parentId: string;
  ParentName: string;
  onBack: () => void;
  selectedVillages: any; // Assuming village IDs are numbers
  onSelectionChange: (selectedVillages: number[]) => void;
  role?: string;
  // ParentName?:string;
  // parentId?:string
  stateId?: any;
  districtId?: any;
  blockId?: any;
  villageId?: any;
  searchPlaceHolder?: string;
}
const CohortSelections: React.FC<VillageSelectionProps> = ({
  parentId,
  ParentName,
  onBack,
  selectedVillages: initialSelectedVillages,
  onSelectionChange,
  role,
  stateId,
  blockId,
  districtId,
  villageId,
}) => {
  const [selectedVillages, setSelectedVillages] = useState<number[]>(
    initialSelectedVillages || []
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [villages, setVillages] = useState<{ id: number; name: string }[]>([]);
  const [childData, setChildData] = useState<{ id: number; name: string }[]>(
    []
  );
  const [selectedchildData, setSelectedChildData] = useState<number[]>(
    initialSelectedVillages || []
  );

  const { t } = useTranslation();

  useEffect(() => {
    setSelectedVillages(initialSelectedVillages || []);
  }, [initialSelectedVillages]);

  useEffect(() => {
    const getVillageList = async () => {
      try {
        if (role === 'mentor') {
          const controllingfieldfk: any = [parentId];
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
        } else {
          const getCentersObject = {
            limit: 0,
            offset: 0,
            filters: {
              type: 'BATCH',
              status: ['active'],
              // state: [stateId],
              // district: [districtId],
              // block: [blockId],
              // village:[villageId],
              parentId: [parentId],
              // "name": selected[0]
            },
          };
          const r = await getCenterList(getCentersObject);
          console.log(r?.result?.results?.cohortDetails);
          const transformedcenterData = r?.result?.results?.cohortDetails?.map(
            (item: any) => ({
              id: item?.cohortId,
              name: item?.name,
            })
          );
          setVillages(transformedcenterData);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getVillageList();
  }, [parentId]);

  const handleToggle = (villageId: number) => {
    setSelectedVillages((prev) => {
      const newSelection = prev.includes(villageId)
        ? prev.filter((id) => id !== villageId)
        : [...prev, villageId];

      onSelectionChange(newSelection);
      return newSelection;
    });
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSelection = event.target.checked ? villages.map((v) => v.id) : [];
    setSelectedVillages(newSelection);
    onSelectionChange(newSelection);
  };

  const categorizedVillages = villages
    ?.sort((a, b) => a.name.localeCompare(b.name))
    .reduce((acc: Record<string, { id: number; name: string }[]>, village) => {
      const firstLetter = village.name.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(village);
      return acc;
    }, {});

  const filteredVillages = categorizedVillages
    ? Object.keys(categorizedVillages)
        .sort()
        .reduce(
          (acc: Record<string, { id: number; name: string }[]>, letter) => {
            const villagesInCategory = categorizedVillages[letter] || []; // Ensure it's always an array
            const filtered = villagesInCategory.filter((village) =>
              village.name.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filtered.length > 0) {
              acc[letter] = filtered; // Only add if there are results
            }

            return acc;
          },
          {}
        )
    : {};

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        gap={1}
        mt={2}
        sx={{ border: '1px solid #ccc', borderRadius: '8px', p: 1 }}
      >
        <SearchIcon color="disabled" />
        <TextField
          variant="standard"
          placeholder={
            role === FormContextType.TEACHER
              ? t('FACILITATOR.SEARCH_BATCHES')
              : 'Search Village..'
          }
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{ disableUnderline: true }}
        />
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
      >
        <Typography variant="subtitle1">
          {role === FormContextType.TEACHER
            ? ParentName + 'Block'
            : ParentName + 'Village'}{' '}
        </Typography>
        {/* <IconButton>
          <SortIcon />
        </IconButton> */}
      </Box>

      {villages?.length && (
        <FormControlLabel
          control={
            <Checkbox
              onChange={handleSelectAll}
              checked={selectedVillages?.length === villages?.length}
            />
            
          }
          label={`Select All (${villages?.length} Villages)`}
          sx={{
            mt: 1, mb: 2, backgroundColor: "#F5F5F5", p: 1, borderRadius: "8px", width
              : "97%", background: "#F8EFE7", marginRight: "0px !important",
            marginLeft: "0px !important"
          }}
        />
      )}

      <Paper sx={{ maxHeight: "31vh", overflowY: "auto", p: 2, borderRadius: "8px" }}>
        {Object.keys(filteredVillages).map((letter) => (
          <Box key={letter} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">{letter}</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
              {filteredVillages[letter]?.map((village) => {
                const isSelected = selectedVillages.includes(village.id);

                return (
                  <Box key={village.id}>
                    <Box
                      onClick={() => handleToggle(village.id)}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderRadius: "16px",
                        backgroundColor: isSelected ? "#FFC107" : "#FFF",
                        color: isSelected ? "#1E1B16" : "#4D4639",
                        border: "1px solid #DADADA",
                        fontWeight: '500',
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                        padding: "5px 15px",
                        gap: "8px",
                        fontSize: '14px'
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

export default CohortSelections;
