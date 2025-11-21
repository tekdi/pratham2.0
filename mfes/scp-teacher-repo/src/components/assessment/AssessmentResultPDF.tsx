import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import type { TextProps } from '@react-pdf/renderer';
import { AssessmentTrackingData, ScoreDetail } from './AnswerSheet';
import { regularFont, boldFont } from '../../utils/unicodeFonts';

// Register Unicode font for Devanagari (Marathi/Hindi) support
// Using Base64 encoded fonts to avoid URL/path resolution issues in MFE environment
try {
  Font.register({
    family: 'UnicodeFont',
    fonts: [
      {
        src: regularFont,
        fontWeight: 'normal',
      },
      {
        src: boldFont,
        fontWeight: 'bold',
      },
    ],
  });
} catch (error) {
  console.warn('Font registration failed:', error);
}

// Helper function to detect if text contains Devanagari characters
const containsDevanagari = (text: string): boolean => {
  return /[\u0900-\u097F]/.test(text);
};

type TextStyleType = NonNullable<TextProps['style']>;

const renderWordWrappedText = (
  content: string,
  baseStyle: TextStyleType,
  unicodeStyle: TextStyleType
) => {
  const segments = content.split(/(\s+)/); // keep spaces
  return (
    <Text>
      {segments.map((segment, index) => {
        if (!segment) return null;
        const isWhitespace = /^\s+$/.test(segment);
        if (isWhitespace) {
          return <Text key={`space-${index}`}>{segment}</Text>;
        }
        const hasDevanagari = containsDevanagari(segment);
        return (
          <Text
            key={`word-${index}`}
            style={hasDevanagari ? unicodeStyle : baseStyle}
            wrap={false}
          >
            {segment}
          </Text>
        );
      })}
    </Text>
  );
};

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 8,
    color: '#333333',
    lineHeight: 1.3,
  },
  header: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #E0E0E0',
    paddingBottom: 3,
  },
  headerLeft: {
    flexDirection: 'column',
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A8825', // Primary green
    marginBottom: 2,
    fontFamily: 'Helvetica',
  },
  subtitle: {
    fontSize: 9,
    color: '#666666',
    fontFamily: 'Helvetica',
    marginTop:3
  },
  userInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 4,
    border: '1px solid #E5E7EB',
  },
  userInfoColumn: {
    flexDirection: 'column',
    gap: 4,
  },
  infoText: {
    fontSize: 7,
    marginBottom: 1,
    color: '#4B5563',
    fontFamily: 'Helvetica',
  },
  infoValue: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#111827',
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 1,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
    paddingBottom: 1,
    borderBottom: '1px solid #E5E7EB',
    fontFamily: 'Helvetica',
  },
  questionContainer: {
    marginBottom: 2,
    paddingBottom: 4,
    borderBottom: '1px solid #F3F4F6',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  questionText: {
    fontSize: 8.5,
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
  },
  questionTextUnicode: {
    fontSize: 8.5,
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
    fontFamily: 'UnicodeFont',
    fontWeight: 'bold',
  },
  scoreBadge: {
    paddingVertical: 1,
    paddingHorizontal: 4,
    borderRadius: 4,
    fontSize: 7,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    minWidth: 28,
    textAlign: 'center',
  },
  scoreBadgePass: { backgroundColor: '#D1FAE5', color: '#059669' },
  scoreBadgePartial: { backgroundColor: '#FEF3C7', color: '#D97706' },
  scoreBadgeFail: { backgroundColor: '#FEE2E2', color: '#DC2626' },
  
  contentBox: {
    marginTop: 2,
    padding: 4,
    backgroundColor: '#F9FAFB',
    borderRadius: 4,
    borderLeft: '2px solid #D1D5DB',
  },
  answerLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 1,
    textTransform: 'uppercase',
    fontFamily: 'Helvetica',
  },
  answerText: {
    fontSize: 8,
    color: '#374151',
    fontFamily: 'Helvetica',
  },
  answerTextUnicode: {
    fontSize: 8,
    color: '#374151',
    fontFamily: 'UnicodeFont',
  },
  explanationBox: {
    marginTop: 3,
    padding: 4,
    backgroundColor: '#EFF6FF',
    borderRadius: 4,
    borderLeft: '2px solid #3B82F6',
  },
  explanationLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 1,
    textTransform: 'uppercase',
    fontFamily: 'Helvetica',
  },
  explanationText: {
    fontSize: 8,
    color: '#1E40AF',
    fontFamily: 'Helvetica',
  },
  explanationTextUnicode: {
    fontSize: 8,
    color: '#1E40AF',
    fontFamily: 'UnicodeFont',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    borderTop: '1px solid #E5E7EB',
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 7,
    color: '#9CA3AF',
    fontFamily: 'Helvetica',
  },
});

// Helper function to strip HTML tags
const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

// Helper function to parse response value
const parseResValue = (resValue: string): { response: string; aiSuggestion: string } => {
  try {
    const parsed = JSON.parse(resValue);

    if (Array.isArray(parsed)) {
      const selectedItem =
        parsed.find((item: any) => item.selected === true) || parsed[0];

      if (selectedItem) {
        let response = '';
        if (selectedItem.label !== undefined && selectedItem.label !== null) {
          if (Array.isArray(selectedItem.label)) {
            response = selectedItem.label
              .map((l: any) =>
                typeof l === 'string' ? l.replace(/<[^>]*>/g, '').trim() : String(l)
              )
              .join(', ');
          } else if (typeof selectedItem.label === 'string') {
            response = selectedItem.label.replace(/<[^>]*>/g, '').trim();
          } else {
            response = String(selectedItem.label);
          }
        } else if (
          selectedItem.value !== undefined &&
          selectedItem.value !== null &&
          selectedItem.value !== ''
        ) {
          response = Array.isArray(selectedItem.value)
            ? selectedItem.value.join(', ')
            : String(selectedItem.value).trim();
        } else {
          response = 'No response available';
        }

        return {
          response: response || 'No response available',
          aiSuggestion:
            selectedItem.AI_suggestion ||
            selectedItem.aiSuggestion ||
            selectedItem.explanation ||
            '',
        };
      }
    }

    return {
      response: (() => {
        if (parsed.label !== undefined && parsed.label !== null) {
          if (Array.isArray(parsed.label)) {
            return parsed.label
              .map((l: any) =>
                typeof l === 'string' ? l.replace(/<[^>]*>/g, '').trim() : String(l)
              )
              .join(', ');
          }
          if (typeof parsed.label === 'string') {
            return parsed.label.replace(/<[^>]*>/g, '').trim();
          }
          return String(parsed.label);
        }
        if (parsed.response) return parsed.response;
        if (parsed.answer) return parsed.answer;
        if (parsed.value !== undefined) {
          return Array.isArray(parsed.value)
            ? parsed.value.join(', ')
            : String(parsed.value);
        }
        return 'No response available';
      })(),
      aiSuggestion:
        parsed.AI_suggestion ||
        parsed.aiSuggestion ||
        parsed.explanation ||
        '',
    };
  } catch {
    return {
      response: resValue || 'No response available',
      aiSuggestion: '',
    };
  }
};

export interface AssessmentResultPDFProps {
  assessmentTrackingData: AssessmentTrackingData;
  userName: string;
  assessmentName: string;
  questionNumberingMap?: Record<string, string>;
  sectionMapping?: Record<string, string>;
  titleOverride?: string;
}

const AssessmentResultPDF: React.FC<AssessmentResultPDFProps> = ({
  assessmentTrackingData,
  userName,
  assessmentName,
  questionNumberingMap = {},
  sectionMapping = {},
  titleOverride,
}) => {

  const percentage = assessmentTrackingData.totalMaxScore > 0
    ? Math.min(Math.round((assessmentTrackingData.totalScore / assessmentTrackingData.totalMaxScore) * 100), 100)
    : 0;

  // Group questions by section
  const groupedQuestions: Record<string, ScoreDetail[]> = {};
  assessmentTrackingData.score_details.forEach((question) => {
    const sectionName = question.questionId
      ? sectionMapping[question.questionId] || 'Unknown Section'
      : 'Unknown Section';

    if (!groupedQuestions[sectionName]) {
      groupedQuestions[sectionName] = [];
    }

    groupedQuestions[sectionName].push(question);
  });

  // Format section names
  const formatSectionName = (name: string): string => {
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

    return name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Get score style based on pass status and score
  const getScoreStyle = (question: ScoreDetail) => {
    if (question.pass.toLowerCase() === 'yes') {
      if (question.score === question.maxScore) {
        return [styles.scoreBadge, styles.scoreBadgePass];
      }
      return [styles.scoreBadge, styles.scoreBadgePartial];
    }
    return [styles.scoreBadge, styles.scoreBadgeFail];
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* <Text style={styles.title}>
              {titleOverride || 'AI Assessment Report'}
            </Text> */}
            <Text style={styles.subtitle}>{assessmentName}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.infoText}>Date</Text>
            <Text style={styles.infoValue}>
              {new Date(assessmentTrackingData.lastAttemptedOn).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* User Information & Score */}
        <View style={styles.userInfoContainer}>
          <View style={styles.userInfoColumn}>
            <Text style={styles.infoText}>Student Name</Text>
            <Text style={styles.infoValue}>{userName}</Text>
          </View>
          <View style={styles.userInfoColumn}>
            <Text style={styles.infoText}>Total Score</Text>
            <Text style={styles.infoValue}>
              {assessmentTrackingData.totalScore} / {assessmentTrackingData.totalMaxScore}
            </Text>
          </View>
          <View style={styles.userInfoColumn}>
            <Text style={styles.infoText}>Percentage</Text>
            <Text style={styles.infoValue}>{percentage}%</Text>
          </View>
        </View>

        {/* Questions by Section */}
        {Object.entries(groupedQuestions).map(([sectionName, questions]) => (
          <View key={sectionName} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {formatSectionName(sectionName)}
            </Text>

            {questions.map((question, index) => {
              const parsedResponse = parseResValue(question.resValue);
              const questionNumber = question.questionId && questionNumberingMap[question.questionId]
                ? questionNumberingMap[question.questionId]
                : `Q${index + 1}`;

              const questionTitle = stripHtmlTags(question.queTitle);
              const hasDevanagariInQuestion = containsDevanagari(questionTitle);

              return (
                <View
                  key={`${question.questionId}-${index}`}
                  style={styles.questionContainer}
                  wrap={false}
                >
                  <View style={styles.questionHeader}>
                    <Text style={hasDevanagariInQuestion ? styles.questionTextUnicode : styles.questionText}>
                      {questionNumber}. {questionTitle}
                    </Text>
                    <Text style={getScoreStyle(question)}>
                      {question.score}/{question.maxScore}
                    </Text>
                  </View>

                  {/* Answer */}
                  {parsedResponse.response &&
                    parsedResponse.response !== 'No response available' && (
                      <View style={styles.contentBox}>
                        <Text style={styles.answerLabel}>Student Answer</Text>
                        {renderWordWrappedText(
                          parsedResponse.response,
                          styles.answerText,
                          styles.answerTextUnicode
                        )}
                      </View>
                    )}

                  {/* AI Suggestion */}
                  {parsedResponse.aiSuggestion && (
                    <View style={styles.explanationBox}>
                      <Text style={styles.explanationLabel}>AI Explanation</Text>
                      {renderWordWrappedText(
                        parsedResponse.aiSuggestion,
                        styles.explanationText,
                        styles.explanationTextUnicode
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Generated on {new Date().toLocaleDateString()}
          </Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => (
            `Page ${pageNumber} of ${totalPages}`
          )} />
        </View>
      </Page>
    </Document>
  );
};

export default AssessmentResultPDF;

