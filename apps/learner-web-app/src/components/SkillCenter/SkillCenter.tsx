'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Link,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  styled,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

import DynamicForm from '@shared-lib-v2/DynamicForm/components/DynamicForm';
import {
  fetchForm,
  searchListData,
} from '@shared-lib-v2/DynamicForm/components/DynamicFormCallback';
import {
  searchCohort,
  CohortDetails,
} from '@learner/utils/API/CohortService';
import {
  CohortSearchSchema,
  CohortSearchUISchema,
} from '../CohortSearch';

interface Center {
  name: string;
  category: string;
  address: string;
  distance: string;
  mapsUrl: string;
  images: string[];
  moreImages: number;
  customFields?: {
    label: string;
    selectedValues: string[];
  }[];
}

interface SkillCenterProps {
  title?: string;
  isNavigateBack?: boolean;
  viewAll?: boolean;
  Limit?: number;
  visibleCenters?: any;
  setVisibleCenters?: any;
  hideFilter?: boolean;
}

const ImageContainer = styled(Box)({
  position: 'relative',
  borderRadius: '8px',
  overflow: 'hidden',
  flex: 1,
  height: '180px',
  '& img': {
    width: '100%',
    height: '100%',
    borderRadius: '8px',
    objectFit: 'cover',
  },
});

const ImageOverlay = styled(Box)({
  position: 'absolute',
  bottom: 0,
  right: 0,
  width: '45px',
  height: '45px',
  background: 'rgba(39, 39, 39, 0.75)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 500,
});

const getCustomFieldValue = (cohort: CohortDetails, label: string) => {
  const field = cohort.customFields.find(f => f.label === label);
  return field?.selectedValues?.[0] || "";
};

const getIndustryValues = (cohort: CohortDetails): string[] => {
  const industryField = cohort.customFields.find(f => f.label === 'INDUSTRY');
  return industryField ? industryField.selectedValues.map(v => v.label || v.value) : [];
};

const SkillCenter = ({
  title,
  isNavigateBack,
  viewAll,
  Limit,
  visibleCenters,
  setVisibleCenters,
  hideFilter = true,
}: SkillCenterProps) => {
  const router = useRouter();
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [schema] = useState(CohortSearchSchema);
  const [uiSchema] = useState(CohortSearchUISchema);
  const [prefilledFormData, setPrefilledFormData] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);
  const isFetched = useRef(false);
 const [pageLimit, setPageLimit] = useState<number>(10);
  const [pageOffset, setPageOffset] = useState<number>(0);
  const searchStoreKey = 'centers';
  let totalcount=100;
  const initialFormDataSearch =
    typeof window !== 'undefined' && localStorage.getItem(searchStoreKey)
      ? JSON.parse(localStorage.getItem(searchStoreKey) || '{}')
      : localStorage.getItem('stateId')
      ? { state: [localStorage.getItem('stateId')] }
      : {};

  useEffect(() => {
    setPrefilledFormData(initialFormDataSearch);
  }, []);

  const fetchCenters = async () => {
    if (!response?.result?.result?.results?.cohortDetails) return;

    const apiCenters: Center[] = response.result.result.results.cohortDetails.map((cohort: CohortDetails) => ({
      name: cohort.name,
      category: getIndustryValues(cohort)[0] || 'General',
      address: getCustomFieldValue(cohort, 'ADDRESS') || 'Address not available',
      distance: '0 km',
      mapsUrl: getCustomFieldValue(cohort, 'GOOGLE_MAP_LINK') || '#',
      images: cohort.image || ['/images/default.png'],
      moreImages: cohort.image?.length > 3 ? cohort.image.length - 3 : 0,
    }));

    setCenters(apiCenters);
setCenters((prev) => [...prev, ...apiCenters]); // ✅ append
  setVisibleCenters((prev: any) =>
    viewAll ? [...prev, ...apiCenters] : [...prev, ...apiCenters].slice(0, Limit)
  );    setLoading(false);
  };

  useEffect(() => {
    if (response?.result?.result?.results?.cohortDetails?.length > 0 && !isFetched.current) {
      isFetched.current = true;
      fetchCenters();
    } else if (!response || !response.result?.result?.results?.cohortDetails?.length) {
      setCenters([]);
      setVisibleCenters([]);
      setLoading(false);
    }
    else{
 setCenters([]);
      setVisibleCenters([]);
      setLoading(false);    }
    
  }, [response]);

  const searchData = async (formData: any) => {
    if (!formData) return;
    formData = Object.fromEntries(Object.entries(formData).filter(([_, v]) => !Array.isArray(v) || v.length > 0));
    const staticFilter = { type: 'COHORT' };
    const sort = ['name', formData.sortBy || 'asc'];

    await searchListData(
      formData,
      0,
      staticFilter,
      10,
      () => {},
      () => {},
      (newResponse: any) => setResponse({ ...newResponse }),
      searchCohort,
      sort
    );
  };

  const SubmitaFunction = async (formData: any) => {
    setPrefilledFormData(formData);
    localStorage.setItem(searchStoreKey, JSON.stringify(formData));
    isFetched.current = false;
    await searchData(formData);
  };
const handleLoadMore = () => {
  console.log("pageLimit",pageLimit, pageOffset)
  const newOffset = pageOffset + 1;
 setPageOffset(newOffset);
  // setPageLimit(pageLimit); // keep limit per page
  isFetched.current = false;
  searchData(prefilledFormData);
};

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          {isNavigateBack && (
            <Box
              onClick={() => {
                router.back();
              }}
              sx={{
                color: '#4D4639',
                fontWeight: 500,
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              <ArrowBackIcon />
            </Box>
          )}
          <Typography
            variant="h5"
            component="h3"
            sx={{ fontWeight: 400, color: '#1F1B13', fontSize: '22px' }}
          >
            {title}
          </Typography>
        </Box>
        {!viewAll && visibleCenters.length > 3 && (
          <Box
            onClick={() => {
              router.push('/skill-center');
            }}
            sx={{
              color: '#0D599E',
              fontWeight: 500,
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            View All{' '}
            <ArrowForwardIcon
              sx={{
                color: '#0D599E',
                fontWeight: 500,
                fontSize: '16px',
                cursor: 'pointer',
              }}
            />
          </Box>
        )}
      </Box>

      {!hideFilter && (
        <DynamicForm
          schema={schema}
          uiSchema={{ ...uiSchema, 'ui:submitButtonOptions': { norender: true } }}
          SubmitaFunction={SubmitaFunction}
          isCallSubmitInHandle={true}
          prefilledFormData={prefilledFormData}
        />
          )
        }
     <Grid container spacing={3} marginTop={"80px"}>
  {(viewAll ? visibleCenters : visibleCenters?.slice(0, 3))?.map(
    (center: any, idx: any) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
        <Card
          sx={{
            height: '100%',
            borderRadius: 3,
            boxShadow: 'unset',
            '&:hover': {
              boxShadow: 'unset',
              transform: 'translateY(-2px)',
              transition: 'all 0.3s ease',
            },
          }}
        >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  {center.images.slice(0, 3).map((img: string, i: number) => (
                    <ImageContainer key={i}>
                      <img src={img} alt={`${center.name} view ${i + 1}`} />
                      {i === 2 && center.moreImages > 0 && (
                        <ImageOverlay>+{center.moreImages}</ImageOverlay>
                      )}
                    </ImageContainer>
                  ))}
                </Box>

                <Box sx={{ px: 2, pb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 1,
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: '#1F1B13',
                    fontSize: '18px',
                  }}
                >
                  {center.name}
                </Typography>
                <Chip
                  label={center.category}
                  size="small"
                  sx={{
                    backgroundColor: '#F5F5F5',
                    color: '#635E57',
                    fontSize: '14px',
                    fontWeight: 500,
                    borderRadius: '16px',
                    height: '24px',
                  }}
                />
                  </Box>

              <Typography
                variant="body2"
                sx={{
                  mb: 1.5,
                  color: '#635E57',
                  fontSize: '14px',
                  lineHeight: 1.5,
                }}
              >
                {center.address}
              </Typography>

              <Link
                href={center.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: '#0066CC',
                  textDecoration: 'none',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: '14px',
                  '&:hover': {
                    color: '#004C99',
                  },
                }}
              >
                    Open on Maps <LocationOnIcon sx={{ fontSize: 18 }} />
                  </Link>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
{/* {visibleCenters?.length < 200 && (
   <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Box
            onClick={handleLoadMore}
            sx={{
              backgroundColor: '#FDBE16',
              color: '#1E1B16',
              padding: '10px 20px',
              borderRadius: '50px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#FDBE16',
              },
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {loading ? 'Loading...' : 'Load More'}
            {loading && <CircularProgress size={20} color="inherit" />}
          </Box>
        </Box>
)} */}

      {!loading && visibleCenters?.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <Typography variant="h4" sx={{ color: '#635E57' }}>No data found</Typography>
        </Box>
      )}
    </Box>
  );
};

export default SkillCenter;
