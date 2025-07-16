import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  FC
} from 'react';
import { useQuery, ApolloError, useMutation } from '@apollo/client';
import { GET_LANGUAGES, GET_TRANSLATIONS_BY_LANGUAGE_CODE } from '@/lib/apollo/queries';
import { SET_USER_LANGUAGE } from '@/lib/api/graphql';

// --- Types for GraphQL responses ---
interface Language {
  code: string;
  label: string;
  flag?: string; // URL to the flag image
  isDefault: boolean;
  __typename?: string;
}

interface GetLanguagesData {
  languages: Language[];
}

interface GetTranslationsData {
  translations: {
    translations: Record<string, string>;
  };
}

// --- Context value shape ---
export interface LanguageContextType {
  languages: Language[];
  languagesLoading: boolean;
  languagesError?: ApolloError;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  translations: Record<string, string>;
  translationsLoading: boolean;
  getTranslation: (key: string) => string;
  dir: 'ltr' | 'rtl';
  handleStoreDefaultLanguage: () => void;
}

interface LanguageProviderProps {
  children: ReactNode;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: FC<LanguageProviderProps> = ({ children }) => {
  const { data: languagesData, loading: languagesLoading, error: languagesError } =
    useQuery<GetLanguagesData>(GET_LANGUAGES);

  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');

  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [translationsLoading, setTranslationsLoading] = useState<boolean>(false);



  const [setUserLanguageMutation] = useMutation(SET_USER_LANGUAGE, {
    onCompleted: (data) => {
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
    },
    onError: (error) => {
      // showToast({
      //   type: "error",
      //   title: "Error",
      //   message: error.message || "Something went wrong.",
      // });
    },
  });

  const handleStoreLanguage = async (code: string) => {
    await setUserLanguageMutation({ variables: { languageCode: code } })
  }

  const handleStoreDefaultLanguage = async () => {
    if (!languagesLoading && languagesData?.languages) {
      const defaultLang = languagesData.languages.find((l) => l.isDefault)?.code;
      if (defaultLang) {
        setSelectedLanguage(defaultLang);
      }
    }
  }

  useEffect(() => {
    if (selectedLanguage) {
      handleStoreLanguage(selectedLanguage);
    }
  }, [selectedLanguage]);


  // Set default language once fetched
  // useEffect(() => {
  //   if (!languagesLoading && languagesData?.languages) {
  //     const defaultLang = languagesData.languages.find((l) => l.isDefault)?.code;
  //     if (defaultLang) {
  //       setSelectedLanguage(defaultLang);
  //     }
  //   }
  // }, [languagesData, languagesLoading]);

  // Fetch translations for selected language
  const { data: translationsData, loading: translationsQueryLoading } =
    useQuery<GetTranslationsData>(GET_TRANSLATIONS_BY_LANGUAGE_CODE, {
      variables: { languageCode: selectedLanguage },
      skip: !selectedLanguage,
    });

  // Update text direction
  useEffect(() => {
    setDir(rtlLanguages.includes(selectedLanguage) ? 'rtl' : 'ltr');
  }, [selectedLanguage]);

  // Store fetched translations
  useEffect(() => {
    setTranslationsLoading(translationsQueryLoading);
    if (translationsData?.translations?.translations) {
      setTranslations(translationsData.translations.translations);
    }
  }, [translationsData, translationsQueryLoading]);

  const getTranslation = (key: string): string => translations[key] ?? key;

  const value: LanguageContextType = {
    languages: languagesData?.languages || [],
    languagesLoading,
    languagesError,
    selectedLanguage,
    setSelectedLanguage,
    translations,
    translationsLoading,
    getTranslation,
    dir,
    handleStoreDefaultLanguage,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
