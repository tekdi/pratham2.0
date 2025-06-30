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
import useTenantConfig from '@workspace/hooks/useTenantConfig';
import ConfirmationDialog from './ConfirmationDialog';

const poppinsFont = {
  fontFamily: 'Poppins',
};

interface SetParametersProps {
  onlyFields?: any;
  inputType?: any;
  staticFilter?: any;
  formState?: any;
  onNext: (parameters: any) => void;
  onBack?: () => void;
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

const SetParameters: React.FC<SetParametersProps> = ({
  staticFilter,
  formState: formStateProps,
  onlyFields,
  inputType,
  onNext,
  onBack,
}) => {
  const [formState, setFormState] = React.useState({
    mcqCount: 0,
    fillInTheBlanksCount: 0,
    shortAnswerCount: 0,
    longAnswerCount: 0,
    ...formStateProps,
    ...staticFilter,
  });
  const [errors, setErrors] = React.useState<any>({});
  const tenantConfig = useTenantConfig();
  const [showConfirm, setShowConfirm] = React.useState(false);

  // Handler for FilterForm changes (local only)
  const handleFilterChange = (newFilter: any) => {
    setFormState((prev: any) => ({ ...prev, ...newFilter }));
    setErrors((prev: any) => ({
      ...prev,
      ...Object.keys(newFilter).reduce(
        (acc, key) => ({ ...acc, [key]: undefined }),
        {}
      ),
    }));
  };

  // If filter is updated from parent, update local formState
  React.useEffect(() => {
    if (onlyFields && onlyFields.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      setFormState((prev: any) => ({
        ...prev,
      }));
    }
  }, [onlyFields]);

  // Validation function
  const validate = () => {
    const newErrors: any = {};
    if (!formState.assessmentTitle || formState.assessmentTitle.trim() === '') {
      newErrors.assessmentTitle = 'Assessment Title is required';
    }
    if (!formState.assessmentType || formState.assessmentType.trim() === '') {
      newErrors.assessmentType = 'Assessment Type is required';
    }
    if (
      !formState.difficulty_level ||
      formState.difficulty_level.trim() === ''
    ) {
      newErrors.difficulty_level = 'Difficulty Level is required';
    }
    if (
      !formState.selectedTypes ||
      !Array.isArray(formState.selectedTypes) ||
      formState.selectedTypes.length === 0
    ) {
      newErrors.selectedTypes = 'At least one Question Type is required';
    }
    if (
      !formState.selectedDistributions ||
      !Array.isArray(formState.selectedDistributions) ||
      formState.selectedDistributions.length === 0
    ) {
      newErrors.selectedDistributions =
        'At least one Question Distribution is required';
    }
    // Validate at least one question count is >= 1
    if (
      (formState.mcqCount || 0) < 1 &&
      (formState.fillInTheBlanksCount || 0) < 1 &&
      (formState.shortAnswerCount || 0) < 1 &&
      (formState.longAnswerCount || 0) < 1
    ) {
      newErrors.questionCount =
        'At least one question type must have at least 1 question.';
    }
    // Validate FilterForm fields if onlyFields is provided
    if (onlyFields && Array.isArray(onlyFields)) {
      onlyFields.forEach((field: string) => {
        if (
          !formState[field] ||
          (typeof formState[field] === 'string' &&
            formState[field].trim() === '')
        ) {
          newErrors[field] = `${field.replace(/([A-Z])/g, ' $1')} is required`;
        }
      });
    }
    return newErrors;
  };

  // Helper to build metadata and questionsDetails
  const handleNext = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    // Build metadata from assessment info and all formState fields (no filter)
    const {
      assessmentTitle,
      description,
      assessmentType,
      selectedTypes,
      selectedDistributions,
      content,
      difficulty_level,
      mcqCount,
      fillInTheBlanksCount,
      shortAnswerCount,
      longAnswerCount,
      ...otherFields
    } = formState;
    const metadata = {
      name: assessmentTitle,
      description,
      assessmentType,
      ...otherFields,
    };
    const typeMap: Record<string, string> = {
      MCQ: 'MCQ',
      'Fill in the blanks': 'fill_in_the_blanks',
      'Short Answer': 'short',
      'Long Answer': 'long',
    };
    const typeCountMap: Record<string, number> = {
      MCQ: mcqCount,
      'Fill in the blanks': fillInTheBlanksCount,
      'Short Answer': shortAnswerCount,
      'Long Answer': longAnswerCount,
    };
    const questionsDetails = selectedTypes.map((type: string) => ({
      type: typeMap[type] || type,
      no: typeCountMap[type] || 0,
    }));
    onNext({
      difficulty_level,
      question_types: selectedTypes,
      metadata,
      questionsDetails,
      content,
    });
  };

  return (
    <Box p={3}>
      <Typography
        sx={{
          ...poppinsFont,
          fontWeight: 400,
          fontSize: 16,
          color: '#7C766F',
          mb: 2,
        }}
      >
        Set parameters for your assessment questions
      </Typography>
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
                sx={{ mb: 2 }}
                label="Assessment Title"
                required
                fullWidth
                value={formState?.assessmentTitle || ''}
                onChange={(e) =>
                  setFormState((prev: any) => ({
                    ...prev,
                    assessmentTitle: e.target.value,
                  }))
                }
                error={!!errors.assessmentTitle}
                helperText={errors.assessmentTitle}
                InputLabelProps={{ style: { fontFamily: 'Poppins' } }}
              />
              {tenantConfig?.COLLECTION_FRAMEWORK && (
                <FilterForm
                  orginalFormData={formState}
                  isShowStaticFilterValue={true}
                  onlyFields={onlyFields}
                  staticFilter={staticFilter}
                  _config={{
                    COLLECTION_FRAMEWORK: tenantConfig?.COLLECTION_FRAMEWORK,
                    CHANNEL_ID: tenantConfig?.CHANNEL_ID,
                    inputType: inputType,
                    _loader: { _loader: { minHeight: 100 } },
                  }}
                  onApply={handleFilterChange}
                  errors={errors}
                  required={
                    onlyFields && Array.isArray(onlyFields)
                      ? Object.fromEntries(
                          onlyFields.map((f: string) => [f, true])
                        )
                      : {}
                  }
                />
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                sx={{ mb: 2 }}
                label="Description/Instructions (Optional)"
                multiline
                minRows={4}
                fullWidth
                value={formState?.description || ''}
                onChange={(e) =>
                  setFormState((prev: any) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                InputLabelProps={{ style: { fontFamily: 'Poppins' } }}
              />
              <FormControl
                required={true}
                fullWidth
                sx={{ mb: 2 }}
                error={!!errors.assessmentType}
              >
                <InputLabel id="assessment-type-label">
                  Assessment Type
                </InputLabel>
                <Select
                  labelId="assessment-type-label"
                  value={formState?.assessmentType || ''}
                  label="Assessment Type"
                  onChange={(e) =>
                    setFormState((prev: any) => ({
                      ...prev,
                      assessmentType: e.target.value as string,
                    }))
                  }
                  input={<OutlinedInput label="Assessment Type" />}
                >
                  <MenuItem value="Pre Test">Pre Test</MenuItem>
                  <MenuItem value="Post Test">Post Test</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
                {errors.assessmentType && (
                  <Typography color="error" variant="caption">
                    {errors.assessmentType}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </Card>
        <Card sx={{ borderRadius: 2, boxShadow: 3, p: 3 }}>
          <Typography
            sx={{ ...poppinsFont, fontWeight: 500, fontSize: 14, mb: 2 }}
          >
            Question Setting
          </Typography>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.difficulty_level} required>
                <InputLabel id="difficulty_level-label">
                  Difficulty Level
                </InputLabel>
                <Select
                  labelId="difficulty_level-label"
                  value={formState?.difficulty_level || ''}
                  label="Difficulty Level"
                  onChange={(e) =>
                    setFormState((prev: any) => ({
                      ...prev,
                      difficulty_level: e.target.value as string,
                    }))
                  }
                  input={<OutlinedInput label="Difficulty Level" />}
                >
                  {difficultyLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
                {errors.difficulty_level && (
                  <Typography color="error" variant="caption">
                    {errors.difficulty_level}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.selectedTypes} required>
                <InputLabel id="question-type-label">Question Type</InputLabel>
                <Select
                  labelId="question-type-label"
                  multiple
                  value={formState?.selectedTypes || []}
                  onChange={(e) =>
                    setFormState((prev: any) => ({
                      ...prev,
                      selectedTypes:
                        typeof e.target.value === 'string'
                          ? e.target.value.split(',')
                          : (e.target.value as string[]),
                    }))
                  }
                  input={<OutlinedInput label="Question Type" />}
                  renderValue={(selected) => (selected as string[]).join(', ')}
                >
                  {questionTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      <Checkbox
                        checked={formState?.selectedTypes?.indexOf(type) > -1}
                      />
                      <ListItemText primary={type} />
                    </MenuItem>
                  ))}
                </Select>
                {errors.selectedTypes && (
                  <Typography color="error" variant="caption">
                    {errors.selectedTypes}
                  </Typography>
                )}
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
                No. of MCQ's : {formState.mcqCount}
              </Typography>
              <Slider
                value={formState.mcqCount}
                min={0}
                max={10}
                sx={{ color: '#FDBE16' }}
                onChange={(_, value) =>
                  setFormState((prev: any) => ({
                    ...prev,
                    mcqCount: value,
                  }))
                }
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
                No. of Fill in the blanks: {formState.fillInTheBlanksCount}
              </Typography>
              <Slider
                value={formState.fillInTheBlanksCount}
                min={0}
                max={10}
                sx={{ color: '#FDBE16' }}
                onChange={(_, value) =>
                  setFormState((prev: any) => ({
                    ...prev,
                    fillInTheBlanksCount: value,
                  }))
                }
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
                No. of Short Answer Questions : {formState.shortAnswerCount}
              </Typography>
              <Slider
                value={formState.shortAnswerCount}
                min={0}
                max={10}
                sx={{ color: '#FDBE16' }}
                onChange={(_, value) =>
                  setFormState((prev: any) => ({
                    ...prev,
                    shortAnswerCount: value,
                  }))
                }
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
                No. of Long Answer Questions : {formState.longAnswerCount}
              </Typography>
              <Slider
                value={formState.longAnswerCount}
                min={0}
                max={10}
                sx={{ color: '#FDBE16' }}
                onChange={(_, value) =>
                  setFormState((prev: any) => ({
                    ...prev,
                    longAnswerCount: value,
                  }))
                }
              />
            </Grid>
            {/* Show error if questionCount validation fails */}
            {errors.questionCount && (
              <Grid item xs={12}>
                <Typography color="error" variant="caption">
                  {errors.questionCount}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                error={!!errors.selectedDistributions}
                required
              >
                <InputLabel id="question-distribution-label">
                  Question Distribution
                </InputLabel>
                <Select
                  labelId="question-distribution-label"
                  multiple
                  value={formState?.selectedDistributions || []}
                  onChange={(e) =>
                    setFormState((prev: any) => ({
                      ...prev,
                      selectedDistributions:
                        typeof e.target.value === 'string'
                          ? e.target.value.split(',')
                          : (e.target.value as string[]),
                    }))
                  }
                  input={<OutlinedInput label="Question Distribution" />}
                  renderValue={(selected) => (selected as string[]).join(', ')}
                >
                  {questionDistributions.map((dist) => (
                    <MenuItem key={dist} value={dist}>
                      <Checkbox
                        checked={
                          formState?.selectedDistributions?.indexOf(dist) > -1
                        }
                      />
                      <ListItemText primary={dist} />
                    </MenuItem>
                  ))}
                </Select>
                {errors.selectedDistributions && (
                  <Typography color="error" variant="caption">
                    {errors.selectedDistributions}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </Card>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        {onBack && (
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
        )}
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
          onClick={handleNext}
        >
          Next: Initiate Question Generation
        </Button>
      </Box>
      <ConfirmationDialog
        open={showConfirm}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />
    </Box>
  );
};

export default SetParameters;
