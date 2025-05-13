import {
  Card,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Button,
  Breadcrumbs,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React from 'react';

interface InfoCardProps {
  item: any;
  onBackClick?: () => void;
  _config?: any;
}

const InfoCard: React.FC<InfoCardProps> = ({ item, onBackClick, _config }) => {
  const { _infoCard } = _config || {};

  return (
    <Card sx={{ display: 'flex', ..._infoCard?._card }}>
      <CardMedia
        component="img"
        sx={{
          flex: { xs: 6, md: 4, lg: 3, xl: 3 },
          maxHeight: '280px',
          ..._infoCard?._cardMedia,
        }}
        image={item?.appIcon || _infoCard?.default_img}
        alt={item?.name}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: { xs: 6, md: 8, lg: 9, xl: 9 },
          ..._infoCard?._textCard,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: '1 0 auto',
            p: 2,
            pb: 0,
            gap: 1.5,
          }}
        >
          {onBackClick && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                pt: 2,
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
                <Typography variant="body1">Course</Typography>
                <Typography variant="body1">Electrical</Typography>
              </Breadcrumbs>
            </Box>
          )}
          <Typography
            component="div"
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: '36px',
              lineHeight: '44px',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {item?.name}
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{
              color: '#1F1B13',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {item?.description}
          </Typography>
          <Box>
            {_infoCard?.isShowStatus && (
              <Box
                sx={{
                  width: 'fit-content',
                  height: '40px',
                  borderRadius: '12px',
                  pt: 1,
                  pr: 2,
                  pb: 1,
                  pl: 2,
                  bgcolor: '#FFDEA1',
                }}
              >
                Started on:{' '}
                {item?.startedOn
                  ? new Intl.DateTimeFormat('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    }).format(new Date(item.startedOn))
                  : ' - '}
                {/* {JSON.stringify(_infoCard?.isShowStatus || {})} */}
              </Box>
            )}
            {!_infoCard?.isHideStatus && (
              <Button
                variant="contained"
                color="primary"
                sx={{ ml: 1 }}
                onClick={_config?.onButtonClick}
              >
                Enroll Now
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default React.memo(InfoCard);
