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
import React, { useState } from 'react';
import CommonModal from '../common-modal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ExpandableText, useTranslation } from '@shared-lib';

interface InfoCardProps {
  item: any;
  topic?: string;
  onBackClick?: () => void;
  _config?: any;
}

const InfoCard: React.FC<InfoCardProps> = ({
  item,
  topic,
  onBackClick,
  _config,
}) => {
  const { t } = useTranslation();
  const { _infoCard } = _config || {};
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          borderRadius: 0,
          ..._infoCard?._card,
        }}
      >
        <CardMedia
          component="img"
          sx={{
            flex: { xs: 6, md: 4, lg: 3, xl: 3 },
            maxHeight: { xs: '200px', sm: '280px' },
            // objectFit: 'contain',
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
              p: { xs: '16px', md: '18px' },
              pb: { xs: '0px', md: '18px' },
              gap: 1.5,
              width: { xs: '90%', sm: '85%' },
            }}
          >
            {onBackClick && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  pt: { xs: 0, md: 2 },
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
                  {_infoCard?.breadCrumbs?.map(
                    (breadcrumb: any, index: number) => (
                      <Typography
                        key={`${
                          breadcrumb?.name ?? breadcrumb?.label ?? ''
                        } ${index}`}
                        variant="body1"
                        color="text.secondary"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => breadcrumb.handleBreadcrumbClick()}
                      >
                        {breadcrumb.name ?? breadcrumb.label ?? ''}
                      </Typography>
                    )
                  )}
                  {(!_infoCard?.breadCrumbs ||
                    _infoCard?.breadCrumbs?.length > 1) &&
                    ['Course', ...(topic ? [topic] : [])].map((key) => (
                      <Typography key={key} variant="body1">
                        {key}
                      </Typography>
                    ))}
                </Breadcrumbs>
              </Box>
            )}
            <Typography
              component="div"
              variant="h5"
              title={item?.name}
              sx={{
                fontWeight: 700,
                fontSize: { xs: '22px', sm: '24px', md: '36px' },
                lineHeight: { xs: '28px', sm: '32px', md: '44px' },
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item?.name}
            </Typography>
            <ExpandableText
              text={item?.description}
              number={2}
              _text={{
                fontSize: { xs: '14px', sm: '16px', md: '18px' },
                lineHeight: { xs: '20px', sm: '22px', md: '26px' },
              }}
            />
            <Box>
              {_infoCard?.isShowStatus &&
                (item?.issuedOn ? (
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: { xs: '14px', sm: '16px', md: '16px' },
                      lineHeight: { xs: '20px', sm: '22px', md: '26px' },
                      color: '#00730B',
                      letterSpacing: '0.15px',
                    }}
                  >
                    <CheckCircleIcon
                      sx={{ color: '#00730B', fontSize: 20, mr: 1 }}
                    />
                    {t('LEARNER_APP.COURSE.COMPLETED_ON')}:{' '}
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
                      fontSize: { xs: '14px', sm: '16px', md: '16px' },
                      lineHeight: { xs: '20px', sm: '22px', md: '26px' },
                    }}
                  >
                    {t('LEARNER_APP.COURSE.STARTED_ON')}:{' '}
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
        // onClose={() => setOpenModal(false)}
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
