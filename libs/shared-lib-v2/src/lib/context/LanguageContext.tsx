// LanguageContext.tsx
'use client';
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
// @ts-ignore
import en from './locales/en.json';
// @ts-ignore

import hi from './locales/hi.json';
// @ts-ignore

import mr from './locales/mr.json';
// @ts-ignore

import odi from './locales/odi.json';
// @ts-ignore

import tel from './locales/tel.json';
// @ts-ignore

import kan from './locales/kan.json';
// @ts-ignore

import tam from './locales/tam.json';
// @ts-ignore

import guj from './locales/guj.json';

// Define translations object
const translations: Record<string, Record<string, string>> = {
  // @ts-ignore
  en,
  // @ts-ignore
  hi,
  // @ts-ignore
  mr,
  // @ts-ignore
  odi,
  // @ts-ignore
  tel,
  // @ts-ignore
  kan,
  // @ts-ignore
  tam,
  // @ts-ignore
  guj,
};

// Define RTL languages
const rtlLanguages = ['ur'];

// Define context type
export type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, options?: { defaultValue?: string }) => string;
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
        localStorage.setItem('preferredLanguage', title);
        setLanguageState(title);
      } else {
        localStorage.setItem('lang', 'en');
        localStorage.setItem('preferredLanguage', 'en');
        setLanguageState('en');
      }
    }
  }, []);

  // Translate function
  const t = useMemo(() => {
    return (key: string, options?: { defaultValue?: string }): string => {
      const getNestedValue = (lang: string) => {
        const keys = key?.split('.');
        let result: any = translations[lang];
        if (keys) {
          for (const k of keys) {
            if (result?.[k] === undefined) {
              return undefined;
            }
            result = result[k];
          }
        }
        return typeof result === 'string' ? result : undefined;
      };

      // Try the current language first
      const currentLangValue = getNestedValue(language);

      // Fallback to English if not found
      if (currentLangValue !== undefined) {
        return currentLangValue;
      }

      const fallbackValue = getNestedValue('en');

      // Return fallback or options.defaultValue or key itself
      return fallbackValue ?? options?.defaultValue ?? key;
    };
  }, [language]);

  // Handle language switch (simple version — no confirmation)
  const handleLanguageChange = useCallback((newLanguage: string) => {
    if (!translations[newLanguage]) return;
    localStorage.setItem('lang', newLanguage);
    localStorage.setItem('preferredLanguage', newLanguage);
    setLanguageState(newLanguage);
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
    const stack = new Error().stack;
    throw new Error(
      `useTranslation must be used within a LanguageProvider.\nCall stack:\n${stack}`
    );
  }
  return context;
};
