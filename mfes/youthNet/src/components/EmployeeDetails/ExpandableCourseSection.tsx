import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandableCourseSectionProps } from './types';
import CourseCard from './CourseCard';

const ExpandableCourseSection: React.FC<ExpandableCourseSectionProps> = ({
  title,
  count,
  courses,
  defaultExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleChange = () => {
    setExpanded(!expanded);
  };

  // Determine background color based on title
  const getBackgroundColor = () => {
    if (title.includes('Overdue')) return '#fef3e6';
    if (title.includes('Ongoing')) return '#fef3e6';
    if (title.includes('Completed')) return '#fef3e6';
    return '#fef3e6';
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      elevation={0}
      sx={{
        border: 'none',
        borderRadius: 0,
        '&:before': {
          display: 'none',
        },
        backgroundColor: 'transparent',
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          backgroundColor: getBackgroundColor(),
          borderRadius: 0,
          // px: 3,
          // py: 1.5,
          '&.Mui-expanded': {
            minHeight: 56,
          },
          '& .MuiAccordionSummary-content': {
            my: 1.5,
          },
        }}
      >
        <Typography
          variant="body1"
          fontWeight={600}
          sx={{
            color: '#8B4513',
          }}
        >
          {count} {title}
        </Typography>
      </AccordionSummary>
      
      <AccordionDetails sx={{ px: 3, py: 3, backgroundColor: 'white' }}>
        {courses.length > 0 ? (
          <Grid container spacing={2.5}>
            {courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
                <CourseCard course={course} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No courses found
            </Typography>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default ExpandableCourseSection;

