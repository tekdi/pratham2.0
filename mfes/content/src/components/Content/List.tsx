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
import { Box, Button } from '@mui/material';
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
import { hierarchyAPI } from '@content-mfes/services/Hierarchy';
import {
  ContentSearch,
  ContentSearchResponse as ImportedContentSearchResponse,
  ResultProp,
} from '@content-mfes/services/Search';
import FilterDialog from '@content-mfes/components/FilterDialog';
import { trackingData } from '@content-mfes/services/TrackingService';
import LayoutPage from '@content-mfes/components/LayoutPage';
import { getUserCertificates } from '@content-mfes/services/Certificate';
import { getUserId } from '@shared-lib-v2/utils/AuthService';

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
];

const DEFAULT_FILTERS = {
  limit: 5,
  offset: 0,
};

interface TrackDataItem {
  courseId: string;
  enrolled: boolean;
  [key: string]: any;
}

interface HierarchyResponse {
  identifier: string;
  mimeType: string;
  children?: [ImportedContentSearchResponse];
  [key: string]: any;
}

export interface ContentProps {
  _config?: any;
  filters?: object;
  contentTabs?: string[];
  cardName?: string;
  handleCardClick?: (content: ContentItem) => void | undefined;
  showFilter?: boolean;
  showSearch?: boolean;
  showBackToTop?: boolean;
  showHelpDesk?: boolean;
  isShowLayout?: boolean;
  hasMoreData?: boolean;
}

export default function Content(props: Readonly<ContentProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState('');
  const [tabValue, setTabValue] = useState<number>(0);
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
  const [filterShow, setFilterShow] = useState(false);
  const [propData, setPropData] = useState<ContentProps>();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize component
  useEffect(() => {
    const init = async () => {
      try {
        const newData = await getData('mfes_content_pages_content');
        const newProp = {
          showSearch: true,
          showFilter: true,
          ...(props ?? newData),
        };
        setPropData(newProp);
        // Set initial filters after propData is set
        setLocalFilters((prev) => ({
          ...prev,
          ...(newProp?.filters ?? {}),
          type:
            props?.contentTabs?.length === 1
              ? props.contentTabs[0]
              : DEFAULT_TABS[0].type,
        }));

        // Set initial tabs after propData is set
        const filteredTabs = DEFAULT_TABS.filter((tab) =>
          Array.isArray(newProp?.contentTabs) && newProp.contentTabs.length > 0
            ? newProp.contentTabs.includes(tab.label.toLowerCase())
            : true
        );
        setTabs(filteredTabs);
        const tabParam = searchParams?.get('tab');
        if (tabParam && filteredTabs?.[Number(tabParam)]) {
          setTabValue(Number(tabParam));
        } else {
          setTabValue(0);
        }
        setIsPageLoading(false);
      } catch (error) {
        console.error('Failed to initialize component:', error);
        setIsPageLoading(false);
      }
    };
    init();
  }, [props, searchParams]);

  // Memoized content fetching with cancellation
  const fetchContent = useCallback(
    async (filter: typeof localFilters): Promise<ResultProp> => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        if (filter.identifier) {
          const hierarchyResult = (await hierarchyAPI(
            filter.identifier
          )) as unknown as HierarchyResponse;
          const defaultChild: ImportedContentSearchResponse = {
            identifier: '',
            mimeType: '',
            children: [{} as ImportedContentSearchResponse],
          };
          const result: ImportedContentSearchResponse = {
            ...hierarchyResult,
            children: hierarchyResult.children || [defaultChild],
          };
          return {
            content: [result],
            count: 1,
          };
        }

        if (!filter.type) {
          throw new Error('Type is required for content search');
        }

        const resultResponse = await ContentSearch({
          ...filter,
          type: filter.type,
        });
        const response = resultResponse?.result;
        if (props?._config?.getContentData) {
          props?._config?.getContentData(response);
        }
        return response;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Request was cancelled');
          return { content: [], count: 0 };
        }
        console.error('Failed to fetch content:', error);
        return { content: [], count: 0 };
      }
    },
    []
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

  // Fetch content data with proper state management
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
        const response = await fetchContent(localFilters);
        if (!response || !isMounted) return;
        const newContentData = response.content ?? [];
        const userTrackData = await fetchDataTrack(newContentData);
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
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set empty arrays on error to maintain array type
        if (localFilters.offset === 0) {
          setContentData([]);
          setTrackData([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [
    localFilters,
    fetchContent,
    fetchDataTrack,
    propData?.hasMoreData,
    propData?.filters,
  ]);

  // Update filters when tab changes
  useEffect(() => {
    if (tabValue !== undefined && tabs[tabValue]?.type) {
      setLocalFilters((prev) => ({
        ...prev,
        type: tabs[tabValue].type,
        offset: 0,
      }));
    }
  }, [tabValue, tabs]);

  // Event handlers
  const handleLoadMore = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setLocalFilters((prev) => ({
      ...prev,
      offset: prev.offset + prev.limit,
    }));
  }, []);

  const handleSearchClick = useCallback(() => {
    setLocalFilters((prev) => ({
      ...prev,
      query: searchValue.trim(),
      offset: 0,
    }));
  }, [searchValue]);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value);
    },
    []
  );

  const handleTabChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', newValue.toString());
      window.history.replaceState(null, '', url.toString());
      setTabValue(newValue);
    },
    []
  );

  const handleCardClickLocal = useCallback(
    async (content: ContentItem) => {
      try {
        if (propData?.handleCardClick) {
          propData.handleCardClick(content);
        } else if (SUPPORTED_MIME_TYPES.includes(content?.mimeType)) {
          router.push(`/player/${content?.identifier}`);
        } else {
          router.push(`/content-details/${content?.identifier}`);
        }
      } catch (error) {
        console.error('Failed to handle card click:', error);
      }
    },
    [propData?.handleCardClick, router]
  );

  const handleApplyFilters = useCallback((selectedValues: any) => {
    setFilterShow(false);
    setLocalFilters((prev) => ({
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
