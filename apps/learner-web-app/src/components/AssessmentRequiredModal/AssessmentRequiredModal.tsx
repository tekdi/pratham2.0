import React from 'react';
import { Box, Button, Divider, Modal, Typography } from '@mui/material';
import Image from 'next/image';
import tada from '../../../public/images/tada.gif';
import { useTranslation } from '@shared-lib';

interface AssessmentRequiredModalProps {
  open: boolean;
  onClose: () => void;
  onStartAssessment: () => void;
  message?: string;
}

const AssessmentRequiredModal: React.FC<AssessmentRequiredModalProps> = ({
  open,
  onClose,
  onStartAssessment,
  message,
}) => {
  const { t } = useTranslation();
  const modalMessage =
    message || t('LEARNER_APP.REGISTRATION_FLOW.ASSESSMENT_REQUIRED_MESSAGE');

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '420px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '12px',
    outline: 'none',
  };

  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        if (reason === 'backdropClick') {
          return;
        }
        onClose();
      }}
      aria-labelledby="assessment-required-modal-title"
      aria-describedby="assessment-required-modal-description"
    >
      <Box sx={modalStyle}>
        <Box
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Tada GIF */}
          <Image
            src={tada}
            alt="Celebration"
            width={30}
            height={30}
            style={{ marginBottom: '16px' }}
          />

          {/* Hurray heading */}
          <Typography
            id="assessment-required-modal-title"
            variant="h1"
            sx={{
              fontWeight: 400,
              textAlign: 'center',
              verticalAlign: 'middle',
              mb: 2,
            }}
          >
            {t('NAVAPATHAM.HURRAY')}
          </Typography>

          {/* Program name text */}
          {typeof window !== 'undefined' && window.localStorage && (
            <Typography
              sx={{
                fontWeight: 200,
                fontSize: '22px',
                lineHeight: '28px',
                letterSpacing: '0px',
                textAlign: 'center',
                verticalAlign: 'middle',
                mb: 2,
              }}
            >
              {`${t('LEARNER_APP.REGISTRATION_FLOW.YOU_HAVE_SUCCESSFULLY_SIGNED_UP_FOR_ASSESSMENT')} ${
                localStorage.getItem('isForNavaPatham') === 'true'
                  ? t('NAVAPATHAM.NAVAPATHAM')
                  : localStorage.getItem('userProgram')
              }.`}
            </Typography>
          )}

          {/* Assessment message */}
          <Typography
            id="assessment-required-modal-description"
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: 'center' }}
          >
            {modalMessage}
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', gap: 1 }}>
          <Button variant="outlined" onClick={onClose}>
            {t('COMMON.CLOSE')}
          </Button>
          <Button variant="contained" color="primary" onClick={onStartAssessment}>
            {t('LEARNER_APP.REGISTRATION_FLOW.START_ASSESSMENT')}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AssessmentRequiredModal;
