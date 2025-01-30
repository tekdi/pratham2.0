import multer, { MulterError } from 'multer';
import FormData from 'form-data';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
const cookie = require("cookie");

const upload = multer({
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB limit
  },
});

// Create an upload handler
const uploadHandler = upload.any(); // NOSONAR

// Next.js API Route config to disable body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Custom middleware to check Content-Length header
const checkContentLength = (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
  const contentLength = req.headers['content-length'];

  if (contentLength && parseInt(contentLength) > 2 * 1024 * 1024) { // 2 MB limit
    return res.status(413).json({ message: 'Payload too large. Maximum size is 2MB.' });
  }
  next();
};

// Helper function to wrap the upload process in a promise
const uploadPromise = (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise<void>((resolve, reject) => {
    uploadHandler(req as any, res as any, (err: unknown) => {
      if (err) {
        if (err instanceof MulterError) {
          return reject(new Error(`File too large: ${err.message}`));
        }
        return reject(new Error('Error processing form data: ' + (err as Error).message));
      }
      resolve();
    });
  });
};

// Main handler function for Next.js API route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  // Handle only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Check Content-Length before processing
  checkContentLength(req, res, async () => {
    try {
      // Await the file upload
      await uploadPromise(req, res);

      // Prepare FormData for the request to the backend service
      const formData = new FormData();

      // Attach uploaded files and form data to FormData
      const files = (req as any).files; // Multer attaches files to req as any

      if (files) {
        files.forEach((file: Express.Multer.File) => {
          formData.append('file', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
          });
        });
      }

      // Attach other body parameters if present
      if (req.body) {
        for (const key in req.body) {
          formData.append(key, req.body[key]);
        }
      }

      const cookies = cookie.parse(req.headers.cookie || "");

      // Set your base URL
      const baseURL = process.env.BASE_URL as string;
      const authApiToken = cookies?.authToken || process.env.AUTH_API_TOKEN;
      const tenantId = process.env.NEXT_PUBLIC_TENANT_ID as string;

      console.log("Using token for file upload:", authApiToken);

      // Extract the relative URL from the incoming request (after /action)
      const relativePath = req.url?.replace('/api/fileUpload', '') ?? '';

      // Construct the final URL using baseURL + relativePath
      const finalURL = `${baseURL}${relativePath}`;

      // Make a POST request to the backend service
      const response = await axios.post(finalURL, formData, {
        headers: {
          ...formData.getHeaders(), // Set headers for FormData
          'Authorization': `Bearer ${authApiToken}`,  // Set your API key in the headers
          'tenantId': tenantId,  // Set your tenant ID in the headers
        },
        params: req.query, // Pass along any query parameters from the original request
      });

      // Return the response from the backend service
      return res.status(response.status).json(response.data);
    } catch (error: any) {
      console.error('Error in file upload:', error);
      return res.status(500).json({ message: error.message });
    }
  });
}