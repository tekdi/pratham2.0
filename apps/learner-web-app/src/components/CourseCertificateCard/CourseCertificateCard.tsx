import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface CertificateCardProps {
  title: string;
  description: string;
  imageUrl: string;
  completionDate: string;
  onPreviewCertificate: () => void;
}

const CourseCertificateCard: React.FC<CertificateCardProps> = ({
  title,
  description,
  imageUrl,
  completionDate,
  onPreviewCertificate,
}) => {
  return (
    <Card
      sx={{
        borderRadius: '12px',
        boxShadow: 3,
        overflow: 'hidden',
        mb: 3,
        bgcolor: '#fff',
        width: '231px',
      }}
    >
      {/* Image with overlay bar */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={imageUrl || '/images/image_ver.png'}
          alt={title}
          sx={{
            width: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Overlay bar */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            padding: '4px 8px',
          }}
        >
          <CheckCircleIcon sx={{ color: '#00C853', fontSize: 18, mr: 0.5 }} />
          <Typography
            variant="caption"
            sx={{
              color: '#00C853',
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            Issued certificate on{' '}
            {new Date(completionDate)
              .toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
              .replace(',', ',')}
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <CardContent sx={{ padding: 2 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
          }}
        >
          {description}
        </Typography>

        <Button
          variant="text"
          onClick={onPreviewCertificate}
          sx={{
            fontSize: '14px',
            fontWeight: 700,
            textTransform: 'none',
            color: '#1976D2',
            pl: 0,
          }}
          endIcon={<ArrowForwardIcon sx={{ fontSize: '18px' }} />}
        >
          Preview Certificate
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseCertificateCard;
