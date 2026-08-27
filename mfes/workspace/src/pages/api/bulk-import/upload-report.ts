// ============================================================
// API ROUTE: /api/bulk-import/upload-report
// Pratham 2.0 — Workspace MFE
//
// Stores a generated bulk-import report (.xlsx) in cloud storage and returns a
// public URL, so the completion email can link to it.
//
// Why a link and not an attachment: the platform notification contract
// (isQueue / context / key / replacements / email.receipients) has no field for
// attachments, so the file cannot travel with the message. Hosting it and
// passing the URL as a {reportUrl} placeholder works with the existing
// /notification/send endpoint and avoids mail attachment size limits.
//
// Reuses the same S3 credentials already used by the multipart-upload routes.
// ============================================================

import type { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const REGION = process.env.AWS_REGION;
const BUCKET = process.env.AWS_BUCKET_NAME;

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY as string,
  },
});

const XLSX_CONTENT_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

// Reports are small (a few KB), but the base64 body still needs headroom.
export const config = {
  api: {
    bodyParser: { sizeLimit: '10mb' },
  },
};

/** Strip anything that could escape the intended key prefix. */
const safeSegment = (v: string): string =>
  String(v || '').replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);

const buildPublicUrl = (key: string): string => {
  // Prefer the configured CDN/storage host so the URL matches the rest of the
  // platform's asset links; fall back to the direct bucket URL.
  const base = process.env.NEXT_PUBLIC_CLOUD_STORAGE_URL;
  if (base) return `${base.replace(/\/$/, '')}/${key}`;
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!BUCKET || !REGION) {
    return res
      .status(500)
      .json({ error: 'Cloud storage is not configured (AWS_BUCKET_NAME / AWS_REGION)' });
  }

  try {
    const { fileName, base64, userId } = req.body || {};

    if (!base64 || typeof base64 !== 'string') {
      return res.status(400).json({ error: 'base64 file content is required' });
    }

    const buffer = Buffer.from(base64, 'base64');
    if (buffer.byteLength === 0) {
      return res.status(400).json({ error: 'Decoded file is empty' });
    }

    const name = safeSegment(fileName || 'Bulk_Import_Report.xlsx');
    const key = [
      'bulk-import-reports',
      safeSegment(userId || 'unknown-user'),
      `${Date.now()}-${name}`,
    ].join('/');

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: XLSX_CONTENT_TYPE,
        // Makes the link download as a file rather than rendering as bytes.
        ContentDisposition: `attachment; filename="${name}"`,
      })
    );

    return res.status(200).json({ url: buildPublicUrl(key), key });
  } catch (err: any) {
    console.error('[bulk-import/upload-report] Upload failed:', err);
    return res
      .status(500)
      .json({ error: 'Failed to upload report', details: err?.message });
  }
}
