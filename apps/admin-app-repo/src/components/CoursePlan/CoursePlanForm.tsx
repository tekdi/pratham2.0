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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
  const [topics, setTopics] = React.useState<
    {
      name: string;
      startDate: string;
      endDate: string;
      subTopics: {
        name: string;
        startDate: string;
        endDate: string;
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
      startDate: '',
      endDate: '',
      subTopics: [{ name: '', startDate: '', endDate: '', resources: [] }],
    },
  ]);

  const handleAddTopic = () => {
    setTopics([
      ...topics,
      {
        name: '',
        startDate: '',
        endDate: '',
        subTopics: [{ name: '', startDate: '', endDate: '', resources: [] }],
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
              { name: '', startDate: '', endDate: '', resources: [] },
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
          <Box
            key={topicIndex}
            sx={{ mb: 3, border: '1px solid #ccc', p: 2, borderRadius: 2 }}
          >
            <Typography variant="h6">Topic {topicIndex + 1}</Typography>

            {/* Topic Fields */}
            <input
              placeholder="Topic Name"
              value={topic.name}
              onChange={(e) => {
                const newTopics = [...topics];
                newTopics[topicIndex].name = e.target.value;
                setTopics(newTopics);
              }}
            />
            <input
              type="date"
              value={topic.startDate}
              onChange={(e) => {
                const newTopics = [...topics];
                newTopics[topicIndex].startDate = e.target.value;
                setTopics(newTopics);
              }}
            />
            <input
              type="date"
              value={topic.endDate}
              onChange={(e) => {
                const newTopics = [...topics];
                newTopics[topicIndex].endDate = e.target.value;
                setTopics(newTopics);
              }}
            />
            <Button
              onClick={() => handleRemoveTopic(topicIndex)}
              color="error"
              size="small"
            >
              Remove Topic
            </Button>

            {/* SubTopics */}
            {topic.subTopics.map((sub, subIndex) => (
              <Box
                key={subIndex}
                sx={{ mt: 2, ml: 3, border: '1px dashed #aaa', p: 2 }}
              >
                <Typography variant="subtitle1">
                  SubTopic {subIndex + 1}
                </Typography>

                <input
                  placeholder="SubTopic Name"
                  value={sub.name}
                  onChange={(e) => {
                    const newTopics = [...topics];
                    newTopics[topicIndex].subTopics[subIndex].name =
                      e.target.value;
                    setTopics(newTopics);
                  }}
                />
                <input
                  type="date"
                  value={sub.startDate}
                  onChange={(e) => {
                    const newTopics = [...topics];
                    newTopics[topicIndex].subTopics[subIndex].startDate =
                      e.target.value;
                    setTopics(newTopics);
                  }}
                />
                <input
                  type="date"
                  value={sub.endDate}
                  onChange={(e) => {
                    const newTopics = [...topics];
                    newTopics[topicIndex].subTopics[subIndex].endDate =
                      e.target.value;
                    setTopics(newTopics);
                  }}
                />
                <Button
                  onClick={() => handleRemoveSubTopic(topicIndex, subIndex)}
                  color="error"
                  size="small"
                >
                  Remove SubTopic
                </Button>

                {/* Resources */}
                {sub.resources.map((res, resIndex) => (
                  <Box key={resIndex} sx={{ mt: 1, ml: 3 }}>
                    <input
                      placeholder="Resource Name"
                      value={res.resourceName}
                      onChange={(e) => {
                        const newTopics = [...topics];
                        newTopics[topicIndex].subTopics[subIndex].resources[
                          resIndex
                        ].resourceName = e.target.value;
                        setTopics(newTopics);
                      }}
                    />
                    <input
                      placeholder="Resource ID"
                      value={res.resourceId}
                      onChange={(e) => {
                        const newTopics = [...topics];
                        newTopics[topicIndex].subTopics[subIndex].resources[
                          resIndex
                        ].resourceId = e.target.value;
                        setTopics(newTopics);
                      }}
                    />
                    <input
                      placeholder="Resource Type"
                      value={res.resourceType}
                      onChange={(e) => {
                        const newTopics = [...topics];
                        newTopics[topicIndex].subTopics[subIndex].resources[
                          resIndex
                        ].resourceType = e.target.value;
                        setTopics(newTopics);
                      }}
                    />
                    <Button
                      onClick={() =>
                        handleRemoveResource(topicIndex, subIndex, resIndex)
                      }
                      color="error"
                      size="small"
                    >
                      Remove Resource
                    </Button>
                  </Box>
                ))}

                <Button
                  onClick={() => handleAddResource(topicIndex, subIndex)}
                  size="small"
                >
                  + Add Resource
                </Button>
              </Box>
            ))}

            <Button
              onClick={() => handleAddSubTopic(topicIndex)}
              sx={{ mt: 1 }}
              size="small"
            >
              + Add SubTopic
            </Button>
          </Box>
        ))}

        <Button
          onClick={handleAddTopic}
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
        >
          + Add Topic
        </Button>
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
