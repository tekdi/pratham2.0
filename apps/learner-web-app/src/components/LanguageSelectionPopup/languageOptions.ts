export interface LanguageOption {
  code: string;
  nativeLabel: string;
  englishLabel?: string;
}

/** PLP landing language grid — keep in sync with Header language codes */
export const PLP_LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', nativeLabel: 'English' },
  { code: 'hi', nativeLabel: 'हिंदी', englishLabel: 'Hindi' },
  { code: 'mr', nativeLabel: 'मराठी', englishLabel: 'Marathi' },
  { code: 'odi', nativeLabel: 'ଓଡ଼ିଆ', englishLabel: 'Odia' },
  { code: 'tel', nativeLabel: 'తెలుగు', englishLabel: 'Telugu' },
  { code: 'kan', nativeLabel: 'ಕನ್ನಡ', englishLabel: 'Kannada' },
  { code: 'tam', nativeLabel: 'தமிழ்', englishLabel: 'Tamil' },
  { code: 'guj', nativeLabel: 'ગુજરાતી', englishLabel: 'Gujarati' },
  { code: 'ur', nativeLabel: 'اردو', englishLabel: 'Urdu' },
];

export const PLP_LANGUAGE_POPUP_DISMISSED_KEY = 'plpLanguagePopupDismissed';