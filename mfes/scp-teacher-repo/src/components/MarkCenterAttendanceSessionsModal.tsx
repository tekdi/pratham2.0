import {
  Box,
  Fade,
  Modal,
  Typography,
} from '@mui/material';
import React from 'react';
import { getDayMonthYearFormat, shortDateFormat } from '../utils/Helper';
import CloseIcon from '@mui/icons-material/Close';
import Backdrop from '@mui/material/Backdrop';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import { modalStyles } from '@/styles/modalStyles';

export interface DaySessionForAttendance {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  type: 'inPerson' | 'online';
  presentCount?: number;
  totalCount?: number;
}

export interface MarkCenterAttendanceSessionsModalProps {
  open: boolean;
  onClose: () => void;
  selectedDate: Date;
  sessions?: DaySessionForAttendance[];
  onSessionSelect: (session: DaySessionForAttendance) => void;
}

const defaultMockSessions: DaySessionForAttendance[] = [
  {
    id: '1',
    name: 'Morning Theory Session',
    startTime: '09:00',
    endTime: '11:00',
    type: 'inPerson',
  },
  {
    id: '2',
    name: 'Hands-on Lab Session',
    startTime: '11:30',
    endTime: '13:30',
    type: 'inPerson',
  },
  {
    id: '3',
    name: 'Online Q&A Session',
    startTime: '15:00',
    endTime: '16:00',
    type: 'online',
    presentCount: 4,
    totalCount: 6,
  },
  {
    id: '4',
    name: 'Evening Revision',
    startTime: '17:00',
    endTime: '18:00',
    type: 'online',
  },
];

const MarkCenterAttendanceSessionsModal: React.FC<
  MarkCenterAttendanceSessionsModalProps
> = ({
  open,
  onClose,
  selectedDate,
  sessions = defaultMockSessions,
  onSessionSelect,
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();

  const inPersonSessions = sessions.filter((s) => s.type === 'inPerson');
  const onlineSessions = sessions.filter((s) => s.type === 'online');

  const dateStr = selectedDate ? shortDateFormat(selectedDate) : '';
  const formattedDate = dateStr ? getDayMonthYearFormat(dateStr) : '';

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: { timeout: 300 },
      }}
      sx={{
        '& .modal_mark': {
          outline: 'none',
        },
      }}
      className="modal_mark"
    >
      <Fade in={open}>
        <Box
          sx={{
            ...modalStyles(theme),
            maxWidth: '450px',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '1rem',
            padding: '15px 10px 0 10px',
          }}
        >
          <Box
            sx={{
              overflowX: 'auto',
              overflowY: 'auto',
              flex: 1,
              paddingBottom: 1,
            }}
            width="100%"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              sx={{ padding: '0 10px' }}
            >
              <Box marginBottom={0}>
                <Typography
                  variant="h2"
                  component="h2"
                  marginBottom={0}
                  fontWeight="500"
                  fontSize="16px"
                  sx={{ color: theme.palette.warning?.A200 ?? theme.palette.warning?.['A200'] }}
                >
                  {t('COMMON.MARK_CENTER_ATTENDANCE')}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    paddingBottom: '10px',
                    color: theme.palette.warning?.A200 ?? theme.palette.warning?.['A200'],
                    fontSize: '14px',
                  }}
                  component="p"
                >
                  {formattedDate}
                </Typography>
              </Box>
              <CloseIcon
                sx={{
                  cursor: 'pointer',
                  color: theme.palette.warning?.A200 ?? theme.palette.warning?.['A200'],
                }}
                onClick={onClose}
              />
            </Box>

            <Box sx={{ height: '1px', background: '#D0C5B4' }} />

            <Box sx={{ padding: '0 10px', marginTop: 2 }}>
              <Box sx={{ marginBottom: 1.5, display: 'flex', alignItems: 'center', gap: 0.5, color: 'black' }}>
                <LocationOnOutlinedIcon sx={{ fontSize: 18 }} />
                <Typography variant="subtitle2" fontWeight="800" fontSize="14px">
                  {t('ATTENDANCE.IN_PERSON_SESSIONS', { count: inPersonSessions.length })}
                </Typography>
              </Box>
              <Box display="flex" flexDirection="column" gap={1}>
                {inPersonSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    theme={theme}
                    presentLabel={t('ATTENDANCE.PRESENT')}
                    onClick={() => onSessionSelect(session)}
                  />
                ))}
              </Box>

              <Box sx={{ marginTop: 2, marginBottom: 1.5, display: 'flex', alignItems: 'center', gap: 0.5, color: 'black' }}>
                <VideocamOutlinedIcon sx={{ fontSize: 18 }} />
                <Typography variant="subtitle2" fontWeight="800" fontSize="14px">
                  {t('ATTENDANCE.ONLINE_SESSIONS', { count: onlineSessions.length })}
                </Typography>
              </Box>
              <Typography
                variant="caption"
                display="block"
                sx={{
                  color: theme.palette.text?.secondary ?? 'rgba(0,0,0,0.6)',
                  marginBottom: 1,
                  fontSize: '12px',
                }}
              >
                {t('ATTENDANCE.ONLINE_ATTENDANCE_AUTO_MARKED_NOTE')}
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                {onlineSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    theme={theme}
                    presentLabel={t('ATTENDANCE.PRESENT')}
                    onClick={() => onSessionSelect(session)}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

function SessionCard({
  session,
  theme,
  onClick,
}: {
  session: DaySessionForAttendance;
  theme: any;
  presentLabel: string;
  onClick: () => void;
}) {
  const timeLabel = `${session.startTime} - ${session.endTime}`;

  return (
    <Box
      onClick={onClick}
      sx={{
        border: '1px solid',
        borderColor: theme.palette.divider ?? '#D0C5B4',
        borderRadius: '8px',
        padding: '12px 14px',
        cursor: 'pointer',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        '&:hover': {
          borderColor: theme.palette.primary?.main ?? '#edc229',
          boxShadow: '0 0 0 2px rgba(237, 194, 41, 0.25)',
        },
      }}
    >
      <Typography variant="body2" fontWeight="500" fontSize="14px">
        {session.name}
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={0.5}>
        <Typography variant="caption" color="text.secondary" fontSize="12px">
          {timeLabel}
        </Typography>
      </Box>
    </Box>
  );
}

export default MarkCenterAttendanceSessionsModal;
