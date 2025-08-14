import { useTranslation } from '@shared-lib';

export const useDirection = () => {
  const { language, rtlLanguages } = useTranslation();
  const isRTL = rtlLanguages.includes(language);
  const dir = isRTL ? 'rtl' : 'ltr';

  return { dir, isRTL };
};
