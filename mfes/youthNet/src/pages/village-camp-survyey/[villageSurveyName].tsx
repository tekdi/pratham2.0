import Header from '../../components/Header';
import withRole from '../../components/withRole';
import BackHeader from '../../components/youthNet/BackHeader';
import EntryContent from '../../components/youthNet/EntryContent';
import EntrySlider from '../../components/youthNet/EntrySlider';
import { CAMP_DATA } from '../../components/youthNet/tempConfigs';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { TENANT_DATA } from '../../utils/app.config';
import { UserList } from '../../components/youthNet/UserCard';
import UploadedFile from '../../components/youthNet/UploadedFile';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PieChartComponent from '../../components/youthNet/Survey/PieChartComponent';
import ParticipantsList from '../../components/youthNet/Survey/ParticipantsList';
interface UserData {
  gender: string;
  age: number;
  name?:string
}
const villageSurveyName = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme<any>();
  const { villageSurveyName } = router.query;
  const { volunteerCount } = router.query;

  const [value, setValue] = React.useState(1);
  const [village, setVillage] = useState<string>('');
  const [camp, setCamp] = useState<string>('');

  // const entry1 = [{ name: 'Anita Kulkarni', age: '', village: '', image: '' }];
  // const entry2 = [{ name: 'Ananya Sen', age: '', village: '', image: '' }];
  // const youthListUser1 = [
  //   { name: 'Ananya Gupta', age: '16', village: 'Female', image: '' },
  //   { name: 'Ankita Sharma', age: '15', village: 'Female', image: '' },
  // ];
  // const youthListUser2 = [
  //   { name: 'Ankita Sharma', age: '15', village: 'Female', image: '' },
  //   { name: 'Ananya Gupta', age: '16', village: 'Female', image: '' },
  // ];
  // const files = ['Uploaded_file1.mp4', 'Uploaded_file2.mp4'];

  useEffect(() => {
    if (villageSurveyName) {
      const [villageName, ...rest] = (villageSurveyName as string).split(
        /(?=[A-Z])/
      );
      const surveyTitle = rest.join('');

      setVillage(villageName);
      setCamp(surveyTitle);
    }
  }, [villageSurveyName]);

  const handleBack = () => {
    router.back();
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const mapBackendDataToQAPairs = (data: any) => {
    const answers = data?.OB?.answers || {};
    return Object.values(answers)
      .map((answer: any) => {
        const question = answer.payload?.question?.[0];
        const label = answer.payload?.labels?.[0];
        
        if (question && label) {
          return { question, answer: label };
        }
        return null;
      })
      .filter(Boolean);
  };
  const backendData ={
    "OB": {
        "status": "submit",
        "externalId": "OB",
        "answers": {
            "6748632e5c5385c232988159": {
                "qid": "6748632e5c5385c232988159",
                "value": "R2",
                "remarks": "",
                "fileName": [],
                "gpsLocation": "",
                "payload": {
                    "question": [
                        "Reason of Visit",
                        ""
                    ],
                    "labels": [
                        "Incomplete assignment / homework"
                    ],
                    "responseType": "radio",
                    "filesNotUploaded": []
                },
                "startTime": 1741868082785,
                "endTime": 1741868084917,
                "criteriaId": "6748632e5c5385c232988163",
                "responseType": "radio",
                "evidenceMethod": "OB",
                "rubricLevel": ""
            },
            "6748632e5c5385c23298815a": {
                "qid": "6748632e5c5385c23298815a",
                "value": "",
                "remarks": "",
                "fileName": [],
                "gpsLocation": "",
                "payload": {
                    "question": [
                        "Reason for Low Attendance",
                        ""
                    ],
                    "responseType": "radio",
                    "filesNotUploaded": []
                },
                "startTime": "",
                "endTime": "",
                "criteriaId": "6748632e5c5385c232988163",
                "responseType": "radio",
                "evidenceMethod": "OB",
                "rubricLevel": ""
            },
            "6748632e5c5385c23298815b": {
                "qid": "6748632e5c5385c23298815b",
                "value": "R3",
                "remarks": "",
                "fileName": [],
                "gpsLocation": "",
                "payload": {
                    "question": [
                        "When can student start coming to classes?",
                        ""
                    ],
                    "labels": [
                        "Does not want to come / Dropout"
                    ],
                    "responseType": "radio",
                    "filesNotUploaded": []
                },
                "startTime": 1741868082788,
                "endTime": 1741868086165,
                "criteriaId": "6748632e5c5385c232988163",
                "responseType": "radio",
                "evidenceMethod": "OB",
                "rubricLevel": ""
            },
            "6748632e5c5385c23298815c": {
                "qid": "6748632e5c5385c23298815c",
                "value": "nice",
                "remarks": "",
                "fileName": [],
                "gpsLocation": "",
                "payload": {
                    "question": [
                        "Comments",
                        ""
                    ],
                    "labels": [
                        "nice"
                    ],
                    "responseType": "text",
                    "filesNotUploaded": []
                },
                "startTime": 1741868082789,
                "endTime": 1741868094699,
                "criteriaId": "6748632e5c5385c232988163",
                "responseType": "text",
                "evidenceMethod": "OB",
                "rubricLevel": ""
            }
        },
        "startTime": 1741868082770,
        "endTime": 1741868094879,
        "gpsLocation": null,
        "submittedBy": "f35d5f03-b052-4ee2-b949-ac897623f08f",
        "submittedByName": "sample TL shetake",
        "submittedByEmail": null,
        "submissionDate": "2025-03-13T12:14:56.290Z",
        "isValid": true
    }
}
const data: Record<string, UserData> = {
  "123": { gender: "male", age: 17, name: "John Doe" },
  "1283": { gender: "female", age: 18, name: "Jane Smith" },
  "12843": { gender: "female", age: 14, name: "Emily Johnson" },
};

const ageColors = ["#EE6002", "#26A69A", "#6200EE", "#FFC107"];
const genderColors = ["#008080", "#FF4500"];

const processData = (key: keyof UserData) => {
  const counts: Record<string, number> = {};
  Object.values(data).forEach((item) => {
    const value = item[key] as string;
    counts[value] = (counts[value] || 0) + 1;
  });
  return Object.keys(counts).map((value, index) => ({
    name: value,
    value: counts[value],
    color: key === "age" ? ageColors[index % ageColors.length] : genderColors[index % genderColors.length],
  }));
};

  const qaPairs : any= mapBackendDataToQAPairs(backendData);
  return (
    <Box minHeight="100vh">
      <Box>
        <Header />
      </Box>
      <Box>
        <BackHeader
          headingOne={village}
          headingTwo={'Creativity Mahotsav'}
          showBackButton={true}
          onBackClick={handleBack}
        />
      </Box>
      <Box ml={2}>
        <Typography
          sx={{ fontSize: '14px', fontWeight: 400, fontStyle: 'italic' }}
        >
{volunteerCount} {t('YOUTHNET_VOLUNTEERLIST.VOLUNTEERS_ASSIGNED')}        </Typography>
      </Box>
      <Box sx={{ width: '100%', display: 'flex' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="inherit"
          aria-label="secondary tabs example"
          sx={{
            fontSize: '14px',
            borderBottom: `1px solid #EBE1D4`,
            '& .MuiTab-root': {
              color: '#4D4639',
              padding: '0 20px',
            },
            '& .Mui-selected': {
              color: '#4D4639',
            },
            '& .MuiTabs-indicator': {
              display: 'flex',
              backgroundColor: theme.palette.primary.main,
              borderRadius: '100px',
              height: '3px',
            },
            '& .MuiTabs-scroller': {
              overflowX: 'unset !important',
            },
          }}
        >
          <Tab value={1} label={t('YOUTHNET_CAMP_DETAILS.SUBMISSION')} />
          <Tab value={2} label={t('YOUTHNET_CAMP_DETAILS.SUMMARY')} />
        </Tabs>
      </Box>
      {value === 1 && (
        <Box>
          <Box width="100%">
            <EntrySlider>
            <EntryContent date="March 13, 2025" qaPairs={qaPairs} />

            <EntryContent date="March 13, 2025" qaPairs={qaPairs} />

            </EntrySlider>
          </Box>
        </Box>
      )}
      {value === 2 && <Box> <div style={{ display: "flex", flexWrap: "wrap" }}>
      <PieChartComponent title="Age" data={processData("age")} />
      <PieChartComponent title="Gender" data={processData("gender")} />
      <ParticipantsList users={Object.values(data)} />

    </div></Box>}
    </Box>
  );
};
export async function getStaticPaths() {
  return {
    paths: [], // No pre-generated pages
    fallback: 'blocking', // Generate page on request
  };
}

export async function getStaticProps({ params, locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      villageSurveyName: params.villageSurveyName, // Pass param as prop
    },
  };
}
export default withRole(TENANT_DATA.YOUTHNET)(villageSurveyName);
