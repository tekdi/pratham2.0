import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import { Box, Typography, useTheme } from '@mui/material';
import 'questionnaire-webcomponent/questionnaire-player-webcomponent.js';
import 'questionnaire-webcomponent/styles.css';
import { useTranslation } from 'react-i18next';
import ConfirmationModal from './ConfirmationModal';
import { updateSubmission } from '../services/ObservationServices';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FileUploadEvent {
  data: {
    submissionId: string;
    name: string;
    file: File;
    question_id: string;
  };
}
interface QuestionnaireAppProps {
  observationQuestions?: any; // Define the correct type here based on your data structure
  observationName?: any;
}
interface PresignedUrlResponse {
  url: string;
  getDownloadableUrl: string[];
  payload: Record<string, string>;
}

interface FileUploadResponse {
  status?: number;
  data?: FileUploadData | null;
  question_id?: string;
}

interface FileUploadData {
  name: string;
  url: string;
  previewUrl: string;
  [key: string]: any;
}

const ObservationComponent: React.FC<QuestionnaireAppProps> = ({
  observationQuestions = {},
  observationName = 'aaaa',
}) => {
  const questionairePlayerMainRef = useRef<HTMLElement | null>(null);
  const [isBackConfirmationOpen, setIsBackConfirmationOpen] = useState(false);

  const [fileUploadResponse, setFileUploadResponse] =
    useState<FileUploadResponse | null>(null);
  const { t } = useTranslation();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<CustomEvent | null>(null);
  const theme = useTheme<any>();
  // const router = useRouter();
  const navigate = useNavigate();

  const uploadFileToPresignedUrl = async (event: FileUploadEvent) => {
    const payload: any = {
      ref: 'survey',
      request: {},
    };

    const submissionId = event.data.submissionId;
    payload.request[submissionId] = {
      files: [event.data.name],
    };

    try {
      const response = await axios.post('your-presigned-url-endpoint', payload); // Update with your correct endpoint
      const presignedUrlData: PresignedUrlResponse =
        response.data.result[submissionId].files[0];

      // Use FormData for file uploads
      const formData = new FormData();
      formData.append('file', event.data.file);

      await axios.put(presignedUrlData.url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const obj: FileUploadData = {
        name: event.data.name,
        url: presignedUrlData.url.split('?')[0],
        previewUrl: presignedUrlData.getDownloadableUrl[0],
      };

      for (const key of Object.keys(presignedUrlData.payload)) {
        obj[key] = presignedUrlData.payload[key];
      }
      setFileUploadResponse({
        status: 200,
        data: obj,
        question_id: event.data.question_id,
      });
    } catch (err) {
      console.error('Unable to upload the file. Please try again', err);
      setFileUploadResponse({
        status: 400,
        data: null,
        question_id: event.data.question_id,
      });
    }
  };

  const receiveUploadData = (event: any) => {
    if (event.data && event.data.file) {
      uploadFileToPresignedUrl(event as FileUploadEvent);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', receiveUploadData, false);

      return () => {
        window.removeEventListener('message', receiveUploadData, false);
      };
    }
  }, []);

  const showToast = (msg: string) => {
    toast.success(msg, {
      position: 'bottom-center',
      autoClose: 3000, // Closes after 3 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const playerElement = questionairePlayerMainRef.current;

      if (playerElement) {
        const handlePlayerSubmitOrSaveEvent = async (event: Event) => {
          if ((event as CustomEvent).detail.status === 'submit') {
            setCurrentEvent(event as CustomEvent);
            setIsConfirmationOpen(true);
          } else {
            await handleSaveSubmit(event);
          }
        };

        const handleSaveSubmit = async (event: Event) => {
          console.log('saved');

          const submissionData = {
            evidence: {
              status: (event as CustomEvent).detail.status,
              ...(event as CustomEvent).detail.data,
            },
          };
          const submissionId = observationQuestions?.assessment?.submissionId;
          const response = await updateSubmission({
            submissionId,
            submissionData,
          });
          const msg = 'Form saved successfully';
          showToast(msg);
          // showToastMessage(t('FORM_SAVED_SUCCESSFULLY'), 'success');
        };

        playerElement.addEventListener(
          'submitOrSaveEvent',
          handlePlayerSubmitOrSaveEvent
        );

        return () => {
          playerElement.removeEventListener(
            'submitOrSaveEvent',
            handlePlayerSubmitOrSaveEvent
          );
        };
      }
    }
  }, [observationQuestions]);

  useEffect(() => {
    if (questionairePlayerMainRef.current) {
      console.log('Web component ref set correctly');
    } else {
      console.log('Web component ref not set');
    }
  }, [questionairePlayerMainRef]);

  const handleConfirmSubmit = async () => {
    console.log('clicked');

    if (currentEvent) {
      const submissionData = {
        evidence: {
          status: currentEvent.detail.status,
          ...currentEvent.detail.data,
        },
      };
      const submissionId = observationQuestions?.assessment?.submissionId;
      const response = await updateSubmission({ submissionId, submissionData });

      if (currentEvent.detail.status === 'draft') {
        const msg = 'Form saved successfully';
        showToast(msg);
      } else if (currentEvent.detail.status === 'submit') {
        const msg = 'Form saved successfully';
        showToast(msg);
        // showToastMessage(t('OBSERVATION.FORM_SUBMIT_SUCCESSFULLY'), 'success');
        // navigate(`${localStorage.getItem('observationPath')}`);
      }
    }
    setIsConfirmationOpen(false);
  };

  const handleBackEvent = () => {
    const classList = document?.querySelector(
      'questionnaire-player-main form'
    )?.classList;

    if (classList?.contains('ng-dirty')) {
      setIsBackConfirmationOpen(true);
    } else {
      // router.push(`${localStorage.getItem('observationPath')}`);
    }
  };

  const handleCancelBack = () => {
    setIsBackConfirmationOpen(false);
  };

  const handleConfirmBack = () => {
    setIsBackConfirmationOpen(false);
    // navigate(`${localStorage.getItem('observationPath')}`);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          direction: 'row',
          gap: '24px',
          mt: '15px',
          marginLeft: '10px',
        }}
        width={'100%'}
        onClick={handleBackEvent}
      >
        <KeyboardBackspaceOutlinedIcon
          cursor={'pointer'}
          sx={{
            color: theme.palette.warning['A200'],
          }}
        />
        {localStorage.getItem('observationName') && (
          <Typography variant="h3" fontSize={'22px'} color={'black'}>
            {localStorage.getItem('observationName')}
          </Typography>
        )}
      </Box>

      <Typography variant="h3" ml="60px" color={'black'}>
        {observationName}
      </Typography>

      {observationQuestions && (
        <questionnaire-player-main
          assessment={JSON.stringify(observationQuestions)}
          fileuploadresponse={JSON.stringify(fileUploadResponse)}
          ref={questionairePlayerMainRef}
        ></questionnaire-player-main>
      )}
      {console.log('isConfirmationOpen', isConfirmationOpen)}

      {isConfirmationOpen && (
        <ConfirmationModal
          handleAction={handleConfirmSubmit}
          handleCloseModal={() => setIsConfirmationOpen(false)}
          modalOpen={isConfirmationOpen}
        />
      )}
      <ToastContainer />

      {/* {isBackConfirmationOpen && <ConfirmationModal />} */}
    </>
  );
};

export default ObservationComponent;
