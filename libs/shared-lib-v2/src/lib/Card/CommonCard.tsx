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
              result?.completed === 1
                ? 'Completed'
                : result?.in_progress === 1
                ? 'In Progress'
                : result?.enrolled === true
                ? 'Enrolled, not started'
                : 'Not Started',
          };
          if (type === 'Course') {
            if (!_card?.isHideProgress) {
              const leafNodes = getLeafNodes(item ?? []);
              const completedCount = result?.completed_list?.length || 0;
              const percentage =
                leafNodes.length > 0
                  ? Math.round((completedCount / leafNodes.length) * 100)
                  : 0;
              setStatusBar({ ...newObj, trackProgress: percentage });
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
        borderRadius: '12px',
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
            }}
          />
        )}

        {/* Progress Bar Overlay */}
        <StatusBar {...statusBar} />
      </Box>

      <CardHeader
        avatar={
          avatarLetter && (
            <Avatar sx={{ bgcolor: avatarColor }} aria-label="avatar">
              {avatarLetter}
            </Avatar>
          )
        }
        title={
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '16px',
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
          <Typography variant="h6" sx={{ fontSize: '14px' }}>
            {subheader}
          </Typography>
        }
      />
      {content && (
        <CardContent
          sx={{
            pt: 0,
          }}
        >
          <Typography
            sx={{
              fontWeight: 400,
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {content}
          </Typography>
        </CardContent>
      )}
      {children && <CardContent>{children}</CardContent>}
      {actions && <CardActions>{actions}</CardActions>}
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
          p: '6px 6px',
          fontSize: '14px',
          lineHeight: '20px',
          fontWeight: '500',
          color: ['completed', 'In Progress', 'Enrolled, not started'].includes(
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
              ['completed', 'In Progress', 'Enrolled, not started'].includes(
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
              status === 'completed' ? 100 : status === 'In Progress' ? 50 : 0
            }
          />
        )}
        <Typography width={'100%'}>{status}</Typography>
      </Box>
    </Box>
  );
};
