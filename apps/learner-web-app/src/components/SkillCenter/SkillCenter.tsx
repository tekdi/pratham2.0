import React, { useEffect, useState } from 'react'
import { 
  Box, 
  Typography, 
  Link, 
  Grid, 
  Card, 
  CardContent, 
  Chip,
  Container,
  styled
} from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { searchCohort, CohortDetails } from '@learner/utils/API/CohortService';

interface Center {
  name: string;
  category: string;
  address: string;
  distance: string;
  mapsUrl: string;
  images: string[];
  moreImages: number;
}

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  '& img': {
    width: 60,
    height: 45,
    borderRadius: theme.shape.borderRadius,
    objectFit: 'cover'
  }
}));

const ImageOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0,0,0,0.5)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.shape.borderRadius,
  fontSize: 14,
  fontWeight: 500,
}));

const mockCenters: Center[] = [
  {
    name: 'Bhor Electrical',
    category: 'Electrical',
    address: 'Sharmik Hall, Near By ST Stand Bhor ,Tal Bhor, Dist Pune 412206',
    distance: '31.2 km',
    mapsUrl: '#',
    images: [
      '/images/default.png',
      '/images/default.png',
      '/images/default.png',
      '/images/default.png',
    ],
    moreImages: 3,
  },
  {
    name: 'Pune Electronics',
    category: 'Electrical',
    address: 'MG Road, Near City Mall, Pune 411001',
    distance: '15.5 km',
    mapsUrl: '#',
    images: [
      '/images/default.png',
      '/images/default.png',
      '/images/default.png',
      '/images/default.png',
    ],
    moreImages: 3,
  },
  {
    name: 'Mumbai Mechanics',
    category: 'Mechanical',
    address: 'Workshop Street, Andheri East, Mumbai 400069',
    distance: '22.8 km',
    mapsUrl: '#',
    images: [
      '/images/default.png',
      '/images/default.png',
      '/images/default.png',
      '/images/default.png',
    ],
    moreImages: 3,
  },
  {
    name: 'Digital Solutions',
    category: 'IT',
    address: 'Tech Park, Hinjewadi Phase 1, Pune 411057',
    distance: '18.3 km',
    mapsUrl: '#',
    images: [
      '/images/default.png',
      '/images/default.png',
      '/images/default.png',
      '/images/default.png',
    ],
    moreImages: 3,
  },
  {
    name: 'Auto Care Center',
    category: 'Automobile',
    address: 'Service Road, Wakad, Pune 411057',
    distance: '25.7 km',
    mapsUrl: '#',
    images: [
      '/images/default.png',
      '/images/default.png',
      '/images/default.png',
      '/images/default.png',
    ],
    moreImages: 3,
  },
  {
    name: 'Skill Hub Institute',
    category: 'Multi-skill',
    address: 'Education Zone, Kothrud, Pune 411038',
    distance: '12.4 km',
    mapsUrl: '#',
    images: [
      '/images/default.png',
      '/images/default.png',
      '/images/default.png',
      '/images/default.png',
    ],
    moreImages: 3,
  }
];

const getCustomFieldValue = (cohort: CohortDetails, fieldLabel: string): string | null => {
  const field = cohort.customFields.find(f => f.label === fieldLabel);
  if (field && field.selectedValues.length > 0) {
    return field.selectedValues[0].value;
  }
  return null;
};

const getIndustryValues = (cohort: CohortDetails): string[] => {
  const industryField = cohort.customFields.find(f => f.label === 'INDUSTRY');
  if (industryField) {
    return industryField.selectedValues.map(v => v.label || v.value);
  }
  return [];
};

const SkillCenter = () => {
  const [showAll, setShowAll] = useState(false);
  const [centers, setCenters] = useState<Center[]>(mockCenters);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await searchCohort({
          limit: 10,
          offset: 0,
          filters: {
            state: 27,
            district: 498,
            block: 3786,
            village: 521992,
          },
        });
        
        if (response?.result?.results?.cohortDetails) {
          const apiCenters: Center[] = response.result.results.cohortDetails.map((cohort: CohortDetails) => ({
            name: cohort.name,
            category: getIndustryValues(cohort)[0] || 'General',
            address: getCustomFieldValue(cohort, 'ADDRESS') || 'Address not available',
            distance: '0 km',
            mapsUrl: getCustomFieldValue(cohort, 'GOOGLE_MAP_LINK') || '#',
            images: cohort.image || ['/images/default.png'],
            moreImages: cohort.image?.length > 3 ? cohort.image.length - 3 : 0,
          }));
          setCenters(apiCenters);
        }
      } catch (error) {
        console.error('Failed to fetch centers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, []);

  const visibleCenters = showAll ? centers : centers.slice(0, 3);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading centers...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h3" sx={{ fontWeight: 600 }}>
          Skilling Center Near You
        </Typography>
        {centers.length > 3 && (
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowAll(!showAll);
            }}
            sx={{ 
              color: 'primary.main', 
              textDecoration: 'none', 
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {showAll ? 'Show Less' : 'View All'} →
          </Link>
        )}
      </Box>

      <Grid container spacing={3}>
        {visibleCenters.map((center, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
                  {center.images.slice(0, 3).map((img, i) => (
                    <ImageContainer key={i}>
                      <img src={img} alt={`${center.name} view ${i + 1}`} />
                      {i === 2 && center.moreImages > 0 && (
                        <ImageOverlay>
                          +{center.moreImages}
                        </ImageOverlay>
                      )}
                    </ImageContainer>
                  ))}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {center.name}
                  </Typography>
                  <Chip 
                    label={center.category} 
                    size="small" 
                    sx={{ 
                      backgroundColor: 'grey.100',
                      color: 'text.secondary',
                      height: 24
                    }} 
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {center.address}
                </Typography>
                
                <Typography variant="body2" color="text.disabled" sx={{ mb: 1 }}>
                  {center.distance}
                </Typography>

                <Link
                  href={center.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontSize: '0.875rem'
                  }}
                >
                  Open on Maps <LocationOnIcon sx={{ fontSize: 16 }} />
                </Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SkillCenter;
