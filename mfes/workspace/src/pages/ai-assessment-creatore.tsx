import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  FormGroup,
  Switch,
  FormControlLabel,
  Snackbar,
  Backdrop,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Close as CloseIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  Check as CheckIcon,
  Share as ShareIcon,
  Assignment as AssignmentIcon,
  QuestionAnswer as QuestionAnswerIcon,
  AutoAwesome as AutoAwesomeIcon,
  Publish as PublishIcon,
  Radio as RadioIcon,
  CompareArrows as CompareArrowsIcon,
  SpaceBar as SpaceBarIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import Layout from '../components/Layout';

interface Question {
  id: string;
  type:
    | 'multiple-choice'
    | 'true-false'
    | 'short-answer'
    | 'essay'
    | 'matching'
    | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  duration: number;
  totalPoints: number;
  questions: Question[];
  settings: {
    shuffleQuestions: boolean;
    showResults: boolean;
    timeLimit: boolean;
    allowRetake: boolean;
    passingScore: number;
  };
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const AIAssessmentCreator: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState('create');
  const [activeStep, setActiveStep] = useState(0);
  const [assessment, setAssessment] = useState<Assessment>({
    id: '',
    title: '',
    description: '',
    subject: '',
    grade: '',
    duration: 60,
    totalPoints: 100,
    questions: [],
    settings: {
      shuffleQuestions: false,
      showResults: true,
      timeLimit: true,
      allowRetake: false,
      passingScore: 70,
    },
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');

  const steps = [
    'Assessment List',
    'Assessment Metadata',
    'Questions Settings',
  ];

  const subjects = [
    'Mathematics',
    'Science',
    'English',
    'History',
    'Geography',
    'Computer Science',
    'Physics',
    'Chemistry',
    'Biology',
    'Literature',
  ];

  const grades = [
    'Kindergarten',
    'Grade 1',
    'Grade 2',
    'Grade 3',
    'Grade 4',
    'Grade 5',
    'Grade 6',
    'Grade 7',
    'Grade 8',
    'Grade 9',
    'Grade 10',
    'Grade 11',
    'Grade 12',
  ];

  // Mock data for table
  const mockAssessments = [
    {
      id: '1',
      title: 'Math Fundamentals Quiz',
      subject: 'Mathematics',
      grade: 'Grade 5',
      questions: 15,
      status: 'published',
      createdAt: '2024-01-15',
      totalPoints: 100,
    },
    {
      id: '2',
      title: 'Science Basics Assessment',
      subject: 'Science',
      grade: 'Grade 6',
      questions: 20,
      status: 'draft',
      createdAt: '2024-01-20',
      totalPoints: 150,
    },
    {
      id: '3',
      title: 'English Grammar Test',
      subject: 'English',
      grade: 'Grade 4',
      questions: 12,
      status: 'published',
      createdAt: '2024-01-18',
      totalPoints: 80,
    },
  ];

  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice', icon: <RadioIcon /> },
    { value: 'true-false', label: 'True/False', icon: <CheckIcon /> },
    {
      value: 'short-answer',
      label: 'Short Answer',
      icon: <QuestionAnswerIcon />,
    },
    { value: 'essay', label: 'Essay', icon: <AssignmentIcon /> },
    { value: 'matching', label: 'Matching', icon: <CompareArrowsIcon /> },
    { value: 'fill-blank', label: 'Fill in the Blank', icon: <SpaceBarIcon /> },
  ];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const generatedQuestions: Question[] = [
        {
          id: '1',
          type: 'multiple-choice',
          question: 'What is the capital of France?',
          options: ['London', 'Berlin', 'Paris', 'Madrid'],
          correctAnswer: 'Paris',
          points: 10,
          difficulty: 'easy',
          category: 'Geography',
          tags: ['capitals', 'europe'],
        },
        {
          id: '2',
          type: 'true-false',
          question: 'The Earth is the third planet from the Sun.',
          correctAnswer: 'true',
          points: 5,
          difficulty: 'easy',
          category: 'Science',
          tags: ['solar-system', 'planets'],
        },
        {
          id: '3',
          type: 'short-answer',
          question: 'Explain the process of photosynthesis.',
          points: 15,
          difficulty: 'medium',
          category: 'Biology',
          tags: ['photosynthesis', 'plants'],
        },
      ];

      setAssessment((prev) => ({
        ...prev,
        questions: generatedQuestions,
        totalPoints: generatedQuestions.reduce((sum, q) => sum + q.points, 0),
      }));

      setSnackbar({
        open: true,
        message: 'Questions generated successfully!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to generate questions. Please try again.',
        severity: 'error',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    setSnackbar({
      open: true,
      message: 'Assessment saved successfully!',
      severity: 'success',
    });
  };

  const handlePublish = () => {
    setAssessment((prev) => ({ ...prev, status: 'published' }));
    setSnackbar({
      open: true,
      message: 'Assessment published successfully!',
      severity: 'success',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Consistent date formatting function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Assessment List
            </Typography>

            {/* Filters */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Search Assessments"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        label="Status"
                      >
                        <MenuItem value="all">All Status</MenuItem>
                        <MenuItem value="draft">Draft</MenuItem>
                        <MenuItem value="published">Published</MenuItem>
                        <MenuItem value="archived">Archived</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Subject</InputLabel>
                      <Select
                        value={subjectFilter}
                        onChange={(e) => setSubjectFilter(e.target.value)}
                        label="Subject"
                      >
                        <MenuItem value="all">All Subjects</MenuItem>
                        {subjects.map((subject) => (
                          <MenuItem key={subject} value={subject}>
                            {subject}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<AddIcon />}
                      onClick={() => setActiveStep(1)}
                    >
                      Create New
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Table */}
            <Card>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Grade</TableCell>
                      <TableCell>Questions</TableCell>
                      <TableCell>Points</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockAssessments
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.title}</TableCell>
                          <TableCell>{row.subject}</TableCell>
                          <TableCell>{row.grade}</TableCell>
                          <TableCell>{row.questions}</TableCell>
                          <TableCell>{row.totalPoints}</TableCell>
                          <TableCell>
                            <Chip
                              label={row.status}
                              color={
                                row.status === 'published'
                                  ? 'success'
                                  : 'default'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{formatDate(row.createdAt)}</TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => setActiveStep(1)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton size="small">
                              <PreviewIcon />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={mockAssessments.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Assessment Metadata
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Assessment Title"
                  value={assessment.title}
                  onChange={(e) =>
                    setAssessment((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Subject</InputLabel>
                  <Select
                    value={assessment.subject}
                    onChange={(e) =>
                      setAssessment((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    label="Subject"
                  >
                    {subjects.map((subject) => (
                      <MenuItem key={subject} value={subject}>
                        {subject}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Grade Level</InputLabel>
                  <Select
                    value={assessment.grade}
                    onChange={(e) =>
                      setAssessment((prev) => ({
                        ...prev,
                        grade: e.target.value,
                      }))
                    }
                    label="Grade Level"
                  >
                    {grades.map((grade) => (
                      <MenuItem key={grade} value={grade}>
                        {grade}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Duration (minutes)"
                  type="number"
                  value={assessment.duration}
                  onChange={(e) =>
                    setAssessment((prev) => ({
                      ...prev,
                      duration: parseInt(e.target.value),
                    }))
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">min</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  value={assessment.description}
                  onChange={(e) =>
                    setAssessment((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe the assessment objectives and learning outcomes..."
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Questions Settings
            </Typography>

            {/* AI Generation Section */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <AutoAwesomeIcon sx={{ mr: 1, color: 'primary.main' }} />
                  AI-Powered Question Generation
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Configure AI parameters to generate relevant questions.
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Number of Questions"
                      type="number"
                      defaultValue={10}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            questions
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Difficulty Level</InputLabel>
                      <Select defaultValue="medium" label="Difficulty Level">
                        <MenuItem value="easy">Easy</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="hard">Hard</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Question Types</InputLabel>
                      <Select defaultValue="mixed" label="Question Types">
                        <MenuItem value="mixed">Mixed</MenuItem>
                        <MenuItem value="multiple-choice">
                          Multiple Choice
                        </MenuItem>
                        <MenuItem value="true-false">True/False</MenuItem>
                        <MenuItem value="short-answer">Short Answer</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleGenerateQuestions}
                      disabled={isGenerating}
                      startIcon={
                        isGenerating ? (
                          <CircularProgress size={20} />
                        ) : (
                          <AutoAwesomeIcon />
                        )
                      }
                    >
                      {isGenerating ? 'Generating...' : 'Generate'}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Assessment Settings */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Display Settings
                    </Typography>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={assessment.settings.shuffleQuestions}
                            onChange={(e) =>
                              setAssessment((prev) => ({
                                ...prev,
                                settings: {
                                  ...prev.settings,
                                  shuffleQuestions: e.target.checked,
                                },
                              }))
                            }
                          />
                        }
                        label="Shuffle Questions"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={assessment.settings.showResults}
                            onChange={(e) =>
                              setAssessment((prev) => ({
                                ...prev,
                                settings: {
                                  ...prev.settings,
                                  showResults: e.target.checked,
                                },
                              }))
                            }
                          />
                        }
                        label="Show Results Immediately"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={assessment.settings.timeLimit}
                            onChange={(e) =>
                              setAssessment((prev) => ({
                                ...prev,
                                settings: {
                                  ...prev.settings,
                                  timeLimit: e.target.checked,
                                },
                              }))
                            }
                          />
                        }
                        label="Enable Time Limit"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={assessment.settings.allowRetake}
                            onChange={(e) =>
                              setAssessment((prev) => ({
                                ...prev,
                                settings: {
                                  ...prev.settings,
                                  allowRetake: e.target.checked,
                                },
                              }))
                            }
                          />
                        }
                        label="Allow Retake"
                      />
                    </FormGroup>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Scoring Settings
                    </Typography>
                    <TextField
                      fullWidth
                      label="Passing Score (%)"
                      type="number"
                      value={assessment.settings.passingScore}
                      onChange={(e) =>
                        setAssessment((prev) => ({
                          ...prev,
                          settings: {
                            ...prev.settings,
                            passingScore: parseInt(e.target.value),
                          },
                        }))
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Students must score at least{' '}
                      {assessment.settings.passingScore}% to pass this
                      assessment.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Generated Questions Preview */}
            {assessment.questions.length > 0 && (
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Generated Questions ({assessment.questions.length})
                  </Typography>
                  <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {assessment.questions.map((question, index) => (
                      <Box
                        key={question.id}
                        sx={{
                          mb: 2,
                          p: 2,
                          border: '1px solid #e0e0e0',
                          borderRadius: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 1,
                          }}
                        >
                          <Typography variant="subtitle2">
                            Question {index + 1}
                          </Typography>
                          <Box>
                            <Chip
                              label={question.type}
                              size="small"
                              sx={{ mr: 1 }}
                            />
                            <Chip
                              label={`${question.points} pts`}
                              size="small"
                              color="primary"
                            />
                          </Box>
                        </Box>
                        <Typography variant="body2">
                          {question.question}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Layout selectedKey={selectedKey} onSelect={setSelectedKey}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Header */}
        <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 3 }}>
          <Typography variant="h4" gutterBottom>
            <AutoAwesomeIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            AI Assessment Creator
          </Typography>
          <Typography variant="body1">
            Create and manage assessments powered by artificial intelligence
          </Typography>
        </Box>

        {/* Stepper */}
        <Box sx={{ p: 3, bgcolor: 'white' }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Card>{renderStepContent(activeStep)}</Card>

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<KeyboardArrowLeftIcon />}
            >
              Back
            </Button>
            <Box>
              <Button
                variant="outlined"
                onClick={handleSave}
                startIcon={<SaveIcon />}
                sx={{ mr: 1 }}
              >
                Save Draft
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={activeStep === steps.length - 1}
                endIcon={<KeyboardArrowRightIcon />}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Loading Backdrop */}
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isGenerating}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <CircularProgress color="inherit" />
            <Typography sx={{ mt: 2 }}>
              Generating questions with AI...
            </Typography>
          </Box>
        </Backdrop>
      </Box>
    </Layout>
  );
};

export default AIAssessmentCreator;
