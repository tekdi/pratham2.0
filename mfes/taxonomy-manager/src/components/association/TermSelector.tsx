import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import type { Category } from '../../interfaces/CategoryInterface';

interface TermSelectorProps {
  categoriesWithTerms: Category[];
  selectedCategoryCode: string;
  selectedTermCode: string;
  selectedCategory: Category | undefined;
  onCategoryChange: (e: SelectChangeEvent<string>) => void;
  onTermChange: (e: SelectChangeEvent<string>) => void;
}

const TermSelector: React.FC<TermSelectorProps> = ({
  categoriesWithTerms,
  selectedCategoryCode,
  selectedTermCode,
  selectedCategory,
  onCategoryChange,
  onTermChange,
}) => {
  // Filter categories to only show those with Live terms
  const categoriesWithLiveTerms = categoriesWithTerms.filter((category) =>
    category.terms?.some((term) => term.status === 'Live')
  );

  // Filter terms to only show Live terms
  const liveTerms = (selectedCategory?.terms || []).filter(
    (term) => term.status === 'Live'
  );

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Select Term to Associate
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
          Category
        </Typography>
        <Select
          value={selectedCategoryCode}
          onChange={onCategoryChange}
          displayEmpty
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        >
          <MenuItem value="">
            <em>Select a category</em>
          </MenuItem>
          {categoriesWithLiveTerms.map((cat) => (
            <MenuItem key={cat.code} value={cat.code}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
        <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
          Term
        </Typography>
        <Select
          value={selectedTermCode}
          onChange={onTermChange}
          displayEmpty
          fullWidth
          size="small"
          disabled={!liveTerms.length}
        >
          <MenuItem value="">
            <em>Select a term</em>
          </MenuItem>
          {liveTerms.map((term) => (
            <MenuItem key={term.code} value={term.code}>
              {term.name}
            </MenuItem>
          ))}
        </Select>
      </CardContent>
    </Card>
  );
};

export default TermSelector;
