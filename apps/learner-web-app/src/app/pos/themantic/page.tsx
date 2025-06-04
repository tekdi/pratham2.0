import React from 'react';
import Layout from './layout/Layout';
import { Box, Container } from '@mui/material';
import ThemanticCard from './themanticCard/ThemanticCard';
const page = () => {
  return (
    <Layout>
      <Container maxWidth="xl">
        <Box
          sx={{
            fontSize: { xs: '25px', sm: '36px' },
            fontWeight: '700',
            textAlign: 'center',
            color: '#3891ce',
            fontFamily: 'Montserrat',
          }}
        >
          STEM Education for Innovation : Experimento India
        </Box>
      </Container>
      <Box sx={{ my: 2 }}>
        <ThemanticCard />
      </Box>
    </Layout>
  );
};

export default page;
