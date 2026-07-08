
import React, { useEffect, useRef, useState } from 'react';
import Layout from '../../../../components/Layout';
import { Typography, Box, CircularProgress } from '@mui/material';
import { getContent, getfilterList } from '@workspace/services/ContentService';
import SearchBox from '../../../../components/SearchBox';
import PaginationComponent from '@workspace/components/PaginationComponent';
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

  // { key: 'status', title: 'STATUS', dataType: DataType.String, width: "100px" },
  {
    key: 'lastUpdatedOn',
    title: 'LAST MODIFIED',
    dataType: DataType.String,
    width: '180px',
  },
  { key: 'action', title: 'ACTION', dataType: DataType.String, width: '220px' },
];
const PublishPage = () => {
  const tenantConfig = useTenantConfig();
  const router = useRouter();

  const [selectedKey, setSelectedKey] = useState('publish');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('publishSearchTerm') || '' : '');
  const [showHeader, setShowHeader] = useState<boolean | null>(null);
  const { filterOptions, sort, program: programQuery } = router.query;

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
  const [programFilter, setProgramFilter] = useState<string[]>([]);

  useEffect(() => {
    if (typeof programQuery === 'string') {
      try {
        setProgramFilter(JSON.parse(programQuery));
      } catch {
        // ignore malformed query
      }
    } else if (programQuery === undefined) {
      setProgramFilter([]);
    }
  }, [programQuery]);

  const [programOptions, setProgramOptions] = useState<{ code: string; name: string }[]>([]);

  useEffect(() => {
    const fetchProgramOptions = async () => {
      const fields = await getfilterList();
      const programField = fields?.find((f: any) => f.code === 'program');
      if (programField?.range) {
        const options = programField.range.map((r: any) => ({
          code: String(r.key || r.value || r.name),
          name: String(r.name || r.value || r.key),
        }));
        setProgramOptions(options);
      }
    };
    fetchProgramOptions();
  }, []);

  const [contentList, setContentList] = React.useState<any[]>([]);
  const [contentDeleted, setContentDeleted] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [data, setData] = React.useState<any[]>([]);
  const fetchContentAPI = useSharedStore((state: any) => state.fetchContentAPI);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(searchTerm);
  const prevSearchTermRef = useRef(debouncedSearchTerm);

  const prevFilterRef = useRef(filter);

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
    localStorage.setItem('publishSearchTerm', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const filteredArray = contentList.map((item: any) => ({
      image: item?.appIcon,

      name: item?.name,
      englishName: item?.englishName,
      description: item?.description,
      language: item.contentLanguage ? item.contentLanguage : item?.language,
      lastPublishedBy: item.lastPublishedBy,
      contentType: item.primaryCategory,
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

  const handleProgramChange = (programs: string[]) => {
    setPage(0);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, program: JSON.stringify(programs) },
      },
      undefined,
      { shallow: true }
    );
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    filter.length > 0 ||
    (sortBy !== '' && sortBy !== 'Modified On') ||
    programFilter.length > 0;

  const clearFilters = () => {
    setSearchTerm('');
    setFilter([]);
    setSortBy('Modified On');
    setProgramFilter([]);
    setPage(0);
    localStorage.removeItem('publishSearchTerm');
    router.push({ pathname: router.pathname }, undefined, { shallow: true });
  };

  const openEditor = (content: any) => {
    const identifier = content?.identifier;
    const mode = 'read';
    if (content?.mimeType === MIME_TYPE.QUESTIONSET_MIME_TYPE) {
      router.push({ pathname: `/editor`, query: { identifier, mode } });
    } else if (
      content?.mimeType &&
      MIME_TYPE.GENERIC_MIME_TYPE.includes(content?.mimeType)
    ) {
      sessionStorage.setItem('previousPage', window.location.href);
      router.push({ pathname: `/upload-editor`, query: { identifier } });
    } else if (
      content?.mimeType &&
      MIME_TYPE.COLLECTION_MIME_TYPE.includes(content?.mimeType)
    ) {
      router.push({ pathname: `/collection`, query: { identifier, mode } });
    }
  };

  useEffect(() => {
    const getPublishContentList = async () => {
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
          ['Live'],
          query,
          LIMIT,
          offset,
          primaryCategory,
          sort_by,
          tenantConfig?.CHANNEL_ID,
          undefined,
          undefined,
          programFilter.length > 0 ? { program: programFilter } : undefined
        );
        // Combine content and QuestionSet arrays
        const combinedList = [
          ...(response?.content || []),
          ...(response?.QuestionSet || [])
        ];
        
        // Sort by lastUpdatedOn in descending order (most recent first)
        const contentList = combinedList.toSorted((a, b) => {
          const dateA = new Date(a.lastUpdatedOn || 0).getTime();
          const dateB = new Date(b.lastUpdatedOn || 0).getTime();
          return dateB - dateA; // Descending order
        });
        setContentList(contentList);
        setTotalCount(response?.count);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getPublishContentList();
  }, [
    tenantConfig,
    debouncedSearchTerm,
    filter,
    sortBy,
    fetchContentAPI,
    contentDeleted,
    page,
    programFilter,
  ]);

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
                Published
              </Typography>
            </Box>
            <Box mb={3}>
              <SearchBox
                value={searchTerm}
                placeholder="Search by title..."
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                programOptions={programOptions}
                programValue={programFilter}
                onProgramChange={handleProgramChange}
                onClear={hasActiveFilters ? clearFilters : undefined}
              />
            </Box>
            {/* <Typography mb={2}>Here you see all your published content.</Typography> */}
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
                    tableTitle="publish"
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

export default PublishPage;
