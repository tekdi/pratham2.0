import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

// Status icon mapping
export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircleIcon sx={{ color: '#1A8825', fontSize: 20 }} />;
    case 'pending':
      return <PendingIcon sx={{ color: '#FFC107', fontSize: 20 }} />;
    case 'processing':
      return <HourglassEmptyIcon sx={{ color: '#2196F3', fontSize: 20 }} />;
    case 'not_started':
      return <CancelIcon sx={{ color: '#757575', fontSize: 20 }} />;
    default:
      return <CancelIcon sx={{ color: '#757575', fontSize: 20 }} />;
  }
};

// Status label mapping
export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'Completed';
    case 'Image_Uploaded':
      return 'Image Uploaded';
    case 'AI Pending':
      return 'AI Processing Pending';
    case 'AI Processed':
      return 'AI Processed - Awaiting Approval';
    case 'Approved':
      return 'Approved';
    case 'Not Started':
      return 'Not Started';
    default:
      return status || 'Not Started';
  }
};

// Map answer sheet status to internal status
export const mapAnswerSheetStatusToInternalStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'Completed': 'completed',
    'Image_Uploaded': 'pending',
    'AI Pending': 'processing',
    'AI Processed': 'processing',
    'Approved': 'completed',
    'Not Started': 'not_started',
  };

  return statusMap[status] || 'not_started';
};

