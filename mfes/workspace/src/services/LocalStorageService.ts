export const getLocalStoredUserId = () => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      const userId = localStorage.getItem("userId");
      return userId ?? "5afb0c71-5e85-46f6-8780-3059cbb7bbf9"; // Do-do : remove the fall back of userId and handle empty case in components
    } catch (error) {
      console.error("Error retrieving user data from local storage:", error);
      return null;
    }
  } else {
    // Running in SSR, return null
    console.warn("Local storage is not available (SSR)");
    return null;
  }
};

export const getLocalStoredUserName = () => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      const username = localStorage.getItem("name");
      return username ?? "Anonymous User";
    } catch (error) {
      console.error("Error retrieving user name from local storage:", error);
      return "Anonymous User";
    }
  } else {
    // Running in SSR, return null
    console.warn("Local storage is not available (SSR)");
    return null;
  }
};
export const getLocalStoredUserRole = () => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      const userInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}");
      return userInfo?.role;
    } catch (error) {
      console.error("Error retrieving user name from local storage:", error);
      return "Anonymous User";
    }
  } else {
    // Running in SSR, return null
    console.warn("Local storage is not available (SSR)");
    return null;
  }
};
