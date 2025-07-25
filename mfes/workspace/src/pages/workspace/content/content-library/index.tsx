import KaTableComponent from '@workspace/components/KaTableComponent';
import Loader from '@workspace/components/Loader';
import PaginationComponent from '@workspace/components/PaginationComponent';
import WorkspaceText from '@workspace/components/WorkspaceText';
import { timeAgo } from '@workspace/utils/Helper';
import { LIMIT } from '@workspace/utils/app.constant';
import useSharedStore from '@workspace/utils/useSharedState';
import { Box, Typography, useTheme } from '@mui/material';
import { DataType } from 'ka-table/enums';
import 'ka-table/style.css';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Layout from '../../../../components/Layout';
import SearchBox from '../../../../components/SearchBox';
import { getContent, getfilterList, getPosFrameworkList } from '../../../../services/ContentService';
import useTenantConfig from '@workspace/hooks/useTenantConfig';
import WorkspaceHeader from '@workspace/components/WorkspaceHeader';
import DynamicMultiFilter from '../../../../components/DynamicMultiFilter';
import { set } from 'lodash';
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
    width: '100px',
  },

  // {
  //   key: 'contentType',
  //   title: 'CONTENT TYPE',
  //   dataType: DataType.String,
  //   width: '100px',
  // },
  {
    key: 'language',
    title: 'Content Language',
    dataType: DataType.String,
    width: '100px',
  },
  // { key: 'state', title: 'STATE', dataType: DataType.String, width: '100px' },

  { key: 'status', title: 'STATUS', dataType: DataType.String, width: '100px' },
  {
    key: 'lastUpdatedOn',
    title: 'LAST MODIFIED',
    dataType: DataType.String,
    width: '100px',
  },
];
const ContentsPage = () => {
  const tenantConfig = useTenantConfig();
  const theme = useTheme<any>();
  const router = useRouter();
  const [showHeader, setShowHeader] = useState<boolean | null>(null);
  const [selectedKey, setSelectedKey] = useState('content-library');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNames, setSelectedNames] = useState<Record<string, string[]>>({});
  console.log("selectedNames",selectedNames);

  const { filterOptions, sort, programOption } = router.query;

  const [filter, setFilter] = useState<any[]>([]);
  const [program, setProgram] = useState<any[]>([]);

  useEffect(() => {
    if (typeof filterOptions === 'string') {
      try {
        const parsed = JSON.parse(filterOptions);
        setFilter(parsed);
      } catch (error) {
        console.error('Failed to parse filterOptions:', error);
      }
    }
  }, [filterOptions]);

  useEffect(() => {
    if (typeof programOption === 'string') {
      try {
        const parsed = JSON.parse(programOption);
        setProgram(parsed);
      } catch (error) {
        console.error('Failed to parse programOption:', error);
      }
    }
  }, [programOption]);

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

  const handleProgramChange = (program: string[]) => {
    console.log('program--', program);
    setProgram(program);
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
        let offset = debouncedSearchTerm !== '' ? 0 : page * LIMIT;
        if (prevFilterRef.current !== filter) {
          offset = 0;
          setPage(0);

          prevFilterRef.current = filter;
        }
        const contentType = 'content-library';

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
    selectedNames  ]);

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
      const posFrameworkData= await getPosFrameworkList()
      console.log("posFrameworkData------",);
      setReadData(response);
     setPosFrameworkData(posFrameworkData)

    }
    // setReadData([
    //   // BEGIN USER DATA
    //   {
    //     code: 'appicon',
    //     dataType: 'url',
    //     description: 'App Icon',
    //     editable: true,
    //     index: 1,
    //     inputType: 'file',
    //     label: 'App Icon',
    //     name: 'App Icon',
    //     placeholder: 'App Icon',
    //     renderingHints: {},
    //     required: false,
    //     visible: true,
    //   },
    //   {
    //     code: 'name',
    //     dataType: 'text',
    //     description: 'Title of the content',
    //     editable: true,
    //     index: 2,
    //     inputType: 'text',
    //     label: 'Title',
    //     name: 'Title',
    //     placeholder: 'Enter Title',
    //     renderingHints: {},
    //     required: false,
    //     visible: true,
    //   },
    //   {
    //     code: 'description',
    //     dataType: 'text',
    //     description: 'Brief description',
    //     editable: true,
    //     index: 3,
    //     inputType: 'textarea',
    //     label: 'Description',
    //     name: 'Description',
    //     placeholder: 'Brief description about the Book',
    //     renderingHints: {},
    //     required: false,
    //     visible: true,
    //   },
    //   {
    //     code: 'keywords',
    //     dataType: 'list',
    //     description: 'Keywords for the content',
    //     editable: true,
    //     index: 4,
    //     inputType: 'keywordsuggestion',
    //     label: 'keywords',
    //     name: 'Keywords',
    //     placeholder: 'Enter Keywords',
    //     required: false,
    //     visible: true,
    //   },
    //   {
    //     code: 'domain',
    //     visible: true,
    //     depends: ['subject', 'subDomain'],
    //     editable: true,
    //     dataType: 'list',
    //     renderingHints: {},
    //     description: 'Domain',
    //     index: 5,
    //     label: 'Domain',
    //     required: true,
    //     name: 'Domain',
    //     inputType: 'multiselect',
    //     placeholder: 'Select Domain',
    //   },
    //   {
    //     code: 'subDomain',
    //     visible: true,
    //     depends: ['subject'],
    //     editable: true,
    //     dataType: 'list',
    //     renderingHints: {},
    //     description: 'Sub Domain',
    //     index: 6,
    //     label: 'Sub Domain',
    //     required: true,
    //     name: 'Sub Domain',
    //     inputType: 'multiselect',
    //     placeholder: 'Sub Domain',
    //   },
    //   {
    //     code: 'subject',
    //     visible: true,
    //     depends: [],
    //     editable: true,
    //     dataType: 'list',
    //     renderingHints: {},
    //     description: 'Subject',
    //     index: 7,
    //     label: 'Subject',
    //     required: true,
    //     name: 'Subject',
    //     inputType: 'multiselect',
    //     placeholder: 'Subject',
    //   },
    //   {
    //     code: 'targetAgeGroup',
    //     dataType: 'list',
    //     description:
    //       'Target Age group / Grade level (Who is the content targeted for?)',
    //     editable: true,
    //     index: 8,
    //     inputType: 'multiselect',
    //     label: 'Target Age group',
    //     name: 'Target Age group',
    //     range: [
    //       { key: '0-3 yrs', name: '0-3 yrs' },
    //       { key: '3-6 yrs', name: '3-6 yrs' },
    //       { key: '6-8 yrs', name: '6-8 yrs' },
    //       { key: '8-11 yrs', name: '8-11 yrs' },
    //       { key: '11-14 yrs', name: '11-14 yrs' },
    //       { key: '14-18 yrs', name: '14-18 yrs' },
    //       { key: '18 yrs +', name: '18 yrs +' },
    //     ],
    //     placeholder: 'Target Age group',
    //     renderingHints: {},
    //     required: false,
    //     visible: true,
    //   },
    //   {
    //     code: 'primaryUser',
    //     dataType: 'list',
    //     description: 'Primary User',
    //     editable: true,
    //     index: 9,
    //     inputType: 'multiselect',
    //     label: 'Primary User',
    //     name: 'Primary User',
    //     range: [
    //       { key: 'Parents/Care givers', name: 'Parents/Care givers' },
    //       { key: 'Educators', name: 'Educators' },
    //       { key: 'Learners/Children', name: 'Learners/Children' },
    //     ],
    //     placeholder: 'Select Primary User',
    //     renderingHints: {},
    //     required: false,
    //     visible: true,
    //   },
    //   {
    //     code: 'contentLanguage',
    //     dataType: 'text',
    //     description: 'Content Language',
    //     editable: true,
    //     index: 10,
    //     inputType: 'select',
    //     label: 'Content Language',
    //     name: 'Content Language',
    //     range: [
    //       { key: 'English', name: 'English' },
    //       { key: 'Marathi', name: 'Marathi' },
    //       { key: 'Hindi', name: 'Hindi' },
    //       { key: 'Assamese', name: 'Assamese' },
    //       { key: 'Bengali', name: 'Bengali' },
    //       { key: 'Gujarati', name: 'Gujarati' },
    //       { key: 'Kannada', name: 'Kannada' },
    //       { key: 'Kashmiri', name: 'Kashmiri' },
    //       { key: 'Khasi', name: 'Khasi' },
    //       { key: 'Malayalam', name: 'Malayalam' },
    //       { key: 'Manipuri', name: 'Manipuri' },
    //       { key: 'Odia', name: 'Odia' },
    //       { key: 'Punjabi', name: 'Punjabi' },
    //       { key: 'Rabha (Rongdani)', name: 'Rabha (Rongdani)' },
    //       { key: 'Sanskrit', name: 'Sanskrit' },
    //       { key: 'Tamil', name: 'Tamil' },
    //       { key: 'Telugu', name: 'Telugu' },
    //       { key: 'Urdu', name: 'Urdu' },
    //     ],
    //     placeholder: 'Content Language',
    //     renderingHints: {},
    //     required: false,
    //     visible: true,
    //   },
    //   {
    //     code: 'program',
    //     dataType: 'list',
    //     description: 'Program',
    //     editable: true,
    //     index: 11,
    //     inputType: 'multiselect',
    //     label: 'Program',
    //     name: 'Program',
    //     range: [
    //       { name: 'Hamara Gaon', value: 'Hamara Gaon' },
    //       {
    //         name: 'Early Childhood Education',
    //         value: 'Early Childhood Education',
    //       },
    //       {
    //         name: 'Inclusive Education (ENABLE)',
    //         value: 'Inclusive Education (ENABLE)',
    //       },
    //       { name: 'Elementary', value: 'Elementary' },
    //       { name: 'Second Chance', value: 'Second Chance' },
    //       { name: 'Digital Initiatives', value: 'Digital Initiatives' },
    //       { name: 'Vocational Training', value: 'Vocational Training' },
    //       {
    //         name: 'Pratham Council For Vulnerable Children',
    //         value: 'Pratham Council For Vulnerable Children',
    //       },
    //       {
    //         name: 'Annual Status of Education Report',
    //         value: 'Annual Status of Education Report',
    //       },
    //       { name: 'Pragyanpath', value: 'Pragyanpath' },
    //       { name: 'Open School', value: 'Open School' },
    //       { name: 'Experimento India', value: 'Experimento India' },
    //       { name: 'Camp to Club', value: 'Camp to Club' },
    //       { name: 'Other', value: 'Other' },
    //     ],
    //     placeholder: 'Please select an option',
    //     renderingHints: {},
    //     required: true,
    //     visible: true,
    //   },
    // ]);
   
    fetchReadData();
  }, []);
  console.log('selectedFilters', selectedFilters);
  console.log('selectedNames in parent:', selectedNames);
  // Restore filters only for content-library
  useEffect(() => {
    if (router.query && router.asPath.includes('content-library')) {
      const savedFilters = localStorage.getItem('contentLibraryFilters');
      const savedSelectedNames = localStorage.getItem('contentLibrarySelectedNames');
      if (savedFilters) setSelectedFilters(JSON.parse(savedFilters));
      if (savedSelectedNames) setSelectedNames(JSON.parse(savedSelectedNames));
    }
  }, [router.asPath]);

  // Save filters only for content-library
  useEffect(() => {
    if (router.asPath.includes('content-library')) {
      localStorage.setItem('contentLibraryFilters', JSON.stringify(selectedFilters));
      localStorage.setItem('contentLibrarySelectedNames', JSON.stringify(selectedNames));
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
                content Library{' '}
              </Typography>
            </Box>
            {/* <Typography mb={2}>Here you see all your content.</Typography> */}

            {/* DynamicMultiFilter goes here */}
           
            <Box mb={3}>
              <SearchBox
                placeholder="Search by title..."
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                onStateChange={handleStateChange}
                isPrimaryCategory={false}
              />
               <Box m={3}>
             <DynamicMultiFilter
                readData={readData}
                posFrameworkData={posFrameworkData}
                selectedFilters={selectedFilters}
                onChange={setSelectedFilters}
                onSelectedNamesChange={setSelectedNames}
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
                    tableTitle="content-library"
                    data={data}
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
