import React, { useState, useMemo } from 'react';
import { Card, CardContent, Typography, Checkbox, Box } from '@mui/material';
import SearchBar from '../SearchBar';
import type { Category } from '../../interfaces/CategoryInterface';
import type { Term } from '../../interfaces/TermInterface';

interface TermChecklistProps {
  selectedAvailableCategory: Category | undefined;
  termsInAvailableCategory: Term[];
  checkedTermCodes: string[];
  selectedTerm: Term | undefined;
  onToggleTerm: (termCode: string) => void;
}

const TermChecklist: React.FC<TermChecklistProps> = ({
  selectedAvailableCategory,
  termsInAvailableCategory,
  checkedTermCodes,
  selectedTerm,
  onToggleTerm,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter terms based on search query and Live status
  const filteredTerms = useMemo(() => {
    // First filter to only show Live terms
    const liveTerms = termsInAvailableCategory.filter(
      (term) => term.status === 'Live'
    );

    if (!searchQuery.trim()) return liveTerms;

    const query = searchQuery.toLowerCase();
    return liveTerms.filter(
      (term) =>
        term.name.toLowerCase().includes(query) ||
        term.code.toLowerCase().includes(query)
    );
  }, [termsInAvailableCategory, searchQuery]);
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          {selectedAvailableCategory
            ? `Terms in ${selectedAvailableCategory.name}`
            : 'Select a Category'}
        </Typography>

        {selectedAvailableCategory &&
          termsInAvailableCategory.filter((term) => term.status === 'Live')
            .length > 0 && (
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search terms..."
              sx={{ mb: 2 }}
            />
          )}

        {selectedAvailableCategory && filteredTerms.length > 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              maxHeight: 300,
              overflowY: 'auto',
            }}
          >
            {filteredTerms.map((term) => (
              <Box
                key={term.code}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <Checkbox
                  checked={checkedTermCodes.includes(term.code)}
                  onChange={() => onToggleTerm(term.code)}
                  disabled={!selectedTerm}
                  size="small"
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {term.name}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {selectedAvailableCategory
              ? searchQuery.trim()
                ? `No terms found matching "${searchQuery}"`
                : 'No terms available in this category'
              : 'Select a category to view terms'}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default TermChecklist;
