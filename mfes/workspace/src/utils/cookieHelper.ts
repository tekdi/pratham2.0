import { parse } from 'cookie';

/**
 * Reads a specific cookie from the request
 * @param {NextApiRequest} req - The Next.js API request object
 * @param {string} cookieName - The name of the cookie to read
 * @returns {string|null} - The cookie value or null if not found
 */
export function getCookie(req: any, cookieName: string): string | null {
  if (!req.headers.cookie) {
    return null;
  }
  
  const cookies = parse(req.headers.cookie);
  return cookies[cookieName] || null;
}
