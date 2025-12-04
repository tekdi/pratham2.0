import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Grid, Checkbox, Button, Chip, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import AddIcCallOutlinedIcon from '@mui/icons-material/AddIcCallOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CallLogModal from './CallLogModal';
import { editEditUser } from '../../services/ProfileService';

interface CallLog {
  date: string;
  status: string;
  note?: string;
}

interface User {
  id: number;
  name: string;
  registeredOn: string;
  inPersonMode: string;
  location: {
    state: string;
    district: string;
    block: string;
    village: string;
  };
  phoneNumber: string;
  email: string;
  birthDate: string;
  callLogs: CallLog[];
  isNew?: boolean;
  preTestStatus?: string;
  modeType?: 'in-person' | 'remote';
}

interface UserCardProps {
  user: User & { userId?: string };
  isSelected?: boolean;
  onSelectChange?: (userId: string, selected: boolean) => void;
  onCallLogUpdate?: (
    userId: string,
    callLog: { date: string; note: string },
    editIndex?: number
  ) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, isSelected = false, onSelectChange, onCallLogUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const [callLogModalOpen, setCallLogModalOpen] = useState(false);
  const [editingCallLog, setEditingCallLog] = useState<{ date: string; note: string } | null>(null);
  const [editingCallLogIndex, setEditingCallLogIndex] = useState<number | null>(null);
  const router = useRouter();

  const handleCallLogSave = async (data: { date: string; note: string }) => {
    if (!user.userId) {
      setCallLogModalOpen(false);
      return;
    }

    const existingValues = user.callLogs.map((log) => ({
      date: log.date || '',
      textValue: log.note || '',
    }));

    const updatedValues = editingCallLog
      ? existingValues.map((entry) =>
          entry.date === editingCallLog.date && entry.textValue === editingCallLog.note
            ? { date: data.date, textValue: data.note }
            : entry
        )
      : [...existingValues, { date: data.date, textValue: data.note }];

    const userDetails = {
      userData: {},
      customFields: [
        {
          fieldId: '186df59d-2876-4c2f-a123-9fec12d3d18a',
          value: updatedValues,
        },
      ],
    };

    try {
      await editEditUser(user.userId, userDetails);
      if (onCallLogUpdate) {
        onCallLogUpdate(user.userId, data, editingCallLogIndex ?? undefined);
      }
    } catch (error) {
      console.error('Error updating call log custom field:', error);
    } finally {
      setCallLogModalOpen(false);
    }
  };

  return (
    <>
      <Box sx={{ 
        bgcolor: '#fff', 
        borderRadius: '8px', 
        mb: 2, 
        boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        border: '1px solid #e0e0e0'
      }}>
        <Box sx={{ p: 1.5 }}>
          <Grid container alignItems="flex-start" spacing={1}>
            <Grid item>
              <Checkbox 
                checked={isSelected}
                onChange={(e) => onSelectChange?.(user.userId || String(user.id), e.target.checked)}
                sx={{ p: 0.5, '&.Mui-checked': { color: '#1E1B16' } }} 
              />
            </Grid>
            <Grid item xs>
               {/* Name and Date Row */}
               <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: '#2E65F3',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      mr: 1,
                      fontSize: '16px',
                    }}
                    onClick={() => {
                      if (user.userId) {
                        router.push(`/learner/${user.userId}?source=user-registration`);
                      }
                    }}
                  >
                    {user.name}
                  </Typography>
                  {/* {user.isNew && (
                      <Typography component="span" sx={{ color: '#2E7D32', fontWeight: 'bold', fontSize: '10px', bgcolor: '#E8F5E9', px: 0.5, borderRadius: '4px' }}>
                          NEW
                      </Typography>
                  )} */}
               </Box>
               <Typography variant="caption" display="block" sx={{ color: '#7C766F', fontSize: '12px', mt: 0.5 }}>
                  Registered on {user.registeredOn}
               </Typography>

               {/* Tags Row */}
               {/* <Box sx={{ display: 'flex', gap: 1, my: 1, flexWrap: 'wrap' }}>
                  <Chip 
                      icon={user.modeType === 'remote' ? <PlayCircleOutlineIcon style={{fontSize: 16}}/> : <BusinessOutlinedIcon style={{fontSize: 16}}/>} 
                      label={user.inPersonMode} 
                      size="small" 
                      sx={{ bgcolor: '#EAE0D5', color: '#4A4640', fontSize: '12px', borderRadius: '4px', height: '24px', '& .MuiChip-icon': { color: '#4A4640' } }} 
                  />
                  {user.preTestStatus && (
                      user.preTestStatus === 'pending' ? (
                          <Chip 
                              icon={<AccessTimeOutlinedIcon style={{fontSize: 16}}/>} 
                              label="Pre test pending" 
                              size="small" 
                              sx={{ bgcolor: '#EAE0D5', color: '#4A4640', fontSize: '12px', borderRadius: '4px', height: '24px', '& .MuiChip-icon': { color: '#4A4640' } }}
                          />
                      ) : (
                          <Chip 
                              icon={<CheckCircleOutlineIcon style={{fontSize: 16}}/>} 
                              label="Pre test completed" 
                              size="small" 
                              sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontSize: '12px', borderRadius: '4px', height: '24px', '& .MuiChip-icon': { color: '#2E7D32' } }}
                          />
                      )
                  )}
               </Box> */}

               {/* Location Row */}
               <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, mb: 1 }}>
                  <LocationOnOutlinedIcon sx={{ fontSize: 16, color: '#4A4640', mt: 0.2 }} />
                  <Typography variant="body2" sx={{ fontSize: '12px', color: '#4A4640', lineHeight: 1.3 }}>
                       {[user.location.village, user.location.block, user.location.district, user.location.state].filter(Boolean).join(', ')}
                  </Typography>
               </Box>

              {/* Expanded Info Section (Phone, Email, DOB) - Shown when expanded */}
              {expanded && (
                  <Box sx={{ mt: 1, mb: 1 }}>
               <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, mb: 1 }}>
               <CallOutlinedIcon sx={{ fontSize: 16, color: '#4A4640' }} />
                          <Typography variant="body2" sx={{ fontSize: '14px', color: '#1E1B16' }}>{user.phoneNumber}</Typography>
                      </Box>
                     { user.email &&(<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, mb: 1 }}>
                      <EmailOutlinedIcon sx={{ fontSize: 16, color: '#4A4640' }} />
                          <Typography variant="body2" sx={{ fontSize: '14px', color: '#1E1B16', wordBreak: 'break-all' }}>{user.email}</Typography>
                      </Box>)}
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, mb: 1 }}>
                      <CakeOutlinedIcon sx={{ fontSize: 16, color: '#4A4640' }} />
                          <Typography variant="body2" sx={{ fontSize: '14px', color: '#1E1B16' }}>{user.birthDate}</Typography>
                      </Box>
                  </Box>
              )}
            </Grid>
          </Grid>
          
          {/* More Details Expander */}
          <Box 
              onClick={() => setExpanded(!expanded)}
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mt: 1 }}
          >
              <Typography sx={{ color: '#0D599E', fontSize: '14px', fontWeight: 500 }}>More Details</Typography>
              <ExpandMoreIcon sx={{ color: '#0D599E', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </Box>
          
          {/* Buttons & Logs Section - Always Visible */}
          <Box sx={{ mt: 2 }}>
               <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  {/* <Button 
                      variant="outlined" 
                      startIcon={<CallOutlinedIcon />}
                      sx={{ 
                          borderRadius: '100px', 
                          borderColor: '#1E1B16', 
                          color: '#1E1B16', 
                          textTransform: 'none',
                          width: 'auto',
                          minWidth: '100px',
                          px: 2,
                          height: '40px'
                      }}
                  >
                      Call
                  </Button> */}
                  
                  <Button 
                      variant="outlined" 
                      startIcon={<AddIcCallOutlinedIcon />}
                      onClick={() => {
                        setEditingCallLog(null);
                        setEditingCallLogIndex(null);
                        setCallLogModalOpen(true);
                      }}
                      sx={{ 
                          borderRadius: '100px', 
                          borderColor: '#1E1B16', 
                          color: '#1E1B16', 
                          textTransform: 'none',
                          width: 'auto',
                          minWidth: '140px',
                          px: 2,
                          height: '40px'
                      }}
                  >
                      Add Call Log
                  </Button>
              </Box>

              <Box>
                  <Typography variant="caption" sx={{ color: '#7C766F', fontSize: '12px', mb: 0.5, display: 'block' }}>Call Logs</Typography>
                  {user.callLogs.length > 0 ? (
                          user.callLogs.map((log: CallLog, index: number) => (
                          <Box key={index} sx={{ mb: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <Box sx={{ flex: 1 }}>
                                      <Typography variant="body2" sx={{ fontSize: '14px', color: '#1E1B16' }}>{log.note || log.status}</Typography>
                                      <Typography variant="caption" sx={{ color: '#7C766F' }}>{log.date}</Typography>
                                  </Box>
                                  <EditOutlinedIcon 
                                      sx={{ 
                                          fontSize: 16, 
                                          color: '#0D599E', 
                                          cursor: 'pointer',
                                          ml: 1,
                                          mt: 0.5
                                      }}
                                      onClick={() => {
                                        setEditingCallLog({ date: log.date || '', note: log.note || '' });
                                        setEditingCallLogIndex(index);
                                        setCallLogModalOpen(true);
                                      }}
                                  />
                              </Box>
                          </Box>
                          ))
                  ) : (
                      <Typography variant="body2" sx={{ fontSize: '14px', color: '#1E1B16', fontStyle: 'italic' }}>No logs yet</Typography>
                  )}
              </Box>
          </Box>

        </Box>
      </Box>

      {/* Call Log Modal */}
      <CallLogModal
        open={callLogModalOpen}
        onClose={() => {
          setCallLogModalOpen(false);
          setEditingCallLog(null);
        }}
        learnerName={user.name}
        onSave={(data) => {
          handleCallLogSave(data);
          setEditingCallLog(null);
        }}
        initialDate={editingCallLog?.date}
        initialNote={editingCallLog?.note}
      />
    </>
  );
};

export default UserCard;
