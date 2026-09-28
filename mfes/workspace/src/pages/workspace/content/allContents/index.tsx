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
import { timeAgo } from '@workspace/utils/helper';
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
  { key: 'status', title: 'STATUS', dataType: DataType.String, width: '140px' },
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

// How long after an action we keep locally overriding the search index's
// verdict on this identifier - long enough to cover the usual reindex lag,
// short enough that a genuinely new state for the same item later isn't
// masked forever.
const RECENT_ACTION_GUARD_MS = 30000;

// A row's new state right after an action is more up to date than what the
// (possibly not-yet-reindexed) search API says. Returns true when a row
// should be hidden from the currently active status tab as a result.
const shouldHideAfterAction = (
  actionType: string,
  currentStatusBy: string
): boolean => {
  // The "All" tab shows every status, so there's nothing to hide there.
  if (currentStatusBy === '' || currentStatusBy === 'All') return false;

  switch (actionType) {
    case 'publish':
      // Item is now Live - stays visible only on the Live tab.
      return currentStatusBy !== 'Live';
    case 'unpublish':
      // Item is now Unlisted (QuestionSets retire under the hood but are
      // normalized to Unlisted for display - see the fetch effect below).
      // Delete is hidden entirely for QuestionSets (see ActionIcon.tsx), so
      // an unpublished QuestionSet is never a "Deleted" item and never
      // shows there, regardless of mimeType.
      return currentStatusBy !== 'Unlisted' && currentStatusBy !== 'Unpublished';
    case 'delete':
      // Delete is only ever available for non-QuestionSet rows (see
      // ActionIcon.tsx); the item is now Retired.
      return currentStatusBy !== 'Deleted';
    default:
      return false;
  }
};

const AllContentsPage = () => {
  const tenantConfig = useTenantConfig();
  const theme = useTheme<any>();
  const router = useRouter();

  const [selectedKey, setSelectedKey] = useState('allContents');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('allContentsSearchTerm') || '' : '');
  const [selectedNames, setSelectedNames] = useState<Record<string, string[]>>(() => {
    if (typeof window === 'undefined') return {};
    const saved = localStorage.getItem('allContentsSelectedNames');
    return saved ? JSON.parse(saved) : {};
  });
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

  const [contentList, setContentList] = React.useState<any[]>([]);
  const [data, setData] = React.useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [contentDeleted, setContentDeleted] = React.useState(false);
  const prevFilterRef = useRef(filter);

  const fetchContentAPI = useSharedStore((state: any) => state.fetchContentAPI);
  const lastContentAction = useSharedStore((state: any) => state.lastContentAction);
  // Identifiers recently acted on (publish/unpublish/delete), so a refetch
  // that still hits a not-yet-reindexed search result doesn't silently
  // re-introduce a row we already know should be gone from this tab. See
  // shouldHideAfterAction below and its uses in the two effects that follow.
  const recentlyMutatedRef = useRef<Map<string, { actionType: string; mimeType?: string; ts: number }>>(new Map());
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

  // Patch the currently displayed list the instant a publish/unpublish/delete
  // succeeds anywhere (see DeleteConfirmation.tsx), rather than waiting for
  // the follow-up refetch - the search index it reads from can lag a few
  // seconds behind the mutation, which otherwise left a stale row visible
  // until a manual page refresh.
  useEffect(() => {
    if (!lastContentAction?.identifier) return;
    const hide = shouldHideAfterAction(lastContentAction.actionType, statusBy);
    if (hide) {
      setContentList((prev) =>
        prev.filter((item) => item?.identifier !== lastContentAction.identifier)
      );
      recentlyMutatedRef.current.set(lastContentAction.identifier, {
        actionType: lastContentAction.actionType,
        mimeType: lastContentAction.mimeType,
        ts: lastContentAction.ts,
      });
    } else {
      recentlyMutatedRef.current.delete(lastContentAction.identifier);
    }
  }, [lastContentAction]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    localStorage.setItem('allContentsSearchTerm', searchTerm);
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
          'Retired',
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
              'Retired',
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
          case 'Unpublished':
            status = ['Unlisted'];
            break;
          case 'Deleted':
            status = ['Retired'];
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
              'Retired',
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
        // Unpublishing a QuestionSet retires it (same API as delete - see
        // ContentService.unpublishContent), so retired QuestionSets are
        // Unpublished items, not deleted ones, and must not appear under
        // Deleted. Excluding them in the query itself (rather than dropping
        // them from the response) keeps response.count - and therefore the
        // pagination - in step with the rows actually listed.
        const searchFilters =
          statusBy === 'Deleted'
            ? {
                ...selectedNames,
                mimeType: { '!=': MIME_TYPE.QUESTIONSET_MIME_TYPE },
              }
            : selectedNames;
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
          searchFilters
        );
        let questionSetItems = response?.QuestionSet || [];

        // A QuestionSet is unpublished via the questionset retire API, so it
        // ends up with status "Retired" instead of "Unlisted". Since Delete
        // is hidden entirely for QuestionSets (see ActionIcon.tsx), a
        // retired QuestionSet is always the result of Unpublish - never a
        // genuine delete - so it belongs under Unpublished only, never
        // Deleted. The primary query above won't return it when this tab
        // asks for status "Unlisted" only, so fetch retired QuestionSets
        // separately here (without touching the regular content status
        // query) and fold them in.
        if (statusBy === 'Unlisted' || statusBy === 'Unpublished') {
          const retiredQuestionSetsResponse = await getContent(
            ['Retired'],
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
          questionSetItems = [
            ...questionSetItems,
            ...(retiredQuestionSetsResponse?.QuestionSet || []),
          ];
        }

        // Combine content and QuestionSet arrays while avoiding duplicates
        const allContent = [
          ...(response?.content || []),
          ...questionSetItems,
        ];
        let contentSortList = allContent.sort((a, b) => {
          const dateA = new Date(a.lastUpdatedOn || 0).getTime();
          const dateB = new Date(b.lastUpdatedOn || 0).getTime();
          return dateB - dateA; // Descending order
        });
        // Deduplicate based on identifier to avoid showing same content twice
        const contentMap = new Map();
        contentSortList.forEach(item => {
          if (item?.identifier && !contentMap.has(item.identifier)) {
            contentMap.set(item.identifier, item);
          }
        });

        // A retired QuestionSet is always Unpublished, never Deleted -
        // re-classify its status for display/filtering purposes wherever it
        // turns up (All, Unpublished, or a stray Deleted-tab result).
        const normalizedList = Array.from(contentMap.values()).map((item: any) =>
          item?.mimeType === MIME_TYPE.QUESTIONSET_MIME_TYPE &&
          item?.status === 'Retired'
            ? { ...item, status: 'Unlisted' }
            : item
        );

        // Backstop to the mimeType exclusion sent with the Deleted query
        // above, in case the search API ignores that filter - QuestionSets
        // must never be listed as Deleted. (When the query filter works,
        // there is nothing left here to drop, so the count still matches.)
        const visibleList =
          statusBy === 'Deleted'
            ? normalizedList.filter(
                (item: any) => item?.mimeType !== MIME_TYPE.QUESTIONSET_MIME_TYPE
              )
            : normalizedList;

        // Safety net for the search index lagging behind a just-performed
        // action: if this refetch still returns a row we already know (from
        // a recent local action) should be hidden from this tab, drop it
        // again instead of letting a stale result reintroduce it. Expired
        // guard entries are pruned so a genuinely new state later isn't
        // masked forever.
        const now = Date.now();
        const contentList = visibleList.filter((item: any) => {
          const mutation = recentlyMutatedRef.current.get(item?.identifier);
          if (!mutation) return true;
          if (now - mutation.ts > RECENT_ACTION_GUARD_MS) {
            recentlyMutatedRef.current.delete(item?.identifier);
            return true;
          }
          return !shouldHideAfterAction(mutation.actionType, statusBy);
        });
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
  }>(() => {
    if (typeof window === 'undefined') return {};
    const saved = localStorage.getItem('allContentsFilters');
    return saved ? JSON.parse(saved) : {};
  });

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

  // Save filters for allContents
  useEffect(() => {
    localStorage.setItem('allContentsFilters', JSON.stringify(selectedFilters));
    localStorage.setItem('allContentsSelectedNames', JSON.stringify(selectedNames));
  }, [selectedFilters, selectedNames]);

  const hasActiveFilters =
    searchTerm !== '' ||
    filter.length > 0 ||
    (sortBy !== '' && sortBy !== 'Modified On') ||
    (statusBy !== '' && statusBy !== 'All') ||
    Object.values(selectedFilters).some((arr) => arr.length > 0);

  const clearFilters = () => {
    setSearchTerm('');
    setFilter([]);
    setSortBy('Modified On');
    setStatusBy('All');
    setSelectedFilters({});
    setSelectedNames({});
    setPage(0);
    localStorage.removeItem('allContentsFilters');
    localStorage.removeItem('allContentsSelectedNames');
    localStorage.removeItem('allContentsSearchTerm');
    router.push({ pathname: router.pathname }, undefined, { shallow: true });
  };

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
                value={searchTerm}
                placeholder="Search by title..."
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                onStatusChange={handleStatusChange}
                allContents={true}
                onClear={hasActiveFilters ? clearFilters : undefined}
              />
              <Box m={3}>
                <DynamicMultiFilter
                  readData={readData}
                  posFrameworkData={posFrameworkData}
                  selectedFilters={selectedFilters}
                  onChange={setSelectedFilters}
                  onSelectedNamesChange={setSelectedNames}
                 // isProgramFilter={false}
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
