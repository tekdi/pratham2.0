import React from 'react';
import { Box, Card, CardMedia, Typography, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ImageIcon from '@mui/icons-material/Image';
import { ImagePreviewProps } from './types';

const ImagePreview: React.FC<ImagePreviewProps> = ({ image, onClick }) => {
  const theme = useTheme<any>();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
  };

  return (
    <Card
      sx={{
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: theme.shadows[4],
        },
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
      }}
      onClick={onClick}
    >
      {image.previewUrl || image.url ? (
        <CardMedia
          component="img"
          height="120"
          image={image.previewUrl || image.url}
          alt={image.name}
          onError={handleImageError}
          sx={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
        />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: theme.palette.grey[500],
          }}
        >
          <ImageIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="caption" align="center" sx={{ px: 1 }}>
            {image.name}
          </Typography>
        </Box>
      )}

      {/* Image name overlay */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          p: 0.5,
          fontSize: '12px',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {image.name}
        </Typography>
      </Box>
    </Card>
  );
};

export default ImagePreview;
