import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Typography,
  Box,
  Grid,
  TextField,
  InputAdornment,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useTranslation } from 'libs/shared-lib-v2/src/lib/context/LanguageContext';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { SvgIconProps } from '@mui/material';

interface CoursePlanFormProps {
  open: boolean;
  onClose: () => void;
  title: string;
  actionTitle: string;
  onAction: (params: any) => void;
}

const CoursePlanForm: React.FC<CoursePlanFormProps> = ({
  open,
  onClose,
  title,
  actionTitle,
  onAction,
}) => {
  const { t } = useTranslation();

  const BlackCalendarIcon = (props: SvgIconProps) => (
    <CalendarMonthOutlinedIcon {...props} sx={{ color: 'black' }} />
  );

  const [topics, setTopics] = React.useState<
    {
      name: string;
      startDate: Date;
      endDate: Date;
      subTopics: {
        name: string;
        startDate: Date;
        endDate: Date;
        resources: {
          resourceType: string;
          resourceId: string;
          resourceName: string;
        }[];
      }[];
    }[]
  >([
    {
      name: '',
      startDate: null,
      endDate: null,
      subTopics: [{ name: '', startDate: null, endDate: null, resources: [] }],
    },
  ]);

  const handleAddTopic = () => {
    setTopics([
      ...topics,
      {
        name: '',
        startDate: null,
        endDate: null,
        subTopics: [
          { name: '', startDate: null, endDate: null, resources: [] },
        ],
      },
    ]);
  };

  const handleAddSubTopic = (topicIndex: number) => {
    setTopics(
      topics.map((topic, index) => {
        if (index === topicIndex) {
          return {
            ...topic,
            subTopics: [
              ...topic.subTopics,
              { name: '', startDate: null, endDate: null, resources: [] },
            ],
          };
        } else {
          return topic;
        }
      })
    );
  };

  const handleAddResource = (topicIndex: number, subTopicIndex: number) => {
    setTopics(
      topics.map((topic, index) => {
        if (index === topicIndex) {
          return {
            ...topic,
            subTopics: topic.subTopics.map((subTopic, subIndex) => {
              if (subIndex === subTopicIndex) {
                return {
                  ...subTopic,
                  resources: [
                    ...subTopic.resources,
                    { resourceType: '', resourceId: '', resourceName: '' },
                  ],
                };
              } else {
                return subTopic;
              }
            }),
          };
        } else {
          return topic;
        }
      })
    );
  };

  const handleRemoveTopic = (topicIndex: number) => {
    setTopics(topics.filter((_, index) => index !== topicIndex));
  };

  const handleRemoveSubTopic = (topicIndex: number, subTopicIndex: number) => {
    setTopics(
      topics.map((topic, index) => {
        if (index === topicIndex) {
          return {
            ...topic,
            subTopics: topic.subTopics.filter(
              (_, subIndex) => subIndex !== subTopicIndex
            ),
          };
        } else {
          return topic;
        }
      })
    );
  };

  const handleRemoveResource = (
    topicIndex: number,
    subTopicIndex: number,
    resourceIndex: number
  ) => {
    setTopics(
      topics.map((topic, index) => {
        if (index === topicIndex) {
          return {
            ...topic,
            subTopics: topic.subTopics.map((subTopic, subIndex) => {
              if (subIndex === subTopicIndex) {
                return {
                  ...subTopic,
                  resources: subTopic.resources.filter(
                    (_, rIndex) => rIndex !== resourceIndex
                  ),
                };
              } else {
                return subTopic;
              }
            }),
          };
        } else {
          return topic;
        }
      })
    );
  };

  const handleSave = () => {
    onAction(topics);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={false} // disables built-in maxWidth
      scroll="paper"
      PaperProps={{
        sx: {
          width: '90vw', // custom width, like xl (90% of viewport)
          maxWidth: 'md', // cap it at 1200px like "xl"
          maxHeight: '95vh',
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Fixed Title */}
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #eee',
          p: 3,
          pb: 1,
        }}
      >
        <Typography variant="h1" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon sx={{ color: 'black', fontWeight: 'bold' }} />
        </IconButton>
      </DialogTitle>

      {/* Scrollable Content */}
      <DialogContent sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {topics.map((topic, topicIndex) => (
          <Grid
            container
            spacing={2.5}
            key={topicIndex}
            sx={{ pl: 1, pr: 1, pt: 3.5 }}
          >
            <Grid item xs={12} sm={12} md={12}>
              {/* <Typography variant="h6">Topic {topicIndex + 1}</Typography> */}
              <TextField
                fullWidth
                label={t('Topic Name')}
                required={true}
                variant="outlined"
                placeholder={t('Type here..')}
                value={topic.name}
                onChange={(e) => {
                  const newTopics = [...topics];
                  newTopics[topicIndex].name = e.target.value;
                  setTopics(newTopics);
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={t('Start Date')}
                  value={topic.startDate}
                  onChange={(newValue) => {
                    const newTopics = [...topics];
                    newTopics[topicIndex].startDate = newValue;
                    setTopics(newTopics);
                  }}
                  format="DD-MM-YYYY"
                  disableScrollLock
                  slots={{
                    openPickerIcon: BlackCalendarIcon,
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined',
                      required: true,
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '4px',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderRadius: '4px',
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={t('End Date')}
                  value={topic.endDate}
                  onChange={(newValue) => {
                    const newTopics = [...topics];
                    newTopics[topicIndex].endDate = newValue;
                    setTopics(newTopics);
                  }}
                  format="DD-MM-YYYY"
                  disableScrollLock
                  slots={{
                    openPickerIcon: BlackCalendarIcon,
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined',
                      required: true,
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '4px',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderRadius: '4px',
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Divider />
            </Grid>

            {/* <Button
                onClick={() => handleRemoveTopic(topicIndex)}
                color="error"
                size="small"
              >
                Remove Topic
              </Button> */}

            {/* SubTopics */}
            {topic.subTopics.map((sub, subIndex) => (
              <Grid
                key={`${topicIndex}_${subIndex}`}
                item
                xs={12}
                sm={12}
                md={12}
                sx={{
                  borderRadius: '12px',
                  border: '1px solid #DADADA',
                  backgroundColor: '#F9F9F9',
                  p: 2,
                  mt: 2,
                  ml: 2.5,
                }}
              >
                <Grid container spacing={2.5}>
                  <Grid item xs={6} sm={6} md={6}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: '#4D4639',
                        backgroundColor: '#FFDEA1',
                        borderRadius: '15px',
                        p: 0.5,
                        width: '130px',
                        textAlign: 'center',
                      }}
                    >
                      {t('Sub Topic')} {subIndex + 1}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sm={6}
                    md={6}
                    sx={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <IconButton
                      onClick={() => handleRemoveSubTopic(topicIndex, subIndex)}
                      size="small"
                    >
                      <DeleteOutlineOutlinedIcon sx={{ color: '#BA1A1A' }} />
                    </IconButton>
                  </Grid>

                  <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      fullWidth
                      label={t('Sub Topic Name')}
                      required={true}
                      variant="outlined"
                      placeholder={t('Type here..')}
                      value={sub.name}
                      onChange={(e) => {
                        const newTopics = [...topics];
                        newTopics[topicIndex].subTopics[subIndex].name =
                          e.target.value;
                        setTopics(newTopics);
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label={t('Start Date')}
                        value={sub.startDate}
                        onChange={(newValue) => {
                          const newTopics = [...topics];
                          newTopics[topicIndex].subTopics[subIndex].startDate =
                            newValue;
                          setTopics(newTopics);
                        }}
                        format="DD-MM-YYYY"
                        disableScrollLock
                        slots={{
                          openPickerIcon: BlackCalendarIcon,
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            variant: 'outlined',
                            required: true,
                            sx: {
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '4px',
                              },
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderRadius: '4px',
                              },
                            },
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label={t('End Date')}
                        value={sub.endDate}
                        onChange={(newValue) => {
                          const newTopics = [...topics];
                          newTopics[topicIndex].subTopics[subIndex].endDate =
                            newValue;
                          setTopics(newTopics);
                        }}
                        format="DD-MM-YYYY"
                        disableScrollLock
                        slots={{
                          openPickerIcon: BlackCalendarIcon,
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            variant: 'outlined',
                            required: true,
                            sx: {
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '4px',
                              },
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderRadius: '4px',
                              },
                            },
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} sx={{ mt: -2 }}>
                    {/* Resources */}
                    {sub.resources.map((res, resIndex) => (
                      <Grid
                        key={`${topicIndex}_${subIndex}_${resIndex}`}
                        container
                        spacing={1}
                        mt={1}
                      >
                        <Grid item xs={12} sm={12} md={12}>
                          <Divider />
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} sx={{ mt: 1 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: '#4D4639',
                              backgroundColor: '#EDE1CF',
                              borderRadius: '15px',
                              p: 0.5,
                              width: '110px',
                              textAlign: 'center',
                            }}
                          >
                            {t('Resource')} {resIndex + 1}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          sm={6}
                          md={6}
                          sx={{ display: 'flex', justifyContent: 'flex-end' }}
                        >
                          <IconButton
                            onClick={() =>
                              handleRemoveResource(
                                topicIndex,
                                subIndex,
                                resIndex
                              )
                            }
                            size="small"
                          >
                            <DeleteOutlineOutlinedIcon
                              sx={{ color: '#BA1A1A' }}
                            />
                          </IconButton>
                        </Grid>

                        <Grid item xs={12} sm={6} md={6}>
                          <input
                            placeholder="Resource Type"
                            value={res.resourceType}
                            onChange={(e) => {
                              const newTopics = [...topics];
                              newTopics[topicIndex].subTopics[
                                subIndex
                              ].resources[resIndex].resourceType =
                                e.target.value;
                              setTopics(newTopics);
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>

                          <TextField
                            fullWidth
                            label={t('Resource ID')}
                            required={true}
                            variant="outlined"
                            placeholder={t('Type here..')}
                            value={res.resourceId}
                            onChange={(e) => {
                              const newTopics = [...topics];
                              newTopics[topicIndex].subTopics[
                                subIndex
                              ].resources[resIndex].resourceId = e.target.value;
                              setTopics(newTopics);
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                          <TextField
                            fullWidth
                            label={t('Resource Name')}
                            required={true}
                            variant="outlined"
                            placeholder={t('Type here..')}
                            value={res.resourceName}
                            onChange={(e) => {
                              const newTopics = [...topics];
                              newTopics[topicIndex].subTopics[
                                subIndex
                              ].resources[resIndex].resourceName =
                                e.target.value;
                              setTopics(newTopics);
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    sx={{ display: 'flex', justifyContent: 'flex-end', mt: -2 }}
                  >
                    <Button
                      onClick={() => handleAddResource(topicIndex, subIndex)}
                      sx={{
                        mt: 2,
                        p: 1,
                        pl: 2.5,
                        pr: 2.5,
                        fontSize: 'medium',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      size="small"
                      endIcon={<AddIcon fontSize="medium" />}
                    >
                      Add Resource
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}></Grid>
                </Grid>
              </Grid>
            ))}

            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              sx={{ display: 'flex', justifyContent: 'flex-end', mt: -2 }}
            >
              <Button
                onClick={() => handleAddSubTopic(topicIndex)}
                variant="outlined"
                sx={{
                  mt: 2,
                  p: 1,
                  pl: 2.5,
                  pr: 2.5,
                  fontSize: 'medium',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                size="small"
                endIcon={<AddIcon fontSize="medium" />}
              >
                Add Sub Topic
              </Button>
            </Grid>
          </Grid>
        ))}
        {/* 
        <Button
          onClick={handleAddTopic}
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
        >
          + Add Topic
        </Button> */}
      </DialogContent>

      {/* Fixed Actions */}
      <DialogActions
        sx={{
          borderTop: '1px solid #eee',
          p: 3,
        }}
      >
        <Button
          variant="contained"
          fullWidth
          onClick={onAction}
          sx={{
            fontSize: 'large',
            borderRadius: '5px',
          }}
        >
          {actionTitle}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CoursePlanForm;
