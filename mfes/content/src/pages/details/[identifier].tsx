import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Grid } from '@mui/material';
import { getLeafNodes, Layout } from '@shared-lib';
import CommonCollapse from '../../components/CommonCollapse'; // Adjust the import based on your folder structure
import { hierarchyAPI } from '../../services/Hierarchy';
import { trackingData } from '../../services/TrackingService';

interface DetailsProps {
  details: any;
}

export default function Details({ details }: DetailsProps) {
  const router = useRouter();
  const { identifier } = router.query; // Fetch the 'id' from the URL
  const [trackData, setTrackData] = useState([]);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDetails = async (identifier: string) => {
      try {
        const result = await hierarchyAPI(identifier);
        //@ts-ignore
        setSelectedContent(result);
        try {
          let courseList = result?.childNodes; // Extract all identifiers
          if (!courseList) {
            courseList = getLeafNodes(result);
          }

          const userId = localStorage.getItem('subId');
          const userIdArray = userId?.split(',');
          if (!userId) return; // Ensure required values exist
          //@ts-ignore
          const course_track_data = await trackingData(userIdArray, courseList);
          if (course_track_data?.data) {
            //@ts-ignore
            const userTrackData =
              course_track_data.data.find(
                (course: any) => course.userId === userId
              )?.course || [];
            setTrackData(userTrackData);
          }
        } catch (error) {
          console.error('Error fetching track data:', error);
        }
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setLoading(false);
      }
    };
    if (identifier) getDetails(identifier as string);
  }, [identifier]);

  const onBackClick = () => {
    router.back();
  };
  return (
    <Layout
      isLoadingChildren={loading}
      _topAppBar={{
        title: 'Shiksha: Course Details',
        actionButtonLabel: 'Action',
      }}
      backTitle="Course Details"
      backIconClick={onBackClick}
      onlyHideElements={['footer']}
    >
      <Box sx={{ p: '8px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {selectedContent?.name}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {selectedContent?.children?.length > 0 && (
              <RenderNestedChildren
                data={selectedContent.children}
                trackData={trackData}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}

const RenderNestedChildren = React.memo(function RenderNestedChildren({
  data,
  trackData,
}: {
  data: any[];
  trackData: any[];
}) {
  if (!Array.isArray(data)) {
    return null;
  }
  return data?.map((item: any) => (
    <CommonCollapse key={item.identifier} item={item} TrackData={trackData} />
  ));
});
