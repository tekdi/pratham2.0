// pages/content-details/[identifier].tsx

'use client';
import React, { useEffect, useState } from 'react';
import Layout from '@learner/components/Layout';
import dynamic from 'next/dynamic';
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  IconButton,
  Typography,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { fetchContent } from '@learner/utils/API/contentService';
import { checkAuth } from '@shared-lib-v2/utils/AuthService';
import { useTranslation } from '@shared-lib';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { gredientStyle } from '@learner/utils/style';

const Content = dynamic(() => import('@Content'), {
  ssr: false,
});
const App = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const { identifier, courseId, unitId } = params; // string | string[] | undefined
  const [item, setItem] = useState<{ [key: string]: any }>(null);
  const [relatedIdentity, setRelatedIdentity] = useState<Array<string | null>>(
    []
  );

  useEffect(() => {
    const fetch = async () => {
      const response = await fetchContent(identifier);
      setItem(response);
    };
    fetch();
  }, [identifier]);

  if (!identifier) {
    return <div>Loading...</div>;
  }
  const onBackClick = () => {
    router.back();
  };

  return (
    <Layout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          p: { xs: 2, md: 4 },
        }}
        style={gredientStyle}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: 'column',
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
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Typography variant="body1">
                {t('LEARNER_APP.COMMON.COURSES')}
              </Typography>
              <Typography variant="body1">
                {t('LEARNER_APP.COMMON.UNITS')}
              </Typography>
              <Typography variant="body1">{item?.name}</Typography>
            </Breadcrumbs>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: 'column',
              pb: 2,
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '36px',
                lineHeight: '44px',
              }}
            >
              {item?.name ?? '-'}
            </Typography>
            {item?.description && (
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '24px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {item?.description ?? '-'}
              </Typography>
            )}
          </Box>
          <PlayerBox
            item={item}
            identifier={identifier}
            courseId={courseId}
            unitId={unitId}
          />
        </Box>
        {courseId && unitId && relatedIdentity.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flex: { xs: 1, sm: 1, md: 4 },
            }}
          >
            <Typography
              sx={{
                mb: 2,
                fontWeight: 500,
                fontSize: '18px',
                lineHeight: '24px',
              }}
            >
              {t('LEARNER_APP.PLAYER.MORE_RELATED_RESOURCES')}
            </Typography>

            <Content
              isShowLayout={false}
              contentTabs={['content']}
              showFilter={false}
              showSearch={false}
              showHelpDesk={false}
              filters={{
                limit: 4,
                filters: {
                  identifier: relatedIdentity,
                },
              }}
              _config={{
                _grid: {
                  xs: 6,
                  sm: 6,
                  md: 6,
                  lg: 6,
                },
                default_img: '/images/image_ver.png',
              }}
              hasMoreData={false}
            />
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default App;

const PlayerBox = ({ item, identifier, courseId, unitId }: any) => {
  const router = useRouter();
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (checkAuth()) {
      setPlay(true);
    }
  }, []);

  const handlePlay = () => {
    if (checkAuth()) {
      setPlay(true);
    } else {
      router.push('/login?redirectUrl=/content-details/' + courseId);
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
              height: 'calc(100vh - 150px)',
              width: 'auto',
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
          }`}
          style={{
            // display: 'block',
            // padding: 0,
            height: 'calc(100vh - 150px)',
            border: 'none',
          }}
          width="100%"
          height="100%"
          title="Embedded Localhost"
        />
      )}
    </Box>
  );
};
