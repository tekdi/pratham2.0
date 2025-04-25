'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import { calculateTrackData, trackDataPorps } from '@shared-lib';
import { hierarchyAPI } from '@content-mfes/services/Hierarchy';
import { trackingData } from '@content-mfes/services/TrackingService';
import LayoutPage from '@content-mfes/components/LayoutPage';
import UnitGrid from '@content-mfes/components/UnitGrid';
import CollapsebleGrid from '@content-mfes/components/CommonCollapse';
import InfoCard from '@content-mfes/components/Card/InfoCard';
import { getUserCertificateStatus } from '@content-mfes/services/Certificate';
import AppConst from '@content-mfes/utils/AppConst/AppConst';

interface DetailsProps {
  isShowLayout?: any;
  id?: string;
  type?: 'collapse' | 'card';
  _config?: any;
}

export default function Details(props: DetailsProps) {
  const router = useRouter();
  const { courseId, unitId } = useParams();
  const identifier = unitId ?? courseId;
  const [trackData, setTrackData] = useState<trackDataPorps[]>([]);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDetails = async (identifier: string) => {
      try {
        const result = await hierarchyAPI(identifier);
        const userId = localStorage.getItem('userId');
        const tenantId = localStorage.getItem('tenantId');
        let startedOn = '';
        if (userId && tenantId) {
          const data = await getUserCertificateStatus({
            userId,
            courseId: courseId as string,
          });
          if (
            !(
              data?.result?.status === 'enrolled' ||
              data?.result?.status === 'completed'
            )
          ) {
            router.replace(`/content-details/${courseId}`);
          }
          startedOn = data?.result?.createdOn;
        }
        setSelectedContent({ ...result, startedOn });
        if (!userId) return; // Ensure required values exist

        try {
          const userIdArray = userId?.split(',');
          //@ts-ignore
          const course_track_data = await trackingData(userIdArray, [courseId]);
          if (course_track_data?.data) {
            //@ts-ignore
            const userTrackData =
              course_track_data.data.find(
                (course: any) => course.userId === userId
              )?.course || [];
            const newTrackData = calculateTrackData(
              userTrackData?.[0] ?? {},
              result?.children ?? []
            );

            setTrackData(newTrackData ?? []);
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
  }, [identifier, courseId, router]);

  const handleItemClick = (subItem: any) => {
    localStorage.setItem('unitId', subItem?.courseId);
    const path =
      subItem.mimeType === 'application/vnd.ekstep.content-collection'
        ? `/content/${courseId}/${subItem?.identifier}`
        : `/content/${courseId}/${unitId}/${subItem?.identifier}`;
    console.log(path, subItem);
    router.push(path);
  };

  const onBackClick = () => {
    router.back();
    // if (unitId) {
    //   router.push(`/content/${courseId}`);
    // } else if (courseId) {
    //   router.push(`/content`);
    // }
  };

  return (
    <LayoutPage
      isShow={props?.isShowLayout}
      isLoadingChildren={loading}
      _topAppBar={{
        title: 'Shiksha: Course Details',
        actionButtonLabel: 'Action',
      }}
      onlyHideElements={['footer']}
    >
      <InfoCard
        item={selectedContent}
        onBackClick={onBackClick}
        _config={{
          default_img: `${AppConst.BASEPATH}/assests/images/image_ver.png`,
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
            handleItemClick={handleItemClick}
            item={selectedContent}
            trackData={trackData}
            _config={props?._config}
          />
        )}
      </Box>
    </LayoutPage>
  );
}
