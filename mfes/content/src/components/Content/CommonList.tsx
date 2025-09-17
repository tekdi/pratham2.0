'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, useTheme, useMediaQuery } from '@mui/material';
import {
  calculateTrackDataItem,
  CommonSearch,
  ContentItem,
  getData,
} from '@shared-lib';
import { useRouter, useSearchParams } from 'next/navigation';
import BackToTop from '@content-mfes/components/BackToTop';
import RenderTabContent from '@content-mfes/components/ContentTabs';
import HelpDesk from '@content-mfes/components/HelpDesk';
import {
  CommonContentSearch,
  ContentSearchResponse as ImportedContentSearchResponse,
} from '@content-mfes/services/Search';
import FilterDialog from '@content-mfes/components/FilterDialog';
import { trackingData } from '@content-mfes/services/TrackingService';
import LayoutPage from '@content-mfes/components/LayoutPage';
import { getUserCertificates } from '@content-mfes/services/Certificate';
import { getUserId } from '@shared-lib-v2/utils/AuthService';
import { telemetryFactory } from '@shared-lib-v2/DynamicForm/utils/telemetry';

// Constants
const SUPPORTED_MIME_TYPES = [
  'application/vnd.ekstep.ecml-archive',
  'application/vnd.ekstep.html-archive',
  'application/vnd.ekstep.h5p-archive',
  'application/pdf',
  'video/mp4',
  'video/webm',
  'application/epub',
  'video/x-youtube',
  'application/vnd.sunbird.questionset',
];

const DEFAULT_TABS = [
  { label: 'Courses', type: 'Course' },
  { label: 'Content', type: 'Learning Resource' },
  {
    "label": "Job family",
    "type": "Job family"
},
{
    "label": "Group Membership",
    "type": "Group Membership"
},
{
  "label": "PSU",
  "type": "PSU"
}
];

// Custom hook to get current breakpoint
const useCurrentBreakpoint = (theme: any) => {
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  const isXl = useMediaQuery(theme.breakpoints.up('xl'));

  if (isXl) return 'xl';
  if (isLg) return 'lg';
  if (isMd) return 'md';
  if (isSm) return 'sm';
  return 'xs';
};

// Calculate minimum limit for 2 rows based on specific breakpoint
const calculateLimitForBreakpoint = (breakpoint: string, gridConfig?: any) => {
  const defaultBreakpoints = {
    xs: 6, // 2 items per row -> 4 items for 2 rows
    sm: 6, // 2 items per row -> 4 items for 2 rows
    md: 4, // 3 items per row -> 6 items for 2 rows
    lg: 3, // 4 items per row -> 8 items for 2 rows
    xl: 2.4, // 5 items per row -> 10 items for 2 rows
  };

  const actualBreakpoints = {
    xs: gridConfig?.xs ?? defaultBreakpoints.xs,
    sm: gridConfig?.sm ?? defaultBreakpoints.sm,
    md: gridConfig?.md ?? defaultBreakpoints.md,
    lg: gridConfig?.lg ?? defaultBreakpoints.lg,
    xl: gridConfig?.xl ?? defaultBreakpoints.xl,
  };

  const currentGridValue =
    actualBreakpoints[breakpoint as keyof typeof actualBreakpoints];
  const itemsPerRow = Math.floor(12 / currentGridValue);
  const limitForTwoRows = itemsPerRow * 2;
  return limitForTwoRows;
};

const LIMIT = calculateLimitForBreakpoint('xl'); // Will be 10 for xl breakpoint
const DEFAULT_FILTERS = {
  limit: LIMIT,
  offset: 0,
};

interface TrackDataItem {
  courseId: string;
  enrolled: boolean;
  [key: string]: any;
}

export interface ContentProps {
  _config?: any;
  filters?: object;
  contentTabs?: string[];
  pageName?: string;
  bodyElementObj?: {
    bodyId?: string;
    topPadding?: number;
  };
  handleCardClick?: (
    content: ContentItem,
    e?: any,
    rowNumber?: number
  ) => void | undefined;
  showFilter?: boolean;
  showSearch?: boolean;
  showBackToTop?: boolean;
  showHelpDesk?: boolean;
  isShowLayout?: boolean;
  hasMoreData?: boolean;
  onTotalCountChange?: (count: number) => void;
  telemetryFunctionCalls?: any;
  totalResources?:number;
  setTotalResources?: (count:number) => void;
}

export default function Content(props: Readonly<ContentProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const currentBreakpoint = useCurrentBreakpoint(theme);
  const [searchValue, setSearchValue] = useState('');
  const [tabValue, setTabValue] = useState<number>(0);
  console.log('DEFAULT_TABS======>', DEFAULT_TABS);
  
  const [tabs, setTabs] = useState<typeof DEFAULT_TABS>([]);
  const [contentData, setContentData] = useState<
    ImportedContentSearchResponse[]
  >([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(false);
  const [localFilters, setLocalFilters] = useState<
    typeof DEFAULT_FILTERS & {
      type?: string;
      query?: string;
      filters?: object;
      identifier?: string;
    }
  >(DEFAULT_FILTERS);
  const [trackData, setTrackData] = useState<TrackDataItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [filterShow, setFilterShow] = useState(false);
  const [propData, setPropData] = useState<ContentProps>();
  const [currentLimit, setCurrentLimit] = useState<number>(LIMIT);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Session keys
  const sessionKeys = {
    filters: `${props?.pageName}_savedFilters`,
    search: `${props?.pageName}_searchValue`,
    scrollId: `${props?.pageName}_scrollToContentId`,
  };

  // Save filters to session
  const persistFilters = useCallback(
    (f: any) => sessionStorage.setItem(sessionKeys.filters, JSON.stringify(f)),
    [sessionKeys.filters]
  );

  const handleSetFilters = useCallback(
    (updater: any) => {
      const updated =
        typeof updater === 'function'
          ? updater(localFilters)
          : { ...localFilters, ...updater };
      setLocalFilters({ ...updated, loadOld: false });
    },
    [localFilters]
  );

  // Responsive limit calculation - recalculate when screen size changes
  useEffect(() => {
    const calculateResponsiveLimit = () => {
      if (propData?._config) {
        const newLimit = calculateLimitForBreakpoint(
          currentBreakpoint,
          propData._config._grid
        );
        if (newLimit !== currentLimit) {
          console.log(
            `Limit changed from ${currentLimit} to ${newLimit} due to screen size change`
          );
          setCurrentLimit(newLimit);
          // Reset offset when limit changes, but respect explicit limit if provided
          setLocalFilters((prev) => ({
            ...prev,
            limit: (propData?.filters as any)?.limit || newLimit,
            offset: 0,
          }));
        }
      }
    };

    // Calculate on mount and when propData changes
    calculateResponsiveLimit();

    // Listen for window resize to recalculate
    const handleResize = () => {
      calculateResponsiveLimit();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [propData, currentBreakpoint, currentLimit]);

  // Restore saved state
  useEffect(() => {
    const init = async () => {
      const savedFilters = JSON.parse(
        sessionStorage.getItem(sessionKeys.filters) || 'null'
      );
      const savedSearch = sessionStorage.getItem(sessionKeys.search) || '';

      // Get tab value from URL parameter
      const urlTab = searchParams.get('tab');
      const savedTab = urlTab ? parseInt(urlTab) : 0;

      const config = props ?? (await getData('mfes_content_pages_content'));
      setPropData(config);
      setSearchValue(savedSearch);

      // Calculate dynamic limit based on current device breakpoint
      const dynamicLimit = calculateLimitForBreakpoint(
        currentBreakpoint,
        config?._config?._grid
      );
      setCurrentLimit(dynamicLimit);

      // 🎯 First filter tabs based on contentTabs configuration
      const filteredTabs = DEFAULT_TABS.filter((tab) =>
        config?.contentTabs?.length
          ? config.contentTabs.includes(tab.label.toLowerCase())
          : true
      );
      
      // 🔧 Get the correct type based on filtered tabs, not DEFAULT_TABS
      const getCorrectType = (tabIndex: number) => {
        // Ensure we don't exceed the filtered tabs array
        const safeIndex = Math.min(tabIndex, filteredTabs.length - 1);
        const selectedTab = filteredTabs[safeIndex];
        console.log(`🎯 Tab ${tabIndex} → Using type: "${selectedTab?.type}" from tab: "${selectedTab?.label}"`);
        return selectedTab?.type || filteredTabs[0]?.type || 'Course';
      };

      if (savedFilters) {
        setLocalFilters({
          ...(config?.filters ?? {}),
          type: getCorrectType(savedTab),
          ...savedFilters,
          loadOld: true,
        });
      } else {
        setLocalFilters((prev) => ({
          ...prev,
          ...(config?.filters ?? {}),
          type: getCorrectType(savedTab),
          limit: (config?.filters as any)?.limit || dynamicLimit, // Use explicit limit if provided, otherwise dynamic limit
          offset: 0, // Start with offset 0
          loadOld: false,
        }));
      }

      setTabs(filteredTabs);
      setTabValue(savedTab);
      setIsPageLoading(false);
    };
    init();
  }, [
    props,
    sessionKeys.filters,
    sessionKeys.search,
    searchParams,
    currentBreakpoint,
  ]);
  // Fetch content with loop to load full data up to offset
  const fetchAllContent = useCallback(
    async (filter: any) => {
      const content: any[] = [];
      const QuestionSet: any[] = [];
      let count = 0;

      if (!filter.type) {
        return { content, QuestionSet, count };
      }

      if (abortControllerRef.current) abortControllerRef.current.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Calculate adjusted limit if loadOld is true
      const adjustedLimit = filter.loadOld
        ? filter.offset + filter.limit
        : filter.limit;
      const adjustedOffset = filter.loadOld ? 0 : filter.offset;

      console.log('🔍 ContentSearch called with filter:', {
        ...filter,
        offset: adjustedOffset,
        limit: adjustedLimit
      });

      const resultResponse = await CommonContentSearch({
        ...filter,
        offset: adjustedOffset,
        limit: adjustedLimit,
        signal: controller.signal,
      });

      if (resultResponse?.result?.count) {
        setTotalCount(resultResponse?.result?.count);
        if(props.setTotalResources)
        {
          props.setTotalResources(resultResponse?.result?.count);
        }
     
      }

      const response = resultResponse?.result;
      if (props?._config?.getContentData) {
        props._config.getContentData(response);
      }

      content.push(...(response?.content || []));
      QuestionSet.push(...(response?.QuestionSet || []));
      count = response?.count || 0;

      return {
        content,
        QuestionSet,
        count,
      };
    },
    [props?._config]
  );

  // Memoized track data fetching
  const fetchDataTrack = useCallback(
    async (
      resultData: ImportedContentSearchResponse[]
    ): Promise<TrackDataItem[]> => {
      if (!resultData.length) return [];

      try {
        const courseList = resultData
          .map((item) => item.identifier)
          .filter((id): id is string => id !== undefined);
        const userId = getUserId(props?._config?.userIdLocalstorageName);

        if (!userId || !courseList.length) return [];
        const userIdArray = userId.split(',').filter(Boolean);
        const [courseTrackData, certificates] = await Promise.all([
          trackingData(userIdArray, courseList),
          getUserCertificates({
            userId: userId,
            courseId: courseList,
            limit: localFilters.limit,
            offset: localFilters.offset,
          }),
        ]);

        if (!courseTrackData?.data) return [];

        const userTrackData =
          courseTrackData.data.find((course: any) => course.userId === userId)
            ?.course ?? [];

        return userTrackData.map((item: any) => ({
          ...item,
          ...calculateTrackDataItem(
            item,
            resultData.find(
              (subItem) => item.courseId === subItem.identifier
            ) ?? {}
          ),
          enrolled: Boolean(
            certificates.result.data.find(
              (cert: any) => cert.courseId === item.courseId
            )?.status === 'enrolled'
          ),
        }));
      } catch (error) {
        console.error('Error fetching track data:', error);
        return [];
      }
    },
    [
      localFilters.limit,
      localFilters.offset,
      props?._config?.userIdLocalstorageName,
    ]
  );

  // Load content when filters change
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (
        !localFilters.type ||
        !localFilters.limit ||
        localFilters.offset === undefined
      )
        return;

      setIsLoading(true);
      try {
        const response = await fetchAllContent(localFilters);
        if (!response || !isMounted) return;
        const newContentData = [
          ...(response.content ?? []),
          ...(response?.QuestionSet ?? []),
        ];
        const userTrackData = await fetchDataTrack(newContentData);
        console.log('userTrackData', userTrackData);
        if (!isMounted) return;
        if (localFilters.offset === 0) {
          setContentData(newContentData);
          setTrackData(userTrackData);
        } else {
          setContentData((prev) => [...(prev ?? []), ...newContentData]);
          setTrackData((prev) => [...prev, ...userTrackData]);
        }

        setHasMoreData(
          propData?.hasMoreData === false
            ? false
            : response.count > localFilters.offset + newContentData.length
        );
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set empty arrays on error to maintain array type
        if (localFilters.offset === 0) {
          setContentData([]);
          setTrackData([]);
        }
      }
    };
    fetchData();

    return () => {
      isMounted = false;
      abortControllerRef.current?.abort();
    };
  }, [
    localFilters,
    fetchAllContent,
    fetchDataTrack,
    propData?.hasMoreData,
    propData?.filters,
  ]);

  // Scroll to saved card ID
  useEffect(() => {
    if (contentData?.length > 0) {
      scrollToSavedContent(sessionKeys, props?.bodyElementObj);
    }
  }, [contentData, sessionKeys, props?.bodyElementObj]);

  // Event handlers
  const handleLoadMore = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      handleSetFilters({
        ...localFilters,
        offset: localFilters.offset + localFilters.limit,
      });
    },
    [handleSetFilters, localFilters]
  );

  // UI Handlers
  const handleSearchClick = useCallback(() => {
    sessionStorage.setItem(sessionKeys.search, searchValue);
    handleSetFilters((prev: any) => ({
      ...prev,
      query: searchValue.trim(),
      offset: 0,
    }));
  }, [searchValue, sessionKeys.search, handleSetFilters]);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value);
    },
    []
  );

  const handleTabChange = (event: any, newValue: number) => {
    console.log('🔄 Tab change:', newValue);
    console.log('📋 Available tabs:', tabs);
    console.log('🎯 Selected tab:', tabs[newValue]);
    console.log('🔍 Setting filter type:', tabs[newValue]?.type);
    
    setTabValue(newValue);

    // Update URL with new tab parameter
    const url = new URL(window.location.href);
    url.searchParams.set('tab', newValue.toString());
    router.replace(url.pathname + url.search);

    handleSetFilters({
      offset: 0,
      type: tabs[newValue].type,
    });
  };

  const handleCardClickLocal = useCallback(
    async (content: ContentItem, e?: any, rowNumber?: number) => {
      console.log('Card clicked--------:', content);
      if (typeof window !== 'undefined') {
        const windowUrl = window.location.href;
        // const cleanedUrl = windowUrl.replace(/^\//, '');
        // const env = cleanedUrl.split('/')[0];
        const telemetryInteract = {
          context: {
            env: windowUrl.split('/')[0],
            cdata: [],
          },
          edata: {
            id: 'clicked on ' + content?.contentType + ':' + content?.name,
            type: 'CLICK',
            subtype: '',
            pageid: windowUrl,
            program: localStorage.getItem('userProgram') || '',
            doId: content?.identifier,
          },
        };
        telemetryFactory.interact(telemetryInteract);
      }

      try {
        sessionStorage.setItem(
          sessionKeys.scrollId,
          JSON.stringify({
            id: `${props?.pageName}-${content?.identifier}`,
            rowNumber,
          })
        );
        persistFilters(localFilters);
        if (propData?.handleCardClick) {
          propData.handleCardClick(content, e, rowNumber);
        } else if (SUPPORTED_MIME_TYPES.includes(content?.mimeType)) {
          router.push(
            `${props?._config?.contentBaseUrl ?? ''}/player/${content?.identifier
            }?activeLink=${window.location.pathname + window.location.search}`
          );
        } else {
          router.push(
            `${props?._config?.contentBaseUrl ?? ''}/content-details/${content?.identifier
            }?activeLink=${window.location.pathname + window.location.search}`
          );
        }
      } catch (error) {
        console.error('Failed to handle card click:', error);
      }
    },
    [
      propData?.handleCardClick,
      props?._config?.contentBaseUrl,
      sessionKeys.scrollId,
      router,
      localFilters,
      persistFilters,
    ]
  );

  const handleApplyFilters = useCallback((selectedValues: any) => {
    setFilterShow(false);
    handleSetFilters((prev: any) => ({
      ...prev,
      offset: 0,
      filters:
        Object.keys(selectedValues).length === 0
          ? {}
          : { ...prev.filters, ...selectedValues },
    }));
  }, []);

  // Memoized JSX
  const searchAndFilterSection = useMemo(
    () =>
      (propData?.showSearch ?? propData?.showFilter) && (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            overflow: 'unset !important',
          }}
        >
          {propData?.showSearch && (
            <CommonSearch
              placeholder="Search content.."
              rightIcon={<SearchIcon />}
              onRightIconClick={handleSearchClick}
              inputValue={searchValue}
              onInputChange={handleSearchChange}
              onKeyPress={(ev: any) =>
                ev.key === 'Enter' && handleSearchClick()
              }
              sx={{
                backgroundColor: '#f0f0f0',
                padding: '4px',
                borderRadius: '50px',
                width: '100%',
                marginLeft: '10px',
              }}
            />
          )}
          {propData?.showFilter && (
            <Box>
              <Button variant="outlined" onClick={() => setFilterShow(true)}>
                <FilterAltOutlinedIcon />
              </Button>
              <FilterDialog
                open={filterShow}
                onClose={() => setFilterShow(false)}
                filterValues={localFilters}
                onApply={handleApplyFilters}
              />
            </Box>
          )}
        </Box>
      ),
    [
      propData?.showSearch,
      propData?.showFilter,
      searchValue,
      filterShow,
      localFilters,
      handleSearchClick,
      handleSearchChange,
      handleApplyFilters,
    ]
  );

  // Call onTotalCountChange callback when totalCount changes
  useEffect(() => {
    if (props?.onTotalCountChange) {
      props.onTotalCountChange(totalCount);
    }
  }, [totalCount, props?.onTotalCountChange]);

  return (
    <LayoutPage
      isLoadingChildren={isPageLoading}
      isShow={propData?.isShowLayout}
    >
      {searchAndFilterSection}
      <RenderTabContent
        {...propData}
        value={tabValue}
        onChange={handleTabChange}
        contentData={contentData}
        _config={propData?._config ?? {}}
        trackData={trackData as any}
        type={localFilters?.type ?? ''}
        handleCardClick={handleCardClickLocal}
        hasMoreData={hasMoreData}
        handleLoadMore={handleLoadMore}
        isLoadingMoreData={isLoading}
        isPageLoading={isLoading && localFilters?.offset === 0}
        tabs={tabs}
        isHideEmptyDataMessage={propData?.hasMoreData !== false}
      />
      {propData?.showHelpDesk && <HelpDesk />}
      {propData?.showBackToTop && <BackToTop />}
    </LayoutPage>
  );
}

function scrollToSavedContent(
  sessionKeys: any,
  config?: { topPadding?: number; bodyId?: string }
) {
  const scrollName = sessionKeys.scrollId;
  const keyValue = sessionStorage.getItem(scrollName);
  const scrollId = keyValue
    ? keyValue.startsWith('{')
      ? JSON.parse(keyValue)
      : {}
    : {};
  if (!scrollId.id) return;

  const el = document.getElementById(scrollId.id);
  if (el) {
    if (config?.bodyId) {
      const body = document.getElementById(config?.bodyId);
      if (body) {
        const top =
          el.getBoundingClientRect().top +
          body.scrollTop -
          (scrollId?.rowNumber === 1 && config?.topPadding
            ? config?.topPadding * 2
            : 0); // 100px top padding
        console.log('top sagar', top);
        body.scrollTo({ top, behavior: 'smooth' });
      }
    } else {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
    sessionStorage.removeItem(scrollName);

    if (sessionKeys.filters) {
      sessionStorage.removeItem(sessionKeys.filters);
    }
  } else {
    // Retry in the next animation frame if element not yet mounted
    requestAnimationFrame(() => {
      const retryEl = document.getElementById(scrollId);
      if (retryEl) {
        retryEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
        sessionStorage.removeItem(scrollName);
        if (sessionKeys.scrollId) {
          sessionStorage.removeItem(sessionKeys.filters);
        }
      }
    });
  }
}
