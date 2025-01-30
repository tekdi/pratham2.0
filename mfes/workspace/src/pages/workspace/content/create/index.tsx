import React, { useEffect, useState } from 'react';
import Layout from '../../../../components/Layout';
import { Typography, Box, useTheme, Paper, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import {
  createCourse,
  createQuestionSet,
} from '../../../../services/ContentService';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined';
import WorkspaceText from '../../../../components/WorkspaceText';
import { getLocalStoredUserId } from '../../../../services/LocalStorageService';

const CreatePage = () => {
  const theme = useTheme();
  const [selectedKey, setSelectedKey] = useState('create');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = getLocalStoredUserId();

    if (token && userId) {
      document.cookie = `authToken=${token}; path=/; secure; SameSite=Strict`;
      document.cookie = `userId=${userId}; path=/; secure; SameSite=Strict`;
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await createQuestionSet();
      console.log('Question set created successfully:', response);

      const identifier = response?.result?.identifier;
      router.push({
        pathname: `/editor`,
        query: { identifier },
      });
    } catch (error) {
      console.error('Error creating question set:', error);
    }
  };

  const openEditor = () => {
    fetchData();
  };

  const fetchCollectionData = async () => {
    try {
      const userId = getLocalStoredUserId();
      const response = await createCourse(userId);
      console.log('Course set created successfully:', response);

      const identifier = response?.result?.identifier;
      router.push({
        pathname: `/collection`,
        query: { identifier },
      });
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const openCollectionEditor = () => {
    fetchCollectionData();
  };

  const cardData = [
    {
      title: 'New Question Set',
      description: 'Create assessments, question banks, quizzes, etc.',
      icon: <QuizOutlinedIcon fontSize="large" />,
      onClick: openEditor,
    },
    {
      title: 'New Course',
      description: ' Create courses by defining content, assessments, etc',
      icon: <SchoolOutlinedIcon fontSize="large" />,
      onClick: openCollectionEditor,
    },
    {
      title: 'New Content',
      description: 'Create new documents, PDF, video, QML, HTML, etc.',
      icon: <VideoLibraryOutlinedIcon fontSize="large" />,
      onClick: () => {
        sessionStorage.setItem('previousPage', window.location.href);
        router.push('/upload-editor');
      },
    },
    {
      title: 'Create New Large Content', // Added "Create" to the title
      description: 'Create videos and documents larger than 150mb', // Updated description
      icon: <img src={'/150+.png'} alt="large-video" height={35} width={70} />, // Correct as is
      onClick: () => {
        sessionStorage.setItem('previousPage', window.location.href); // No change needed
        router.push({
          pathname: '/upload-editor',
          query: { editorforlargecontent: 'true' }, // No change needed
        }); // Removed an extra comma
      },
    },
  ];

  return (
    <Layout selectedKey={selectedKey} onSelect={setSelectedKey}>
      <WorkspaceText />

      {/* Outer box for "Create new content" heading and cards */}
      <Box
        sx={{
          backgroundColor: '#F8EFE7',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: theme.shadows[3],
        }}
        m={3} // Margin around the box for spacing
      >
        <Typography
          variant="h4"
          sx={{ mb: 2 }}
          fontSize={'16px'}
          fontWeight={600}
        >
          Create new content
        </Typography>

        <Box
          display="flex"
          gap="1rem"
          justifyContent="flex-start"
          flexWrap="wrap"
        >
          <Grid container spacing={2}>
            {cardData.map((card, index) => (
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6} key={index}>
                <Paper
                  key={index}
                  elevation={3}
                  onClick={card.onClick}
                  sx={{
                    padding: '1rem',
                    borderRadius: '8px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    flex: '1 1 180px',
                    // maxWidth: "220px",
                    // minHeight: "114px",
                    border: 'solid 1px #D0C5B4',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                  className="create-card"
                >
                  {card?.icon}
                  <Typography
                    className="one-line-text"
                    variant="h3"
                    sx={{ mt: 1, fontWeight: 'bold', fontSize: '14px' }}
                  >
                    {card?.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="two-line-text"
                    color="textSecondary"
                    sx={{ mt: 1, mb: 0 }}
                  >
                    {card?.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
};

export default CreatePage;
