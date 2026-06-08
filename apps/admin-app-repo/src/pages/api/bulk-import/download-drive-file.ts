// ============================================================
// API ROUTE: /api/bulk-import/download-drive-file
// Pratham 2.0 — Workspace MFE
//
// Proxies Google Drive file downloads to avoid browser CORS.
// The client sends a driveUrl; this route streams the file back.
// ============================================================

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

// Convert Google Drive share URL to direct download URL
const convertToDirectUrl = (driveUrl: string): string | null => {
  // Pattern: /file/d/FILE_ID/
  const fileMatch = driveUrl.match(/\/file\/d\/([^/]+)/);
  if (fileMatch) {
    return `https://drive.google.com/uc?export=download&id=${fileMatch[1]}&confirm=t`;
  }
  // Pattern: ?id=FILE_ID
  const idMatch = driveUrl.match(/[?&]id=([^&]+)/);
  if (idMatch) {
    return `https://drive.google.com/uc?export=download&id=${idMatch[1]}&confirm=t`;
  }
  return null;
};

const extractFileNameFromHeaders = (
  headers: Record<string, any>,
  driveUrl: string
): string => {
  const contentDisp = String(headers['content-disposition'] || '');
  const match = contentDisp.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  if (match) {
    return match[1].replace(/['"]/g, '').trim();
  }
  const urlParts = driveUrl.split('/');
  return `drive_file_${urlParts[urlParts.length - 1].slice(0, 8)}`;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { driveUrl } = req.body;

  if (!driveUrl || typeof driveUrl !== 'string') {
    return res.status(400).json({ error: 'driveUrl is required' });
  }

  if (!driveUrl.includes('drive.google.com') && !driveUrl.includes('docs.google.com')) {
    return res.status(400).json({ error: 'URL must be a Google Drive link' });
  }

  const directUrl = convertToDirectUrl(driveUrl);
  if (!directUrl) {
    return res.status(400).json({ error: 'Unable to parse Google Drive URL. Ensure it is a valid share link.' });
  }

  try {
    const response = await axios.get(directUrl, {
      responseType: 'arraybuffer',
      timeout: 90_000,
      maxContentLength: MAX_FILE_SIZE_BYTES,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BulkImportBot/1.0)',
      },
      // Follow redirects (Google Drive issues a redirect for large files)
      maxRedirects: 5,
    });

    const contentType = response.headers['content-type'] || 'application/octet-stream';
    const fileName = extractFileNameFromHeaders(response.headers, driveUrl);
    const fileBuffer = Buffer.from(response.data);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', fileBuffer.length);
    res.setHeader('x-file-name', encodeURIComponent(fileName));
    res.setHeader('Access-Control-Expose-Headers', 'x-file-name');

    return res.status(200).send(fileBuffer);
  } catch (error: any) {
    console.error('[bulk-import/download-drive-file] Error:', error.message);

    if (error.response?.status === 403) {
      return res.status(403).json({
        error: 'Google Drive file is not publicly accessible. Please change sharing settings to "Anyone with the link".',
      });
    }
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Google Drive file not found' });
    }
    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({ error: 'Download timed out. File may be too large or network is slow.' });
    }

    return res.status(500).json({ error: `Download failed: ${error.message}` });
  }
}

// Increase body size limit for the proxy response
export const config = {
  api: {
    responseLimit: '110mb',
  },
};
