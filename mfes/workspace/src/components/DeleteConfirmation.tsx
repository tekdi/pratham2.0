import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  IconButton,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { deleteContent, publishContent, unpublishContent } from '@workspace/services/ContentService';
import useSharedStore from '../../../shared-store';
import { toast } from 'react-hot-toast';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface DeleteConfirmationProps {
  open: boolean;
  handleClose: any;
  rowData?: any;
  actionType?: string;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  open,
  rowData,
  handleClose,
  actionType = 'delete',
}) => {
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const fetchContentAPI = useSharedStore((state: any) => state.fetchContentAPI);
  const setFetchContentAPI = useSharedStore(
    (state: any) => state.setFetchContentAPI
  );
  const handleDelete = async (content?: any) => {
    if (actionType === 'publish') {
      console.log('Publish clicked');
      if (rowData?.identifier) {
        try {
     await publishContent(rowData?.identifier);
          console.log(`Unpublished item with identifier - ${rowData?.identifier}`);

          await delay(2000);
          toast.success('Content published Successfully', {
            icon: <CheckCircleIcon style={{ color: 'white' }} />,
            style: {
              backgroundColor: 'green',
              color: 'white',
            },
            position: 'bottom-center',
          });

          setFetchContentAPI(!fetchContentAPI);
        } catch (error) {
          toast.error('Failed to publish content', {
            icon: <ErrorOutlineIcon style={{ color: 'white' }} />,
            style: {
              backgroundColor: 'red',
              color: 'white',
            },
            position: 'bottom-center',
          });
          setFetchContentAPI(!fetchContentAPI);
        }
      }
      handleClose();
      return;
    }

    if (actionType === 'unpublish') {
      console.log('Unpublish clicked');       
         console.log('rowData====>', rowData);

      if (rowData?.identifier) {
        try {
     await unpublishContent(rowData?.identifier, rowData?.lastPublishedBy);
          console.log(`Unpublished item with identifier - ${rowData?.identifier}`);

          await delay(2000);
          toast.success('Content Unpublished Successfully', {
            icon: <CheckCircleIcon style={{ color: 'white' }} />,
            style: {
              backgroundColor: 'green',
              color: 'white',
            },
            position: 'bottom-center',
          });

          setFetchContentAPI(!fetchContentAPI);
        } catch (error) {
          console.error('Failed to unpublish content:', error);
          toast.error('Failed to unpublish content', {
            icon: <ErrorOutlineIcon style={{ color: 'white' }} />,
            style: {
              backgroundColor: 'red',
              color: 'white',
            },
            position: 'bottom-center',
          });
          setFetchContentAPI(!fetchContentAPI);
        }
      }
      handleClose();
      return;
    }

    console.log(`Deleting item at index`, rowData);

    if (rowData?.identifier && rowData?.mimeType) {
      try {
        await deleteContent(rowData?.identifier, rowData?.mimeType);
        console.log(`Deleted item with identifier - ${rowData?.identifier}`);

        await delay(2000);
        toast.success('Delete Content Successfully', {
          icon: <CheckCircleIcon style={{ color: 'white' }} />,
          style: {
            backgroundColor: 'green',
            color: 'white',
          },
          position: 'bottom-center',
        });

        setFetchContentAPI(!fetchContentAPI);
      } catch (error) {
        console.error('Failed to delete content:', error);
        setFetchContentAPI(!fetchContentAPI);
      }
      // setFetchContentAPI(!fetchContentAPI)
    }
    handleClose();
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="delete-confirmation-title"
      aria-describedby="delete-confirmation-description"
      maxWidth="xs"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '16px',
        },
      }}
    >
      <DialogTitle sx={{ m: 0 }} id="delete-confirmation-title">
        <Box sx={{ padding: '10px' }}>
          <Typography sx={{ fontWeight: '400', fontSize: '16px' }}>
            {actionType === 'unpublish'
              ? 'Are you sure you want to unpublish this Resource?'
              : actionType === 'publish'
              ? 'Are you sure you want to publish this Resource?'
              : 'Are you sure you want to delete this Resource?'}
          </Typography>
        </Box>
        {/* <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton> */}
      </DialogTitle>
      <Divider />

      <DialogActions
        sx={{ justifyContent: 'end', gap: '10px', padding: '20px' }}
      >
        <Box
          onClick={handleClose}
          sx={{ cursor: 'pointer', color: '#0D599E', fontSize: '14px' }}
        >
          No, go back
        </Box>
        <Button
          sx={{
            background: '#FDBE16',
            color: '#000',
            borderRadius: '100px',
            '&:hover': {
              background: '#FDBE16',
            },
          }}
          onClick={handleDelete}
          variant="contained"
        >
          {actionType === 'unpublish'
            ? 'Unpublish'
            : actionType === 'publish'
            ? 'Publish'
            : 'yes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmation;