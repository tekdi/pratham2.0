// LanguageContext.tsx
import React, {
  useContext,
  useState,
  useEffect,
  useMemo,
  createContext,
  ReactNode,
  useCallback,
} from 'react';
import { getTitleFromValue } from './Languages';

// Translation files
import en from './locales/en.json';
import hi from './locales/hi.json';

// Define translations object
const translations: Record<string, Record<string, string>> = {
  en,
  hi,
};

// Define RTL languages
const rtlLanguages = ['ur'];

// Define context type
export type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  rtlLanguages: string[];
};

// Create context
export const LanguageContext = createContext<LanguageContextType | null>(null);

// Props type for provider
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<string>('en');

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('lang');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage);
    } else {
      const browserLanguage = navigator.language;
      const title = getTitleFromValue(browserLanguage);
      if (title) {
        localStorage.setItem('lang', title);
        setLanguageState(title);
      } else {
        localStorage.setItem('lang', 'en');
        setLanguageState('en');
      }
    }
  }, []);

  // Translate function
  const t = useMemo(
    () =>
      (key: string): string =>
        translations[language]?.[key] || key,
    [language]
  );

  // Handle language switch (simple version — no confirmation)
  const handleLanguageChange = useCallback((newLanguage: string) => {
    if (!translations[newLanguage]) return;
    localStorage.setItem('appLanguage', newLanguage);
    setLanguageState(newLanguage);
    window?.location?.reload();
  }, []);

  // Memoized context value
  const contextValue = useMemo<LanguageContextType>(
    () => ({
      language,
      setLanguage: handleLanguageChange,
      t,
      rtlLanguages,
    }),
    [language, handleLanguageChange, t]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook
export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
