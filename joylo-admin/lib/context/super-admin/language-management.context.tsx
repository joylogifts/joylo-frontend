'use client';

// Core
import { createContext, useCallback, useEffect, useState } from 'react';
// Interfaces and Types
import {
  IProvider,
  ILanguageManagementContextProps,
  ILanguageResponseGraphQL,
  IQueryResult,
  ILanguageReponse,
} from '@/lib/utils/interfaces';
import { GET_LANGUAGES } from '@/lib/api/graphql';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';

export const LanguageManagementContext =
  createContext<ILanguageManagementContextProps>(
    {} as ILanguageManagementContextProps
  );

export const LanguageManagementProvider = ({ children }: IProvider) => {
  const [language, setLanguage] = useState<ILanguageReponse | null>(null);
  const [isLangFormVisible, setLangFormVisible] = useState(false);

  // API
  const languageResponse = useQueryGQL(GET_LANGUAGES, {
    debounceMs: 300,
  }) as IQueryResult<ILanguageResponseGraphQL | undefined, undefined>;

  // Handlers
  const onToggleLangFormVisibility = (status: boolean) => {
    setLangFormVisible(status);
  };
  const onSetLanguage = (lng: ILanguageReponse | null) => {
    setLanguage(lng);
  };

  const onLanguageReponseFetchCompleted = useCallback(() => {
    setLanguage(languageResponse?.data?.languages[0] ?? null);
  }, [languageResponse?.data?.languages]);

  // Use Effects
  useEffect(() => {
    onLanguageReponseFetchCompleted();
  }, [languageResponse?.data?.languages]);

  return (
    <LanguageManagementContext.Provider
      value={{
        language,
        onSetLanguage,
        isLangFormVisible,
        onToggleLangFormVisibility,
        languageResponse,
      }}
    >
      {children}
    </LanguageManagementContext.Provider>
  );
};
