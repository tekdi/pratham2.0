import React from 'react'
import { gredientStyle } from '@learner/utils/style';
import Layout from '@learner/components/Layout';
import { Box } from '@mui/material';
import SkillCenter from '@learner/components/SkillCenter/SkillCenter';

const SkillCenterPage = () => {
  return (
    <Layout sx={gredientStyle}>
      <Box>
        <SkillCenter 
          title={"Skilling Centers"} 
          isNavigateBack={true}
          viewAll={true}
        />
      </Box>
    </Layout>
  )
}

export default SkillCenterPage
