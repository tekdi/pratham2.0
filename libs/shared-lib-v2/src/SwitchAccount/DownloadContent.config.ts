// List of hostnames where download button should be shown
const downloadEnabledHostnames = [
  'pos.prathamdigital.org',
  'qa-pos.prathamdigital.org',
  'dev-pos.prathamdigital.org',
  'https://www.prathamopenschool.org/',
  'https://experimentoindia.prathamopenschool.org/',
  'https://dev-themantic.prathamdigital.org/',
  'https://qa-themantic.prathamdigital.org/',
  'https://themantic.prathamdigital.org/',
  'localhost:3003',
];

// Normalize hostname (removes protocol, www prefix, trailing slashes, and paths)
const normalizeHostname = (urlOrHostname: string): string => {
  // Remove protocol if present (https:// or http://)
  let hostname = urlOrHostname.replace(/^https?:\/\//, '');
  // Remove trailing slash
  hostname = hostname.replace(/\/$/, '');
  // Remove path if present (everything after /)
  hostname = hostname.split('/')[0];
  // Remove www. prefix for consistent comparison
  hostname = hostname.replace(/^www\./, '');
  return hostname;
};

// Check if download is enabled for current hostname
export const isDownloadContentEnabled = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  // Use host (includes port) instead of hostname to handle localhost:3003
  const currentHost = window.location.host;
  const currentHostname = normalizeHostname(currentHost);

  // Check if current hostname matches any configured hostname
  return downloadEnabledHostnames.some((configHostname) => {
    const normalizedConfigHostname = normalizeHostname(configHostname);
    return normalizedConfigHostname === currentHostname;
  });
};

export default downloadEnabledHostnames;
