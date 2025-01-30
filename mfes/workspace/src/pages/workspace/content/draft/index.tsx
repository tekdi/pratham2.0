import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../../../components/Layout';
import { Typography, Box, CircularProgress } from '@mui/material';
import { getContent } from '../../../../services/ContentService';
import SearchBox from '../../../../components/SearchBox';
import PaginationComponent from '../../../../components/PaginationComponent';
import { LIMIT } from '../../../../utils/app.constant';
import { useRouter } from 'next/router';
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
    width: '450px',
  },
  {
    key: 'contentType',
    title: 'CONTENT TYPE',
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
  const [selectedKey, setSelectedKey] = useState('draft');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('Modified On');
  const [contentList, setContentList] = React.useState([]);
  const [contentDeleted, setContentDeleted] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [data, setData] = React.useState<any[]>([]);
  const fetchContentAPI = useSharedStore((state: any) => state.fetchContentAPI);

  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(searchTerm);

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

  const router = useRouter();

  useEffect(() => {
    const getDraftContentList = async () => {
      try {
        setLoading(true);
        const query = debouncedSearchTerm || '';
        const offset = debouncedSearchTerm !== '' ? 0 : page * LIMIT;
        const primaryCategory = filter.length ? filter : [];
        const order = sortBy === 'Created On' ? 'asc' : 'desc';
        const sort_by = { lastUpdatedOn: order };
        const response = await getContent(
          ['Draft', 'FlagDraft'],
          query,
          LIMIT,
          offset,
          primaryCategory,
          sort_by
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
    debouncedSearchTerm,
    filter,
    sortBy,
    contentDeleted,
    fetchContentAPI,
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
  );
};

export default DraftPage;
