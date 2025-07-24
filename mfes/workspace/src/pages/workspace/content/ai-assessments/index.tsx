import React, { useEffect, useRef, useState } from 'react';
import Layout from '../../../../components/Layout';
import { Typography, Box, CircularProgress } from '@mui/material';
import {
  getContent,
  searchAiAssessment,
} from '@workspace/services/ContentService';
import SearchBox from '../../../../components/SearchBox';
import PaginationComponent from '@workspace/components/PaginationComponent';
import { LIMIT } from '@workspace/utils/app.constant';
import { useRouter } from 'next/router';
import { MIME_TYPE } from '@workspace/utils/app.config';
import WorkspaceText from '@workspace/components/WorkspaceText';
import { DataType } from 'ka-table/enums';
import KaTableComponent from '@workspace/components/KaTableComponent';
import { timeAgo } from '@workspace/utils/Helper';
import useSharedStore from '@workspace/utils/useSharedState';
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
    key: 'aiStatus',
    title: 'AI STATUS',
    dataType: DataType.String,
    width: '140px',
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

  // { key: 'action', title: 'ACTION', dataType: DataType.String, width: '140px' },
];

const staticFilter = ['Practice Question Set'];
const PublishPage = () => {
  const tenantConfig = useTenantConfig();
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState('ai-assessments');
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showHeader, setShowHeader] = useState<boolean | null>(null);
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
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(searchTerm);

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
    const filteredArray = contentList.map((item: any) => ({
      image: item?.appIcon,

      name: item?.name,
      description: item?.description,
      language: item.contentLanguage ? item.contentLanguage : item?.language,
      contentType: staticFilter,
      lastUpdatedOn: timeAgo(item.lastUpdatedOn),
      status: item.status,
      identifier: item.identifier,
      mimeType: item.mimeType,
      mode: item.mode,
      aiStatus: item.aiStatus,
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

  useEffect(() => {
    const getPublishContentList = async () => {
      try {
        if (!tenantConfig) return;
        setLoading(true);
        const query = debouncedSearchTerm || '';
        let offset = debouncedSearchTerm !== '' ? 0 : page * LIMIT;

        const primaryCategory = staticFilter;
        if (prevFilterRef.current !== filter) {
          offset = 0;
          setPage(0);

          prevFilterRef.current = filter;
        }
        const order = sortBy === 'Created On' ? 'asc' : 'desc';
        const sort_by = { lastUpdatedOn: order };
        const aiQuestionSetStatus = await searchAiAssessment({
          createdBy: localStorage.getItem('userId'),
        });
        const identifiers = aiQuestionSetStatus?.data?.map(
          (item: any) => item.question_set_id as string
        );
        const response = await getContent(
          ['Live'],
          query,
          LIMIT,
          offset,
          primaryCategory,
          sort_by,
          tenantConfig?.CHANNEL_ID,
          '',
          '',
          identifiers
        );
        // const contentList = (response?.content || []).concat(
        //   response?.QuestionSet || []
        // );
        setContentList(
          response?.QuestionSet.map((item: any) => ({
            ...item,
            aiStatus: aiQuestionSetStatus?.data?.find(
              (aiItem: any) => aiItem.question_set_id === item.identifier
            )?.status,
          }))
        );
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
                Ai-assessments
              </Typography>
            </Box>
            <Box mb={3}>
              <SearchBox
                staticFilter={staticFilter}
                placeholder="Search by title..."
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
              />
            </Box>
            {/* <Typography mb={2}>Here you see all your "Ai-assessments content.</Typography> */}
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
