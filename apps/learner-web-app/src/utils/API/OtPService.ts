import { API_ENDPOINTS } from './EndUrls';
import { post } from './RestClient';
import {
  getRecaptchaToken,
  RECAPTCHA_SEND_OTP_ACTION,
} from '@shared-lib-v2/utils/recaptcha';
interface SendOTPParams {
  mobile: string;
  reason: string;
}
interface VerifyOTPParams {
  mobile: string;
  reason: string;
  otp: string;
  hash: string;
  username?: string;
}
export const sendOTP = async ({
  mobile,
  reason,
}: SendOTPParams): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.sendOTP;

  try {
    const captchaToken = await getRecaptchaToken(RECAPTCHA_SEND_OTP_ACTION);
    const response = await post(apiUrl, { mobile, reason, captchaToken });
    return response?.data;
  } catch (error) {
    console.error('error in login', error);
    throw error;
  }
};

export const verifyOTP = async ({
  mobile,
  reason,
  otp,
  hash,
  username,
}: VerifyOTPParams): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.verifyOTP;

  try {
    const response = await post(apiUrl, {
      mobile,
      reason,
      otp,
      hash,
      username,
    });
    return response?.data;
  } catch (error) {
    console.error('error in login', error);
    throw error;
  }
};
