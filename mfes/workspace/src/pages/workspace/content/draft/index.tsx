import React, { useEffect, useMemo, useRef, useState } from 'react';
import Layout from '../../../../components/Layout';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  getContent,
  getfilterList,
  getPosFrameworkList,
  getMediaFilterList,
} from '@workspace/services/ContentService';
import SearchBox from '../../../../components/SearchBox';
import PaginationComponent from '@workspace/components/PaginationComponent';
import NoDataFound from '@workspace/components/NoDataFound';
import { LIMIT } from '@workspace/utils/app.constant';
import { useRouter } from 'next/router';
import { MIME_TYPE } from '@workspace/utils/app.config';
import WorkspaceText from '@workspace/components/WorkspaceText';
import { DataType } from 'ka-table/enums';
import KaTableComponent from '@workspace/components/KaTableComponent';
import { timeAgo } from '@workspace/utils/Helper';
import useSharedStore from '../../../../../../shared-store';
import useTenantConfig from '@workspace/hooks/useTenantConfig';
import WorkspaceHeader from '@workspace/components/WorkspaceHeader';
import DynamicMultiFilter from '../../../../components/DynamicMultiFilter';

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
  {
    key: 'lastUpdatedOn',
    title: 'LAST MODIFIED',
    dataType: DataType.String,
    width: '180px',
  },
  { key: 'action', title: 'ACTION', dataType: DataType.String, width: '100px' },
];
const DraftPage = () => {
  const tenantConfig = useTenantConfig();
  const [selectedKey, setSelectedKey] = useState('draft');
  const router = useRouter();
  const [showHeader, setShowHeader] = useState<boolean | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNames, setSelectedNames] = useState<Record<string, string[]>>(
    {}
  );
  // const filterOption: string[] = router.query.filterOptions
  //   ? JSON.parse(router.query.filterOptions as string)
  //   : [];
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
  const [contentList, setContentList] = React.useState([]);
  const [contentDeleted, setContentDeleted] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [data, setData] = React.useState<any[]>([]);
  const fetchContentAPI = useSharedStore((state: any) => state.fetchContentAPI);
  const prevFilterRef = useRef(filter);

  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(searchTerm);
  const prevSearchTermRef = useRef(debouncedSearchTerm);

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

  useEffect(() => {
    const filteredArray = contentList.map((item: any) => ({
      image: item?.appIcon,

      name: item?.name,
      englishName: item?.englishName,
      description: item?.description,

      contentType: item.primaryCategory,
      language: item.contentLanguage ? item.contentLanguage : item.language,
      lastUpdatedOn: timeAgo(item.lastUpdatedOn),
      status: item.status,
      identifier: item.identifier,
      mimeType: item.mimeType,
      mode: item.mode,
    }));
    setData(filteredArray);
    console.log(filteredArray);
  }, [contentList]);

  const handleSearch = (search: string) => {
    setSearchTerm(search.toLowerCase());
  };

  const handleFilterChange = (filter: string[]) => {
    setFilter(filter);
  };

  const handleSortChange = (sortBy: string) => {
    setSortBy(sortBy);
  };

  const handleDelete = (index: number) => {
    console.log(`Deleting item at index ${index}`);
    setContentDeleted((prev) => !prev);
  };

  useEffect(() => {
    const getDraftContentList = async () => {
      try {
        if (!tenantConfig) return;
        setLoading(true);
        const query = debouncedSearchTerm || '';

        const primaryCategory = filter.length ? filter : [];
        
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
        const order = sortBy === 'Created On' ? 'asc' : 'desc';
        const sort_by = { lastUpdatedOn: order };
        const response = await getContent(
          ['Draft', 'FlagDraft'],
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
        const contentList = (response?.content || []).concat(
          response?.QuestionSet || []
        );
        setContentList(contentList);
        setTotalCount(response?.count);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getDraftContentList();
  }, [
    tenantConfig,
    debouncedSearchTerm,
    filter,
    sortBy,
    contentDeleted,
    fetchContentAPI,
    page,
    selectedNames,
  ]);

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

  // Restore filters only for draft
  useEffect(() => {
    if (router.query && router.asPath.includes('draft')) {
      const savedFilters = localStorage.getItem('draftFilters');
      const savedSelectedNames = localStorage.getItem(
        'draftSelectedNames'
      );
      if (savedFilters) setSelectedFilters(JSON.parse(savedFilters));
      if (savedSelectedNames) setSelectedNames(JSON.parse(savedSelectedNames));
    }
  }, [router.asPath]);

  // Save filters only for draft
  useEffect(() => {
    if (router.asPath.includes('draft')) {
      localStorage.setItem(
        'draftFilters',
        JSON.stringify(selectedFilters)
      );
      localStorage.setItem(
        'draftSelectedNames',
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
                Drafts
              </Typography>
            </Box>
            {/* <Typography mb={2}>
          Create, organize, and manage all types of content in one place.
        </Typography> */}

            <Box pb={3}>
              <SearchBox
                placeholder="Search by title..."
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
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
              <Box display="flex" justifyContent="center" my={5}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Box className="table-ka-container">
                  <KaTableComponent
                    columns={columns}
                    data={data}
                    tableTitle="draft"
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

export default DraftPage;
