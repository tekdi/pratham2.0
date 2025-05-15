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
export interface ContentItem {
  name: string;
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
}
interface CommonCardProps {
  title: string;
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
  onClick?: () => void;
  _card?: any;
}

interface StatuPorps {
  trackProgress?: number;
  status?: string;
  type?: string;
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
}) => {
  const [statusBar, setStatusBar] = React.useState<StatuPorps>();
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
                ? 'Completed'
                : result?.status?.toLowerCase() === 'in progress'
                ? 'In Progress'
                : result?.enrolled === true
                ? 'Enrolled, not started'
                : 'Not Started',
          };
          if (type === 'Course') {
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
  }, [TrackData, item, type, _card?.isHideProgress]);

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: orientation === 'horizontal' ? 'column' : 'row',
        height: minheight || 'auto',
        cursor: onClick ? 'pointer' : 'default',
        bgcolor: '#FEF7FF',
        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
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
            title={item.identifier}
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
        <StatusBar {...statusBar} />
      </Box>

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
        title={
          <Typography
            title={title}
            sx={{
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '24px',
              whiteSpace: 'wrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 1,
            }}
          >
            {title}
          </Typography>
        }
        subheader={
          subheader && (
            <Typography variant="h6" sx={{ fontSize: '14px' }}>
              {subheader}
            </Typography>
          )
        }
      />
      {content && (
        <CardContent
          sx={{
            pt: 0.5,
            pb: 0,
          }}
        >
          <Typography
            component="h1"
            // @ts-ignore
            title={content}
            sx={{
              fontWeight: 400,
              fontSize: '15.4px',
              lineHeight: '22px',
              color: '#49454F',
              display: '-webkit-box',
              WebkitLineClamp: 5,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              ..._card?._contentText?.sx,
            }}
          >
            {content}
          </Typography>
        </CardContent>
      )}
      {children && <CardContent>{children}</CardContent>}
      {actions && (
        <CardActions sx={{ p: 2, pt: '14px' }}>{actions}</CardActions>
      )}
    </Card>
  );
};

export const StatusBar: React.FC<StatuPorps> = ({
  trackProgress,
  status,
  type,
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: 'absolute',
        ...(type === 'Course' ? { top: 0 } : { bottom: 0 }),
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <Box
        sx={{
          width: '100%',
          pl: type === 'Course' ? '6px' : '0',
          pr: type === 'Course' ? '6px' : '8px',
          py: '6px',
          fontSize: '14px',
          lineHeight: '20px',
          fontWeight: '500',
          color: ['Completed', 'In Progress', 'Enrolled, not started'].includes(
            status ?? ''
          )
            ? '#50EE42'
            : 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {type === 'Course' ? (
          <CircularProgressWithLabel
            value={trackProgress !== undefined ? trackProgress : 100}
            _text={{
              sx: {
                color: [
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
              ['Completed', 'In Progress', 'Enrolled, not started'].includes(
                status ?? ''
              )
                ? theme.palette.success.main
                : 'white'
            }
            size={trackProgress !== undefined ? 35 : 16}
            thickness={trackProgress !== undefined ? 2 : 4}
          />
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
                : status?.toLowerCase() === 'completed'
                ? 100
                : status?.toLowerCase() === 'in progress'
                ? 50
                : 0
            }
          />
        )}
        <Typography
          width={type === 'Course' ? '100%' : '133px'}
          sx={{
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0.1px',
            verticalAlign: 'middle',
          }}
        >
          {status}
        </Typography>
      </Box>
    </Box>
  );
};
