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
import React, { useState, useRef, useEffect } from 'react';
import CommonModal from '../common-modal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface InfoCardProps {
  item: any;
  topic: string;
  onBackClick?: () => void;
  _config?: any;
}

const InfoCard: React.FC<InfoCardProps> = ({
  item,
  topic,
  onBackClick,
  _config,
}) => {
  const { _infoCard } = _config || {};
  const [openModal, setOpenModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkTextHeight = () => {
      if (descriptionRef.current) {
        const lineHeight = parseInt(
          window.getComputedStyle(descriptionRef.current).lineHeight
        );
        const height = descriptionRef.current.scrollHeight;
        setShowButton(height > lineHeight * 2);
      }
    };

    // Initial check
    checkTextHeight();

    // Add resize listener to handle window resizing
    window.addEventListener('resize', checkTextHeight);
    return () => window.removeEventListener('resize', checkTextHeight);
  }, [item?.description]);
  console.log(topic, 'topic');
  return (
    <>
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
              p: '18px',
              pb: 0,
              gap: 1.5,
              width: '85%',
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
                  {topic && <Typography variant="body1">{topic}</Typography>}
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
              ref={descriptionRef}
              variant="subtitle1"
              component="div"
              sx={{
                textTransform: 'capitalize',
                color: '#1F1B13',
                display: '-webkit-box',
                WebkitLineClamp: isExpanded ? 'unset' : 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                transition: 'all 0.3s ease-in-out',
                maxHeight: isExpanded ? '100%' : '51px',
              }}
            >
              {item?.description}
            </Typography>
            {showButton && (
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                sx={{
                  textTransform: 'none',
                  color: '#1F1B13',
                  p: 0,
                  minWidth: 'auto',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline',
                  },
                }}
              >
                {isExpanded ? 'See less' : 'See more'}
              </Button>
            )}
            <Box>
              {_infoCard?.isShowStatus &&
                (item?.issuedOn ? (
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 500,
                      fontSize: '16px',
                      lineHeight: '24px',
                      color: '#00730B',
                      letterSpacing: '0.15px',
                    }}
                  >
                    <CheckCircleIcon
                      sx={{ color: '#00730B', fontSize: 20, mr: 1 }}
                    />
                    Completed on:{' '}
                    {new Intl.DateTimeFormat('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    }).format(new Date(item?.issuedOn))}
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      width: 'fit-content',
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
                ))}
              {!_infoCard?.isHideStatus && (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ ml: 1 }}
                  onClick={() => setOpenModal(true)}
                >
                  Enroll Now
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Card>

      <CommonModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onStartLearning={_config?.onButtonClick}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 2,
            px: 3,
          }}
        >
          <CheckCircleIcon sx={{ color: '#21A400', fontSize: 48, mb: 1 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              fontSize: '22px',
              lineHeight: '28px',
              letterSpacing: '0px',
              textAlign: 'center',
              color: '#1F1B13',
              mb: 1,
            }}
          >
            Awesome!
          </Typography>
          <Typography
            sx={{
              mb: 0,
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '24px',
              letterSpacing: '0.5px',
              textAlign: 'center',
              color: '#1F1B13',
            }}
          >
            You are now enrolled to the course!
          </Typography>
        </Box>
      </CommonModal>
    </>
  );
};

export default React.memo(InfoCard);
