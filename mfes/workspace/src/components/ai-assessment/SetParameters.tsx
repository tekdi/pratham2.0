import React from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Slider,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Grid,
} from '@mui/material';
import { FilterForm } from 'libs/shared-lib-v2/src/lib/Filter/FilterForm';

const poppinsFont = {
  fontFamily: 'Poppins',
};

interface SetParametersProps {
  onBack: () => void;
}

const difficultyLevels = ['Easy', 'Medium', 'Hard'];
const questionTypes = [
  'MCQ',
  'Fill in the blanks',
  'Short Answer',
  'Long Answer',
];
const questionDistributions = [
  'Knowledge',
  'Inference',
  'Understanding',
  'Application',
];

const SetParameters: React.FC<SetParametersProps> = ({ onBack }) => {
  const [assessmentTitle, setAssessmentTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [difficulty, setDifficulty] = React.useState('Medium');
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>([]);
  const [selectedDistributions, setSelectedDistributions] = React.useState<
    string[]
  >([]);

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Card sx={{ borderRadius: 2, boxShadow: 3, p: 3 }}>
          <Typography
            sx={{ ...poppinsFont, fontWeight: 500, fontSize: 14, mb: 2 }}
          >
            Assessment Information
          </Typography>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Assessment Title *"
                required
                fullWidth
                value={assessmentTitle}
                onChange={(e) => setAssessmentTitle(e.target.value)}
                InputLabelProps={{ style: { fontFamily: 'Poppins' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Description/Instructions (Optional)"
                multiline
                minRows={3}
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                InputLabelProps={{ style: { fontFamily: 'Poppins' } }}
              />
            </Grid>
          </Grid>
          <FilterForm
            orginalFormData={{}}
            isShowStaticFilterValue={true}
            onlyFields={[
              'program',
              'se_domains',
              'se_subDomains',
              'se_subjects',
              'primaryUser',
              'language',
              'ageGroup',
              'statu',
              'board',
            ]}
            staticFilter={{
              se_subjects: ['English'],
            }}
            _config={{
              _box: { sx: { flexDirection: 'row', flexWrap: 'wrap', gap: 2 } },
              inputType: {
                program: 'dropdown',
                se_domains: 'dropdown',
                se_subDomains: 'dropdown',
                se_subjects: 'dropdown',
                primaryUser: 'dropdown',
                language: 'dropdown',
                ageGroup: 'dropdown',
                statu: 'dropdown',
                board: 'dropdown',
              },
            }}
          />
        </Card>
        <Card sx={{ borderRadius: 2, boxShadow: 3, p: 3 }}>
          <Typography
            sx={{ ...poppinsFont, fontWeight: 500, fontSize: 14, mb: 2 }}
          >
            Question Setting
          </Typography>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="difficulty-label">Difficulty Level</InputLabel>
                <Select
                  labelId="difficulty-label"
                  value={difficulty}
                  label="Difficulty Level"
                  onChange={(e) => setDifficulty(e.target.value as string)}
                  input={<OutlinedInput label="Difficulty Level" />}
                >
                  {difficultyLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="question-type-label">Question Type</InputLabel>
                <Select
                  labelId="question-type-label"
                  multiple
                  value={selectedTypes}
                  onChange={(e) =>
                    setSelectedTypes(
                      typeof e.target.value === 'string'
                        ? e.target.value.split(',')
                        : (e.target.value as string[])
                    )
                  }
                  input={<OutlinedInput label="Question Type" />}
                  renderValue={(selected) => (selected as string[]).join(', ')}
                >
                  {questionTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      <Checkbox checked={selectedTypes.indexOf(type) > -1} />
                      <ListItemText primary={type} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} md={6}>
              <Typography
                sx={{
                  ...poppinsFont,
                  fontWeight: 400,
                  fontSize: 14,
                  color: '#4D4639',
                  mb: 1,
                }}
              >
                No. of MCQ's : 2
              </Typography>
              <Slider
                defaultValue={2}
                min={0}
                max={10}
                sx={{ color: '#FDBE16' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                sx={{
                  ...poppinsFont,
                  fontWeight: 400,
                  fontSize: 14,
                  color: '#4D4639',
                  mb: 1,
                }}
              >
                No. of Fill in the blanks: 2
              </Typography>
              <Slider
                defaultValue={2}
                min={0}
                max={10}
                sx={{ color: '#FDBE16' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                sx={{
                  ...poppinsFont,
                  fontWeight: 400,
                  fontSize: 14,
                  color: '#4D4639',
                  mb: 1,
                }}
              >
                No. of Short Answer Questions : 2
              </Typography>
              <Slider
                defaultValue={2}
                min={0}
                max={10}
                sx={{ color: '#FDBE16' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                sx={{
                  ...poppinsFont,
                  fontWeight: 400,
                  fontSize: 14,
                  color: '#4D4639',
                  mb: 1,
                }}
              >
                No. of Long Answer Questions : 2
              </Typography>
              <Slider
                defaultValue={2}
                min={0}
                max={10}
                sx={{ color: '#FDBE16' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="question-distribution-label">
                  Question Distribution
                </InputLabel>
                <Select
                  labelId="question-distribution-label"
                  multiple
                  value={selectedDistributions}
                  onChange={(e) =>
                    setSelectedDistributions(
                      typeof e.target.value === 'string'
                        ? e.target.value.split(',')
                        : (e.target.value as string[])
                    )
                  }
                  input={<OutlinedInput label="Question Distribution" />}
                  renderValue={(selected) => (selected as string[]).join(', ')}
                >
                  {questionDistributions.map((dist) => (
                    <MenuItem key={dist} value={dist}>
                      <Checkbox
                        checked={selectedDistributions.indexOf(dist) > -1}
                      />
                      <ListItemText primary={dist} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Card>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          sx={{
            borderRadius: 100,
            px: 4,
            py: 1,
            fontWeight: 500,
            ...poppinsFont,
          }}
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          variant="contained"
          sx={{
            borderRadius: 100,
            px: 4,
            py: 1,
            fontWeight: 500,
            bgcolor: '#FDBE16',
            color: '#1E1B16',
            ...poppinsFont,
          }}
        >
          Next: Review Questionnaire
        </Button>
      </Box>
    </Box>
  );
};

export default SetParameters;
