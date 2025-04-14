'use client';

import React, { useCallback, useEffect, useState } from 'react';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';
import { CommonSearch, getData, Layout } from '@shared-lib';
import { useRouter } from 'next/navigation';
import BackToTop from '../components/BackToTop';
import RenderTabContent from '../components/ContentTabs';
import HelpDesk from '../components/HelpDesk';
import { hierarchyAPI } from '../services/Hierarchy';
import { ContentSearch, ContentSearchResponse } from '../services/Search';
import FilterDialog from '../components/FilterDialog';
import { trackingData } from '../services/TrackingService';
import { ProfileMenu } from '../utils/menus';

export interface ContentProps {
  _grid?: object;
  filters?: object;
  contentTabs?: string[];
  cardName?: string;
  handleCardClick?: (content: ContentSearchResponse) => void | undefined;
  showFilter?: boolean;
  showSearch?: boolean;
  showBackToTop?: boolean;
  showHelpDesk?: boolean;
}
export default function Content(props: Readonly<ContentProps>) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [tabValue, setTabValue] = useState<number>();
  const [tabs, setTabs] = useState<any>([]);
  const [contentData, setContentData] = useState<ContentSearchResponse[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [localFilters, setLocalFilters] = useState<any>({
    limit: 5,
    offset: 0,
  });
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [frameworkFilter, setFrameworkFilter] = useState(false);
  const [trackData, setTrackData] = useState<[]>([]);
  const [filterShow, setFilterShow] = useState(false);
  const [propData, setPropData] = useState<ContentProps>();

  useEffect(() => {
    const init = async () => {
      const newData = await getData('mfes_content_pages_content');
      setPropData({
        showSearch: true,
        showFilter: true,
        ...(props || newData),
      });
      setTabValue(0);
      setIsPageLoading(false);
    };
    init();
  }, [props]);

  const fetchContent = useCallback(async (filters: any) => {
    try {
      let data: any;
      if (filters.identifier) {
        const result = await hierarchyAPI(filters.identifier);
        data = [result];
      } else {
        data = await ContentSearch(filters);
      }
      return data;
    } catch (error) {
      console.error('Failed to fetch content:', error);
      return [];
    }
  }, []);

  const fetchDataTrack = useCallback(async (resultData: any) => {
    if (!resultData.length) return; // Ensure contentData is available
    try {
      const courseList = resultData.map((item: any) => item.identifier); // Extract all identifiers
      const userId =
        localStorage.getItem('subId') ?? localStorage.getItem('userId');
      const userIdArray = userId?.split(',');
      if (!userId || !courseList.length) return; // Ensure required values exist
      //@ts-ignore
      const course_track_data = await trackingData(userIdArray, courseList);
      if (course_track_data?.data) {
        //@ts-ignore

        return (
          course_track_data.data.find((course: any) => course.userId === userId)
            ?.course || []
        );
      }
    } catch (error) {
      console.error('Error fetching track data:', error);
    }
  }, []);

  useEffect(() => {
    if (tabValue !== undefined && tabs?.[tabValue]?.type) {
      setLocalFilters((prevFilters: any) => ({
        ...prevFilters,
        type: tabs?.[tabValue]?.type,
        offset: 0,
      }));
    }
  }, [tabValue, tabs]);

  const handleLoadMore = (event: any) => {
    event.preventDefault();
    setLocalFilters((prevFilters: any) => ({
      ...prevFilters,
      offset: prevFilters.offset + prevFilters.limit,
    }));
  };

  const handleSearchClick = async () => {
    setLocalFilters((prevFilters: any) => ({
      ...prevFilters,
      query: searchValue.trim(),
      offset: 0,
    }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCardClickLocal = async (content: ContentSearchResponse) => {
    try {
      if (
        [
          'application/vnd.ekstep.ecml-archive',
          'application/vnd.ekstep.html-archive',
          'application/vnd.ekstep.h5p-archive',
          'application/pdf',
          'video/mp4',
          'video/webm',
          'application/epub',
          'video/x-youtube',
          'application/vnd.sunbird.questionset',
        ].includes(content?.mimeType as string)
      ) {
        if (propData?.handleCardClick) {
          propData.handleCardClick(content);
        } else {
          router.push(`/player/${content?.identifier}`);
        }
      } else {
        router.push(`/content-details/${content?.identifier}`);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const init = () => {
      const cookies = document.cookie.split('; ');
      const subid = cookies
        .find((row) => row.startsWith('subid='))
        ?.split('=')[1];

      localStorage.setItem('subId', `${subid}`);
      const filteredTabs = [
        {
          label: 'Courses',
          type: 'Course',
        },
        {
          label: 'Content',
          type: 'Learning Resource',
        },
      ].filter((tab) =>
        Array.isArray(propData?.contentTabs) && propData.contentTabs.length > 0
          ? propData?.contentTabs?.includes(tab.label?.toLowerCase())
          : true
      );
      setTabs(filteredTabs);
      setLocalFilters((prevFilters: any) => ({
        ...prevFilters,
        ...(propData?.filters || {}),
      }));
    };
    init();
  }, [propData?.filters, propData?.contentTabs]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        if (
          localFilters.type &&
          localFilters.limit &&
          localFilters.offset !== undefined
        ) {
          const { result } = await fetchContent(localFilters);
          const newContentData = Object.values(result)
            .filter((e): e is ContentSearchResponse[] => Array.isArray(e))
            .flat();
          const userTrackData = await fetchDataTrack(newContentData || []);
          if (localFilters.offset === 0) {
            setContentData((newContentData as ContentSearchResponse[]) || []);
            setTrackData(userTrackData);
          } else {
            setContentData((prevState: any) => [
              ...prevState,
              ...(newContentData || []),
            ]);
            setTrackData(
              (prevState: []) => [...prevState, ...(userTrackData || [])] as []
            );
          }
          setHasMoreData(
            result?.count > localFilters.offset + newContentData?.length
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [localFilters, fetchContent, fetchDataTrack]);

  const handleApplyFilters = async (selectedValues: any) => {
    if (Object.keys(selectedValues).length === 0) {
      setLocalFilters((prevFilters: any) => ({
        ...prevFilters,
        filters: {},
        offset: 0,
      }));
    } else {
      const { limit, offset, ...selectedValuesWithoutLimitOffset } =
        selectedValues;
      setLocalFilters((prevFilters: any) => ({
        ...prevFilters,
        offset: 0,
        filters: {
          ...prevFilters.filters,
          ...selectedValuesWithoutLimitOffset,
        },
      }));
    }
  };

  //get filter framework
  useEffect(() => {
    const fetchFramework = async () => {
      try {
        const url = `${
          process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL
        }/interface/v1/api/framework/v1/read/${
          localStorage.getItem('framework') || process.env.NEXT_PUBLIC_FRAMEWORK
        }`;
        const frameworkData = await fetch(url).then((res) => res.json());
        const frameworks = frameworkData?.result?.framework;
        setFrameworkFilter(frameworks);
      } catch (error) {
        console.error('Error fetching board data:', error);
      }
    };
    fetchFramework();
  }, [router]);

  return (
    <Layout
      isLoadingChildren={isPageLoading}
      showTopAppBar={{
        title: 'Shiksha: Home',
        showMenuIcon: true,
        actionButtonLabel: 'Action',
        ...ProfileMenu(),
      }}
      showFilter={true}
      isFooter={false}
      showLogo={true}
      showBack={true}
    >
      <Box sx={{ p: 1 }}>
        {(propData?.showSearch || propData?.showFilter) && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {propData?.showSearch && (
              <CommonSearch
                placeholder={'Search content..'}
                rightIcon={<SearchIcon />}
                onRightIconClick={handleSearchClick}
                inputValue={searchValue || ''}
                onInputChange={handleSearchChange}
                onKeyPress={(ev: any) => {
                  if (ev.key === 'Enter') {
                    handleSearchClick();
                  }
                }}
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
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backgroundColor: '#ECE6F0',
                    borderRadius: '12px',
                    // padding: '8px',
                    width: '56px',
                    height: '46px',
                    '&:hover': {
                      backgroundColor: '#E0E0E0',
                      boxShadow: '0px 4px 8px 3px #00000026',
                    },
                    marginLeft: '4px',
                    marginRight: '7px',

                    boxShadow: '0px 1px 3px 0px #0000004D',
                  }}
                  onClick={() => setFilterShow(true)}
                >
                  <FilterAltOutlinedIcon
                    sx={{ color: '#6750A4', fontSize: '25px' }}
                  />
                </Box>
                <FilterDialog
                  open={filterShow}
                  onClose={() => setFilterShow(false)}
                  frameworkFilter={frameworkFilter}
                  filterValues={localFilters}
                  onApply={handleApplyFilters}
                />
              </Box>
            )}
          </Box>
        )}
        <RenderTabContent
          {...propData}
          value={tabValue}
          onChange={handleTabChange}
          contentData={contentData}
          _grid={propData?._grid || {}}
          trackData={trackData || []}
          type={localFilters?.type || ''}
          handleCardClick={handleCardClickLocal}
          hasMoreData={hasMoreData}
          handleLoadMore={handleLoadMore}
          isLoadingMoreData={isLoading}
          isPageLoading={isLoading && localFilters?.offset === 0}
          tabs={tabs}
        />
        {propData?.showHelpDesk && <HelpDesk />}
        {propData?.showBackToTop && showBackToTop && <BackToTop />}
      </Box>
    </Layout>
  );
}
