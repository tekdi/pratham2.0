import React, { useEffect, useState } from 'react';
import Layout from '../../../../components/Layout';
import { Typography, Box, CircularProgress } from '@mui/material';

import { getContent } from '../../../../services/ContentService';
import SearchBox from '../../../../components/SearchBox';
import PaginationComponent from '../../../../components/PaginationComponent';
import { LIMIT } from '../../../../utils/app.constant';
import WorkspaceText from '../../../../components/WorkspaceText';
import { DataType } from 'ka-table/enums';
import KaTableComponent from '../../../../components/KaTableComponent';
import { timeAgo } from '../../../../utils/Helper';
import useSharedStore from '../../../../utils/useSharedState';
const columns = [
  {
    key: 'title_and_description',
    title: 'TITLE & DESCRIPTION',
    dataType: DataType.String,
    width: '480px',
  },

  {
    key: 'contentType',
    title: 'CONTENT TYPE',
    dataType: DataType.String,
    width: '250px',
  },
  // { key: 'status', title: 'STATUS', dataType: DataType.String, width: "100px" },
  {
    key: 'lastUpdatedOn',
    title: 'LAST MODIFIED',
    dataType: DataType.String,
    width: '180px',
  },
  {
    key: 'create-by',
    title: 'CREATED BY',
    dataType: DataType.String,
    width: '100px',
  },
  { key: 'action', title: 'ACTION', dataType: DataType.String, width: '100px' },
];
const UpForReviewPage = () => {
  const [selectedKey, setSelectedKey] = useState('up-review');
  const [filter, setFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('Modified On');
  const [searchTerm, setSearchTerm] = useState('');
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contentDeleted, setContentDeleted] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [data, setData] = React.useState<any[]>([]);
  const fetchContentAPI = useSharedStore((state: any) => state.fetchContentAPI);
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

      contentType: item.primaryCategory,
      lastUpdatedOn: timeAgo(item.lastUpdatedOn),
      status: item.status,
      identifier: item.identifier,
      mimeType: item.mimeType,
      mode: item.mode,
      createdBy: item.createdBy,
      creator: item.creator,
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
    const getReviewContentList = async () => {
      try {
        setLoading(true);
        const query = debouncedSearchTerm || '';
        const offset = debouncedSearchTerm !== '' ? 0 : page * LIMIT;
        const primaryCategory = filter.length ? filter : [];
        const order = sortBy === 'Created On' ? 'asc' : 'desc';
        const sort_by = { lastUpdatedOn: order };
        const contentType = 'upReview';
        const response = await getContent(
          ['Review', 'FlagReview'],
          query,
          LIMIT,
          offset,
          primaryCategory,
          sort_by,
          contentType
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
    getReviewContentList();
  }, [
    debouncedSearchTerm,
    filter,
    sortBy,
    fetchContentAPI,
    contentDeleted,
    page,
  ]);

  return (
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
              Up For Review
            </Typography>
          </Box>
          {/* <Typography mb={2}>
          Here you can see all your content submitted for review.
        </Typography> */}

          <Box mb={3}>
            <SearchBox
              placeholder="Search by title..."
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
            />
          </Box>

          {/* {loading ? (
            <Box display="flex" justifyContent="center" my={5}>
              <CircularProgress />
            </Box>
          ) : contentList && contentList.length > 0 ? (
            <Box className="table-ka-container">
              <KaTableComponent columns={columns} data={data} tableTitle="submitted"  />
            </Box>
          ) : (
            <NoDataFound />
          )} */}
          {loading ? (
            <Box display="flex" justifyContent="center" my={5}>
              <CircularProgress />
            </Box>
          ) : (
            <Box className="table-ka-container">
              <KaTableComponent
                columns={columns}
                data={data}
                tableTitle="upForReview"
              />
            </Box>
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
  );
};

export default UpForReviewPage;
