'use client';

import {
  GET_LANGUAGES,
  GET_TRANSLATIONS_BY_LANGUAGE_CODE,
} from '@/lib/api/graphql';
import { useQuery } from '@apollo/client';
import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';

interface LangTranslationContextType {
  languages: any[];
  languagesLoading: boolean;
  languagesError: any;
  selectedLanguage: string;
  setSelectedLanguage: (code: string) => void;
  translations: Record<string, string>;
  translationsLoading: boolean;
  getTranslation: (key: string) => string;
}

const LangTranslationContext = createContext<LangTranslationContextType | null>(
  null
);
const LANGUAGE_KEY = "selectedLanguage";
export function LangTranslationProvider({ children }: { children: ReactNode }) {
  // LANGUAGES
  const {
    data: languagesData,
    loading: languagesLoading,
    error: languagesError,
  } = useQuery(GET_LANGUAGES);

  // Initialize selectedLanguage from localStorage if available
  const [selectedLanguage, setSelectedLanguageState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(LANGUAGE_KEY) || "en";
    }
    return "en";
  });
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [translationsLoading, setTranslationsLoading] = useState(false);


  useEffect(() => {
    if (!languagesData || languagesLoading) return;
    const languages = languagesData.languages || [];
    const defaultLang = languages.find((l: any) => l.isDefault)?.code;
    setSelectedLanguageState((prev) => prev || defaultLang);
  }, [languagesData, languagesLoading]);


  useEffect(() => {
    if (selectedLanguage) {
      localStorage.setItem(LANGUAGE_KEY, selectedLanguage);
    }
  }, [selectedLanguage]);

  // TRANSLATIONS
  const { data: translationsData, loading: translationsQueryLoading } =
    useQuery(GET_TRANSLATIONS_BY_LANGUAGE_CODE, {
      variables: { languageCode: selectedLanguage || '' },
      skip: !selectedLanguage,
    });

  useEffect(() => {
    setTranslationsLoading(translationsQueryLoading);
    if (translationsData?.translations?.translations) {
      setTranslations(translationsData.translations.translations);
    }
  }, [translationsData, translationsQueryLoading]);

  const getTranslation = (key: string) => {
    return translations[key] ?? key;
  };

  const setSelectedLanguage = (code: string) => {
    setSelectedLanguageState(code);
    localStorage.setItem(LANGUAGE_KEY, code);
  };

  const contextValue: LangTranslationContextType = {
    languages: languagesData?.languages || [],
    languagesLoading,
    languagesError,
    selectedLanguage,
    setSelectedLanguage,
    translations,
    translationsLoading,
    getTranslation,
  };

  return (
    <LangTranslationContext.Provider value={contextValue}>
      {children}
    </LangTranslationContext.Provider>
  );
}

// Hook to use anywhere
export const useLangTranslation = () => {
  const context = useContext(LangTranslationContext);
  if (!context) {
    throw new Error(
      'useLangTranslation must be used within a LangTranslationProvider'
    );
  }
  return context;
};