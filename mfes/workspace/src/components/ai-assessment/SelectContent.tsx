import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  Chip,
  Checkbox,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { FilterForm } from '@shared-lib-v2/lib/Filter/FilterForm';

const poppinsFont = {
  fontFamily: 'Poppins',
};

const mockContentSources = [
  {
    id: '1',
    title: 'Math - Chapter 1',
    description: 'Some description of the content',
    creator: 'Arun Desai',
    status: 'Live',
    lastModified: '24 Apr 2025',
  },
  {
    id: '2',
    title: 'Math - Chapter 2',
    description: 'Some description of the content',
    creator: 'Deepa Kumari',
    status: 'Draft',
    lastModified: '24 Apr 2025',
  },
  {
    id: '3',
    title: 'Math - Chapter 3',
    description: 'Some description of the content',
    creator: 'Ravi Kumar',
    status: 'Draft',
    lastModified: '4 Apr 2025',
  },
  {
    id: '4',
    title: 'Math - Chapter 4',
    description: 'Some description of the content',
    creator: 'Aarav Sharma',
    status: 'Live',
    lastModified: '2 Feb 2025',
  },
  {
    id: '5',
    title: 'Math - Chapter 5',
    description: 'Some description of the content',
    creator: 'Gourav Sen',
    status: 'Live',
    lastModified: '16 Jan 2025',
  },
];

interface SelectContentProps {
  selected: string[];
  setSelected: (ids: string[]) => void;
  onNext: () => void;
}

const SelectContent: React.FC<SelectContentProps> = ({
  selected,
  setSelected,
  onNext,
}) => {
  const [search, setSearch] = useState('');
  const handleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((sid) => sid !== id));
    } else if (selected.length < 3) {
      setSelected([...selected, id]);
    }
  };
  const filteredSources = mockContentSources.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <Box>
      {/* Stepper should be rendered by parent */}
      <Typography
        variant="h5"
        sx={{
          ...poppinsFont,
          fontWeight: 400,
          fontSize: 22,
          color: '#1F1B13',
          mb: 2,
        }}
      >
        AI Question Set Generator
      </Typography>
      <FilterForm
        orginalFormData={{}}
        isShowStaticFilterValue={true}
        onlyFields={[
          'program',
          'se_domains',
          'se_subDomains',
          'se_subjects',
          'primaryUser',
          'language',
          'ageGroup',
          'statu',
          'board',
        ]}
        staticFilter={{
          se_subjects: ['English'],
        }}
        _config={{
          _box: { sx: { flexDirection: 'row' } },
          inputType: {
            program: 'dropdown',
            se_domains: 'dropdown',
            se_subDomains: 'dropdown',
            se_subjects: 'dropdown',
            primaryUser: 'dropdown',
            language: 'dropdown',
            ageGroup: 'dropdown',
            statu: 'dropdown',
            board: 'dropdown',
          },
        }}
      />
      <Box sx={{ mb: 2, width: 400 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search content.."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: { bgcolor: '#F0F0F0', borderRadius: 1 },
          }}
        />
      </Box>
      <Typography
        sx={{
          ...poppinsFont,
          fontWeight: 400,
          fontSize: 16,
          color: '#7C766F',
          mb: 2,
        }}
      >
        Select up to 3 content sources for your questions
      </Typography>
      <Card sx={{ borderRadius: 2, boxShadow: 1, mb: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Title and description</TableCell>
                <TableCell>Creator</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last modified</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSources.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(row.id)}
                      onChange={() => handleSelect(row.id)}
                      disabled={
                        !selected.includes(row.id) && selected.length >= 3
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 500 }}>
                      {row.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {row.description}
                    </Typography>
                  </TableCell>
                  <TableCell>{row.creator}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={row.status === 'Live' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{row.lastModified}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          sx={{
            borderRadius: 100,
            px: 4,
            py: 1,
            fontWeight: 500,
            ...poppinsFont,
          }}
        >
          Back to Workspace
        </Button>
        <Button
          variant="contained"
          sx={{
            borderRadius: 100,
            px: 4,
            py: 1,
            fontWeight: 500,
            bgcolor: '#FDBE16',
            color: '#1E1B16',
            ...poppinsFont,
          }}
          disabled={selected.length === 0}
          onClick={onNext}
        >
          Next: Set Parameters
        </Button>
      </Box>
    </Box>
  );
};

export default SelectContent;
