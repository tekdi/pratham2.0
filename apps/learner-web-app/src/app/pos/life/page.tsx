'use client';
import LearnerCourse from '@learner/components/Content/LearnerCourse';
import Layout from '@learner/components/pos/Layout';
import { Grid } from '@mui/material';

export default function PosSchoolsPage() {
  return (
    <Layout>
      <Grid container>
        <Grid item xs={12}>
          <LearnerCourse />
        </Grid>
      </Grid>
    </Layout>
  );
}
