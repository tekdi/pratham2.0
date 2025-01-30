export const getLocalStoredUserId = () => {
  const fallbackUserId = process.env.NEXT_PUBLIC_DEFAULT_USER_ID || null;
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      const userId = localStorage.getItem('userId');
      return userId ?? fallbackUserId; // Do-do : remove the fall back of userId and handle empty case in components
    } catch (error) {
      console.error('Error retrieving user data from local storage:', error);
      return null;
    }
  } else {
    // Running in SSR, return null
    console.warn('Local storage is not available (SSR)');
    return null;
  }
};

export const getLocalStoredUserName = () => {
  const fallbackUserName = process.env.NEXT_PUBLIC_DEFAULT_USER_NAME || null;
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      const username = localStorage.getItem('name');
      return username ?? fallbackUserName;
    } catch (error) {
      console.error('Error retrieving user name from local storage:', error);
      return null;
    }
  } else {
    // Running in SSR, return null
    console.warn('Local storage is not available (SSR)');
    return null;
  }
};
export const getLocalStoredUserRole = () => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      const userInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');
      return userInfo?.role;
    } catch (error) {
      console.error('Error retrieving user name from local storage:', error);
      return 'Anonymous User';
    }
  } else {
    // Running in SSR, return null
    console.warn('Local storage is not available (SSR)');
    return null;
  }
};
