'use client';

import {
  GET_LANGUAGES,
  GET_TRANSLATIONS_BY_LANGUAGE_CODE,
} from '@/lib/api/graphql';
import { ApolloError, useQuery } from '@apollo/client';
import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';

export interface Language {
  _id: string;
  code: string;
  label: string;
  flag?: string; // URL to the flag image
  isDefault: boolean;
  __typename?: string;
}

interface LangTranslationContextType {
  languages: Language[];
  languagesLoading: boolean;
  languagesError: ApolloError | undefined;
  selectedLanguage: string;
  setSelectedLanguage: (code: string) => void;
  translations: Record<string, string>;
  translationsLoading: boolean;
  getTranslation: (key: string) => string;
}

const LangTranslationContext = createContext<LangTranslationContextType | null>(
  null
);

export function LangTranslationProvider({ children }: { children: ReactNode }) {
  // LANGUAGES
  const {
    data: languagesData,
    loading: languagesLoading,
    error: languagesError,
  } = useQuery(GET_LANGUAGES);

  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [translationsLoading, setTranslationsLoading] = useState(false);

  useEffect(() => {
    if (!languagesData || languagesLoading) return;

    const languages = languagesData.languages || [];
    const defaultLang = languages.find((l: Language) => l.isDefault)?.code;
    setSelectedLanguage((prev) => prev || defaultLang);
  }, [languagesData, languagesLoading]);

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
      {translationsQueryLoading ? null : children}
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
