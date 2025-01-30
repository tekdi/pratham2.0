import React, { useEffect, useRef } from 'react';
import { Toaster, toast, ToastOptions } from 'react-hot-toast';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

interface ToastNotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info';
}


const ToastNotification: React.FC<ToastNotificationProps> = ({ message, type = 'info' }) => {
  const prevMessageRef = useRef<string | null>(null);

  useEffect(() => {
    if (message && message !== prevMessageRef.current) {
      const customToastOptions: ToastOptions = {
        style: {
          background:
            type === 'success' ? 'green' : type === 'error' ? 'red' : 'blue',
          color: 'white',
        },
        position: "bottom-center",
         icon: type === 'success' ? (
          <CheckCircleIcon style={{ color: 'white' }} />
        ) : type === 'error' ? (
          <ErrorIcon style={{ color: 'white' }} />
        ) : (
          <InfoIcon style={{ color: 'white' }} />
        ),
      };
      //toast.dismiss();

      toast(message, customToastOptions);

      prevMessageRef.current = message;
    }
  }, [message, type]); 

  return <Toaster />;
};

export default ToastNotification;
