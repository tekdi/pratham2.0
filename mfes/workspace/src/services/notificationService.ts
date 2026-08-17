// ============================================================
// NOTIFICATION SERVICE
// Pratham 2.0 — Workspace MFE
//
// Thin wrapper over the Pratham notification service.
// POST {MIDDLEWARE_URL}/notification/send
//
// The request shape matches the one used across the platform (see
// shared-lib-v2 DynamicForm/services/NotificationService). Note the API field
// is spelled `receipients` — that is the server's spelling, not a typo here.
// ============================================================

import { post } from './RestClient';

export interface SendNotificationRequest {
  /** false → send immediately; true → hand off to the service's queue */
  isQueue: boolean;
  /** Template context, e.g. 'CMS' or 'USER' */
  context: string;
  /** Template key configured in the notification service */
  key: string;
  /** Placeholder → value map, e.g. { '{FirstName}': 'Asha' } */
  replacements: Record<string, string>;
  /** NOTE: server-side field name is `receipients` */
  email?: { receipients: string[] };
  push?: Record<string, any>;
}

/**
 * Send a templated notification.
 *
 * Never throws — notification delivery must not break the flow that triggered
 * it. Returns the service result on success, or null on failure.
 */
export const sendCredentialService = async ({
  isQueue,
  context,
  key,
  replacements,
  email,
  push,
}: SendNotificationRequest): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/notification/send`;

  try {
    const response = await post(apiUrl, {
      isQueue,
      context,
      key,
      replacements,
      ...(email && { email }),
      ...(push && { push }),
    });
    return response?.data?.result ?? null;
  } catch (error) {
    console.error('[notification] Failed to send notification:', error);
    return null;
  }
};

export const sendReviewNotification = async (reviewData: any) => {
  // Subject: Content Review Request
  // Body: Hi {reviewerName}, {creatorName} has requested you to review the content {contentId}. Please review the content and provide your feedback.
};
