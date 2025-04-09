import React from 'react';
import { Card, CardContent, Typography, Grid, Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

interface Subject {
  id: string;
  value: string;
  label: string;
}

interface ProfileDetailsProps {
  fullName: string;
  emailId: string;
  state?: string;
  district?: string;
  block?: string;
  designation?: string;
  joinedOn?: string | null;
  phoneNumber?: string;
  mentorId?: string;
  gender?: string;
  age?: number;
  dob?: string;
  village?: string | null;
  middleName?: string | null;
  userName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  subjectsITeach?: Subject[];
  myMainSubjects?: Subject[];
}

const Profile: React.FC<ProfileDetailsProps> = ({
  fullName,
  emailId,
  state,
  district,
  block,
  designation,
  joinedOn,
  phoneNumber,
  mentorId,
  gender,
  age,
  dob,
  village,
  userName,
  middleName,
  firstName,
  lastName,
  subjectsITeach = [],
  myMainSubjects = [],
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();

  // Extract IDs of "MY_MAIN_SUBJECTS" for matching
  const mainSubjectIds = new Set(myMainSubjects.map((subject) => subject.id));

  return (
    <Card
      sx={{
        borderRadius: '16px',
        boxShadow: 0,
        border: `1px solid ${theme.palette.warning['A100']}`,
        mt: 2,
      }}
    >
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography
              color={theme.palette.warning['500']}
              sx={{ fontSize: '12px', fontWeight: 600 }}
            >
              {t('SCP_PROFILE.DESIGNATION')}
            </Typography>
            <Typography
              color={theme.palette.warning['A200']}
              sx={{ fontSize: '16px', fontWeight: 400 }}
            >
              {designation}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <>
              <Typography
                color={theme.palette.warning['500']}
                sx={{ fontSize: '12px', fontWeight: 600 }}
              >
                {t('SCP_PROFILE.USERNAME')}
              </Typography>
              <Typography
                color={theme.palette.warning['A200']}
                sx={{ fontSize: '16px', fontWeight: 400 }}
                gutterBottom
              >
                {userName}
              </Typography>
            </>
          </Grid>

          <Grid item xs={6}>
            <Typography
              color={theme.palette.warning['500']}
              sx={{ fontSize: '12px', fontWeight: 600 }}
            >
              {t('SCP_PROFILE.EMAIL_ID')}
            </Typography>
            <Typography
              color={theme.palette.warning['A200']}
              sx={{ fontSize: '16px', fontWeight: 400 }}
              gutterBottom
            >
              {emailId}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography
              color={theme.palette.warning['500']}
              sx={{ fontSize: '12px', fontWeight: 600, mt: 2 }}
            >
              {t('SCP_PROFILE.JOINED_ON')}
            </Typography>
            <Typography
              color={theme.palette.warning['A200']}
              sx={{ fontSize: '16px', fontWeight: 400 }}
            >
              {joinedOn}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography
              color={theme.palette.warning['500']}
              sx={{ fontSize: '12px', fontWeight: 600, mt: 2 }}
            >
              {t('SCP_PROFILE.PHONE_NUMBER')}
            </Typography>
            <Typography
              color={theme.palette.warning['A200']}
              sx={{ fontSize: '16px', fontWeight: 400 }}
            >
              {phoneNumber}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              color={theme.palette.warning['500']}
              sx={{ fontSize: '12px', fontWeight: 600, mt: 2 }}
            >
              {t('SCP_PROFILE.GENDER')}
            </Typography>
            <Typography color={theme.palette.warning['A200']}>
              {gender}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              color={theme.palette.warning['500']}
              sx={{ fontSize: '12px', fontWeight: 600, mt: 2 }}
            >
              {t('SCP_PROFILE.DOB')}
            </Typography>
            <Typography sx={{ fontSize: '16px', fontWeight: 400 }}>
              {dob}
            </Typography>
          </Grid>
        </Grid>

        {/* Subjects I Teach Section */}
        <Box mt={4}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.warning['500'] }}
          >
            {t('SCP_PROFILE.SUBJECTS_I_TEACH')}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {subjectsITeach.map((subject) => {
              const isHighlighted = mainSubjectIds.has(subject.id);
              return (
                <Button
                  key={subject.id}
                  variant="contained"
                  sx={{
                    backgroundColor: isHighlighted ? 'yellow' : 'primary.main',
                    color: isHighlighted ? 'black' : 'white',
                    '&:hover': {
                      backgroundColor: isHighlighted ? 'gold' : 'primary.dark',
                    },
                  }}
                >
                  {subject.label}
                </Button>
              );
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Profile;