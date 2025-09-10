import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Role } from '../../utils/app.constant';

interface ProfileDetailsProps {
  fullName: string;
  emailId: string;
  state?: any;
  district?: any;
  block?: any;
  designation?: string;
  joinedOn?: string | null;
  phoneNumber?: string;
  mentorId?: string;
  gender?: string;
  age?: number;
  dob?: string;
  village?: any
  middleName?: string | null;
  userName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
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
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  console.log('designation', designation);
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
        {designation !== Role.LEARNER ? (
          <>
            <Typography
              color={theme.palette.warning['500']}
              sx={{ fontSize: '12px', fontWeight: 600 }}
            >
              {t('YOUTHNET_PROFILE.FULL_NAME')}
            </Typography>
            <Typography
              color={theme.palette.warning['A200']}
              sx={{ fontSize: '16px', fontWeight: 400 }}
              gutterBottom
            >
              {fullName}
            </Typography>
          </>
        ) : (
          <>
            <Typography
              color={theme.palette.warning['500']}
              sx={{ fontSize: '12px', fontWeight: 600 }}
            >
              {t('YOUTHNET_PROFILE.FIRST_NAME')}
            </Typography>
            <Typography
              color={theme.palette.warning['A200']}
              sx={{ fontSize: '16px', fontWeight: 400 }}
              gutterBottom
            >
              {firstName}
            </Typography>
            <Typography
              color={theme.palette.warning['500']}
              sx={{ fontSize: '12px', fontWeight: 600 }}
            >
              {t('YOUTHNET_PROFILE.MIDDLE_NAME')}
            </Typography>
            <Typography
              color={theme.palette.warning['A200']}
              sx={{ fontSize: '16px', fontWeight: 400 }}
              gutterBottom
            >
              {middleName}
            </Typography>
            <Typography
              color={theme.palette.warning['500']}
              sx={{ fontSize: '12px', fontWeight: 600 }}
            >
              {t('YOUTHNET_PROFILE.LAST_NAME')}
            </Typography>
            <Typography
              color={theme.palette.warning['A200']}
              sx={{ fontSize: '16px', fontWeight: 400 }}
              gutterBottom
            >
              {lastName}
            </Typography>
          </>
        )}
        {designation !== Role.LEAD && (
          <>
            <Typography
              color={theme.palette.warning['500']}
              sx={{ fontSize: '12px', fontWeight: 600 }}
            >
              {t('YOUTHNET_PROFILE.USERNAME')}
            </Typography>
            <Typography
              color={theme.palette.warning['A200']}
              sx={{ fontSize: '16px', fontWeight: 400 }}
              gutterBottom
            >
              {userName}
            </Typography>
          </>
        )}

        <Typography
          color={theme.palette.warning['500']}
          sx={{ fontSize: '12px', fontWeight: 600, mt: 2 }}
        >
          {t('YOUTHNET_PROFILE.EMAIL_ID')}
        </Typography>
        <Typography
          color={theme.palette.warning['A200']}
          sx={{ fontSize: '16px', fontWeight: 400 }}
          gutterBottom
        >
          {emailId}
        </Typography>

        <Grid container spacing={2}>
          {/* <Grid item xs={6}>
            <Typography
              color={theme.palette.warning['500']}
              sx={{ fontSize: '12px', fontWeight: 600, mt: 2 }}
            >
              {t('YOUTHNET_PROFILE.JOINED_ON')}
            </Typography>
            <Typography
              color={theme.palette.warning['A200']}
              sx={{ fontSize: '16px', fontWeight: 400 }}
            >
              {joinedOn}
            </Typography>
          </Grid> */}
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography
              color={theme.palette.warning['500']}
              sx={{ fontSize: '12px', fontWeight: 600, mt: 2 }}
            >
              {t('YOUTHNET_PROFILE.PHONE_NUMBER')}
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
              {t('YOUTHNET_PROFILE.DESIGNATION')}
            </Typography>
            <Typography
              color={theme.palette.warning['A200']}
              sx={{ fontSize: '16px', fontWeight: 400 }}
            >
              {designation}
            </Typography>
          </Grid>
          {/* <Grid item xs={6}>
            <Typography
              color={theme.palette.warning['500']}
              sx={{ fontSize: '12px', fontWeight: 600, mt: 2 }}
            >
              {t('YOUTHNET_PROFILE.MENTOR_ID')}
            </Typography>
            <Typography
              color={theme.palette.warning['A200']}
              sx={{ fontSize: '16px', fontWeight: 400 }}
            >
              {mentorId}
            </Typography>
          </Grid> */}
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography
              color={theme.palette.warning['500']}
              sx={{ fontSize: '12px', fontWeight: 600, mt: 2 }}
            >
              {t('YOUTHNET_PROFILE.GENDER')}
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
              {t('YOUTHNET_PROFILE.DOB')}
            </Typography>
            <Typography sx={{ fontSize: '16px', fontWeight: 400 }}>
              {dob}
            </Typography>
          </Grid>
        </Grid>

        {/* Location Fields - Separate Display */}
        <Grid container spacing={2}>
          {state && (
            <Grid item xs={6}>
              <Typography
                color={theme.palette.warning['500']}
                sx={{ fontSize: '12px', fontWeight: 600, mt: 2 }}
              >
                {state.includes(',') ? t('YOUTHNET_PROFILE.STATES') : t('YOUTHNET_PROFILE.STATE')}
              </Typography>
              <Typography
                color={theme.palette.warning['A200']}
                sx={{ fontSize: '16px', fontWeight: 400 }}
                gutterBottom
              >
                {state}
              </Typography>
            </Grid>
          )}
          
          {district && (
            <Grid item xs={6}>
              <Typography
                color={theme.palette.warning['500']}
                sx={{ fontSize: '12px', fontWeight: 600, mt: 2 }}
              >
                {district.includes(',') ? t('YOUTHNET_PROFILE.DISTRICTS') : t('YOUTHNET_PROFILE.DISTRICT')}
              </Typography>
              <Typography
                color={theme.palette.warning['A200']}
                sx={{ fontSize: '16px', fontWeight: 400 }}
                gutterBottom
              >
                {district}
              </Typography>
            </Grid>
          )}
          
          {block && designation !== Role.LEAD && (
            <Grid item xs={6}>
              <Typography
                color={theme.palette.warning['500']}
                sx={{ fontSize: '12px', fontWeight: 600, mt: 2 }}
              >
                {block.includes(',') ? t('YOUTHNET_PROFILE.BLOCKS') : t('YOUTHNET_PROFILE.BLOCK')}
              </Typography>
              <Typography
                color={theme.palette.warning['A200']}
                sx={{ fontSize: '16px', fontWeight: 400 }}
                gutterBottom
              >
                {block}
              </Typography>
            </Grid>
          )}
          
          {village && (
            <Grid item xs={6}>
              <Typography
                color={theme.palette.warning['500']}
                sx={{ fontSize: '12px', fontWeight: 600, mt: 2 }}
              >
                {village.includes(',') ? t('YOUTHNET_PROFILE.VILLAGES') : t('YOUTHNET_PROFILE.VILLAGE')}
              </Typography>
              <Typography
                color={theme.palette.warning['A200']}
                sx={{ fontSize: '16px', fontWeight: 400 }}
                gutterBottom
              >
                {village}
              </Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Profile;
