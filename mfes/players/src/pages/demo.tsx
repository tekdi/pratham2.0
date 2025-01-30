import React, { useState } from 'react';
import CustomButton from '../components/Button/Button';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Typography } from '@mui/material';
import CustomTypography from '../components/Typography/Typography';
import CustomCheckbox from '../components/Checkboxes/CustomCheckbox';
import CustomRadioGroup from '../components/Radio/CustomRadioGroup';
import CustomSelect from '../components/Select/CustomSelect';
import CustomSwitch from '../components/Switches/CustomSwitch';
import CustomTextField from '../components/Textfields/CustomTextField';
// import { SunbirdPlayer } from '@shared-lib';
// import { Collection } from '@shared-lib';
// import { QuestionSet } from '@shared-lib';

const Demo: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [gender, setGender] = useState<string>('');
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(false);

  return (
    <Box>
      <Box
        style={{
          display: 'flex',
          gap: '10px',
          padding: '20px',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h5">Custom Buttons</Typography>
        {/* Primary Button */}
        <CustomButton
          title="Save"
          onClick={() => alert('Save clicked!')}
          variant="primary"
        />

        {/* Secondary Button */}
        <CustomButton
          title="Cancel"
          onClick={() => alert('Cancel clicked!')}
          variant="secondary"
        />

        {/* Outlined Button */}
        <CustomButton
          title="Outlined"
          onClick={() => alert('Outlined clicked!')}
          variant="outlined"
        />

        {/* Icon Button */}
        <CustomButton
          variant="icon"
          icon={<SaveIcon />}
          onClick={() => alert('Save icon clicked!')}
        />

        {/* Another Icon Button */}
        <CustomButton
          variant="icon"
          icon={<CancelIcon />}
          onClick={() => alert('Cancel icon clicked!')}
        />
        <Typography variant="h5">Custom Typography</Typography>
        <CustomTypography variant="heading" level={1} text="Heading Level 1" />
        <CustomTypography variant="heading" level={2} text="Heading Level 2" />
        <CustomTypography variant="heading" level={3} text="Heading Level 3" />
        <CustomTypography variant="heading" level={4} text="Heading Level 4" />
        <CustomTypography variant="heading" level={5} text="Heading Level 5" />
        <CustomTypography variant="heading" level={6} text="Heading Level 6" />

        {/* Subtitle */}
        <CustomTypography variant="subtitle" text="This is a subtitle" />

        {/* Paragraph */}
        <CustomTypography
          variant="paragraph"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        />

        {/* Label */}
        <CustomTypography variant="label" text="Label text" />

        {/* Link */}
        <CustomTypography
          variant="link"
          text="Visit Google"
          href="https://www.google.com"
          onClick={() => console.log('Link clicked!')}
        />
        <CustomTextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          multiline
        />

        <CustomSelect
          label="Country"
          value={country}
          onChange={(e: { target: { value: string } }) =>
            setCountry(e.target.value as string)
          }
          options={[
            { value: 'us', label: 'United States' },
            { value: 'in', label: 'India' },
          ]}
        />

        <CustomCheckbox
          label="Accept Terms"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
        />

        <CustomRadioGroup
          label="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          options={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
          ]}
        />

        <CustomSwitch
          label="Enable Notifications"
          checked={notificationsEnabled}
          onChange={(e) => setNotificationsEnabled(e.target.checked)}
        />
      </Box>
      {/* do_214210695162388480112
          do_21421049808039936017' 
          do_214210683521646592110' 
          do_21421049808039936017'  */}
      {/* <SunbirdPlayer identifier="do_214210683521646592110" /> */}
    </Box>
  );
};

export default Demo;
