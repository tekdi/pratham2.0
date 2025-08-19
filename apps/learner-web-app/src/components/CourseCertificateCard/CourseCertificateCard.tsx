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
        display: 'flex',
        flexDirection: 'column',
        height: 'auto',
        cursor: 'pointer',
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
    >
      {/* Image with overlay bar */}
      <Box sx={{ position: 'relative', width: '100%' }}>
        <CardMedia
          component="img"
          image={imageUrl || '/images/image_ver.png'}
          alt={title}
          sx={{
            width: '100%',
            height: '297px',
            objectFit: 'cover',
            '@media (max-width: 600px)': {
              height: '200px',
            },
          }}
        />

        {/* Overlay bar */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '40px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            padding: '0px 5px',
          }}
        >
          <CheckCircleIcon sx={{ color: '#00C853', fontSize: 18, mr: 0.5 }} />
          <Typography
            variant="h5"
            sx={{
              color: '#00C853',
              fontWeight: 600,
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

      {/* Content with button at bottom */}
      <CardContent
        sx={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <Box sx={{ flexGrow: 1, mb: 1 }}>
          <Typography 
           // fontWeight={700} 
            sx={{ 
              // fontSize: '16px',
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
        </Box>

        <Box sx={{ flexGrow: 2, mb: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              // fontSize: '14px',
              // fontWeight: 700,
              paddingLeft: '5px',
            }}
          >
            {description}
          </Typography>
        </Box>

        <Button
          variant="text"
          onClick={onPreviewCertificate}
          sx={{
            fontSize: '14px',
            fontWeight: 700,
            textTransform: 'none',
            color: '#1976D2',
            padding: 0,
            margin: 0,
            mt: 'auto',
            alignSelf: 'flex-start',
            minHeight: 'auto',
            lineHeight: 1.2,
            '@media (max-width: 600px)': {
              padding: '8px 0',
              fontSize: '13px',
              lineHeight: 1.4,
              textAlign: 'left',
              justifyContent: 'flex-start',
            },
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
