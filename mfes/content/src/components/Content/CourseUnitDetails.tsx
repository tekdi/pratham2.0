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
  const [effectiveUnitId, setEffectiveUnitId] = useState<string | undefined>(
    Array.isArray(unitId) ? unitId[0] : unitId
  );
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
        }) as any;
        console.log('resultHierarchyCourse=======>', resultHierarchyCourse?.program);
        if (!resultHierarchyCourse?.program?.includes(localStorage.getItem('userProgram')))
        {
          router.push('/unauthorized');
          return;
        }
        let resultHierarchy = resultHierarchyCourse;
        console.log('resultHierarchyCourse', resultHierarchyCourse);
        
        // If no unitId is provided (course level), automatically use the first unit ONLY if there's exactly one child
        if (!unitId && resultHierarchyCourse?.children && resultHierarchyCourse.children.length === 1) {
          const firstUnit = resultHierarchyCourse.children[0];
          const firstUnitId = typeof firstUnit === 'string' ? firstUnit : (firstUnit as any)?.identifier;
          if (firstUnitId) {
            setEffectiveUnitId(firstUnitId);
            resultHierarchy = getUnitFromHierarchy(resultHierarchyCourse, firstUnitId);
          }
        } else if (unitId) {
          resultHierarchy = getUnitFromHierarchy(resultHierarchyCourse, unitId as string);
        }
        
        if (props?.showBreadCrumbs) {
          const breadcrum = findCourseUnitPath({
            contentBaseUrl: props?._config?.contentBaseUrl,
            node: resultHierarchyCourse,
            targetId: (effectiveUnitId as string) || (courseId as string),
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
        if (effectiveUnitId && !props?.isHideInfoCard) {
          setCourseItem(resultHierarchyCourse);
          const breadcrum = findCourseUnitPath({
            contentBaseUrl: props?._config?.contentBaseUrl,
            node: resultHierarchyCourse,
            targetId: (effectiveUnitId as string) || (courseId as string),
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

        // Always set courseItem when at course level to show course info in header
        if (!unitId) {
          const courseStartDate = resultHierarchyCourse?.createdOn || 
                                 resultHierarchyCourse?.lastUpdatedOn || 
                                 new Date().toISOString();
          
          setCourseItem({ 
            ...resultHierarchyCourse, 
            startedOn: courseStartDate,
            // Ensure these fields are set for the InfoCard to display properly
            createdOn: courseStartDate,
            enrollmentDate: courseStartDate
          });
        }

        if (props?._config?.getContentData) {
          props?._config?.getContentData(resultHierarchy);
        }

        const userId = getUserId(props?._config?.userIdLocalstorageName);
        let startedOn = {};
        if (props?._config?.isEnrollmentRequired !== false) {
          if (checkAuth(Boolean(userId))) {
            const userIdString = Array.isArray(userId) ? userId[0] : userId;
            const data = await getUserCertificateStatus({
              userId: userIdString as string,
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
                  (course: any) => course.userId === userIdString
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
              } else if (course_track_data?.data && !effectiveUnitId) {
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
                    userId: userIdString as string,
                    courseId: courseId,
                  });
                  console.log('responseCriteria', responseCriteria);
                  if (responseCriteria === true) {
                    const resultCertificate = await issueCertificate({
                      userId: userIdString as string,
                      courseId: courseId,
                      unitId: effectiveUnitId as string,
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
            
            // Update courseItem with completion status if at course level
            if (!unitId) {
              setCourseItem((prev: any) => ({
                ...prev,
                startedOn: data?.result?.status === 'completed' || data?.result?.status === 'viewCertificate' 
                  ? undefined 
                  : data?.result?.createdOn || prev?.startedOn,
                issuedOn: data?.result?.status === 'completed' || data?.result?.status === 'viewCertificate'
                  ? data?.result?.issuedOn || data?.result?.completedOn
                  : undefined
              }));
            }
          }
        }
        setSelectedContent({ ...resultHierarchy, ...startedOn });
        
        // If at course level, ensure selectedContent has course start date for InfoCard
        if (!unitId) {
          const courseStartDate = resultHierarchyCourse?.createdOn || 
                                 resultHierarchyCourse?.lastUpdatedOn || 
                                 new Date().toISOString();
          
          // Check if we have completion data from enrollment
          const hasCompletionData = (startedOn as any)?.issuedOn || (startedOn as any)?.completedOn;
          const isCompleted = hasCompletionData && ((startedOn as any)?.status === 'completed' || (startedOn as any)?.status === 'viewCertificate');
          
          setSelectedContent((prev: any) => ({ 
            ...prev, 
            startedOn: isCompleted ? undefined : courseStartDate,
            issuedOn: isCompleted ? ((startedOn as any)?.issuedOn || (startedOn as any)?.completedOn) : undefined,
            createdOn: courseStartDate,
            enrollmentDate: courseStartDate
          }));
        }
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
          }/${courseId}/${effectiveUnitId}/${subItem?.identifier}`;
      router.push(`${path}${activeLink ? `?activeLink=${activeLink}` : ''}`);
    }
  };

  const onBackClick = () => {
    // If we're at course level (no unitId), go back to the activeLink or courses page
    if (!unitId) {
      if (activeLink) {
        router.push(activeLink);
      } else {
        router.push(`${props?._config?.contentBaseUrl ?? ''}/content`);
      }
      return;
    }

    // If we have breadcrumbs and there are multiple levels, go to previous level
    if (breadCrumbs?.length > 1) {
      if (breadCrumbs?.[breadCrumbs.length - 2]?.link) {
        router.push(breadCrumbs?.[breadCrumbs.length - 2]?.link);
      }
    } else {
      // Fallback: go back to course level
      router.push(
        `${props?._config?.contentBaseUrl ?? '/content'}/${courseId}${activeLink ? `?activeLink=${activeLink}` : ''}`
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
        <>
          {console.log('InfoCard item data:', !unitId ? courseItem : selectedContent)}
          {console.log('Course completion status:', !unitId ? courseItem?.issuedOn : selectedContent?.issuedOn)}
          <InfoCard
            item={!unitId ? courseItem : selectedContent}
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
                // Ensure completion date is properly displayed
                showCompletionDate: true,
                ...props?._config?._infoCard,
              },
            }}
          />
        </>
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
        {certificateId && !effectiveUnitId && (
          <CourseCompletionBanner certificateId={certificateId} />
        )}
        
        {/* Show completion banner for completed courses */}
        {!unitId && courseItem?.children?.length === 1 && courseItem?.issuedOn && (
          <CourseCompletionBanner certificateId={certificateId || ''} />
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
