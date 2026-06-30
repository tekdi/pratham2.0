// ============================================================
// API ROUTE: /api/bulk-import/check-drive-file
// Pratham 2.0 — Workspace MFE
//
// Pre-flight check for a Google Drive URL:
//   1. Verifies the file is publicly accessible
//   2. Returns the actual MIME type (Content-Type) from the server
//      so the caller can validate it against the declared fileType
//      BEFORE creating a content node in the platform.
//
// Uses a Range GET (bytes=0-0) to get headers without downloading
// the entire file. This reliably follows Drive's redirect chain and
// returns the final file's Content-Type.
// ============================================================

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const convertToDirectUrl = (driveUrl: string): string | null => {
  const fileMatch = driveUrl.match(/\/file\/d\/([^/]+)/);
  if (fileMatch) {
    return `https://drive.google.com/uc?export=download&id=${fileMatch[1]}&confirm=t`;
  }
  const idMatch = driveUrl.match(/[?&]id=([^&]+)/);
  if (idMatch) {
    return `https://drive.google.com/uc?export=download&id=${idMatch[1]}&confirm=t`;
  }
  return null;
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
    return res.status(400).json({ error: 'Unable to parse Google Drive URL.' });
  }

  try {
    // Range GET bytes=0-0 → fetches only 1 byte but follows all redirects
    // and returns the final Content-Type header of the actual file.
    // More reliable than HEAD for Drive because HEAD may stop at the
    // confirmation-page redirect without returning the real file's type.
    const response = await axios.get(directUrl, {
      timeout: 20_000,
      maxRedirects: 10,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BulkImportBot/1.0)',
        'Range': 'bytes=0-0',
      },
      // Accept any response (200, 206 Partial Content, 403, 404, etc.)
      validateStatus: (status) => status < 500,
      // We only need headers — stream and abort immediately to avoid downloading
      responseType: 'stream',
    });

    // Abort the stream immediately — we only needed the headers
    response.data.destroy();

    const status = response.status;

    if (status === 403) {
      return res.status(403).json({
        accessible: false,
        error: 'Google Drive file is not publicly accessible. Change sharing to "Anyone with the link".',
      });
    }
    if (status === 404) {
      return res.status(404).json({
        accessible: false,
        error: 'Google Drive file not found. Check the URL is correct.',
      });
    }

    // 200 or 206 (Partial Content) — file is accessible
    // Extract the content-type and strip any charset/boundary suffix
    const rawContentType = (response.headers['content-type'] || '').split(';')[0].trim().toLowerCase();

    return res.status(200).json({
      accessible: true,
      mimeType: rawContentType || 'application/octet-stream',
    });
  } catch (error: any) {
    console.error('[bulk-import/check-drive-file] Error:', error.message);

    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({
        accessible: false,
        error: 'Google Drive check timed out.',
      });
    }

    return res.status(500).json({
      accessible: false,
      error: `Drive URL check failed: ${error.message}`,
    });
  }
}
