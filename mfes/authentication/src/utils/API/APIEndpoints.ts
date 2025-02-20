const baseurl = process.env.NEXT_PUBLIC_MIDDLEWARE_URL;

const API_ENDPOINTS = {


  accountLogin: `${baseurl}/interface/v1/account/login`,
  authRefresh: `${baseurl}/interface/v1/account/auth/refresh`,
  authLogout: `${baseurl}/interface/v1/account/auth/logout`,
  userAuth: `${baseurl}/interface/v1/user/auth`,
  resetPassword: `${baseurl}/interface/v1/user/reset-password`,
  forgotPassword: `${baseurl}/interface/v1/user/forgot-password`,
  passwordResetLink: `${baseurl}/interface/v1/user/password-reset-link`,

};

export default API_ENDPOINTS;
