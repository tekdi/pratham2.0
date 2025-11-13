import React from 'react';
// import AssessmentSortModal from '../../components/AssessmentSortModal';
// import CohortSelectionSection from '../../components/CohortSelectionSection';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import SearchBar from '../../components/Searchbar';
import { showToastMessage } from '../../components/Toastify';
import NoDataFound from '../../components/common/NoDataFound';
import { compositeSearch, getOfflineAssessmentDetails } from '../../services/AssesmentService/AssesmentService';
import { ICohort } from '../../utils/Interfaces';
import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { toPascalCase } from '../../utils/Helper';
import Dropdown from '../../components/youthNet/DropDown';
import { getStateBlockDistrictList } from '../../services/youthNet/Dashboard/VillageServices';
import { cohortHierarchy } from '../../utils/app.constant';
import { DROPDOWN_NAME, YOUTHNET_USER_ROLE } from '../../components/youthNet/tempConfigs';
import { getLoggedInUserRole } from '../../utils/Helper';
import { loggedInProgram } from '../../utils/app.config';

const AssessmentList = () => {
  const theme = useTheme<any>();
  const router = useRouter();
  const { t } = useTranslation();

  // Core state management (following /assessments/index.tsx pattern)
  const [modalOpen, setModalOpen] = useState(false);
  const [assessmentList, setAssessmentList] = useState([]);
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [villageId, setVillageId] = useState('');
  const [blockId, setBlockId] = useState('');

  const [availableAssessmentTypes, setAvailableAssessmentTypes] = useState<
    string[] | null
  >(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cohortsData, setCohortsData] = useState<Array<ICohort>>([]);
  const [manipulatedCohortData, setManipulatedCohortData] =
    useState<Array<ICohort>>(cohortsData);
  const [centerData, setCenterData] = useState<{
    board: string;
    state: string;
  } | null>(null);
  const [assessmentType, setAssessmentType] = useState<string>('pre');
  const [selectedSortOption, setSelectedSortOption] = useState<{
    sortByKey: string;
    sortByValue: string;
  } | null>(() => {
    if (typeof window !== 'undefined') {
      const savedSort = localStorage.getItem('assessmentListSortOption');
      return savedSort ? JSON.parse(savedSort) : null;
    }
    return null;
  });

  const [districtData, setDistrictData] = useState<any>(null);
  const [blockData, setBlockData] = useState<any>(null);
  const [selectedStateValue, setSelectedStateValue] = useState<any>('');
  const [selectedDistrictValue, setSelectedDistrictValue] = useState<any>('');
  const [selectedBlockValue, setSelectedBlockValue] = useState<any>('');
  const [villageList, setVillageList] = useState<any>([]);
  const [selectedVillageValue, setSelectedVillageValue] = useState<any>('');

  // Course accordion state
  const [courseData, setCourseData] = useState<any[]>([]);
  const [filteredCourseData, setFilteredCourseData] = useState<any[]>([]);
  const [expandedAccordions, setExpandedAccordions] = useState<Set<string>>(new Set());
  const [courseAssessments, setCourseAssessments] = useState<{ [courseId: string]: any[] }>({});

  const { query } = router;

  // Authentication check (following existing pattern)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      const storedUserId = localStorage.getItem('userId');
      // const storedClassId = localStorage.getItem('classId') ?? '';

      // setClassId(storedClassId);
      if (token) {
        setIsAuthenticated(true);
      } else {
        router.push('/login');
      }
      setUserId(storedUserId);
    }
  }, []);

  // Assessment type from query params
  useEffect(() => {
    const newAssessmentType =
      query.type === 'post' ? 'post' : query.type === 'pre' ? 'pre' : 'other';
    setAssessmentType(newAssessmentType);
  }, [query.type]);

  // Extract center data from cohorts (following /assessments/index.tsx pattern)
  // useEffect(() => {
  //   if (classId && cohortsData?.length) {
  //     const cohort = cohortsData.find((item: any) => item.cohortId === classId);
  //     if (!cohort?.customField) {
  //       setCenterData(null);
  //       return;
  //     }
  //     const selectedState =
  //       cohort.customField.find((item: any) => item.label === 'STATE')
  //         ?.selectedValues?.[0]?.value || '';

  //     const selectedBoard =
  //       cohort.customField.find((item: any) => item.label === 'BOARD')
  //         ?.selectedValues?.[0] || '';

  //     setCenterData({ state: selectedState, board: selectedBoard });
  //   }
  // }, [classId, cohortsData]);

  // Initialize district and block dropdown data (role-based, mirroring villages page)
  useEffect(() => {
    // Only initialize district/block data for LEAD role
    if (YOUTHNET_USER_ROLE.LEAD === getLoggedInUserRole()) {
      try {
        const userDataString = localStorage.getItem('userData');
        const userData: any = userDataString ? JSON.parse(userDataString) : null;
        const stateResult = userData?.customFields?.find(
          (item: any) => item.label === cohortHierarchy.STATE
        );
        setSelectedStateValue(stateResult?.selectedValues?.[0]?.id);

        const districtResult = userData?.customFields?.find(
          (item: any) => item.label === cohortHierarchy.DISTRICT
        );
        const transformedDistricts = districtResult?.selectedValues?.map(
          (item: any) => ({ id: item?.id, name: item?.value })
        );
        setDistrictData(transformedDistricts);
        const firstDistrictId = transformedDistricts?.[0]?.id;
        setSelectedDistrictValue(firstDistrictId);

        if (firstDistrictId) {
          const controllingfieldfk = [firstDistrictId?.toString()];
          const fieldName = 'block';
          getStateBlockDistrictList({ controllingfieldfk, fieldName })
            .then((blockResponce: any) => {
              const transformedBlockData = blockResponce?.result?.values?.map(
                (item: any) => ({ id: item?.value, name: item?.label })
              );
              setBlockData(transformedBlockData);
              
              // Use blockId from query params if available, otherwise use first block
              const blockIdFromQuery = query.blockId && typeof query.blockId === 'string' ? query.blockId : null;
              const blockExists = blockIdFromQuery && transformedBlockData?.some((b: any) => String(b.id) === String(blockIdFromQuery));
              
              if (blockExists) {
                setSelectedBlockValue(blockIdFromQuery);
                setBlockId(blockIdFromQuery);
              } else {
                const firstBlockId = transformedBlockData?.[0]?.id || '';
                setSelectedBlockValue(firstBlockId);
                setBlockId(firstBlockId);
              }
            })
            .catch((e: any) => {
              console.error('Error fetching block data:', e);
              setBlockData([]);
            });
        } else {
          setBlockData([]);
        }
      } catch (e) {
        console.error('Error initializing district/block data:', e);
        setDistrictData([]);
        setBlockData([]);
      }
    }
  }, [query.blockId]);

  // Village list fetching logic (role-based, following villages page pattern)
  useEffect(() => {
    const getVillageList = async () => {
      try {
        if (YOUTHNET_USER_ROLE.INSTRUCTOR === getLoggedInUserRole()) {
          // For INSTRUCTOR role: get villages from localStorage (logged user's block villages)
          const villageDataString = localStorage.getItem('villageData');
          const villageData: any = villageDataString
            ? JSON.parse(villageDataString)
            : null;
          setVillageList(villageData || []);
          if (villageData && villageData.length > 0) {
            // Use villageId from query params if available, otherwise use first village
            const villageIdFromQuery = query.villageId && typeof query.villageId === 'string' ? query.villageId : null;
            const villageExists = villageIdFromQuery && villageData?.some((v: any) => String(v.Id) === String(villageIdFromQuery));
            
            if (villageExists) {
              setSelectedVillageValue(villageIdFromQuery);
              setVillageId(villageIdFromQuery);
            } else {
              setSelectedVillageValue(villageData[0]?.Id);
              setVillageId(villageData[0]?.Id);
            }
          }
        } else if (YOUTHNET_USER_ROLE.LEAD === getLoggedInUserRole() && selectedBlockValue !== '') {
          // For LEAD role: fetch villages based on selected block
          const controllingfieldfk = [selectedBlockValue?.toString()];
          const fieldName = 'village';
          const villageResponce = await getStateBlockDistrictList({
            controllingfieldfk,
            fieldName,
          });

          const transformedVillageData = villageResponce?.result?.values?.map(
            (item: any) => ({
              Id: item?.value,
              name: item?.label,
            })
          );
          setVillageList(transformedVillageData || []);
          if (transformedVillageData && transformedVillageData.length > 0) {
            // Use villageId from query params if available, otherwise use first village
            const villageIdFromQuery = query.villageId && typeof query.villageId === 'string' ? query.villageId : null;
            const villageExists = villageIdFromQuery && transformedVillageData?.some((v: any) => String(v.Id) === String(villageIdFromQuery));
            
            if (villageExists) {
              setSelectedVillageValue(villageIdFromQuery);
              setVillageId(villageIdFromQuery);
            } else {
              setSelectedVillageValue(transformedVillageData[0]?.Id);
              setVillageId(transformedVillageData[0]?.Id);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching village data:', error);
        setVillageList([]);
      }
    };

    getVillageList();
  }, [selectedBlockValue, query.villageId]);

  // Initialize villages on page load for INSTRUCTOR role
  useEffect(() => {
    if (YOUTHNET_USER_ROLE.INSTRUCTOR === getLoggedInUserRole()) {
      const villageDataString = localStorage.getItem('villageData');
      const villageData: any = villageDataString
        ? JSON.parse(villageDataString)
        : null;
      if (villageData && villageData.length > 0) {
        setVillageList(villageData);
        
        // Use villageId from query params if available, otherwise use first village
        const villageIdFromQuery = query.villageId && typeof query.villageId === 'string' ? query.villageId : null;
        const villageExists = villageIdFromQuery && villageData?.some((v: any) => String(v.Id) === String(villageIdFromQuery));
        
        if (villageExists) {
          setSelectedVillageValue(villageIdFromQuery);
          setVillageId(villageIdFromQuery);
        } else {
          setSelectedVillageValue(villageData[0]?.Id);
          setVillageId(villageData[0]?.Id);
        }
      }
    }
  }, [query.villageId]);

  // Reset assessment type and related lists when class changes
  useEffect(() => {
    setAvailableAssessmentTypes(null);
    console.log('availableAssessmentTypes');
    setFilteredAssessments([]);
    setAssessmentType('pre');
    // }, [classId]);
  }, []);


  // Ensure default selection: pick first available type if current isn't present
  useEffect(() => {
    if (availableAssessmentTypes && availableAssessmentTypes.length > 0) {
      const firstType = availableAssessmentTypes[0];
      if (firstType && !availableAssessmentTypes.includes(assessmentType)) {
        handleAssessmentTypeChange(firstType);
      }
    }
  }, [availableAssessmentTypes]);

  // Get assessment data (following /assessments/index.tsx pattern)
  useEffect(() => {
    const getDoIdForAssessmentReport = async (
     
    ) => {
      const filters = {
         program:  loggedInProgram,
      //  program:  ["Second Chance"],
        // board: [selectedBoard],
        status: ['Live'],
        primaryCategory: ['Practice Question Set'],
        evaluationType: ['offline'],
      };
      try {
        if (filters) {
          setIsLoading(true);
          setAssessmentList([]);
          setFilteredAssessments([]);
          setAvailableAssessmentTypes(null);

          const searchResults = await getOfflineAssessmentDetails({ filters });

          if (searchResults?.responseCode === 'OK') {
            const result = searchResults?.result;
            if (result) {
              if (result?.QuestionSet?.length > 0) {
                const assessmentData = result.QuestionSet.map((item: any) => ({
                  subject: item?.name,
                  identifier: item?.IL_UNIQUE_ID,
                  createdOn: item?.createdOn,
                  updatedOn: item?.lastUpdatedOn,
                  description: item?.description,
                  board: item?.board,
                  medium: item?.medium,
                  gradeLevel: item?.gradeLevel,
                  assessmentType: item?.assessmentType,
                }));
                setAssessmentList(assessmentData);

                // Extract unique assessment types
                const uniqueTypes = Array.from(
                  new Set(
                    (result.QuestionSet || [])
                      .map((i: any) => i?.assessmentType)
                      .filter((t: any) => !!t)
                  )
                );
                setAvailableAssessmentTypes(uniqueTypes as string[]);
                const term = searchTerm.trim().toLowerCase();
                console.log('assessmentData', assessmentData);
                const identifiers = assessmentData.map((item: any) => item.identifier);

        const courseListFilters = {
        program:  loggedInProgram,
       // program:  ["Second Chance"],

        // board: [selectedBoard],
        status: ['Live'],
        primaryCategory: ['Course'],
        // evaluationType: ['offline'],
        leafNodes: identifiers,
      };
      console.log('assessmentData', assessmentData);
      
                const initialFiltered = assessmentData.filter(
                  (assessment: any) => {
                    const matchesType =
                      assessment.assessmentType === assessmentType;
                    if (!matchesType) return false;
                    if (term === '') return true;
                    const subject = assessment.subject?.toLowerCase() || '';
                    const description =
                      assessment.description?.toLowerCase() || '';
                    return subject.includes(term) || description.includes(term);
                  }
                );

                console.log('initialFiltered', initialFiltered);
                setFilteredAssessments(initialFiltered);
                const fileds=["name",
            "appIcon",
            "description",
            "posterImage",
            "mimeType",
            "identifier",
            "resourceType",
            "primaryCategory",
            "contentType",
            "trackable",
            "children",
            "leafNodes"];
                const courseListResponse = await compositeSearch({ filters: courseListFilters, fields: fileds });
      
      // Set default appIcon if not present
      if (courseListResponse?.result?.content?.length > 0) {
        courseListResponse.result.content.forEach((course: any) => {
          if (!course.appIcon) {
            course.appIcon = "/youthnet/images/decorationBg.png";
          }
        });
      }
      
      console.log('courseListResponse', courseListResponse);
      
      // Store course data
      const courses = courseListResponse?.result?.content || [];
      setCourseData(courses);
      // Initialize filtered course data (will be properly filtered by useEffect)
      
      // Create mapping between courses and their assessments with assessment type filtering
      const courseAssessmentMapping: { [courseId: string]: any[] } = {};
      courses.forEach((course: any) => {
        const courseAssessmentList = assessmentData.filter((assessment: any) => {
          const matchesLeafNode = course.leafNodes && course.leafNodes.includes(assessment.identifier);
          const matchesType = assessment.assessmentType === assessmentType;
          return matchesLeafNode && matchesType;
        });
        courseAssessmentMapping[course.identifier] = courseAssessmentList;
      });
      setCourseAssessments(courseAssessmentMapping);

              } else {
                setAssessmentList([]);
                setFilteredAssessments([]);
              }
            }
          } else {
            console.log('❌ API response not OK:', searchResults?.responseCode);
          }
        }
      } catch (error) {
        console.error('💥 API Error:', error);
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        console.error(
          'Error fetching getDoIdForAssessmentDetails results:',
          error
        );
      } finally {
        console.log('🏁 API call finished, setting loading to false');
        setIsLoading(false);
      }
    };
    getDoIdForAssessmentReport();

    // Fetch when board info is available
    // if (centerData && centerData?.board) {
    // } else {
    //   // If no board data, ensure loading is false
    //   setIsLoading(false);
    // }
  }, [centerData, t]);

  // Safety mechanism to reset loading state if it gets stuck
  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 10000); // 10 seconds timeout

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [loading]);

  // Reset loading state when classId is available (following /assessments/index.tsx pattern)
  // useEffect(() => {
  //   if (classId) {
  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 0);
  //   }
  // }, [classId]);

  // Search functionality
  const handleSearch = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    if (courseData.length > 0 && assessmentList.length > 0) {
      recalculateCourseAssessments(assessmentList, assessmentType, newSearchTerm);
    }
  };

  // Sort modal handlers
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Assessment type change handler
  const handleAssessmentTypeChange = (newType: string) => {
    setAssessmentType(newType);
    const queryParams = { ...query };

    if (newType === 'post') queryParams.type = 'post';
    else if (newType === 'pre') queryParams.type = 'pre';
    else delete queryParams.type;

    router.push({ pathname: router.pathname, query: queryParams }, undefined, {
      shallow: true,
    });
    
    // Recalculate course assessments with new assessment type
    if (courseData.length > 0 && assessmentList.length > 0) {
      recalculateCourseAssessments(assessmentList, newType, searchTerm);
    }
  };

  const getAssessmentTypeLabel = (type: string) => {
    switch (type) {
      case 'pre':
        return t('PROFILE.PRE_TEST');
      case 'post':
        return t('PROFILE.POST_TEST');
      case 'other':
        return t('FORM.OTHER');
      case 'mock':
        return t('PROFILE.MOCK_TEST');
      case 'unit':
        return t('PROFILE.UNIT_TEST');
      default:
        return type;
    }
  };

  // Sort functionality
  const handleSorting = (selectedValue: {
    sortByKey: string;
    sortByValue: string;
  }) => {
    setSelectedSortOption(selectedValue);
    localStorage.setItem(
      'assessmentListSortOption',
      JSON.stringify(selectedValue)
    );

    const sortedAssessments = [...filteredAssessments];

    switch (selectedValue.sortByKey) {
      case 'name':
        sortedAssessments.sort((a: any, b: any) => {
          if (selectedValue.sortByValue === 'asc') {
            return a.subject.localeCompare(b.subject);
          } else {
            return b.subject.localeCompare(a.subject);
          }
        });
        break;
      case 'date':
        sortedAssessments.sort((a: any, b: any) => {
          const dateA = new Date(a.createdOn || 0);
          const dateB = new Date(b.createdOn || 0);
          if (selectedValue.sortByValue === 'asc') {
            return dateA.getTime() - dateB.getTime();
          } else {
            return dateB.getTime() - dateA.getTime();
          }
        });
        break;
      default:
        break;
    }

    setFilteredAssessments(sortedAssessments);
    setModalOpen(false);
  };

  // Assessment card click handler
  const handleAssessmentDetails = (identifier: string, subject: string, parentId?: string) => {
    console.log('villageId', villageId);
    console.log('villageIdblockId', blockId);
    console.log('parentId (courseId)', parentId);
    // Navigate to assessment details page with assessmentId, cohortId, parentId, and subject
    // Include filter values in query params for retention when navigating back
    if (identifier ) {
      const navigationUrl = `/manual-assessments/${identifier}?villageId=${villageId}&blockId=${blockId}&parentId=${parentId || ''}&subject=${encodeURIComponent(
        subject
      )}&type=${assessmentType}`;
      router.push(navigationUrl);
    } else {
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
    }
  };

  // Function to recalculate course assessments based on current filters
  const recalculateCourseAssessments = useCallback((assessmentData: any[], selectedAssessmentType: string, searchTerm = '') => {
    const courseAssessmentMapping: { [courseId: string]: any[] } = {};
    const filteredCourses: any[] = [];
    const term = searchTerm.trim().toLowerCase();
    
    courseData.forEach((course: any) => {
      const courseAssessmentList = assessmentData.filter((assessment: any) => {
        const matchesLeafNode = course.leafNodes && course.leafNodes.includes(assessment.identifier);
        const matchesType = assessment.assessmentType === selectedAssessmentType;
        
        // Apply search filter if search term exists
        if (term !== '') {
          const subject = assessment.subject?.toLowerCase() || '';
          const description = assessment.description?.toLowerCase() || '';
          const matchesSearch = subject.includes(term) || description.includes(term);
          return matchesLeafNode && matchesType && matchesSearch;
        }
        
        return matchesLeafNode && matchesType;
      });
      
      courseAssessmentMapping[course.identifier] = courseAssessmentList;
      
      // Only include courses that have at least one matching assessment
      if (courseAssessmentList.length > 0) {
        filteredCourses.push(course);
      }
    });
    
    setCourseAssessments(courseAssessmentMapping);
    setFilteredCourseData(filteredCourses);
  }, [courseData]);

  // Recalculate course assessments when core data changes
  useEffect(() => {
    if (courseData.length > 0 && assessmentList.length > 0) {
      recalculateCourseAssessments(assessmentList, assessmentType, searchTerm);
    }
  }, [courseData, assessmentList, assessmentType, searchTerm, recalculateCourseAssessments]);

  // Route change cleanup
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (!url.startsWith('/scp-teacher-repo/assessments/list')) {
        localStorage.removeItem('assessmentListSortOption');
        setSelectedSortOption(null);
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  // Accordion handlers
  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordions(prev => {
      const newSet = new Set(prev);
      if (isExpanded) {
        newSet.add(panel);
      } else {
        newSet.delete(panel);
      }
      return newSet;
    });
  };

  return (
    <>
      <Box>
        <Header />
      </Box>

      {loading && (
        <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
      )}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: theme?.palette?.warning['A200'],
          padding: '20px 20px 5px',
        }}
        width="100%"
      >
        <Typography fontSize="22px">
          {t('ASSESSMENTS.MANUAL_ASSESSMENT_LIST')}
        </Typography>
      </Box>

      <SearchBar onSearch={handleSearch} placeholder={t('COMMON.SEARCH')} />

      {/* Dropdown section - role-based layout following villages page pattern */}
      <Box sx={{ px: '20px', mt: 2 }}>
        <Grid container spacing={2}>
          {/* District & Block Dropdowns - Only show for LEAD role */}
          {YOUTHNET_USER_ROLE.LEAD === getLoggedInUserRole() && (
            <>
              {/* District Dropdown */}
              {/* <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ width: '100%' }}>
                  {districtData ? (
                    <Dropdown
                      name={districtData?.DISTRICT_NAME}
                      values={districtData}
                      defaultValue={districtData?.[0]?.id}
                      onSelect={(value) => {
                        setSelectedDistrictValue(value);
                        console.log('District selected:', value);
                      }}
                      label={t('YOUTHNET_USERS_AND_VILLAGES.DISTRICTS')}
                    />
                  ) : (
                    <Loader showBackdrop={false} />
                  )}
                </Box>
              </Grid> */}

              {/* Block Dropdown */}
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ width: '100%' }}>
                  {blockData ? (
                    <Dropdown
                      name={blockData?.BLOCK_NAME}
                      values={blockData}
                      defaultValue={selectedBlockValue}
                      onSelect={(value) => {
                        setSelectedBlockValue(value);
                        setBlockId(value);
                        console.log('Block selected:', value);
                      }}
                      label={t('YOUTHNET_USERS_AND_VILLAGES.BLOCKS')}
                    />
                  ) : (
                    <Loader showBackdrop={false} />
                  )}
                </Box>
              </Grid>
            </>
          )}

          {/* Village Dropdown - Always show but data source depends on role */}
          <Grid item xs={12} sm={6} md={YOUTHNET_USER_ROLE.INSTRUCTOR === getLoggedInUserRole() ? 6 : 3}>
            <Box sx={{ width: '100%' }}>
              {villageList?.length > 0 ? (
                <Dropdown
                  name={DROPDOWN_NAME}
                  values={villageList.map((item: any) =>
                    Array.isArray(item)
                      ? item.map(({ Id, name }) => ({ id: Id, name }))
                      : { id: item.Id, name: item.name }
                  )}
                  defaultValue={selectedVillageValue}
                  onSelect={(value) => {
                    console.log('Village selected:', value);
                    setSelectedVillageValue(value);
                    setVillageId(value);
                  }}
                  label={t('YOUTHNET_USERS_AND_VILLAGES.VILLAGES')}
                />
              ) : (YOUTHNET_USER_ROLE.LEAD === getLoggedInUserRole() && selectedBlockValue && villageList?.length === 0) ? (
                <Typography sx={{ fontSize: '14px', mt: 2 }}>
                  {t('YOUTHNET_USERS_AND_VILLAGES.NO_VILLAGES_FOUND')}
                </Typography>
              ) : (
                <Loader showBackdrop={false} />
              )}
            </Box>
          </Grid>

          {/* Assessment Type Dropdown - Always show */}
          {availableAssessmentTypes && availableAssessmentTypes?.length > 0 ? (
            <Grid item xs={12} sm={6} md={YOUTHNET_USER_ROLE.INSTRUCTOR === getLoggedInUserRole() ? 6 : 3}>
              <Box sx={{ width: '100%' }}>
                <FormControl fullWidth>
                  <InputLabel
                    style={{
                      color: theme?.palette?.warning['A200'],
                      background: theme?.palette?.warning['A400'],
                      paddingLeft: '2px',
                      paddingRight: '2px',
                    }}
                    id="assessment-type-select-label"
                  >
                    {t('ASSESSMENTS.ASSESSMENT_TYPE')}
                  </InputLabel>
                  <Select
                    labelId="assessment-type-select-label"
                    id="assessment-type-select"
                    label={t('ASSESSMENTS.ASSESSMENT_TYPE')}
                    style={{
                      borderRadius: '4px',
                    }}
                    value={assessmentType}
                    onChange={(e) => handleAssessmentTypeChange(e.target.value)}
                    disabled={availableAssessmentTypes.length === 1}
                  >
                    {availableAssessmentTypes.map((type) => (
                      <MenuItem
                        key={type}
                        value={type}
                        style={{ textAlign: 'right' }}
                      >
                        {getAssessmentTypeLabel(type)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          ) : (
            <Grid item xs={12} sm={6} md={YOUTHNET_USER_ROLE.INSTRUCTOR === getLoggedInUserRole() ? 6 : 3}>
              <Box sx={{ width: '100%', mt: 2 }}>
                <Typography sx={{ fontSize: '14px' }}>
                  {t('ASSESSMENTS.NO_ASSESSMENT_TYPE_FOUND')}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            mt: 2,
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Loader showBackdrop={false} />
        </Box>
      )}

      {!isLoading &&
        (!assessmentList?.length || !filteredCourseData?.length) &&
        centerData?.board && (
          <>
            {/* Show different message if courses exist but none match filters */}
            {courseData?.length > 0 && filteredCourseData?.length === 0 ? (
              <Box
                sx={{
                  background: theme.palette.action.selected,
                  py: 1,
                  borderRadius: 2,
                  mx: '20px',
                  mt: 2,
                  p: 2,
                }}
              >
                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                  {searchTerm ? 
                    t('COMMON.NO_COURSES_MATCH_SEARCH', { searchTerm }) || `No courses match your search "${searchTerm}" for the selected assessment type` :
                    t('COMMON.NO_COURSES_FOR_ASSESSMENT_TYPE') || `No courses available for the selected assessment type`
                  }
                </Typography>
              </Box>
            ) : (
              <NoDataFound />
            )}
          </>
        )}

      {!isLoading &&
        (!assessmentList?.length || !filteredCourseData?.length) &&
        !centerData?.board && (
          <Box
            sx={{
              background: theme.palette.action.selected,
              py: 1,
              borderRadius: 2,
              mx: '20px',
              mt: 2,
              p: 2,
            }}
          >
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
              {t('COMMON.NO_ASSIGNED_COURSES')}
            </Typography>
          </Box>
        )}

      {!isLoading && filteredCourseData?.length > 0 && (
        <>
          {/* Results count section */}
          <Box
            sx={{
              mt: 2,
              px: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1,
              mb: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: '500',
                color: theme?.palette?.warning['400'],
                flex: '1 1 auto',
                minWidth: '200px',
              }}
            >
              {filteredCourseData.length === 1
                ? t('COMMON.COURSES_FOUND', {
                  count: filteredCourseData.length,
                }) || `${filteredCourseData.length} Course Found`
                : t('COMMON.COURSES_FOUND_PLURAL', {
                  count: filteredCourseData.length,
                }) || `${filteredCourseData.length} Courses Found`}
            </Typography>
          </Box>

          {/* Course accordion cards */}
          <Box
            sx={{
              mx: '20px',
              mb: 2,
            }}
          >
            {filteredCourseData.map((course: any) => (
              <Accordion
                key={course.identifier}
                expanded={expandedAccordions.has(course.identifier)}
                onChange={handleAccordionChange(course.identifier)}
                sx={{
                  mb: 2,
                  borderRadius: '8px!important',
                  border: `1px solid ${theme.palette.warning['A100']}`,
                  '&:before': {
                    display: 'none',
                  },
                  '&.Mui-expanded': {
                    margin: '0 0 16px 0',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ArrowDropDownSharpIcon />}
                  sx={{
                    background: theme.palette.warning['A400'],
                    borderRadius: '8px',
                    '&.Mui-expanded': {
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    },
                    minHeight: '80px',
                    '& .MuiAccordionSummary-content': {
                      alignItems: 'center',
                      gap: 2,
                    },
                  }}
                >
                  {/* Course Icon */}
                  {course.appIcon && (
                    <Box
                      component="img"
                      src={course.appIcon}
                      alt={course.name}
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '8px',
                        objectFit: 'cover',
                        border: `2px solid ${theme.palette.warning['A200']}`,
                      }}
                    />
                  )}
                  
                  {/* Course Details */}
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: theme.palette.warning['300'],
                        mb: 0.5,
                        lineHeight: 1.3,
                      }}
                    >
                      {toPascalCase(course.name)}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: theme.palette.warning['400'],
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {course.description || 'No description available'}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: theme.palette.warning['300'],
                        mt: 0.5,
                        fontWeight: '500',
                      }}
                    >
                      {courseAssessments[course.identifier]?.length || 0} Assessment{courseAssessments[course.identifier]?.length !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails
                  sx={{
                    background: '#FBF4E4',
                    padding: '20px',
                  }}
                >
                  {courseAssessments[course.identifier]?.length > 0 ? (
                    <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
                      {courseAssessments[course.identifier].map((assessment: any) => (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={3}
                          key={assessment.identifier}
                        >
                          <Box
                            sx={{
                              border: `1px solid ${theme.palette.warning['A100']}`,
                              background: theme.palette.warning['A400'],
                              padding: '16px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                borderColor: theme.palette.warning['A200'],
                              },
                            }}
                            onClick={() =>
                              handleAssessmentDetails(
                                assessment?.identifier,
                                assessment?.subject,
                                course?.identifier
                              )
                            }
                          >
                            <Typography
                              sx={{
                                fontSize: '16px',
                                fontWeight: '500',
                                color: theme.palette.warning['300'],
                                mb: 1,
                                lineHeight: 1.3,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                              }}
                              title={assessment?.subject}
                            >
                              {toPascalCase(assessment?.subject)}
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                gap: '8px',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                mt: 'auto',
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  color: theme.palette.warning['300'],
                                }}
                              >
                                {assessment?.gradeLevel || '--'}
                              </Typography>
                              <FiberManualRecordIcon
                                sx={{
                                  fontSize: '8px',
                                  color: theme.palette.warning['400'],
                                }}
                              />
                              <Typography
                                sx={{
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  color: theme.palette.warning['400'],
                                }}
                              >
                                {toPascalCase(assessment?.board) || '--'}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography
                      sx={{
                        textAlign: 'center',
                        color: theme.palette.warning['400'],
                        fontStyle: 'italic',
                      }}
                    >
                      No assessments available for this course
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </>
      )}

      {/* {modalOpen && (
        <AssessmentSortModal
          open={modalOpen}
          onClose={handleCloseModal}
          modalTitle={t('COMMON.SORT_BY')}
          btnText={t('COMMON.APPLY')}
          onFilterApply={handleSorting}
          selectedOption={selectedSortOption || undefined}
        />
      )} */}
    </>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default AssessmentList;
