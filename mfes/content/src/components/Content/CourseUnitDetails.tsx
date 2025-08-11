'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Fade } from '@mui/material';
import {
  calculateTrackData,
  calculateTrackDataItem,
  CourseCompletionBanner,
  trackDataPorps,
  findCourseUnitPath,
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
import { checkCriteriaForCertificate } from '@shared-lib-v2/utils/CertificateService/coursesCertificates';
import AppConst from '@content-mfes/utils/AppConst/AppConst';
import { checkAuth, getUserId } from '@shared-lib-v2/utils/AuthService';
import { getUserId as getUserIdLocal } from '@content-mfes/services/LoginService';
import BreadCrumb from '../BreadCrumb';

interface DetailsProps {
  isShowLayout?: any;
  isHideInfoCard?: boolean;
  showBreadCrumbs?: any;
  id?: string;
  type?: 'collapse' | 'card';
  _config?: any;
  _box?: any;
}

const getUnitFromHierarchy = (resultHierarchy: any, unitId: string): any => {
  if (resultHierarchy?.identifier === unitId) {
    return resultHierarchy;
  }
  if (resultHierarchy?.children) {
    for (const child of resultHierarchy.children) {
      const unit = getUnitFromHierarchy(child, unitId);
      if (unit) {
        return unit;
      }
    }
  }
  return null;
};

export default function Details(props: DetailsProps) {
  const router = useRouter();
  const { courseId, unitId, identifier: contentId } = useParams();
  const identifier = courseId;
  const [trackData, setTrackData] = useState<trackDataPorps[]>([]);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [courseItem, setCourseItem] = useState<any>({});
  const [breadCrumbs, setBreadCrumbs] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [certificateId, setCertificateId] = useState();
  let activeLink = null;
  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search);
    activeLink = searchParams.get('activeLink');
  }

  useEffect(() => {
    const getDetails = async (identifier: string) => {
      try {
        const resultHierarchyCourse = await hierarchyAPI(identifier, {
          mode: 'edit',
        });
        let resultHierarchy = resultHierarchyCourse;
        if (unitId) {
          resultHierarchy = getUnitFromHierarchy(
            resultHierarchy,
            unitId as string
          );
        }
        if (props?.showBreadCrumbs) {
          const breadcrum = findCourseUnitPath({
            contentBaseUrl: props?._config?.contentBaseUrl,
            node: resultHierarchyCourse,
            targetId: (unitId as string) || (courseId as string),
            keyArray: [
              'name',
              'identifier',
              'mimeType',
              {
                key: 'link',
                suffix: activeLink ? `?activeLink=${activeLink}` : '',
              },
            ],
          });
          setBreadCrumbs([
            ...(props?.showBreadCrumbs?.prefix || []),
            ...(breadcrum || []),
            ...(props?.showBreadCrumbs?.suffix || []),
          ]);
        }
        if (unitId && !props?.isHideInfoCard) {
          setCourseItem(resultHierarchyCourse);
          const breadcrum = findCourseUnitPath({
            contentBaseUrl: props?._config?.contentBaseUrl,
            node: resultHierarchyCourse,
            targetId: (unitId as string) || (courseId as string),
            keyArray: [
              'name',
              'identifier',
              'mimeType',
              {
                key: 'link',
                suffix: activeLink ? `?activeLink=${activeLink}` : '',
              },
            ],
          });
          setBreadCrumbs(breadcrum);
        }

        if (props?._config?.getContentData) {
          props?._config?.getContentData(resultHierarchy);
        }

        // Auto - redirect if there's only one child and we're at course level
        // if (!unitId && resultHierarchy?.children?.length === 1) {
        //   const singleChild = resultHierarchy.children[0] as any;
        //   const childIdentifier = typeof singleChild === 'string' ? singleChild : singleChild?.identifier;
        //   if (childIdentifier) {
        //     const redirectPath = `${props?._config?.contentBaseUrl ?? '/content'}/${courseId}/${childIdentifier}${activeLink ? `?activeLink=${activeLink}` : ''}`;
        //     router.replace(redirectPath);
        //     return;
        //   }
        // }

        const userId = getUserId(props?._config?.userIdLocalstorageName);
        let startedOn = {};
        if (props?._config?.isEnrollmentRequired !== false) {
          if (checkAuth(Boolean(userId))) {
            const data = await getUserCertificateStatus({
              userId: userId as string,
              courseId: courseId as string,
            });
            if (
              ![
                'enrolled',
                'inprogress',
                'completed',
                'viewCertificate',
              ].includes(data?.result?.status)
            ) {
              router.replace(
                `${props?._config?.contentBaseUrl ?? '/content'
                }-details/${courseId}${activeLink ? `?activeLink=${activeLink}` : ''
                }`
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
                if (props?._config?.userIdLocalstorageName !== 'did') {
                  setCertificateId(data?.result?.certificateId);
                }
              } else if (course_track_data?.data && !unitId) {
                const course_track = calculateTrackDataItem(
                  userTrackData?.[0] ?? {},
                  resultHierarchy ?? {}
                );

                if (
                  course_track?.status === 'completed' &&
                  ['enrolled', 'completed'].includes(data?.result?.status) &&
                  props?._config?.userIdLocalstorageName !== 'did'
                ) {
                  const userResponse: any = await getUserIdLocal();
                  const responseCriteria = await checkCriteriaForCertificate({
                    userId: userId,
                    courseId: courseId,
                  });
                  console.log('responseCriteria', responseCriteria);
                  if (responseCriteria === true) {
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
                    setCertificateId(
                      resultCertificate?.result?.credentialSchemaId
                    );
                  } else {
                  }
                }
              }
            }
            startedOn = {
              startedOn: data?.result?.createdOn,
              issuedOn: data?.result?.issuedOn,
            };
          }
        }
        setSelectedContent({ ...resultHierarchy, ...startedOn });
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setLoading(false);
      }
    };
    if (identifier) getDetails(identifier as string);
  }, [
    identifier,
    courseId,
    router,
    unitId,
    props?._config,
    activeLink,
    props?.isHideInfoCard,
  ]);

  const handleItemClick = (subItem: any) => {
    if (props?._config?.handleCardClick) {
      props?._config.handleCardClick?.(subItem);
    } else {
      localStorage.setItem('unitId', subItem?.courseId);
      const path =
        subItem.mimeType === 'application/vnd.ekstep.content-collection'
          ? `${props?._config?.contentBaseUrl ?? '/content'}/${courseId}/${subItem?.identifier
          }`
          : `${props?._config?.contentBaseUrl ?? '/content'
          }/${courseId}/${unitId}/${subItem?.identifier}`;
      router.push(`${path}${activeLink ? `?activeLink=${activeLink}` : ''}`);
    }
  };

  const onBackClick = () => {
    if (breadCrumbs?.length > 1) {
      // router.back()
      if (breadCrumbs?.[breadCrumbs.length - 2]?.link) {
        router.push(breadCrumbs?.[breadCrumbs.length - 2]?.link);
      }
    } else {
      router.push(
        `${activeLink
          ? activeLink
          : `${props?._config?.contentBaseUrl ?? ''}/content`
        }`
      );
    }
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
      {!props?.isHideInfoCard && (
        <InfoCard
          item={selectedContent}
          topic={courseItem?.se_subjects ?? selectedContent?.se_subjects}
          onBackClick={onBackClick}
          _config={{
            ...props?._config,
            _infoCard: {
              breadCrumbs: breadCrumbs,
              isShowStatus:
                props?._config?.isEnrollmentRequired !== false
                  ? trackData
                  : false,
              isHideStatus: true,
              default_img: `${AppConst.BASEPATH}/assests/images/image_ver.png`,
              ...props?._config?._infoCard,
            },
          }}
        />
      )}
      {props?.showBreadCrumbs && (
        <Box sx={{
          position: 'relative',
          zIndex: 1000,
        }}>
          <BreadCrumb
            breadCrumbs={breadCrumbs}
            isShowLastLink
            customPlayerStyle={true}
            customPlayerMarginTop={35}
          />
        </Box>
      )}
      <Box
        sx={{
          pt: { xs: 1, md: 2 },
          pb: { xs: 4, md: 10 },
          px: { xs: 2, sm: 3, md: 10 },
          gap: 2,
          ...props?._box,
        }}
      >
        {certificateId && !unitId && (
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
            skipContentId={
              typeof contentId === 'string' ? contentId : undefined
            }
            trackData={trackData}
            _config={props?._config}
          />
        )}
      </Box>
    </LayoutPage>
  );
}
