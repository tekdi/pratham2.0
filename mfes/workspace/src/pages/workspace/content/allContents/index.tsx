import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from 'react';
import Layout from '@workspace/components/Layout';
import {
  Typography,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  IconButton,
  useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UpReviewTinyImage from '@mui/icons-material/LibraryBooks';
import SearchBox from '../../../../components/SearchBox';
import {
  deleteContent,
  getContent,
  getfilterList,
  getPosFrameworkList,
  getMediaFilterList,
} from '../../../../services/ContentService';
import { timeAgo } from '@workspace/utils/Helper';
import Loader from '@workspace/components/Loader';
import NoDataFound from '@workspace/components/NoDataFound';
import { MIME_TYPE } from '@workspace/utils/app.config';
import { useRouter } from 'next/router';
import PaginationComponent from '@workspace/components/PaginationComponent';
import { LIMIT } from '@workspace/utils/app.constant';
import WorkspaceText from '@workspace/components/WorkspaceText';
import { Table as KaTable } from 'ka-table';
import { DataType } from 'ka-table/enums';
import 'ka-table/style.css';
import KaTableComponent from '@workspace/components/KaTableComponent';
import useSharedStore from '../../../../../../shared-store';
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
    width: '450px',
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
  { key: 'status', title: 'STATUS', dataType: DataType.String, width: '100px' },
  {
    key: 'lastUpdatedOn',
    title: 'LAST MODIFIED',
    dataType: DataType.String,
    width: '180px',
  },
  {
    key: 'contentAction',
    title: 'ACTION',
    dataType: DataType.String,
    width: '220px',
  },
];
const AllContentsPage = () => {
  const tenantConfig = useTenantConfig();
  const theme = useTheme<any>();
  const router = useRouter();

  const [selectedKey, setSelectedKey] = useState('allContents');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNames, setSelectedNames] = useState<Record<string, string[]>>(
    {}
  );
  const { filterOptions, sort, status } = router.query;

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
  // const statusQuery: string =
  //   typeof router.query.status === 'string' ? router.query.status : 'All';
  const [statusBy, setStatusBy] = useState<string>('');
  useEffect(() => {
    setStatusBy(status?.toString() || 'All');
  }, [status]);

  const [contentList, setContentList] = React.useState<content[]>([]);
  const [data, setData] = React.useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [contentDeleted, setContentDeleted] = React.useState(false);
  const prevFilterRef = useRef(filter);

  const fetchContentAPI = useSharedStore((state: any) => state.fetchContentAPI);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(searchTerm);
  const [totalCount, setTotalCount] = useState(0);
  const [showHeader, setShowHeader] = useState<boolean | null>(null);
  const prevSearchTermRef = useRef(debouncedSearchTerm);
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
  const handleStatusChange = (statusBy: string) => {
    setStatusBy(statusBy);
  };

  useEffect(() => {
    const getContentList = async () => {
      try {
        if (!tenantConfig) return;
        setLoading(true);
        let status = [
          'Draft',
          'FlagDraft',
          'Review',
          'Processing',
          'Live',
          'Unlisted',
          'FlagReview',
        ];

        switch (statusBy) {
          case '':
          case 'All':
            status = [
              'Draft',
              'FlagDraft',
              'Review',
              'Processing',
              'Live',
              'Unlisted',
              'FlagReview',
            ];
            break;
          case 'Live':
            status = ['Live'];
            break;
          case 'Review':
            status = ['Review'];
            break;
          case 'Draft':
            status = ['Draft'];
            break;
          case 'Unlisted':
            status = ['Unlisted'];
            break;
          case 'FlagReview':
            status = ['FlagReview'];
            break;
          default:
            status = [
              'Draft',
              'FlagDraft',
              'Review',
              'Processing',
              'Live',
              'Unlisted',
              'FlagReview',
            ];
        }

        const query = debouncedSearchTerm || '';
        const primaryCategory = filter.length ? filter : [];
        const order = sortBy === 'Created On' ? 'asc' : 'desc';
        const sort_by = {
          lastUpdatedOn: order,
        };
        let offset = page * LIMIT;
        
        // Reset offset and page only when filter or search term changes
        if (prevFilterRef.current !== filter) {
          offset = 0;
          setPage(0);
          prevFilterRef.current = filter;
        }
        
        if (prevSearchTermRef.current !== debouncedSearchTerm) {
          offset = 0;
          setPage(0);
          prevSearchTermRef.current = debouncedSearchTerm;
        }
        console.log('seraching', debouncedSearchTerm);
        const response = await getContent(
          status,
          query,
          LIMIT,
          offset,
          primaryCategory,
          sort_by,
          tenantConfig?.CHANNEL_ID,
          undefined,
          undefined,
          selectedNames
        );
        // Combine content and QuestionSet arrays while avoiding duplicates
        const allContent = [
          ...(response?.content || []),
          ...(response?.QuestionSet || [])
        ];
        
        // Deduplicate based on identifier to avoid showing same content twice
        const contentMap = new Map();
        allContent.forEach(item => {
          if (item?.identifier && !contentMap.has(item.identifier)) {
            contentMap.set(item.identifier, item);
          }
        });
        
        const contentList = Array.from(contentMap.values());
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
    statusBy,
    page,
    selectedNames,
  ]);

  useEffect(() => {
    console.log('contentList=======>', contentList);
    const filteredArray = contentList.map((item: any) => ({
      image: item?.appIcon,
      contentType: item.primaryCategory,
      language: item.contentLanguage ? item.contentLanguage : item?.language,

      name: item.name,
      englishName: item?.englishName,
      primaryCategory: item.primaryCategory,
      lastUpdatedOn: timeAgo(item.lastUpdatedOn),
      lastUpdatedBy: item.lastUpdatedBy || item.createdBy,
      lastPublishedBy: item.lastPublishedBy || item.createdBy,
      status: item.status,
      identifier: item.identifier,
      mimeType: item.mimeType,
      mode: item.mode,
      description: item?.description,
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

  // Restore filters only for allContents
  useEffect(() => {
    if (router.query && router.asPath.includes('allContents')) {
      const savedFilters = localStorage.getItem('allContentsFilters');
      const savedSelectedNames = localStorage.getItem(
        'allContentsSelectedNames'
      );
      if (savedFilters) setSelectedFilters(JSON.parse(savedFilters));
      if (savedSelectedNames) setSelectedNames(JSON.parse(savedSelectedNames));
    }
  }, [router.asPath]);

  // Save filters only for allContents
  useEffect(() => {
    if (router.asPath.includes('allContents')) {
      localStorage.setItem(
        'allContentsFilters',
        JSON.stringify(selectedFilters)
      );
      localStorage.setItem(
        'allContentsSelectedNames',
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
                All My Contents
              </Typography>
            </Box>
            {/* <Typography mb={2}>Here you see all your content.</Typography> */}

            <Box mb={3}>
              <SearchBox
                placeholder="Search by title..."
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                onStatusChange={handleStatusChange}
                allContents={true}
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
                    tableTitle="all-content"
                    data={data}
                    showQrCodeButton={true}
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

export default AllContentsPage;
