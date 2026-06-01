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
import { formatDate, isExpired, formatDateTime } from '../../utils/Helper/helper';

interface SurveyCardProps {
  survey: Survey;
  onClick: (survey: Survey) => void;
}

const SurveyCard: React.FC<SurveyCardProps> = ({ survey, onClick }) => {
  const isActionable = survey.status === 'published';
  const expired = isExpired(survey.endDate);

  return (
    <Card
      sx={{
        borderRadius: '12px',
        border: '1px solid #E0E0E0',
        boxShadow: 'none',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, mr: 1 }}>
            <AssignmentIcon sx={{ color: '#0D599E', fontSize: 22, flexShrink: 0 }} />
            <Typography
              variant="h2"
              className="two-line-text"
              sx={{ color: '#1E1B16' }}
            >
              {survey.surveyTitle}
            </Typography>
          </Box>
          <Chip
            label={expired ? 'Expired' : survey.status}
            size="small"
            sx={{
              backgroundColor: expired
                ? '#FFEBEE'
                : survey.status === 'published'
                ? '#E8F5E9'
                : '#FFF3E0',
              color: expired
                ? '#C62828'
                : survey.status === 'published'
                ? '#2E7D32'
                : '#E65100',
              fontWeight: 500,
              fontSize: '11px',
              height: '24px',
              textTransform: 'capitalize',
              flexShrink: 0,
            }}
          />
        </Box>

        {survey.surveyDescription && (
          <Typography
            variant="body2"
            className="two-line-text"
            sx={{ color: '#7C766F', fontSize: '13px', mb: 1.5 }}
          >
            {survey.surveyDescription}
          </Typography>
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            {survey.publishedAt && (
              <Typography variant="h6" sx={{ color: '#999' }}>
                Published: {formatDate(survey.publishedAt)}
              </Typography>
            )}
            {expired && survey.endDate && (
              <Typography variant="h6" sx={{ color: '#C62828', fontSize: '11px' }}>
                Expired on: {formatDateTime(survey.endDate)}
              </Typography>
            )}
          </Box>
          {isActionable && (
            expired ? (
              <Button
                variant="outlined"
                size="small"
                onClick={() => onClick(survey)}
                sx={{
                  borderColor: '#BDBDBD',
                  color: '#757575',
                  fontWeight: 600,
                  fontSize: '13px',
                  px: 2,
                  '&:hover': { borderColor: '#9E9E9E', backgroundColor: '#F5F5F5' },
                }}
              >
                View Survey
              </Button>
            ) : (
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
            )
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SurveyCard;
