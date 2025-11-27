'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import { Box, LinearProgress, useTheme } from '@mui/material';
import { CircularProgressWithLabel } from '../Progress/CircularProgressWithLabel';
import SpeakableText from '../textToSpeech/SpeakableText';
import { capitalize } from 'lodash';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TripOriginOutlinedIcon from '@mui/icons-material/TripOriginOutlined';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import AdjustIcon from '@mui/icons-material/Adjust';
import { useTranslation } from '../context/LanguageContext';

export interface ContentItem {
  name: string;
  englishName?: string;
  gradeLevel: string[];
  language: string[];
  artifactUrl: string;
  identifier: string;
  appIcon: string;
  contentType: string;
  mimeType: string;
  description: string;
  posterImage: string;
  leafNodes?: [{}];
  children: [{}];
  courseType?: string;
}

interface CommonCardProps {
  title: string;
  englishTitle?: string;
  avatarLetter?: string;
  avatarColor?: string;
  subheader?: string;
  image?: string;
  imageAlt?: string;
  content?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  orientation?: 'vertical' | 'horizontal';
  minheight?: string;
  TrackData?: any[];
  item: ContentItem;
  type: string;
  onClick?: (e: any) => void;
  _card?: any;
  courseType?: string;
}

interface StatuPorps {
  trackProgress?: number;
  status?: string;
  type?: string;
  _card?: any;
}

export const getLeafNodes = (node: any) => {
  const result = [];

  // If the node has leafNodes, add them to the result array
  if (node?.leafNodes) {
    result.push(...node.leafNodes);
  }

  // If the node has children, iterate through them and recursively collect leaf nodes
  if (node?.children) {
    node.children.forEach((child: any) => {
      result.push(...getLeafNodes(child));
    });
  }

  return result;
};

export const CommonCard: React.FC<CommonCardProps> = ({
  avatarLetter,
  avatarColor = red[500],
  title,
  englishTitle,
  subheader,
  image,
  imageAlt,
  content,
  actions,
  children,
  orientation,
  minheight,
  TrackData,
  item,
  type,
  onClick,
  _card,
  courseType,
}) => {
  const [statusBar, setStatusBar] = React.useState<StatuPorps>();
  const { t } = useTranslation();

  React.useEffect(() => {
    const init = () => {
      try {
        //@ts-ignore
        if (TrackData) {
          const result = TrackData?.find((e) => e.courseId === item.identifier);
          const newObj = {
            type,
            status:
              result?.status?.toLowerCase() === 'completed'
                ? t('COMMON.STATUS.completed')
                : result?.status?.toLowerCase() === 'in progress'
                ? t('COMMON.STATUS.in_progress')
                : result?.enrolled === true
                ? t('COMMON.STATUS.enrolled_not_started')
                : t('COMMON.STATUS.not_started'),
          };
          if (
            type === 'Course' ||
            type === 'Job family' ||
            type === 'PSU' ||
            type === 'Group Membership' ||
            type === 'self'
          ) {
            if (!_card?.isHideProgress) {
              setStatusBar({
                ...newObj,
                trackProgress: result?.percentage ?? 0,
              });
            } else {
              setStatusBar(newObj);
            }
          } else {
            setStatusBar(newObj);
          }
        }
      } catch (e) {
        console.log('error', e);
      }
    };
    init();
  }, [TrackData, item, type, _card?.isHideProgress, t]);

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: orientation === 'horizontal' ? 'column' : 'row',
        height: minheight || '100%',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
        borderRadius: '20px',
        '&:hover': {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
        },
        '@media (max-width: 600px)': {
          flexDirection: 'column',
        },
        ..._card?.sx,
      }}
      onClick={onClick}
    >
      {/* Image and Progress Overlay */}
      <Box sx={{ position: 'relative', width: '100%' }}>
        {image && (
          <CardMedia
            title={title}
            component="img"
            image={image || '/assets/images/default.png'}
            alt={imageAlt || 'Image'}
            sx={{
              width: '100%',
              height: orientation === 'horizontal' ? '140px' : 'auto',
              objectFit: 'cover', //set contain
              '@media (max-width: 600px)': {
                height: '140px',
              },
              ..._card?._cardMedia?.sx,
            }}
          />
        )}

        {/* Progress Bar Overlay */}
        {/* Progress Bar Overlay */}
        {!_card?.isHideProgressStatus && (
          <StatusBar {...statusBar} _card={_card} />
        )}
      </Box>
      {avatarLetter && subheader && (
        <CardHeader
          sx={{
            pb: 0,
            pt: 1,
          }}
          avatar={
            avatarLetter && (
              <Avatar sx={{ bgcolor: avatarColor }} aria-label="avatar">
                {avatarLetter}
              </Avatar>
            )
          }
          subheader={
            subheader && (
              <Typography variant="h3" component="div">
                <SpeakableText>{subheader}</SpeakableText>
              </Typography>
            )
          }
        />
      )}
      <Box sx={_card?._contentParentText?.sx}>
        {title && (
          <CardContent
            sx={{
              pt: 1,
              pb: '0 !important',
            }}
          >
            <Typography
              variant="body1"
              component="div"
              title={title}
              sx={{
                fontWeight: 500,
                // fontSize: '16px',
                // lineHeight: '24px',
                whiteSpace: 'wrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                textTransform: 'capitalize',
                WebkitLineClamp: 2,
              }}
            >
              <SpeakableText>{title}</SpeakableText>
            </Typography>
            {englishTitle && (
              <Typography
                variant="body1"
                component="div"
                title={englishTitle}
                sx={{
                  fontWeight: 500,
                  // fontSize: '16px',
                  // lineHeight: '24px',
                  whiteSpace: 'wrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  textTransform: 'capitalize',
                  WebkitLineClamp: 2,
                }}
              >
                <SpeakableText>{englishTitle}</SpeakableText>
              </Typography>
            )}
          </CardContent>
        )}
        {content && (
          <CardContent
            sx={{
              pt: 0.5,
              pb: '0 !important',
            }}
          >
            <Typography
              variant="body1"
              component="div"
              // @ts-ignore
              title={typeof content === 'string' ? content : ''}
              sx={{
                fontWeight: 400,
                // fontSize: '15.4px',
                // lineHeight: '22px',
                color: '#49454F',
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                ..._card?._contentText?.sx,
              }}
            >
              {typeof content === 'string' ? (
                <SpeakableText>
                  {capitalize(content[0]) + content.slice(1)}
                </SpeakableText>
              ) : (
                content
              )}
            </Typography>
            {/* <Typography
      sx={{
        fontFamily: "Poppins, sans-serif",
        fontWeight: 400,
        fontStyle: "normal",
        fontSize: "15.4px",
        lineHeight: "23.09px",
        letterSpacing: "0.48px",
        textTransform: "uppercase",
      }}
    >
      {courseType}
    </Typography> */}
          </CardContent>
        )}
      </Box>
      {children && <CardContent>{children}</CardContent>}
      {actions && (
        <CardActions sx={{ p: 2, pt: '14px' }}>
          <SpeakableText>{actions}</SpeakableText>
        </CardActions>
      )}

      {/* Add courseType at the bottom right, outside CardContent */}
      {Array.isArray(courseType) &&
        courseType.includes('Mandatory') &&
        !courseType.includes('Optional') && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              px: 2,
              pb: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: '15.4px',
                lineHeight: '23.09px',
                letterSpacing: '0.48px',
                textTransform: 'uppercase',
                color: '#969088',
              }}
            >
              {courseType}
            </Typography>
          </Box>
        )}
    </Card>
  );
};

export const StatusBar: React.FC<StatuPorps> = ({
  trackProgress,
  status,
  type,
  _card,
}) => {
  console.log('status===>', status);
  const { t } = useTranslation();

  const theme = useTheme();

  // Don't render StatusBar if status is undefined or empty
  if (!status || status.trim() === '') {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        ...(type === 'Course' ||
        type === 'Job family' ||
        type === 'PSU' ||
        type === 'Group Membership' ||
        type === 'self'
          ? { top: 0 }
          : { bottom: 0 }),
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <Box
        sx={{
          width: '100%',
          pl:
            type === 'Course' ||
            type === 'Job family' ||
            type === 'PSU' ||
            type === 'Group Membership' ||
            type === 'self'
              ? '6px'
              : '0',
          pr:
            type === 'Course' ||
            type === 'Job family' ||
            type === 'PSU' ||
            type === 'Group Membership' ||
            type === 'self'
              ? '6px'
              : '0',
          py: '6px',
          fontSize: '14px',
          lineHeight: '20px',
          fontWeight: '500',

          color: [
            t('COMMON.STATUS.completed'),
            t('COMMON.STATUS.enrolled_not_started'),
            'Completed',
            'In Progress',
            'Enrolled, not started',
            t('COMMON.STATUS.not_started'),
            t('COMMON.STATUS.in_progress'),
          ].includes(status ?? '')
            ? '#50EE42'
            : 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {type === 'Course' ||
        type === 'Job family' ||
        type === 'PSU' ||
        type === 'Group Membership' ||
        type === 'self' ? (
          _card?.isHideProgress ? (
            <StatusIcon status={status ?? ''} />
          ) : (
            <CircularProgressWithLabel
              value={trackProgress !== undefined ? trackProgress : 100}
              _text={{
                sx: {
                  color: [
                    t('COMMON.STATUS.completed'),
                    t('COMMON.STATUS.in_progress'),
                    t('COMMON.STATUS.enrolled_not_started'),
                    t('COMMON.STATUS.not_started'),
                    'completed',
                    'In Progress',
                    'Enrolled, not started',
                  ].includes(status ?? '')
                    ? theme.palette.success.main
                    : 'white',
                  fontSize: '10px',
                  ...(trackProgress === undefined ? { display: 'none' } : {}),
                },
              }}
              color={
                [
                  'Completed',
                  t('COMMON.STATUS.completed'),
                  'In Progress',
                  t('COMMON.STATUS.enrolled_not_started'),
                  t('COMMON.STATUS.in_progress'),
                  t('COMMON.STATUS.not_started'),
                  'Enrolled, not started',
                ].includes(status ?? '')
                  ? theme.palette.success.main
                  : 'white'
              }
              size={trackProgress !== undefined ? 35 : 16}
              thickness={trackProgress !== undefined ? 2 : 4}
            />
          )
        ) : (
          <LinearProgress
            sx={{
              width: '100%',
            }}
            variant="determinate"
            color="error"
            value={
              typeof trackProgress === 'number'
                ? trackProgress
                : [
                    t('COMMON.STATUS.completed').toLowerCase(),
                    'completed',
                  ].includes(status?.toLowerCase() || '')
                ? 100
                : [
                    t('COMMON.STATUS.in_progress').toLowerCase(),
                    'in progress',
                  ].includes(status?.toLowerCase() || '')
                ? 50
                : 0
            }
          />
        )}
        <Typography
          variant="h3"
          component="div"
          sx={{
            minWidth: '81px',
            // fontSize: '14px',
            // lineHeight: '20px',
            letterSpacing: '0.1px',
            verticalAlign: 'middle',
          }}
        >
          <SpeakableText>{status}</SpeakableText>
        </Typography>
      </Box>
    </Box>
  );
};

interface StatusIconProps {
  status: string;
}

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  const { t } = useTranslation();

  const completed = [t('COMMON.STATUS.completed').toLowerCase(), 'completed'];
  const inProgress = [
    t('COMMON.STATUS.in_progress').toLowerCase(),
    'in progress',
  ];
  const enrolledNotStarted = [
    t('COMMON.STATUS.enrolled_not_started').toLowerCase(),
    'enrolled, not started',
  ];

  const statusLower = status?.toLowerCase();

  if (completed.includes(statusLower)) {
    return <CheckCircleIcon />;
  }
  if (inProgress.includes(statusLower)) {
    return <AdjustIcon />;
  }
  if (enrolledNotStarted.includes(statusLower)) {
    return <TripOriginOutlinedIcon />;
  }
  return <PanoramaFishEyeIcon />;
};

export default StatusIcon;
