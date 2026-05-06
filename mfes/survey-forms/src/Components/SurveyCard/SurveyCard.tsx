'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Box,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Survey } from '../../types/survey';
import { formatDate } from '../../utils/Helper/helper';
import { CONTEXT_TYPE_LABELS } from '../../../app.config';

interface SurveyCardProps {
  survey: Survey;
  onClick: (survey: Survey) => void;
}

const SurveyCard: React.FC<SurveyCardProps> = ({ survey, onClick }) => {
  const isActionable = survey.status === 'published';

  return (
    <Card
      sx={{
        borderRadius: '12px',
        border: '1px solid #E0E0E0',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIcon sx={{ color: '#0D599E', fontSize: 20 }} />
            <Typography
              variant="h2"
              className="two-line-text"
              sx={{ color: '#1E1B16' }}
            >
              {survey.surveyTitle}
            </Typography>
          </Box>
          <Chip
            label={survey.status}
            size="small"
            sx={{
              backgroundColor:
                survey.status === 'published' ? '#E8F5E9' : '#FFF3E0',
              color: survey.status === 'published' ? '#2E7D32' : '#E65100',
              fontWeight: 500,
              fontSize: '11px',
              height: '24px',
              textTransform: 'capitalize',
            }}
          />
        </Box>

        {survey.surveyDescription && (
          <Typography
            variant="body2"
            className="two-line-text"
            sx={{ color: '#7C766F', mb: 1.5, fontSize: '13px' }}
          >
            {survey.surveyDescription}
          </Typography>
        )}

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            mb: 1.5,
          }}
        >
          {survey.surveyType && (
            <Chip
              label={survey.surveyType}
              size="small"
              variant="outlined"
              sx={{ fontSize: '11px', height: '22px', textTransform: 'capitalize' }}
            />
          )}
          {survey.contextType && survey.contextType !== 'none' && (
            <Chip
              label={`Context: ${CONTEXT_TYPE_LABELS[survey.contextType] || survey.contextType}`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '11px', height: '22px', textTransform: 'capitalize' }}
            />
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {survey.publishedAt && (
            <Typography variant="h6" sx={{ color: '#999' }}>
              Published: {formatDate(survey.publishedAt)}
            </Typography>
          )}
          {isActionable && (
            <Button
              variant="contained"
              size="small"
              onClick={() => onClick(survey)}
              sx={{
                backgroundColor: '#FDBE16',
                color: '#1E1B16',
                fontWeight: 600,
                fontSize: '13px',
                px: 2,
                '&:hover': { backgroundColor: '#e6ab0e' },
              }}
            >
              Fill Survey
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SurveyCard;
