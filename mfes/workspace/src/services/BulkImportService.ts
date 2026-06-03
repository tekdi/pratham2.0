// ============================================================
// BULK IMPORT SERVICE
// Pratham 2.0 — Workspace MFE
// Handles all API calls required for bulk content/QS/course creation
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { get, post, patch } from './RestClient';
import { getLocalStoredUserId } from './LocalStorageService';
import {
  ContentCreatePayload,
  QuestionSetCreatePayload,
  HierarchyUpdatePayload,
  FrameworkId,
} from '../types/bulkImport.types';

// ─── MIME TYPE MAP ────────────────────────────────────────────

export const FILE_MIME_MAP: Record<string, string> = {
  pdf: 'application/pdf',
  zip: 'application/zip',
  mp4: 'video/mp4',
  h5p: 'application/vnd.ekstep.h5p-archive',
};

export const QUESTIONSET_MIME = 'application/vnd.sunbird.questionset';
export const COURSE_MIME = 'application/vnd.ekstep.content-collection';

// ─── FRAMEWORK HELPER ─────────────────────────────────────────

export const getFrameworkFromStorage = (): FrameworkId => {
  if (typeof window === 'undefined') return 'pos-framework';
  const fw = localStorage.getItem('collectionFramework');
  return fw === 'scp-framework' ? 'scp-framework' : 'pos-framework';
};

export const getChannelId = (): string => {
  if (typeof window === 'undefined') return '';
  try {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    return (
      userData?.tenantData?.[0]?.tenantId ||
      localStorage.getItem('channelId') ||
      'scp-channel'
    );
  } catch {
    return 'scp-channel';
  }
};

// ─── CONTENT APIs ─────────────────────────────────────────────

/**
 * Create a content metadata node via POST /action/content/v3/create
 */
export const createContentNode = async (
  payload: Omit<ContentCreatePayload, 'createdBy' | 'code'>
): Promise<string> => {
  const userId = getLocalStoredUserId();
  const channelId = getChannelId();

  const reqBody = {
    request: {
      content: {
        code: uuidv4(),
        createdBy: userId,
        createdFor: [channelId],
        channel: channelId,
        ...payload,
      },
    },
  };

  const response = await post('/action/content/v3/create', reqBody);
  const identifier: string = response?.data?.result?.identifier;
  if (!identifier) throw new Error('Content creation failed: no identifier returned');
  return identifier;
};

/**
 * Get a signed upload URL for a content file
 * POST /action/content/v3/upload/url/{contentId}
 */
export const getContentUploadUrl = async (
  contentId: string,
  fileName: string
): Promise<{ preSignedUrl: string; contentId: string }> => {
  const response = await post(`/action/content/v3/upload/url/${contentId}`, {
    request: {
      content: { fileName },
    },
  });

  const result = response?.data?.result;
  if (!result?.pre_signed_url) throw new Error('Failed to get upload URL');

  return {
    preSignedUrl: result.pre_signed_url,
    contentId: result.identifier || contentId,
  };
};

/**
 * Upload a file buffer to the pre-signed S3 URL
 */
export const uploadFileToPresignedUrl = async (
  presignedUrl: string,
  fileBuffer: ArrayBuffer,
  mimeType: string
): Promise<void> => {
  await axios.put(presignedUrl, fileBuffer, {
    headers: { 'Content-Type': mimeType },
  });
};

/**
 * Associate the uploaded file with the content node
 * POST /action/content/v3/upload/{contentId}  (multipart or JSON)
 */
export const associateUploadedFile = async (
  contentId: string,
  fileUrl: string,
  mimeType: string
): Promise<void> => {
  // Sunbird requires the current versionKey in every update call.
  // Fetch it first via content read, then include it in the PATCH.
  const contentData = await readContent(contentId);
  const versionKey: string | undefined = contentData?.versionKey;
  if (!versionKey) throw new Error(`Could not retrieve versionKey for content ${contentId}`);

  await patch(`/action/content/v3/update/${contentId}`, {
    request: {
      content: {
        versionKey,
        artifactUrl: fileUrl,
        mimeType,
      },
    },
  });
};

/**
 * Submit content for review
 * POST /action/content/v3/review/{contentId}
 */
export const submitContentForReview = async (contentId: string): Promise<void> => {
  await post(`/action/content/v3/review/${contentId}`, {
    request: {
      content: {
        lastUpdatedBy: getLocalStoredUserId(),
      },
    },
  });
};

/**
 * Read content node to verify status
 * GET /action/content/v3/read/{contentId}
 */
export const readContent = async (contentId: string): Promise<any> => {
  const response = await get(`/action/content/v3/read/${contentId}`);
  return response?.data?.result?.content;
};

// ─── QUESTION SET APIs ────────────────────────────────────────

/**
 * Create a QuestionSet skeleton
 * POST /action/questionset/v2/create
 */
export const createQuestionSetNode = async (
  payload: Omit<QuestionSetCreatePayload, 'createdBy' | 'code'>
): Promise<string> => {
  const userId = getLocalStoredUserId();
  const channelId = getChannelId();

  const reqBody = {
    request: {
      questionset: {
        code: uuidv4(),
        mimeType: QUESTIONSET_MIME,
        createdBy: userId,
        channel: channelId,
        ...payload,
      },
    },
  };

  const response = await post('/action/questionset/v2/create', reqBody);
  const identifier: string = response?.data?.result?.identifier;
  if (!identifier) throw new Error('QuestionSet creation failed: no identifier returned');
  return identifier;
};

/**
 * Create a single MCQ / Arrange / Match / Subjective question
 * POST /action/question/v2/create
 */
export const createQuestion = async (
  questionPayload: Record<string, any>
): Promise<string> => {
  const userId = getLocalStoredUserId();
  const channelId = getChannelId();

  const reqBody = {
    request: {
      question: {
        code: uuidv4(),
        createdBy: userId,
        channel: channelId,
        ...questionPayload,
      },
    },
  };

  const response = await post('/action/question/v2/create', reqBody);
  const identifier: string = response?.data?.result?.identifier;
  if (!identifier) throw new Error('Question creation failed');
  return identifier;
};

/**
 * Update QuestionSet hierarchy (attach sections + questions)
 * PATCH /action/questionset/v2/hierarchy/update
 */
export const updateQuestionSetHierarchy = async (
  questionSetId: string,
  payload: HierarchyUpdatePayload
): Promise<void> => {
  const userId = getLocalStoredUserId();

  const reqBody = {
    request: {
      data: {
        lastUpdatedBy: userId,
        nodesModified: payload.nodesModified,
        hierarchy: payload.hierarchy,
      },
    },
  };

  await patch('/action/questionset/v2/hierarchy/update', reqBody, {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  });
};

// ─── COURSE APIs ──────────────────────────────────────────────

/**
 * Create a Course skeleton
 * POST /action/content/v3/create  (mimeType = collection)
 */
export const createCourseNode = async (
  payload: Record<string, any>
): Promise<string> => {
  const userId = getLocalStoredUserId();
  const channelId = getChannelId();
  const collectionFW = getFrameworkFromStorage();

  const reqBody = {
    request: {
      content: {
        code: uuidv4(),
        mimeType: COURSE_MIME,
        resourceType: 'Course',
        primaryCategory: 'Course',
        contentType: 'Course',
        createdBy: userId,
        createdFor: [channelId],
        channel: channelId,
        framework: 'pos-framework',      // content FW always pos-framework
        targetFWIds: [collectionFW],
        ...payload,
      },
    },
  };

  const response = await post('/action/content/v3/create', reqBody);
  const identifier: string = response?.data?.result?.identifier;
  if (!identifier) throw new Error('Course creation failed: no identifier returned');
  return identifier;
};

/**
 * Update Course hierarchy (attach content / questionsets)
 * PATCH /action/content/v3/hierarchy/update
 */
export const updateCourseHierarchy = async (
  courseId: string,
  nodesModified: Record<string, any>,
  hierarchy: Record<string, any>
): Promise<void> => {
  const userId = getLocalStoredUserId();

  const reqBody = {
    request: {
      data: {
        lastUpdatedBy: userId,
        nodesModified,
        hierarchy,
      },
    },
  };

  await patch('/action/content/v3/hierarchy/update', reqBody, {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  });
};

// ─── FORM READ APIs ────────────────────────────────────────────

/**
 * Read content creation form fields
 * POST /action/data/v1/form/read
 */
export const readContentFormFields = async (
  action: string,
  subType: string,
  framework: string
): Promise<any[]> => {
  const response = await post('/action/data/v1/form/read', {
    request: {
      action,
      subType,
      framework,
      rootOrgId: 'scp-channel',
      type: 'content',
      popup: true,
      editMode: true,
    },
  });
  return response?.data?.result?.form?.data?.fields || [];
};

/**
 * Read QuestionSet form via object category definition
 * POST /action/object/category/definition/v1/read
 */
export const readQuestionSetFormDefinition = async (
  framework: string
): Promise<any> => {
  const baseurl = process.env.NEXT_PUBLIC_MIDDLEWARE_URL || '';
  const response = await axios.post(
    `${baseurl}/action/object/category/definition/v1/read?fields=objectMetadata,forms,name,label`,
    {
      request: {
        objectCategoryDefinition: {
          objectType: 'QuestionSet',
          name: 'Practice Question Set',
          channel: getChannelId(),
        },
      },
    }
  );
  return response?.data?.result?.objectCategoryDefinition;
};

// ─── GOOGLE DRIVE DOWNLOAD PROXY ─────────────────────────────

/**
 * Download a Google Drive public file through our Next.js API proxy
 * to avoid CORS issues
 * Returns an ArrayBuffer
 */
export const downloadGoogleDriveFile = async (
  driveUrl: string
): Promise<{ buffer: ArrayBuffer; fileName: string; mimeType: string }> => {
  // API route lives in the host admin app (same domain, no basePath prefix needed)
  const response = await axios.post(
    `/api/bulk-import/download-drive-file`,
    { driveUrl },
    { responseType: 'arraybuffer', timeout: 120_000 }
  );

  const fileName =
    response.headers['x-file-name'] || 'uploaded_file';
  const mimeType =
    response.headers['content-type'] || 'application/octet-stream';

  return { buffer: response.data, fileName, mimeType };
};

// ─── VALIDATION HELPERS ────────────────────────────────────────

/**
 * Validate that a Google Drive URL is publicly accessible (HEAD check)
 */
export const validateDriveUrl = async (driveUrl: string): Promise<boolean> => {
  try {
    const directUrl = convertDriveToDirectUrl(driveUrl);
    const resp = await axios.head(directUrl, { timeout: 10_000 });
    return resp.status === 200;
  } catch {
    return false;
  }
};

/**
 * Convert a Google Drive share link to a direct download URL
 * Supports formats:
 *  - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *  - https://drive.google.com/open?id=FILE_ID
 *  - https://docs.google.com/...
 */
export const convertDriveToDirectUrl = (driveUrl: string): string => {
  // Pattern: /file/d/FILE_ID/
  const fileMatch = driveUrl.match(/\/file\/d\/([^/]+)/);
  if (fileMatch) {
    return `https://drive.google.com/uc?export=download&id=${fileMatch[1]}`;
  }
  // Pattern: ?id=FILE_ID
  const idMatch = driveUrl.match(/[?&]id=([^&]+)/);
  if (idMatch) {
    return `https://drive.google.com/uc?export=download&id=${idMatch[1]}`;
  }
  return driveUrl;
};

export const extractDriveFileId = (driveUrl: string): string | null => {
  const fileMatch = driveUrl.match(/\/file\/d\/([^/]+)/);
  if (fileMatch) return fileMatch[1];
  const idMatch = driveUrl.match(/[?&]id=([^&]+)/);
  if (idMatch) return idMatch[1];
  return null;
};
