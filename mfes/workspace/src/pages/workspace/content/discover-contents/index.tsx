import KaTableComponent from '@workspace/components/KaTableComponent';
import Loader from '@workspace/components/Loader';
import PaginationComponent from '@workspace/components/PaginationComponent';
import WorkspaceText from '@workspace/components/WorkspaceText';
import { timeAgo } from '@workspace/utils/Helper';
import { LIMIT } from '@workspace/utils/app.constant';
import useSharedStore from '../../../../../../shared-store';
import { Box, Typography, useTheme } from '@mui/material';
import { DataType } from 'ka-table/enums';
import 'ka-table/style.css';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Layout from '../../../../components/Layout';
import SearchBox from '../../../../components/SearchBox';
import {
  getContent,
  getfilterList,
  getPosFrameworkList,
  getMediaFilterList,
} from '../../../../services/ContentService';
import useTenantConfig from '@workspace/hooks/useTenantConfig';
import WorkspaceHeader from '@workspace/components/WorkspaceHeader';
import DynamicMultiFilter from '../../../../components/DynamicMultiFilter';
// const columns = [
//   { key: 'name', title: 'Content', dataType: DataType.String, width: "450px" },
//   { key: 'lastUpdatedOn', title: 'Last Updated', dataType: DataType.String, width: "300px" },
//   { key: 'status', title: 'Status', dataType: DataType.String, width: "300px" },
//   { key: 'contentAction', title: 'Action', dataType: DataType.String, width: "200px" },

// ]
const columns = [
  {
    key: 'title_and_description',
    title: 'TITLE & DESCRIPTION',
    dataType: DataType.String,
    width: '350px',
  },
  {
    key: 'create-by',
    title: 'CREATED BY',
    dataType: DataType.String,
    width: '200px',
  },

  {
    key: 'contentType',
    title: 'CONTENT TYPE',
    dataType: DataType.String,
    width: '200px',
  },
  {
    key: 'language',
    title: 'Content Language',
    dataType: DataType.String,
    width: '200px',
  },
  { key: 'state', title: 'STATE', dataType: DataType.String, width: '100px' },

  { key: 'status', title: 'STATUS', dataType: DataType.String, width: '100px' },
  {
    key: 'lastUpdatedOn',
    title: 'LAST MODIFIED',
    dataType: DataType.String,
    width: '100px',
  },
  {
    key: 'contentAction',
    title: 'ACTION',
    dataType: DataType.String,
    width: '140px',
  },
];
const ContentsPage = () => {
  const tenantConfig = useTenantConfig();
  const theme = useTheme<any>();
  const router = useRouter();
  const [showHeader, setShowHeader] = useState<boolean | null>(null);
  const [selectedKey, setSelectedKey] = useState('discover-contents');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNames, setSelectedNames] = useState<Record<string, string[]>>(
    {}
  );

  const { filterOptions, sort } = router.query;

  const [filter, setFilter] = useState<any[]>([]);

  useEffect(() => {
    if (typeof filterOptions === 'string') {
      try {
        const parsed = JSON.parse(filterOptions);
        setFilter(parsed);
      } catch (error) {
        console.error('Failed to parse filterOptions:', error);
      }
    }
  }, [filterOptions]); // Update filter when router query changes

  const [sortBy, setSortBy] = useState('');
  useEffect(() => {
    setSortBy(sort?.toString() || 'Modified On');
  }, [sort]);
  const [contentList, setContentList] = React.useState<content[]>([]);
  const [data, setData] = React.useState<any[]>([]);
  const prevFilterRef = useRef(filter);

  const [loading, setLoading] = useState(false);
  const [contentDeleted, setContentDeleted] = React.useState(false);
  const fetchContentAPI = useSharedStore((state: any) => state.fetchContentAPI);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(searchTerm);
  const prevSearchTermRef = useRef(debouncedSearchTerm);
  const [totalCount, setTotalCount] = useState(0);
  const stateQuery: string =
    typeof router.query.state === 'string' ? router.query.state : 'All';
  const [state, setState] = useState<string>(stateQuery);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage - 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  useEffect(() => {
    const headerValue = localStorage.getItem('showHeader');
    setShowHeader(headerValue === 'true');
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filter: string[]) => {
    setFilter(filter);
  };

  const handleSortChange = (sortBy: string) => {
    console.log('sortBy', sortBy);
    setSortBy(sortBy);
  };
  const handleStateChange = (state: string) => {
    setState(state);
  };

  useEffect(() => {
    const getContentList = async () => {
      try {
        if (!tenantConfig) return;
        setLoading(true);
        const status = [
          // "Draft",
          // "FlagDraft",
          // "Review",
          // "Processing",
          'Live',
          // "Unlisted",
          // "FlagReview",
        ];
        const query = debouncedSearchTerm || '';

        const primaryCategory = filter.length ? filter : [];
        const order = sortBy === 'Created On' ? 'asc' : 'desc';
        const sort_by = {
          lastUpdatedOn: order,
        };
        
        // Reset page to 0 when search term or filter changes
        if (prevSearchTermRef.current !== debouncedSearchTerm) {
          setPage(0);
          prevSearchTermRef.current = debouncedSearchTerm;
        }
        
        if (prevFilterRef.current !== filter) {
          setPage(0);
          prevFilterRef.current = filter;
        }
        
        const offset = page * LIMIT;
        const contentType = 'discover-contents';

        const response = await getContent(
          status,
          query,
          LIMIT,
          offset,
          primaryCategory,
          sort_by,
          tenantConfig?.CHANNEL_ID,
          contentType,
          state !== 'All' ? state : undefined,
          selectedNames
        );

        const contentList = (response?.content || []).concat(
          response?.QuestionSet || []
        );
        setContentList(contentList);
        setTotalCount(response?.count);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getContentList();
  }, [
    tenantConfig,
    debouncedSearchTerm,
    filter,
    fetchContentAPI,
    sortBy,
    state,
    page,
    selectedNames,
  ]);

  useEffect(() => {
    const filteredArray = contentList.map((item: any) => ({
      image: item?.appIcon,
      contentType: item.primaryCategory,
      name: item.name,
      primaryCategory: item.primaryCategory,
      language: item.contentLanguage ? item.contentLanguage : item?.language,

      lastUpdatedOn: timeAgo(item.lastUpdatedOn),
      status: item.status,
      identifier: item.identifier,
      mimeType: item.mimeType,
      mode: item.mode,
      creator: item.creator,
      description: item?.description,
      state: item?.state,
      author: item.author,
    }));
    setData(filteredArray);
    console.log(filteredArray);
  }, [contentList]);

  const filteredData = useMemo(
    () =>
      contentList?.filter((content) =>
        content?.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      ),
    [debouncedSearchTerm, contentList]
  );

  const displayedRows = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  console.log('contentList', contentList);

  // Add state for dynamic filter
  const [readData, setReadData] = useState<any[]>([]);
  const [posFrameworkData, setPosFrameworkData] = useState<any>(null);
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>({});

  // Mock fetch for readData and posFrameworkData (replace with real API calls)
  useEffect(() => {
    const fetchReadData = async () => {
      const response = await getfilterList();
      const posFrameworkData = await getPosFrameworkList();
      const mediaFilterList = await getMediaFilterList();

      const convertedArray = mediaFilterList?.range.map((item: any) => ({
        name: item.label,
        value: item.identifier,
      }));
      mediaFilterList.range = convertedArray;

      response.push(mediaFilterList);
      setReadData(response);

      setPosFrameworkData(posFrameworkData);
    };

    fetchReadData();
  }, []);

  // Restore filters only for discover-contents
  useEffect(() => {
    if (router.query && router.asPath.includes('discover-contents')) {
      const savedFilters = localStorage.getItem('discoverContentsFilters');
      const savedSelectedNames = localStorage.getItem(
        'discoverContentsSelectedNames'
      );
      if (savedFilters) setSelectedFilters(JSON.parse(savedFilters));
      if (savedSelectedNames) setSelectedNames(JSON.parse(savedSelectedNames));
    }
  }, [router.asPath]);

  // Save filters only for discover-contents
  useEffect(() => {
    if (router.asPath.includes('discover-contents')) {
      localStorage.setItem(
        'discoverContentsFilters',
        JSON.stringify(selectedFilters)
      );
      localStorage.setItem(
        'discoverContentsSelectedNames',
        JSON.stringify(selectedNames)
      );
    }
  }, [selectedFilters, selectedNames, router.asPath]);

  return (
    <>
      {showHeader && <WorkspaceHeader />}
      <Layout selectedKey={selectedKey} onSelect={setSelectedKey}>
        <WorkspaceText />

        <Box p={3}>
          <Box
            sx={{
              background: '#fff',
              borderRadius: '8px',
              boxShadow: '0px 2px 6px 2px #00000026',
              pb: totalCount > LIMIT ? '15px' : '0px',
            }}
          >
            <Box p={2}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 'bold', fontSize: '16px' }}
              >
                Discover Contents
              </Typography>
            </Box>
            {/* <Typography mb={2}>Here you see all your content.</Typography> */}

            <Box mb={3}>
              <SearchBox
                placeholder="Search by title..."
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                onStateChange={handleStateChange}
                discoverContents={true}
              />
              <Box m={3}>
                <DynamicMultiFilter
                  readData={readData}
                  posFrameworkData={posFrameworkData}
                  selectedFilters={selectedFilters}
                  onChange={setSelectedFilters}
                  onSelectedNamesChange={setSelectedNames}
                  isProgramFilter={false}
                />
              </Box>
            </Box>
            {loading ? (
              <Loader showBackdrop={true} loadingText={'Loading'} />
            ) : (
              <>
                <Box className="table-ka-container">
                  <KaTableComponent
                    columns={columns}
                    tableTitle="discover-contents"
                    data={data}
                    showQrCodeButton={true}
                    hideDeleteButton={true}
                  />
                </Box>
              </>
            )}
            {totalCount > LIMIT && (
              <PaginationComponent
                count={Math.ceil(totalCount / LIMIT)}
                page={page}
                setPage={setPage}
                onPageChange={(event, newPage) => setPage(newPage - 1)}
              />
            )}
          </Box>
        </Box>
      </Layout>
    </>
  );
};

export default ContentsPage;
