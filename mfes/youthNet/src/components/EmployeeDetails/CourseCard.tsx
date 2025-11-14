import React from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Button, Stack, Tooltip } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { CourseCardProps } from './types';

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        boxShadow: 'none',
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      {/* Course Image */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="160"
          image={course.image}
          alt={course.title}
          sx={{ objectFit: 'cover' }}
        />
        {course.completedDate && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: 'rgba(76, 175, 80, 0.85)', // Semi-transparent green
              color: 'white',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: '11px',
              fontWeight: 500,
              backdropFilter: 'blur(4px)', // Adds blur effect for better readability
            }}
          >
            ● Completed on {course.completedDate}
          </Box>
        )}
      </Box>

      {/* Course Content */}
      <CardContent sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
        <Tooltip title={course.title} arrow>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            gutterBottom
            sx={{
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: '2.8em',
              cursor: 'default',
            }}
          >
            {course.title}
          </Typography>
        </Tooltip>
        
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            flex: 1,
          }}
        >
          {course.description}
        </Typography>

        {/* Preview Certificate Button */}
        {/* {course.certificateUrl && (
          <Button
            variant="text"
            size="small"
            endIcon={<ArrowForward fontSize="small" />}
            sx={{
              alignSelf: 'flex-start',
              textTransform: 'none',
              color: '#1976d2',
              p: 0,
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
              },
            }}
          >
            Preview Certificate
          </Button>
        )} */}
      </CardContent>
    </Card>
  );
};

export default CourseCard;

