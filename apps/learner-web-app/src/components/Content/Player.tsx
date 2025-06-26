// pages/content-details/[identifier].tsx

'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Avatar, Box, Button, IconButton, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
// import { ContentSearch } from '@learner/utils/API/contentService';
import { checkAuth } from '@shared-lib-v2/utils/AuthService';
import {
  ExpandableText,
  findCourseUnitPath,
  useTranslation,
} from '@shared-lib';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchContent } from '@learner/utils/API/contentService';
import BreadCrumb from '@content-mfes/components/BreadCrumb';
import { hierarchyAPI } from '@content-mfes/services/Hierarchy';

const CourseUnitDetails = dynamic(() => import('@CourseUnitDetails'), {
  ssr: false,
});
const App = ({
  userIdLocalstorageName,
  contentBaseUrl,
  _config,
}: {
  userIdLocalstorageName?: string;
  contentBaseUrl?: string;
  _config?: any;
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const { identifier, courseId, unitId } = params || {}; // string | string[] | undefined
  const [item, setItem] = useState<{ [key: string]: any }>(null);
  const [breadCrumbs, setBreadCrumbs] = useState<any>();
  const [isShowMoreContent, setIsShowMoreContent] = useState(false);

  let activeLink = null;
  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search);
    activeLink = searchParams.get('activeLink');
  }
  useEffect(() => {
    const fetch = async () => {
      const response = await fetchContent(identifier);
      setItem({ content: response });
      if (unitId) {
        const course = await hierarchyAPI(courseId as string);
        const breadcrum = findCourseUnitPath({
          contentBaseUrl: contentBaseUrl,
          node: course,
          targetId: identifier as string,
          keyArray: [
            'name',
            'identifier',
            'mimeType',
            {
              key: 'link',
              suffix: activeLink
                ? `?activeLink=${encodeURIComponent(activeLink)}`
                : '',
            },
          ],
        });
        setBreadCrumbs(breadcrum?.slice(0, -1));
      } else {
        setBreadCrumbs([]);
      }
    };
    fetch();
  }, [identifier, unitId, courseId, activeLink, contentBaseUrl]);

  if (!identifier) {
    return <div>Loading...</div>;
  }
  const onBackClick = () => {
    if (breadCrumbs?.length > 1) {
      if (breadCrumbs?.[breadCrumbs.length - 1]?.link) {
        router.push(breadCrumbs?.[breadCrumbs.length - 1]?.link);
      }
    } else if (contentBaseUrl) {
      router.back();
    } else {
      router.push(`${activeLink ? activeLink : '/content'}`);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        px: { xs: 2 },
        pb: { xs: 1 },
        pt: { xs: 2, sm: 2, md: 4 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flex: { xs: 1, md: 15 },
          gap: 1,
          flexDirection: 'column',
          width: isShowMoreContent ? 'initial' : '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <IconButton
            aria-label="back"
            onClick={onBackClick}
            sx={{ width: '24px', height: '24px' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <BreadCrumb breadCrumbs={breadCrumbs} isShowLastLink />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            // pb: 2,
          }}
        >
          <Typography
            variant="body8"
            component="h2"
            sx={{
              fontWeight: 700,
              // fontSize: '24px',
              // lineHeight: '44px',
            }}
          >
            {item?.content?.name ?? '-'}
          </Typography>
          {item?.content?.description && (
            <ExpandableText
              text={item?.content?.description}
              maxWords={60}
              maxLines={2}
              _text={{
                fontSize: { xs: '14px', sm: '16px', md: '18px' },
                lineHeight: { xs: '20px', sm: '22px', md: '26px' },
              }}
            />
          )}
        </Box>
        <PlayerBox
          isShowMoreContent={isShowMoreContent}
          userIdLocalstorageName={userIdLocalstorageName}
          item={item}
          identifier={identifier}
          courseId={courseId}
          unitId={unitId}
          {..._config?.player}
        />
      </Box>

      <Box
        sx={{
          display: isShowMoreContent ? 'flex' : 'none',
          flexDirection: 'column',
          flex: { xs: 1, sm: 1, md: 9 },
        }}
      >
        <Typography
          variant="body5"
          component="h2"
          sx={{
            mb: 2,
            fontWeight: 500,
            // fontSize: '18px',
            // lineHeight: '24px',
          }}
        >
          {t('LEARNER_APP.PLAYER.MORE_RELATED_RESOURCES')}
        </Typography>

        <CourseUnitDetails
          isShowLayout={false}
          isHideInfoCard={true}
          _box={{
            pt: 1,
            pb: 1,
            px: { md: 1 },
            height: 'calc(100vh - 185px)',
          }}
          _config={{
            ...(_config?.courseUnitDetails || {}),
            getContentData: (item: any) => {
              setIsShowMoreContent(
                item.children.filter(
                  (item: any) => item.identifier !== identifier
                )?.length > 0
              );
            },
            _parentGrid: { pb: 2 },
            default_img: '/images/image_ver.png',
            _grid: { xs: 6, sm: 4, md: 6, lg: 6, xl: 6 },
            _card: {
              isHideProgress: true,
              ...(_config?.courseUnitDetails?._card || {}),
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default App;

const PlayerBox = ({
  item,
  identifier,
  courseId,
  unitId,
  userIdLocalstorageName,
  isGenerateCertificate,
  trackable,
  isShowMoreContent,
}: any) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (checkAuth() || userIdLocalstorageName) {
      setPlay(true);
    }
  }, []);

  const handlePlay = () => {
    if (checkAuth() || userIdLocalstorageName) {
      setPlay(true);
    } else {
      router.push(
        `/login?redirectUrl=${
          courseId ? `/content-details/${courseId}` : `/player/${identifier}`
        }`
      );
    }
  };
  return (
    <Box
      sx={{
        flex: { xs: 1, sm: 1, md: 8 },
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {!play && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <Avatar
            src={item?.posterImage ?? `/images/image_ver.png`}
            alt={item?.identifier}
            style={{
              height: 'calc(100vh - 235px)',
              width: '100%',
              borderRadius: 0,
            }}
          />
          <Button
            variant="contained"
            onClick={handlePlay}
            sx={{
              mt: 2,
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {t('Play')}
          </Button>
        </Box>
      )}

      {play && (
        <Box
          sx={{
            width: isShowMoreContent
              ? '100%'
              : { xs: '100%', sm: '100%', md: '90%', lg: '80%', xl: '70%' },
          }}
        >
          <iframe
            name={JSON.stringify({
              isGenerateCertificate: isGenerateCertificate,
              trackable: trackable,
            })}
            src={`${
              process.env.NEXT_PUBLIC_LEARNER_SBPLAYER
            }?identifier=${identifier}${
              courseId && unitId ? `&courseId=${courseId}&unitId=${unitId}` : ''
            }${
              userIdLocalstorageName
                ? `&userId=${localStorage.getItem(userIdLocalstorageName)}`
                : ''
            }`}
            style={{
              border: 'none',
              objectFit: 'contain',
              aspectRatio: '16 / 9',
            }}
            allowFullScreen
            width="100%"
            height="100%"
            title="Embedded Localhost"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            frameBorder="0"
            scrolling="no"
            sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation"
          />
        </Box>
      )}
    </Box>
  );
};
