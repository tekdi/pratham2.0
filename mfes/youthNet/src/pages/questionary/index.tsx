import dynamic from 'next/dynamic';

import Header from '@/components/Header';
import { fetchEntities, fetchQuestion } from '@/services/ObservationServices';
import { Typography, useTheme } from '@mui/material';
import { GetStaticPaths } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Box, Grid, Tab, Tabs } from '@mui/material';
import { useTranslation } from 'next-i18next';
import EntryContent from '../../components/youthNet/EntryContent';
import EntrySlider from '../../components/youthNet/EntrySlider';
import BackHeader from '../../components/youthNet/BackHeader';

const ObservationComponent = dynamic(
  () => import('@/components/observations/ObservationComponent'),
  {
    ssr: false,
    // loading: () => <p>Loading Questionnaire App...</p>,
  }
);

const ObservationQuestions: React.FC = () => {
  const router = useRouter();
  const { Id } = router.query;
  const { entityId , solutionId, observationId} = router.query;
  const { observationName } = router.query;
  const [value, setValue] = useState<number>(1);
  const { t } = useTranslation();
  const [storedEntries, setStoredEntries] = useState([]);

  const [questionResponse, setQuestionResponseResponse] =
  useState<any>(null);
  const [questions, setQuestions] =
  useState<any>(null);
  const theme = useTheme<any>();
 
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };
   useEffect(() => {
    const fetchQuestionsList = async () => {
      try {
         const response = await fetchEntities({ solutionId });
                    console.log(response);
                    const completedIds = response?.result?.entities
                      ?.filter((entity: any) => entity.status === "completed" && entity._id)
                      ?.map((entity: any) => entity._id);
                    console.log(completedIds);
                    setStoredEntries(completedIds)

       const observationId=Id;
        //const entityId=entityId;  
        if(observationId && Id)
        {
          const response=await fetchQuestion({observationId,entityId})
          const combinedData = {
            solution: response.solution,
            assessment: {
              ...response.assessment, // Spread all properties from assessment

            }
          };
          setQuestions(combinedData)
          // setQuestionResponseResponse(
          //   combinedData
          // )
        }
      } catch (error) {
        console.error('Error fetching cohort list', error);
      }
    };
    if( solutionId && Id && entityId )
    fetchQuestionsList();
  }, [Id, entityId, solutionId]);
  const handleBack = () => {
    router.back();
  };
  return (
    <Box>
      {/* <Header /> */}
      <Box
       
      >
               <BackHeader headingOne={observationName?.toString()}   showBackButton={true}    onBackClick={handleBack}/>

        {/* { observationName&& (
          <Typography variant="h3" fontSize={'22px'}
            color={'black'}>
              {observationName}
          </Typography>
        )} */}
      </Box>
      <Box sx={{ width: '100%' }}>
        {value && (
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit" // Use "inherit" to apply custom color
            aria-label="secondary tabs example"
            sx={{
              fontSize: '14px',
              borderBottom: (theme) => `1px solid #EBE1D4`,

              '& .MuiTab-root': {
                color: theme.palette.warning['A200'],
                padding: '0 20px',
                flexGrow: 1,
              },
              '& .Mui-selected': {
                color: theme.palette.warning['A200'],
              },
              '& .MuiTabs-indicator': {
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: theme.palette.primary.main,
                borderRadius: '100px',
                height: '3px',
              },
              '& .MuiTabs-scroller': {
                overflowX: 'unset !important',
              },
            }}
          >
            <Tab value={1} label={"submit New"} />
            <Tab value={2} label={t('Submissions')} />
          </Tabs>
        )}
      </Box>
      <Box>
        {value === 1 && (
          <Box
            padding={'15px'}
            sx={{
              background: '#FBF4E4',
            }}
          >
              
              <ObservationComponent observationName={observationName} observationQuestions={questions} backButtonShow={false} />

          </Box>
        )}
        {value === 2 && (
          <Box
          padding={'15px'}
          sx={{
            background: '#FBF4E4',
          }}
        >
            <Box>
          { storedEntries.length!==0  ?(<Box width="100%">
            <EntrySlider>
            {storedEntries.map((entryId: any, index: any) => (
  <EntryContent    entityId={entryId} questionResponse={questionResponse} setQuestionResponseResponse={setQuestionResponseResponse} />
))}
            </EntrySlider>
          </Box>):(<Typography ml="25%" mt="10%"> Looks like there are no entries yet</Typography>)
      }
        </Box>
         <></>
        </Box>
        )}
      </Box>
    </Box>
  );
};
export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}
// export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
//   return {
//     paths: [], //indicates that no page needs be created at build time
//     fallback: 'blocking', //indicates the type of fallback
//   };
// };

export default ObservationQuestions;
