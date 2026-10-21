// ============================================================
// BULK IMPORT SERVICE
// Pratham 2.0 — Workspace MFE
// Handles all API calls required for bulk content/QS/course creation
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { get, post, patch, delApi } from './RestClient';
import { getLocalStoredUserId } from './LocalStorageService';
import {
  ContentCreatePayload,
  QuestionSetCreatePayload,
  HierarchyUpdatePayload,
  FrameworkId,
} from '../types/bulkImport.types';

// ─── MIME TYPE MAP ────────────────────────────────────────────

export const FILE_MIME_MAP: Record<string, string> = {
  pdf:     'application/pdf',
  // Platform does not accept application/zip — uploaded zips are HTML5
  // content archives (extracted by the platform on upload/publish)
  zip:     'application/vnd.ekstep.html-archive',
  mp4:     'video/mp4',
  mp3:     'audio/mp3',
  h5p:     'application/vnd.ekstep.h5p-archive',
  youtube: 'video/x-youtube',  // URL set directly as artifactUrl — no file download needed
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
    const storedChannelId = localStorage.getItem('channelId');
    if (storedChannelId) return storedChannelId;

    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const selectedTenantId = localStorage.getItem('tenantId');
    const selectedTenant =
      userData?.tenantData?.find((tenant: any) => tenant?.tenantId === selectedTenantId) ||
      userData?.tenantData?.[0];
    return selectedTenant?.channelId || selectedTenant?.tenantId || 'scp-channel';
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
 * Upload an app icon image for a content/QS/course node.
 * Downloads the image from Google Drive, uploads it via the presigned URL
 * mechanism, and returns the permanent S3 URL to use as appIcon.
 */
export const uploadAppIconFromDrive = async (
  contentId: string,
  driveUrl: string
): Promise<string> => {
  // 1. Download image from Drive
  const { buffer, fileName, mimeType } = await downloadGoogleDriveFile(driveUrl);

  // 2. Get presigned upload URL (reuse the same content upload URL endpoint)
  const { preSignedUrl } = await getContentUploadUrl(contentId, fileName || 'icon.png');

  // 3. Upload image to S3
  await uploadFileToPresignedUrl(preSignedUrl, buffer, mimeType || 'image/png');

  // 4. Return the permanent S3 URL (strip query params)
  return preSignedUrl.split('?')[0];
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
 * Notify the platform that a file has been uploaded to S3 and trigger processing.
 * POST /action/content/v3/upload/{contentId}  (multipart/form-data with fileUrl field)
 *
 * This is the CORRECT way to hand off an already-uploaded S3 file to the platform.
 * The platform content service will:
 *   1. Download the file from the provided S3 URL
 *   2. Run mimeType-specific processing:
 *      - H5P  → extract archive, upload to content/h5p/{id}-latest/, set streamingUrl
 *      - ZIP  → extract and package for streaming
 *      - PDF/MP4 → copy to artifact/ path
 *   3. Set artifactUrl to the processed location and pkgVersion
 *
 * Do NOT use this for YouTube — use associateYouTubeUrl() instead.
 */
export const notifyContentUploaded = async (
  contentId: string,
  fileUrl: string,
): Promise<void> => {
  // Browser FormData — axios automatically sets Content-Type: multipart/form-data with boundary
  const formData = new FormData();
  formData.append('fileUrl', fileUrl);
  await post(`/action/content/v3/upload/${contentId}`, formData);
};

/**
 * For YouTube content: store the video URL as artifactUrl via PATCH.
 * YouTube does not go through the file-upload pipeline.
 */
export const associateYouTubeUrl = async (
  contentId: string,
  youtubeUrl: string,
  mimeType: string
): Promise<void> => {
  const contentData = await readContent(contentId);
  const versionKey: string | undefined = contentData?.versionKey;
  if (!versionKey) throw new Error(`Could not retrieve versionKey for content ${contentId}`);

  await patch(`/action/content/v3/update/${contentId}`, {
    request: {
      content: {
        versionKey,
        artifactUrl: youtubeUrl,
        mimeType,
      },
    },
  });
};

/**
 * @deprecated Use notifyContentUploaded() for files or associateYouTubeUrl() for YouTube.
 * Kept for backward-compat — routes to the correct implementation based on URL.
 */
export const associateUploadedFile = async (
  contentId: string,
  fileUrl: string,
  mimeType: string
): Promise<void> => {
  if (mimeType === 'video/x-youtube') {
    return associateYouTubeUrl(contentId, fileUrl, mimeType);
  }
  return notifyContentUploaded(contentId, fileUrl);
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
 * Publish content
 * POST /action/content/v3/publish/{contentId}
 *
 * This is the step that triggers the platform's processing pipeline:
 *   - H5P / ZIP → creates streamingUrl
 *   - Sets pkgVersion
 *   - Transitions status to "Live"
 *
 * Bulk import runs as an admin operation so we publish immediately after review.
 */
export const publishContent = async (contentId: string): Promise<void> => {
  await post(`/action/content/v3/publish/${contentId}`, {
    request: {
      content: {
        lastPublishedBy: getLocalStoredUserId(),
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
): Promise<Record<string, string>> => {
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

  const response = await patch('/action/questionset/v2/hierarchy/update', reqBody, {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  });

  // Maps client-generated ids of isNew nodes (section UUIDs) to the real
  // platform identifiers assigned during the update
  return (response as any)?.data?.result?.identifiers ?? {};
};

/**
 * Submit a QuestionSet for review
 * POST /action/questionset/v2/review/{identifier}
 *
 * Must run AFTER the hierarchy update, otherwise the QuestionSet is reviewed
 * while still empty and its questions never reach a reviewable state.
 */
export const reviewQuestionSet = async (questionSetId: string): Promise<void> => {
  await post(`/action/questionset/v2/review/${questionSetId}`, {
    request: {
      questionset: {
        lastUpdatedBy: getLocalStoredUserId(),
      },
    },
  });
};

/**
 * Publish a QuestionSet
 * POST /action/questionset/v2/publish/{identifier}
 *
 * Publishing the QuestionSet also publishes the questions in its hierarchy —
 * child questions (visibility 'Parent') are part of the QS package and do not
 * need to be published individually. This transitions the QS to "Live" and
 * generates the package the QuML player consumes.
 *
 * Bulk import runs as an admin operation, so we publish straight after review.
 */
export const publishQuestionSet = async (questionSetId: string): Promise<void> => {
  await post(`/action/questionset/v2/publish/${questionSetId}`, {
    request: {
      questionset: {
        lastPublishedBy: getLocalStoredUserId(),
      },
    },
  });
};

/**
 * Retire (soft-delete) a QuestionSet — used to clean up when the hierarchy
 * update fails so no QuestionSet is left without its questions.
 * DELETE /action/questionset/v2/retire/{identifier}
 */
export const retireQuestionSet = async (identifier: string): Promise<void> => {
  await delApi(`/action/questionset/v2/retire/${identifier}`);
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
 * Pre-flight check: verify a Google Drive URL is publicly accessible
 * WITHOUT downloading the file, and return the actual MIME type.
 *
 * Returns { mimeType } on success.
 * Throws a user-readable error if the file is inaccessible so the caller
 * can abort before creating any platform node.
 *
 * YouTube URLs skip this check entirely (caller's responsibility).
 */
export const checkDriveFileAccessible = async (
  driveUrl: string
): Promise<{ mimeType: string }> => {
  const response = await axios.post(
    `/api/bulk-import/check-drive-file`,
    { driveUrl },
    { timeout: 25_000, validateStatus: () => true }
  );

  if (response.data?.accessible === false || response.status >= 400) {
    const msg = response.data?.error || 'Google Drive file is not accessible.';
    throw new Error(`Drive file check failed: ${msg}`);
  }

  return { mimeType: response.data?.mimeType || 'application/octet-stream' };
};

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
