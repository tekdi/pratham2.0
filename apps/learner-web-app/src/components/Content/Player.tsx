// pages/content-details/[identifier].tsx

'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Avatar, Box, Button, IconButton, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
// import { ContentSearch } from '@learner/utils/API/contentService';
import { checkAuth } from '@shared-lib-v2/utils/AuthService';
import { findCourseUnitPath, useTranslation } from '@shared-lib';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchContent } from '@learner/utils/API/contentService';
import BreadCrumb from '@content-mfes/components/BreadCrumb';
import { hierarchyAPI } from '@content-mfes/services/Hierarchy';

const CourseUnitDetails = dynamic(() => import('@CourseUnitDetails'), {
  ssr: false,
});
const App = (props: { userIdLocalstorageName?: string }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const { identifier, courseId, unitId } = params; // string | string[] | undefined
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
        const breadcrum = findCourseUnitPath(course, identifier as string, [
          'name',
          'identifier',
          'mimeType',
          {
            key: 'link',
            suffix: activeLink ? `?activeLink=${activeLink}` : '',
          },
        ]);
        setBreadCrumbs(breadcrum?.slice(0, -1));
      } else {
        // const breadcrum = findCourseUnitPath(
        //   response,
        //   identifier as string,
        //   ['name', 'identifier', 'mimeType'],
        //   [{ name: 'Content' }]
        // );
        setBreadCrumbs([{ name: 'Content' }]);
      }
    };
    fetch();
  }, [identifier, unitId, courseId, activeLink]);

  if (!identifier) {
    return <div>Loading...</div>;
  }
  const onBackClick = () => {
    if (breadCrumbs?.length > 1) {
      if (breadCrumbs?.[breadCrumbs.length - 1]?.link) {
        router.push(breadCrumbs?.[breadCrumbs.length - 1]?.link);
      }
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
            <Typography
              variant="h3"
              sx={{
                fontWeight: 400,
                // fontSize: '14px',
                // lineHeight: '24px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
              }}
            >
              {item?.content?.description ?? 'no description'}
            </Typography>
          )}
        </Box>
        <PlayerBox
          userIdLocalstorageName={props.userIdLocalstorageName}
          item={item}
          identifier={identifier}
          courseId={courseId}
          unitId={unitId}
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
            px: 1,
            height: 'calc(100vh - 185px)',
          }}
          _config={{
            getContentData: (item: any) => {
              setIsShowMoreContent(
                item.children.filter(
                  (item: any) => item.identifier !== identifier
                )?.length > 0
              );
            },
            _parentGrid: { pb: 2 },
            default_img: '/images/image_ver.png',
            _grid: { xs: 6, sm: 4, md: 6, lg: 4, xl: 3 },
            _card: { isHideProgress: true },
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
}: any) => {
  const router = useRouter();
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
            Play
          </Button>
        </Box>
      )}
      {play && (
        <iframe
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
            width: '100%',
            height: 'calc(100vh - 235px)',
            border: 'none',
            objectFit: 'contain',
          }}
          allowFullScreen
          width="100%"
          height="100%"
          title="Embedded Localhost"
        />
      )}
    </Box>
  );
};
