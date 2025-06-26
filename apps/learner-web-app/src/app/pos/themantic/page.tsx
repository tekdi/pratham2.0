import React from 'react';
import Layout from './layout/Layout';
import { Box, Container } from '@mui/material';
import ThemanticCard from './themanticCard/[cardId]/page';
import SubHeader from './subHeader/SubHeader';
import HomeCards from './HomeCards/HomeCards';
const page = () => {
  return (
    <Layout>
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

      <Box sx={{ my: 2 }}>
        <SubHeader showFilter={true}/>
      </Box>
      <Box sx={{ my: 2 }}>
       <HomeCards />
      </Box>
    </Layout>
  );
};

export default page;
