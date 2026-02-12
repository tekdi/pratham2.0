import { v4 as uuidv4 } from 'uuid';
import { post, patch } from './RestClient';
import {
  getLocalStoredUserId,
  getLocalStoredUserName,
} from './LocalStorageService';
import {
  ParsedQuestionSet,
  ParsedSection,
  ParsedQuestion,
} from '@workspace/utils/bulkImportValidation';

export interface ImportProgress {
  currentQuestionSet: number;
  totalQuestionSets: number;
  currentStep: 'creating' | 'sections' | 'questions' | 'review' | 'done' | 'error';
  currentQuestionSetName: string;
  questionsProcessed: number;
  totalQuestions: number;
  errors: ImportError[];
  completedIds: string[];
}

export interface ImportError {
  questionSetName: string;
  step: string;
  message: string;
}

type ProgressCallback = (progress: ImportProgress) => void;

function buildMCQQuestionBody(
  question: ParsedQuestion,
  qs: ParsedQuestionSet,
  userId: string,
  userName: string
) {
  const answerIndex = question.ansOption - 1;

  const optionsHtml = question.options
    .filter((o) => o.text)
    .map((o, i) => ({
      body: `<p>${o.text}</p>`,
      value: i,
    }));

  const correctOption = optionsHtml[answerIndex];

  const editorState: any = {
    question: `<p>${question.question}</p>`,
    options: optionsHtml.map((o) => ({
      body: o.body,
      value: o.value,
    })),
    answer: answerIndex,
  };

  const interactionOptions = optionsHtml.map((o) => ({
    label: o.body,
    value: o.value,
  }));

  const body = `<div class='question-body' tabindex='-1'><div class='mcq-title' tabindex='0'><p>${question.question}</p></div><div data-choice-interaction='response1' class='mcq-vertical'></div></div>`;

  const answer = correctOption
    ? `<div class='answer-container'><div class='answer-body'><p>${correctOption.body}</p></div></div>`
    : '';

  return {
    mimeType: 'application/vnd.sunbird.question',
    media: [],
    editorState,
    templateId: 'mcq-vertical',
    maxScore: question.maxScore,
    name: question.question.substring(0, 100),
    responseDeclaration: {
      response1: {
        cardinality: 'single',
        type: 'integer',
        correctResponse: {
          value: answerIndex,
        },
        mapping: [
          {
            value: answerIndex,
            score: question.maxScore,
          },
        ],
      },
    },
    outcomeDeclaration: {
      maxScore: {
        cardinality: 'single',
        type: 'integer',
        defaultValue: question.maxScore,
      },
    },
    interactionTypes: ['choice'],
    interactions: {
      response1: {
        type: 'choice',
        options: interactionOptions,
        validation: {
          required: 'Yes',
        },
      },
    },
    qType: 'MCQ',
    primaryCategory: 'Multiple Choice Question',
    body,
    answer,
    solutions: {},
    createdBy: userId,
    subject: [qs.subject],
    domain: qs.domain,
    subDomain: qs.subDomain ? [qs.subDomain] : [],
    program: qs.program ? [qs.program] : [],
    author: userName,
    channel: 'pos-channel',
    framework: 'pos-framework',
    license: 'CC BY 4.0',
    visibility: 'Parent',
  };
}

export async function bulkImportQuestionSets(
  questionSets: ParsedQuestionSet[],
  frameworkId: string,
  onProgress: ProgressCallback
): Promise<ImportProgress> {
  const userId = getLocalStoredUserId() || '';
  const userName = getLocalStoredUserName() || '';

  const progress: ImportProgress = {
    currentQuestionSet: 0,
    totalQuestionSets: questionSets.length,
    currentStep: 'creating',
    currentQuestionSetName: '',
    questionsProcessed: 0,
    totalQuestions: questionSets.reduce(
      (acc, qs) =>
        acc + qs.sections.reduce((a, s) => a + s.questions.length, 0),
      0
    ),
    errors: [],
    completedIds: [],
  };

  for (let qsIndex = 0; qsIndex < questionSets.length; qsIndex++) {
    const qs = questionSets[qsIndex];
    progress.currentQuestionSet = qsIndex + 1;
    progress.currentQuestionSetName = qs.testName;
    progress.currentStep = 'creating';
    onProgress({ ...progress });

    try {
      // Step 1: Create QuestionSet
      const createResponse = await createQuestionSetAPI(
        frameworkId,
        qs.testName,
        userId
      );
      const questionSetId =
        createResponse?.result?.identifier;

      if (!questionSetId) {
        progress.errors.push({
          questionSetName: qs.testName,
          step: 'create',
          message: 'Failed to create question set - no identifier returned',
        });
        continue;
      }

      // Step 2: Add sections to QuestionSet
      progress.currentStep = 'sections';
      onProgress({ ...progress });

      const sectionIds: string[] = [];
      const nodesModified: any = {};
      const hierarchy: any = {};

      // Calculate total maxScore as sum of all question scores
      const totalMaxScore = qs.sections.reduce(
        (acc, section) =>
          acc + section.questions.reduce((a, q) => a + q.maxScore, 0),
        0
      );

      // Root node
      nodesModified[questionSetId] = {
        root: true,
        objectType: 'QuestionSet',
        metadata: {
          appIcon: '',
          name: qs.testName,
          subject: [qs.subject],
          showTimer: false,
          requiresSubmit: 'No',
          author: userName,
          primaryCategory: 'Practice Question Set',
          attributions: [],
          timeLimits: { questionSet: { max: 3600, min: 0 } },
          description: qs.description || qs.testName,
          domain: qs.domain,
          subDomain: qs.subDomain ? [qs.subDomain] : [],
          contentLanguage: qs.language,
          assessmentType: qs.assessmentType || 'Mock Test',
          outcomeDeclaration: {
            maxScore: {
              cardinality: 'single',
              type: 'integer',
              defaultValue: totalMaxScore,
            },
          },
        },
        isNew: false,
      };

      // Add program if available
      if (qs.program) {
        nodesModified[questionSetId].metadata.program = [qs.program];
      }

      const sectionChildrenIds: string[] = [];

      for (const section of qs.sections) {
        const sectionId = uuidv4();
        sectionIds.push(sectionId);
        sectionChildrenIds.push(sectionId);

        nodesModified[sectionId] = {
          root: false,
          objectType: 'QuestionSet',
          metadata: {
            mimeType: 'application/vnd.sunbird.questionset',
            code: sectionId,
            name: section.name,
            visibility: 'Parent',
            primaryCategory: 'Practice Question Set',
            shuffle: false,
            showFeedback: false,
            showSolutions: false,
            attributions: [],
            timeLimits: { questionSet: { max: 0, min: 0 } },
            description: section.name,
          },
          isNew: true,
        };
      }

      hierarchy[questionSetId] = {
        name: qs.testName,
        children: sectionChildrenIds,
        root: true,
      };

      for (const sectionId of sectionChildrenIds) {
        hierarchy[sectionId] = {
          name: nodesModified[sectionId].metadata.name,
          children: [],
          root: false,
        };
      }

      // Update hierarchy with sections
      await updateHierarchyAPI(
        questionSetId,
        nodesModified,
        hierarchy,
        userId
      );

      // Step 3: Read hierarchy to get real section identifiers
      // After updating, we get the real section IDs back
      // We need to add questions to each section
      progress.currentStep = 'questions';
      onProgress({ ...progress });

      // We need to re-read the hierarchy to get actual section IDs
      const hierarchyResponse = await readHierarchyAPI(questionSetId);
      const children = hierarchyResponse?.result?.questionset?.children || hierarchyResponse?.result?.questionSet?.children || [];

      // Map section names to actual IDs
      const sectionIdMap = new Map<string, string>();
      for (const child of children) {
        sectionIdMap.set(child.name, child.identifier);
      }

      // Step 4: Add questions to each section
      for (let sIndex = 0; sIndex < qs.sections.length; sIndex++) {
        const section = qs.sections[sIndex];
        const realSectionId = sectionIdMap.get(section.name);

        if (!realSectionId) {
          progress.errors.push({
            questionSetName: qs.testName,
            step: 'questions',
            message: `Could not find section ID for "${section.name}"`,
          });
          continue;
        }

        // Add questions in batches to avoid overloading
        const BATCH_SIZE = 5;
        for (
          let batchStart = 0;
          batchStart < section.questions.length;
          batchStart += BATCH_SIZE
        ) {
          const batch = section.questions.slice(
            batchStart,
            batchStart + BATCH_SIZE
          );

          const questionNodesModified: any = {};
          const questionIds: string[] = [];

          for (const question of batch) {
            const questionTempId = uuidv4();
            questionIds.push(questionTempId);

            questionNodesModified[questionTempId] = {
              metadata: buildMCQQuestionBody(question, qs, userId, userName),
              objectType: 'Question',
              root: false,
              isNew: true,
            };
          }

          // Get existing children for this section
          const existingSectionChildren =
            children.find((c: any) => c.identifier === realSectionId)
              ?.children?.map((c: any) => c.identifier) || [];

          const questionHierarchy: any = {
            [questionSetId]: {
              name: qs.testName,
              children: Array.from(sectionIdMap.values()),
              root: true,
            },
          };

          // Add all sections to hierarchy
          for (const [sName, sId] of sectionIdMap.entries()) {
            if (sId === realSectionId) {
              questionHierarchy[sId] = {
                name: sName,
                children: [...existingSectionChildren, ...questionIds],
                root: false,
              };
            } else {
              const otherChildren =
                children.find((c: any) => c.identifier === sId)
                  ?.children?.map((c: any) => c.identifier) || [];
              questionHierarchy[sId] = {
                name: sName,
                children: otherChildren,
                root: false,
              };
            }
          }

          try {
            await updateHierarchyAPI(
              questionSetId,
              questionNodesModified,
              questionHierarchy,
              userId
            );

            // Refresh hierarchy data after adding questions
            const refreshed = await readHierarchyAPI(questionSetId);
            const refreshedChildren = refreshed?.result?.questionset?.children || refreshed?.result?.questionSet?.children || [];

            // Update the section children data for subsequent batches
            for (const child of refreshedChildren) {
              const existingIdx = children.findIndex(
                (c: any) => c.identifier === child.identifier
              );
              if (existingIdx >= 0) {
                children[existingIdx] = child;
              }
            }
          } catch (err: any) {
            progress.errors.push({
              questionSetName: qs.testName,
              step: 'questions',
              message: `Failed to add questions batch to section "${section.name}": ${err?.message || 'Unknown error'}`,
            });
          }

          progress.questionsProcessed += batch.length;
          onProgress({ ...progress });
        }
      }

      // Step 5: Send for review
      progress.currentStep = 'review';
      onProgress({ ...progress });

      try {
        await sendForReviewAPI(questionSetId);
        progress.completedIds.push(questionSetId);
      } catch (err: any) {
        progress.errors.push({
          questionSetName: qs.testName,
          step: 'review',
          message: `Failed to send for review: ${err?.message || 'Unknown error'}`,
        });
        // Still consider it partially completed
        progress.completedIds.push(questionSetId);
      }
    } catch (err: any) {
      progress.errors.push({
        questionSetName: qs.testName,
        step: progress.currentStep,
        message: err?.message || 'Unknown error occurred',
      });
    }
  }

  progress.currentStep = 'done';
  onProgress({ ...progress });
  return progress;
}

async function createQuestionSetAPI(
  frameworkId: string,
  name: string,
  userId: string
) {
  const apiURL = '/action/questionset/v2/create';
  const reqBody = {
    request: {
      questionset: {
        name,
        mimeType: 'application/vnd.sunbird.questionset',
        primaryCategory: 'Practice Question Set',
        code: uuidv4(),
        createdBy: userId,
        framework: frameworkId,
      },
    },
  };

  const response = await post(apiURL, reqBody);
  return response?.data;
}

async function updateHierarchyAPI(
  questionSetId: string,
  nodesModified: any,
  hierarchy: any,
  userId: string
) {
  const apiURL = '/mfe_workspace/action/questionset/v2/hierarchy/update';
  const reqBody = {
    request: {
      data: {
        nodesModified,
        hierarchy,
        lastUpdatedBy: userId,
      },
    },
  };

  const response = await patch(apiURL, reqBody, {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-Channel-Id': 'pos-channel',
  });
  return response?.data;
}

async function readHierarchyAPI(questionSetId: string) {
  const apiURL = `/action/questionset/v2/hierarchy/${questionSetId}?mode=edit`;

  const { get } = await import('./RestClient');
  const response = await get(apiURL);
  return response?.data;
}

async function sendForReviewAPI(questionSetId: string) {
  const apiURL = `/mfe_workspace/action/questionset/v2/review/${questionSetId}`;
  const reqBody = {
    request: {
      questionset: {},
    },
  };

  const response = await post(apiURL, reqBody, {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Channel-Id': 'pos-channel',
  });
  return response?.data;
}
