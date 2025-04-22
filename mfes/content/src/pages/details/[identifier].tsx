import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import { getLeafNodes } from '@shared-lib';
import { hierarchyAPI } from '../../services/Hierarchy';
import { trackingData } from '../../services/TrackingService';
import LayoutPage from '../../components/LayoutPage';
import UnitGrid from '../../components/UnitGrid';
import CollapsebleGrid from '../../components/CommonCollapse';
import InfoCard from '../../components/Card/InfoCard';

interface DetailsProps {
  isShowLayout?: any;
  type?: 'collapse' | 'card';
  _config?: any;
}

export default function Details(props: DetailsProps) {
  const router = useRouter();
  const params = useParams();
  const identifier = params?.identifier; // string | string[] | undefined
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

          const userId = localStorage.getItem('userId');
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
    <LayoutPage
      isShow={props?.isShowLayout}
      isLoadingChildren={loading}
      _topAppBar={{
        title: 'Shiksha: Course Details',
        actionButtonLabel: 'Action',
      }}
      backTitle="Course Details"
      backIconClick={onBackClick}
      onlyHideElements={['footer']}
    >
      <InfoCard
        item={selectedContent}
        onBackClick={onBackClick}
        _config={{
          ...props?._config,
          _infoCard: {
            isShowStatus: trackData,
            isHideStatus: true,
            ...props?._config?._infoCard,
          },
        }}
      />

      <Box sx={{ pt: 5, pb: 10, px: 10 }}>
        {props?.type === 'collapse' ? (
          selectedContent?.children?.length > 0 && (
            <CollapsebleGrid
              data={selectedContent.children}
              trackData={trackData}
            />
          )
        ) : (
          <UnitGrid
            item={selectedContent}
            trackData={trackData}
            _config={props?._config}
          />
        )}
      </Box>
    </LayoutPage>
  );
}
