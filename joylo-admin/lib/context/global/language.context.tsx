'use client';

import {
  GET_LANGUAGES,
  GET_TRANSLATIONS_BY_LANGUAGE_CODE,
  SET_USER_LANGUAGE,
} from '@/lib/api/graphql';
import useToast from '@/lib/hooks/useToast';
import { APP_NAME } from '@/lib/utils/constants';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
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
  handleDefaultLanguage: () => void;
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

  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [translationsLoading, setTranslationsLoading] = useState(false);
  const { showToast } = useToast();

  const [setUserLanguageMutation] = useMutation(SET_USER_LANGUAGE, {
    // onCompleted: (data) => {
    // if (data.setUserLanguage) {
    //   showToast({
    //     type: "success",
    //     title: "Success",
    //     message: "Language updated successfully!",
    //   });
    // } else {
    //   showToast({
    //     type: "error",
    //     title: "Error",
    //     message: "Something went wrong.",
    //   });
    // }
    // },
    onError: (error) => {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Something went wrong.',
      });
    },
  });

  const handleStoreLanguage = async (code: string) => {
    const authData = JSON.parse(
      localStorage.getItem(`user-${APP_NAME}`) || '{}'
    );

    if (!authData.token) return;

    await setUserLanguageMutation({ variables: { languageCode: code } });
  };

  const handleDefaultLanguage = () => {
    if (!languagesData || languagesLoading) return;
    const languages = languagesData.languages || [];
    const defaultLang = languages.find((l: Language) => l.isDefault)?.code;
    setSelectedLanguage((prev) => prev || defaultLang);
  };
  // useEffect(() => {
  //   if (!languagesData || languagesLoading) return;

  //   const languages = languagesData.languages || [];
  //   const defaultLang = languages.find((l: Language) => l.isDefault)?.code;
  //   setSelectedLanguage((prev) => prev || defaultLang);
  // }, [languagesData, languagesLoading]);

  useEffect(() => {
    if (selectedLanguage) {
      handleStoreLanguage(selectedLanguage);
      const savedUser = localStorage.getItem(`user-${APP_NAME}`);
      if (savedUser) {
        const _old_user = JSON.parse(savedUser);
        _old_user.languageCode = selectedLanguage;
        localStorage.setItem(`user-${APP_NAME}`, JSON.stringify(_old_user));
      }
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

  const contextValue: LangTranslationContextType = {
    languages: languagesData?.languages || [],
    languagesLoading,
    languagesError,
    selectedLanguage,
    setSelectedLanguage,
    translations,
    translationsLoading,
    getTranslation,
    handleDefaultLanguage,
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
