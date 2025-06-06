'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Link,
  Grid,
  Card,
  CardContent,
  Chip,
  Container,
  styled,
  CircularProgress,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {
  searchCohort,
  CohortDetails,
  getUserCohortsRead,
} from '@learner/utils/API/CohortService';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DynamicForm from '@shared-lib-v2/DynamicForm/components/DynamicForm';
import { fetchForm, searchListData } from '@shared-lib-v2/DynamicForm/components/DynamicFormCallback';
import { CohortSearchSchema, CohortSearchUISchema } from '../CohortSearch';
import { FormContext } from '@shared-lib-v2/DynamicForm/components/DynamicFormConstant';

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
  setVisibleCenters?: any
  hideFilter?: boolean;
}

const ImageContainer = styled(Box)(({ theme }) => ({
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
}));

const ImageOverlay = styled(Box)(({ theme }) => ({
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
}));

const getCustomFieldValue = (
  cohort: CohortDetails,
  fieldLabel: string
): string | null => {
  console.log(fieldLabel, 'fieldLabel');
  console.log(cohort, 'cohort');

  const field = cohort.customFields.find((f) => f.label === fieldLabel);
  console.log(field, 'field');

  if (field && field.selectedValues.length > 0) {
    return field.selectedValues[0] as any;
  }
  return null;
};
const getIndustryValues = (cohort: CohortDetails): string[] => {
  const industryField = cohort.customFields.find((f) => f.label === 'INDUSTRY');
  if (industryField) {
    return industryField.selectedValues.map((v) => v.label || v.value);
  }
  return [];
};

const SkillCenter = ({
  title,
  isNavigateBack,
  viewAll,
  Limit,
  visibleCenters,
  setVisibleCenters,
  hideFilter=true
}: SkillCenterProps) => {
  const router = useRouter();
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
   const [schema, setSchema] = useState(CohortSearchSchema);
  const [uiSchema, setUiSchema] = useState(CohortSearchUISchema);
    const [prefilledFormData, setPrefilledFormData] = useState<any>(null);
   const [isLoading, setIsLoading] = useState(false);
  
  const [addSchema, setAddSchema] = useState(null);
  const [addUiSchema, setAddUiSchema] = useState(null);
  const [prefilledAddFormData, setPrefilledAddFormData] = useState({});
  const [pageLimit, setPageLimit] = useState<number>(10);
  const [pageOffset, setPageOffset] = useState<number>(0);
 
  const [response, setResponse] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editableUserId, setEditableUserId] = useState('');
    // const [visibleCenters, setVisibleCenters] = useState<any>([]);

  const [cohortId, setCohortId] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [totalCountBatch, setTotalCountBatch] = useState(0);
    const searchStoreKey = 'centers';

 const initialFormDataSearch =
  typeof window !== 'undefined' && typeof localStorage !== 'undefined'
    ? localStorage.getItem(searchStoreKey) && localStorage.getItem(searchStoreKey) !== '{}'
      ? JSON.parse(localStorage.getItem(searchStoreKey) || '')
      : localStorage.getItem('stateId')
      ? { state: [localStorage.getItem('stateId')] }
      : {}
    : {};

useEffect(() => {
    // Fetch form schema from API and set it in state.
      
    setPrefilledFormData(initialFormDataSearch);
  }, [initialFormDataSearch]);
  console.log("predfilledformdata", prefilledFormData)
  const limit = 10;

  const fetchCenters = async (currentOffset: number) => {
    try {
     
      if (response?.result.result.results?.cohortDetails) {
        const apiCenters: Center[] = response.result.result.results.cohortDetails.map((cohort: CohortDetails) => ({
          name: cohort.name,
          category: getIndustryValues(cohort)[0] || 'General',
          address: getCustomFieldValue(cohort, 'ADDRESS') || 'Address not available',
          distance: '0 km',
          mapsUrl: getCustomFieldValue(cohort, 'GOOGLE_MAP_LINK') || '#',
          images: cohort.image || ['/images/default.png'],
          moreImages: cohort.image?.length > 3 ? cohort.image.length - 3 : 0,
        }));

        if (currentOffset === 0) {
          setCenters(apiCenters);
            const visibleCenters = viewAll ? apiCenters : apiCenters.slice(0, Limit);
            setVisibleCenters(visibleCenters)

        } else {
          const r: any=((prev: any) => [...prev, ...apiCenters])
                      const visibleCenters = viewAll ? r : r.slice(0, Limit);
                      setVisibleCenters(visibleCenters)

          setCenters(prev => [...prev, ...apiCenters]);
        }

        setHasMore(apiCenters.length === limit);
      }
      else{
              setVisibleCenters([])

      }
    } catch (error) {
      setVisibleCenters([])
      console.error('Failed to fetch centers:', error);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  if( JSON.stringify(response)) {
  fetchCenters(0);
  }
}, [JSON.stringify(response)]);


  const handleLoadMore = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchCenters(newOffset);
  };

 
    
      console.log("Youth@16",visibleCenters)
  if (loading && centers.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading centers...</Typography>
      </Box>
    );
  }
 

  const updatedUiSchema = {
    ...uiSchema,
    'ui:submitButtonOptions': {
      norender: true, // Hide submit button if isHide is true
    },
  };
    const SubmitaFunction = async (formData: any) => {
    // console.log("###### debug issue formData", formData)
    if (formData && Object.keys(formData).length > 0) {
      setPrefilledFormData(formData);
      //set prefilled search data on refresh
      localStorage.setItem(searchStoreKey, JSON.stringify(formData));
      await searchData(formData, 0);
    }
  };
 const searchData = async (formData: any, newPage: any) => {
    if (formData) {
      formData = Object.fromEntries(
        Object.entries(formData).filter(
          ([_, value]) => !Array.isArray(value) || value.length > 0
        )
      );
      const staticFilter = { type: 'COHORT' };
      const { sortBy } = formData;
      const staticSort = ['name', sortBy || 'asc'];
      await searchListData(
        formData,
        newPage,
        staticFilter,
        pageLimit,
        setPageOffset,
        setCurrentPage,
  (newResponse: any) => setResponse({ ...newResponse }), // 👈 Force new reference
        searchCohort,
        staticSort
      );
    }
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

          { !hideFilter &&  schema &&
          uiSchema && (
            <DynamicForm
              schema={schema}
              uiSchema={updatedUiSchema}
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
              {center.images.slice(0, 3).map((img: any, i: any) => (
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
    )
  )}
</Grid>


      {!loading && visibleCenters?.length === 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            width: '100%',
          }}
        >
          <Typography variant="h6" sx={{ color: '#635E57', fontSize: '16px' }}>
            No data found
          </Typography>
        </Box>
      )}

      {viewAll && hasMore && offset > 10 && (
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
      )}
    </Box>
  );
};

export default SkillCenter;
