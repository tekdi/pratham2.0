import React, { useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Types and Interfaces
export interface ScoreDetail {
  questionId: string | null;
  pass: string;
  sectionId: string;
  resValue: string;
  duration: number;
  score: number;
  maxScore: number;
  queTitle: string;
}

export interface AssessmentTrackingData {
  assessmentTrackingId: string;
  userId: string;
  courseId: string;
  contentId: string;
  attemptId: string;
  createdOn: string;
  lastAttemptedOn: string;
  totalMaxScore: number;
  totalScore: number;
  updatedOn: string;
  timeSpent: string;
  unitId: string;
  score_details: ScoreDetail[];
}

export interface ParsedResponse {
  response: string;
  aiSuggestion: string;
}

export interface AnswerSheetProps {
  assessmentTrackingData: AssessmentTrackingData;
  onApprove: () => void;
  onScoreEdit: (question: ScoreDetail) => void;
  expandedPanel: string | false;
  onAccordionChange: (
    panel: string
  ) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
  isApproved?: boolean;
  questionNumberingMap?: Record<string, string>;
  sectionMapping?: Record<string, string>;
}

// Utility function to parse response values
const parseResValue = (resValue: string): ParsedResponse => {
  try {
    const parsed = JSON.parse(resValue);

    // Handle array format like: [{"label":"<p>4</p>","value":0,"selected":true,"AI_suggestion":""}]
    if (Array.isArray(parsed)) {
      const selectedItem =
        parsed.find((item) => item.selected === true) || parsed[0];

      if (selectedItem) {
        // Extract response from different possible fields
        let response = '';

        // Always prioritize label over value for display
        if (selectedItem.label) {
          // Remove HTML tags from label
          response = selectedItem.label.replace(/<[^>]*>/g, '').trim();
        } else if (
          selectedItem.value !== undefined &&
          selectedItem.value !== null &&
          selectedItem.value !== ''
        ) {
          response = String(selectedItem.value).trim();
        } else {
          response = 'No response available';
        }

        return {
          response: response || 'No response available',
          aiSuggestion:
            selectedItem.AI_suggestion ||
            selectedItem.aiSuggestion ||
            selectedItem.explanation ||
            'No AI suggestion available',
        };
      }
    }

    // Handle object format (fallback for backward compatibility)
    return {
      response:
        parsed.response ||
        parsed.answer ||
        parsed.label ||
        parsed.value ||
        'No response available',
      aiSuggestion:
        parsed.AI_suggestion ||
        parsed.aiSuggestion ||
        parsed.explanation ||
        'No AI suggestion available',
    };
  } catch (error) {
    // If JSON parsing fails, treat as plain text
    return {
      response: resValue || 'No response available',
      aiSuggestion: 'No AI suggestion available',
    };
  }
};

// Score Badge Component
interface ScoreBadgeProps {
  score: number;
  maxScore: number;
  pass: string;
  onClick: () => void;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = React.memo(
  ({ score, maxScore, pass, onClick }) => {
    const scoreColor = useMemo(() => {
      if (pass.toLowerCase() === 'yes') {
        return score === maxScore ? '#1A8825' : '#987100';
      }
      return '#BA1A1A';
    }, [pass, score, maxScore]);

    return (
      <Box
        onClick={onClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          bgcolor: scoreColor,
          borderRadius: '4px',
          border: '1px solid #FFFFFF',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            opacity: 0.8,
            transform: 'scale(1.02)',
          },
          mb: 2,
        }}
      >
        <Typography
          sx={{
            color: '#FFFFFF',

            fontSize: '14px',
            fontWeight: 400,
            letterSpacing: '1.79%',
          }}
        >
          {score}/{maxScore}
        </Typography>
        <BorderColorIcon
          sx={{
            color: '#FFFFFF',
            fontSize: 15,
          }}
        />
      </Box>
    );
  }
);

ScoreBadge.displayName = 'ScoreBadge';

// AI Suggestion Accordion Component
interface AISuggestionAccordionProps {
  aiSuggestion: string;
  isExpanded: boolean;
  onToggle: (event: React.SyntheticEvent, isExpanded: boolean) => void;
}

const AISuggestionAccordion: React.FC<AISuggestionAccordionProps> = React.memo(
  ({ aiSuggestion, isExpanded, onToggle }) => {
    if (
      !aiSuggestion ||
      aiSuggestion === 'No AI suggestion available' ||
      aiSuggestion.trim() === ''
    ) {
      return null;
    }

    return (
      <Accordion
        expanded={isExpanded}
        onChange={onToggle}
        sx={{
          backgroundColor: '#FFF5F5',
          boxShadow: 'none',
          borderRadius: '8px',
          border: '1px solid #D0C5B4',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: 0,
          },
        }}
      >
        <AccordionSummary
          expandIcon={<KeyboardArrowDownIcon sx={{ color: '#666666' }} />}
          sx={{
            padding: '6px 8px',
            minHeight: 'unset',
            '&.Mui-expanded': {
              minHeight: 'auto',
            },
            '& .MuiAccordionSummary-content': {
              margin: 0,
              '&.Mui-expanded': {
                margin: '0px 0',
              },
            },
          }}
        >
          <Typography
            sx={{
              color: '#7C766F',
              fontSize: { xs: '14px', md: '16px' },
              fontWeight: 500,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            Explanation:
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: '0px 8px 8px 8px' }}>
          <Typography
            sx={{
              color: '#1F1B13',
              fontSize: { xs: '14px', md: '16px' },
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            {aiSuggestion}
          </Typography>
        </AccordionDetails>
      </Accordion>
    );
  }
);

AISuggestionAccordion.displayName = 'AISuggestionAccordion';

// Question Item Component
interface QuestionItemProps {
  question: ScoreDetail;
  index: number;
  isExpanded: boolean;
  onScoreClick: () => void;
  onAccordionToggle: (event: React.SyntheticEvent, isExpanded: boolean) => void;
  isApproved: boolean;
  questionNumberingMap?: Record<string, string>;
}

const QuestionItem: React.FC<QuestionItemProps> = React.memo(
  ({
    question,
    index,
    isExpanded,
    onScoreClick,
    onAccordionToggle,
    isApproved,
    questionNumberingMap = {},
  }) => {
    const parsedResponse = useMemo(() => {
      const result = parseResValue(question.resValue);
      console.log('Parsed response for question:', question.questionId, result);
      return result;
    }, [question.resValue, question.questionId]);

    // Response box styling based on score
    const responseBoxStyle = useMemo(() => {
      if (question.pass.toLowerCase() === 'yes') {
        if (question.score === question.maxScore) {
          // Full marks - green
          return {
            backgroundColor: '#D2E3D6',
            color: '#1A8825',
          };
        } else {
          // Partial marks - yellow
          return {
            backgroundColor: '#EFE3C0',
            color: '#987100',
          };
        }
      } else {
        // No marks - red
        return {
          backgroundColor: '#E8D2D2',
          color: '#BA1A1A',
        };
      }
    }, [question.pass, question.score, question.maxScore]);

    return (
      <Box
        sx={{
          width: '100%',
          gap: '8px',
          display: 'flex',
          flexDirection: 'column',
          mt: '16px',
        }}
      >
        {/* Question and Score Row */}
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '1.79%',
                color: '#1F1B13',
              }}
            >
              {question.questionId && questionNumberingMap[question.questionId]
                ? `${questionNumberingMap[question.questionId]}. ${
                    question.queTitle
                  }`
                : `Q${index + 1}. ${question.queTitle}`}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              bgcolor: responseBoxStyle.color,
              borderRadius: '4px',
              border: '1px solid #FFFFFF',
              cursor: isApproved ? 'default' : 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': !isApproved
                ? {
                    opacity: 0.8,
                    transform: 'scale(1.02)',
                  }
                : {},
            }}
            onClick={onScoreClick}
          >
            <Typography
              sx={{
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 400,
                letterSpacing: '1.79%',
              }}
            >
              {question.score}/{question.maxScore}
            </Typography>
            {!isApproved && (
              <BorderColorIcon
                sx={{
                  color: '#FFFFFF',
                  fontSize: 15,
                }}
              />
            )}
          </Box>
        </Box>

        {/* Response Box */}
        <Box
          sx={{
            width: '100%',
            padding: '6px 8px',
            borderRadius: '4px',
            backgroundColor: responseBoxStyle.backgroundColor,
            mb: '4px',
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '24px',
              letterSpacing: '0.94%',
              color: responseBoxStyle.color,
            }}
          >
            {parsedResponse.response}
          </Typography>
        </Box>

        {/* AI Suggestion */}
        <AISuggestionAccordion
          aiSuggestion={parsedResponse.aiSuggestion}
          isExpanded={isExpanded}
          onToggle={onAccordionToggle}
        />
      </Box>
    );
  }
);

QuestionItem.displayName = 'QuestionItem';

// Score Summary Component
interface ScoreSummaryProps {
  totalScore: number;
  totalMaxScore: number;
}

const ScoreSummary: React.FC<ScoreSummaryProps> = React.memo(
  ({ totalScore, totalMaxScore }) => {
    const percentage = useMemo(() => {
      return totalMaxScore > 0
        ? Math.min(Math.round((totalScore / totalMaxScore) * 100), 100)
        : 0;
    }, [totalScore, totalMaxScore]);

    return (
      <Typography
        sx={{
          fontWeight: 500,
          fontSize: '14px',
          lineHeight: '20px',
          letterSpacing: '0.71%',
          color: '#1F1B13',
          mb: '16px',
          mx: '16px',
        }}
      >
        Marks:{' '}
        <span style={{ color: '#1A8825' }}>
          {totalScore || 0}/{totalMaxScore || 0} ({percentage}%)
        </span>
      </Typography>
    );
  }
);

ScoreSummary.displayName = 'ScoreSummary';

// Approve Button Component
interface ApproveButtonProps {
  onApprove: () => void;
  isApproved: boolean;
}

const ApproveButton: React.FC<ApproveButtonProps> = React.memo(
  ({ onApprove, isApproved }) => {
    if (isApproved) return null;

    return (
      <Box sx={{ px: '16px', mb: '16px' }}>
        <Button
          variant="contained"
          fullWidth
          onClick={onApprove}
          sx={{
            bgcolor: '#FDBE16',
            color: '#4D4639',

            textTransform: 'none',
            borderRadius: '100px',
            height: '40px',
            fontSize: '14px',
            fontWeight: 500,
            letterSpacing: '0.71%',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              bgcolor: '#FDBE16',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(253, 190, 22, 0.3)',
            },
          }}
        >
          Approve Marks & Notify Learner
        </Button>
      </Box>
    );
  }
);

ApproveButton.displayName = 'ApproveButton';

// Questions List Component
interface QuestionsListProps {
  scoreDetails: ScoreDetail[];
  expandedPanel: string | false;
  onAccordionChange: (
    panel: string
  ) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
  onScoreEdit: (question: ScoreDetail) => void;
  isApproved: boolean;
  questionNumberingMap?: Record<string, string>;
  sectionMapping?: Record<string, string>;
}

const QuestionsList: React.FC<QuestionsListProps> = React.memo(
  ({
    scoreDetails,
    expandedPanel,
    onAccordionChange,
    onScoreEdit,
    isApproved,
    questionNumberingMap = {},
    sectionMapping = {},
  }) => {
    const handleScoreClick = useCallback(
      (question: ScoreDetail) => {
        if (!isApproved) {
          onScoreEdit(question);
        }
      },
      [onScoreEdit, isApproved]
    );

    // Function to format section names
    const formatSectionName = (name: string): string => {
      // Handle common patterns
      const nameMap: Record<string, string> = {
        fill_in_the_blanks: 'Fill in the Blanks',
        mcq: 'Multiple Choice Questions',
        short: 'Short Answer Questions',
        long: 'Long Answer Questions',
      };

      const lowerName = name.toLowerCase();
      const mappedName = nameMap[lowerName];
      if (mappedName) {
        return mappedName;
      }

      // Default formatting: replace underscores and capitalize
      return name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    };

    // Group questions by section
    const groupedQuestions = useMemo(() => {
      const groups: Record<string, ScoreDetail[]> = {};

      scoreDetails.forEach((question) => {
        const sectionName = question.questionId
          ? sectionMapping[question.questionId] || 'Unknown Section'
          : 'Unknown Section';

        if (!groups[sectionName]) {
          groups[sectionName] = [];
        }

        groups[sectionName].push(question);
      });

      return groups;
    }, [scoreDetails, sectionMapping]);

    return (
      <Box sx={{ px: '16px' }}>
        <Box
          sx={{
            bgcolor: '#F8EFE7',
            border: '1px solid #D0C5B4',
            borderRadius: '16px',
            width: '100%',
            padding: '16px',
            mb: '20px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {Object.entries(groupedQuestions).map(
              ([sectionName, questions]) => (
                <Box key={sectionName} sx={{ mb: '24px' }}>
                  {/* Section Header */}
                  <Box
                    sx={{
                      // backgroundColor: '#F0F0F0',
                      borderRadius: '8px',
                      // p: '12px 16px',
                      mb: '16px',
                      mt: '24px',
                      '&:first-of-type': {
                        mt: '0px',
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: '18px',
                        lineHeight: '24px',
                        color: '#1F1B13',
                        textTransform: 'capitalize',
                      }}
                    >
                      {formatSectionName(sectionName)}
                    </Typography>
                  </Box>

                  {/* Questions in this section */}
                  {questions.map((question, index) => (
                    <QuestionItem
                      key={`${question.questionId}-${index}`}
                      question={question}
                      index={index}
                      isExpanded={
                        expandedPanel === `panel-${question.questionId}`
                      }
                      onScoreClick={() => handleScoreClick(question)}
                      onAccordionToggle={onAccordionChange(
                        `panel-${question.questionId}`
                      )}
                      isApproved={isApproved}
                      questionNumberingMap={questionNumberingMap}
                    />
                  ))}
                </Box>
              )
            )}
          </Box>
        </Box>
      </Box>
    );
  }
);

QuestionsList.displayName = 'QuestionsList';

// Empty State Component
const EmptyState: React.FC = React.memo(() => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography
        sx={{
          color: '#666666',

          fontSize: '16px',
          fontWeight: 500,
        }}
      >
        No assessment data available
      </Typography>
      <Typography
        sx={{
          color: '#999999',

          fontSize: '14px',
          textAlign: 'center',
        }}
      >
        Please check if the assessment has been completed and try again.
      </Typography>
    </Box>
  );
});

EmptyState.displayName = 'EmptyState';

// Main AnswerSheet Component
const AnswerSheet: React.FC<AnswerSheetProps> = ({
  assessmentTrackingData,
  onApprove,
  onScoreEdit,
  expandedPanel,
  onAccordionChange,
  isApproved = false,
  questionNumberingMap = {},
  sectionMapping = {},
}) => {
  // Early return for empty state
  if (
    !assessmentTrackingData ||
    !assessmentTrackingData.score_details?.length
  ) {
    return <EmptyState />;
  }

  return (
    <Box>
      {/* Score Summary */}
      <ScoreSummary
        totalScore={assessmentTrackingData.totalScore}
        totalMaxScore={assessmentTrackingData.totalMaxScore}
      />

      {/* Approve Button */}
      <ApproveButton onApprove={onApprove} isApproved={isApproved} />

      {/* Questions List */}
      <QuestionsList
        scoreDetails={assessmentTrackingData.score_details}
        expandedPanel={expandedPanel}
        onAccordionChange={onAccordionChange}
        onScoreEdit={onScoreEdit}
        isApproved={isApproved}
        questionNumberingMap={questionNumberingMap}
        sectionMapping={sectionMapping}
      />
    </Box>
  );
};

export default AnswerSheet;
