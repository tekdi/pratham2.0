'use client';

import React from 'react';
import Layout from '../../components/Layout';
import { Box, Typography, Grid } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import dynamic from 'next/dynamic';

const L1ContentList = dynamic(
  () => import('@learner/components/Content/CommonL1ContentList'),
  {
    ssr: false,
  }
);

const ScpDashboard: React.FC = () => {
  return (
    // <Layout>
    //   <Grid container>
    //     <Grid item xs={12}>
    //       <Box
    //         sx={{
    //           display: 'flex',
    //           flexDirection: 'column',
    //           alignItems: 'center',
    //           justifyContent: 'center',
    //           minHeight: '60vh',
    //           p: { xs: 3, md: 5 },
    //         }}
    //       >
    //         <Box
    //           sx={{
    //             display: 'flex',
    //             alignItems: 'center',
    //             justifyContent: 'center',
    //             mb: 3,
    //           }}
    //         >
    //           <InfoIcon
    //             sx={{
    //               fontSize: { xs: '48px', md: '64px' },
    //               color: '#017AFF',
    //               mr: 2,
    //             }}
    //           />
    //         </Box>
    //         <Typography
    //           variant="h5"
    //           sx={{
    //             textAlign: 'center',
    //             color: '#1F1B13',
    //             fontWeight: 600,
    //             fontSize: { xs: '18px', md: '24px' },
    //             lineHeight: { xs: '24px', md: '32px' },
    //             maxWidth: '600px',
    //           }}
    //         >
    //           Thank you for registering for the second chance program. Our team will get in touch with you soon
    //         </Typography>
    //       </Box>
    //     </Grid>
    //   </Grid>
    // </Layout>
    // <L1ContentList notab={true} />
    <L1ContentList />

  );
};

export default ScpDashboard;

