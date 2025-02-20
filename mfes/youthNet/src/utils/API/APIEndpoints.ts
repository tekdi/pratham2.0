const baseurl = process.env.NEXT_PUBLIC_MIDDLEWARE_URL;

const API_ENDPOINTS = {
  userRead: (userId: string | string[]) => `${baseurl}/user/v1/read/${userId}`,
  userUpdate: (userId: string | string[]) => `${baseurl}/user/v1/update/${userId}`,
  userAuth: `${baseurl}/user/v1/auth`,
  notificationSend: `${baseurl}/notification/send`,
  userReadWithField: (userId: string | string[]) => `${baseurl}/user/v1/read/${userId}?fieldvalue=false`,
  academicYearsList: `${baseurl}/user/v1/academicyears/list`,


};

export default API_ENDPOINTS;
