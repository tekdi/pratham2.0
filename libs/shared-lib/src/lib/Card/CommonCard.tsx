import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import { Box } from '@mui/material';
import { Progress } from '../Progress/Progress';

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
  status?: 'Not started' | 'Completed' | 'In progress' | string;
  progress?: number;
  onClick?: () => void;
}

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
  status,
  progress,
  onClick,
}) => {
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
              height: orientation === 'horizontal' ? '297px' : 'auto',
              objectFit: 'cover', //set contain
              '@media (max-width: 600px)': {
                height: '200px',
              },
            }}
          />
        )}

        {/* Progress Bar Overlay */}
        {progress !== undefined && (
          <Box
            sx={{
              position: 'absolute',
              height: '40px',
              top: 0,
              width: '100%',
              display: 'flex',
              // justifyContent: 'center',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <Progress
              variant="determinate"
              value={100}
              size={30}
              thickness={5}
              sx={{
                color: '#fff8fb',
                position: 'absolute',
                left: '10px',
              }}
            />
            <Progress
              variant="determinate"
              value={progress}
              size={30}
              thickness={5}
              sx={{
                color: progress === 100 ? '#21A400' : '#FFB74D',
                position: 'absolute',
                left: '10px',
              }}
            />
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 'bold',
                marginLeft: '12px',
                color: progress === 100 ? '#21A400' : '#FFB74D',
                position: 'absolute',
                left: '50px',
              }}
            >
              {status &&
                actions &&
                actions?.toString().toLowerCase() === 'resource' &&
                status}
              {status &&
                actions &&
                actions?.toString().toLowerCase() === 'course' &&
                `${progress}%`}
            </Typography>
          </Box>
        )}
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
              fontSize: '16px',
              whiteSpace: 'wrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 1,
              paddingLeft: '5px',
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
            display: 'flex',
            paddingBottom: 0,
            overflow: 'hidden',
            maxWidth: '100%',
            height: '50px',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Typography
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: 700 }}>
                Description:
              </span>{' '}
              {content}
            </Typography>
          </Box>
        </CardContent>
      )}
      {children && <CardContent>{children}</CardContent>}
      {actions && (
        <CardActions
          disableSpacing
          sx={{
            border: '1px solid #79747E',
            borderRadius: '8px',
            width: '80px',
            display: 'flex',
            justifyContent: 'center',
            margin: '12px',
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#6750A4',
            }}
          >
            {actions}
          </Typography>
        </CardActions>
      )}
    </Card>
  );
};
