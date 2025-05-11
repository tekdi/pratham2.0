'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import {
  calculateTrackData,
  calculateTrackDataItem,
  CourseCompletionBanner,
  trackDataPorps,
} from '@shared-lib';
import { hierarchyAPI } from '@content-mfes/services/Hierarchy';
import { trackingData } from '@content-mfes/services/TrackingService';
import LayoutPage from '@content-mfes/components/LayoutPage';
import UnitGrid from '@content-mfes/components/UnitGrid';
import CollapsebleGrid from '@content-mfes/components/CommonCollapse';
import InfoCard from '@content-mfes/components/Card/InfoCard';
import {
  getUserCertificateStatus,
  issueCertificate,
} from '@content-mfes/services/Certificate';
import AppConst from '@content-mfes/utils/AppConst/AppConst';
import { checkAuth, getUserId } from '@shared-lib-v2/utils/AuthService';

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
  const [certificateId, setCertificateId] = useState();

  useEffect(() => {
    const getDetails = async (identifier: string) => {
      try {
        const resultHierarchy = await hierarchyAPI(identifier);
        const userId = getUserId(props?._config?.userIdLocalstorageName);
        let startedOn = '';
        if (checkAuth(Boolean(userId))) {
          const data = await getUserCertificateStatus({
            userId: userId as string,
            courseId: courseId as string,
          });
          if (
            !(
              data?.result?.status === 'enrolled' ||
              data?.result?.status === 'completed' ||
              data?.result?.status === 'viewCertificate'
            )
          ) {
            router.replace(
              `${
                props?._config?.contentBaseUrl ?? '/content'
              }-details/${courseId}`
            );
          } else {
            const userIdArray: string[] = Array.isArray(userId)
              ? (userId as string[]).filter(Boolean)
              : [userId as string].filter(Boolean);
            const course_track_data = await trackingData(userIdArray, [
              courseId as string,
            ]);
            const userTrackData =
              course_track_data.data.find(
                (course: any) => course.userId === userId
              )?.course || [];

            const newTrackData = calculateTrackData(
              userTrackData?.[0] ?? {},
              resultHierarchy?.children ?? []
            );

            setTrackData(newTrackData ?? []);
            if (data?.result?.status === 'viewCertificate') {
              setCertificateId(data?.result?.certificateId);
            } else if (course_track_data?.data && !unitId) {
              const course_track = calculateTrackDataItem(
                userTrackData?.[0] ?? {},
                resultHierarchy ?? {}
              );

              if (
                course_track?.status === 'completed' &&
                data?.result?.status === 'enrolled'
              ) {
                const userResponse: any = await getUserId();
                const resultCertificate = await issueCertificate({
                  userId: userId,
                  courseId: courseId,
                  unitId: unitId,
                  issuanceDate: new Date().toISOString(),
                  expirationDate: new Date(
                    new Date().setFullYear(new Date().getFullYear() + 20)
                  ).toISOString(),
                  credentialId: data?.result?.usercertificateId,
                  firstName: userResponse?.firstName ?? '',
                  middleName: userResponse?.middleName ?? '',
                  lastName: userResponse?.lastName ?? '',
                  courseName: resultHierarchy?.name ?? '',
                });
                setCertificateId(resultCertificate?.result?.credentialSchemaId);
              }
            }
          }
          startedOn = data?.result?.createdOn;
        }
        setSelectedContent({ ...resultHierarchy, startedOn });
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setLoading(false);
      }
    };
    if (identifier) getDetails(identifier as string);
  }, [identifier, courseId, router, unitId]);

  const handleItemClick = (subItem: any) => {
    if (props?._config?.handleCardClick) {
      props?._config.handleCardClick?.(subItem);
    } else {
      localStorage.setItem('unitId', subItem?.courseId);
      const path =
        subItem.mimeType === 'application/vnd.ekstep.content-collection'
          ? `${props?._config?.contentBaseUrl ?? '/content'}/${courseId}/${
              subItem?.identifier
            }`
          : `${
              props?._config?.contentBaseUrl ?? '/content'
            }/${courseId}/${unitId}/${subItem?.identifier}`;
      router.push(path);
    }
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

      <Box
        sx={{
          pt: 5,
          pb: 10,
          px: 10,
          gap: 2,
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {certificateId && (
          <CourseCompletionBanner certificateId={certificateId} />
        )}
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
