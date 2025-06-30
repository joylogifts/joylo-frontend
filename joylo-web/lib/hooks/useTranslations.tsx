import { useEffect, useState } from "react";

// API
import {
  GET_DEFAULT_LANGUAGE,
  GET_TRANSLATIONS_BY_LANGUAGE_CODE,
} from "../api/graphql";

// Hooks
import useUser from "./useUser";
import { useLazyQueryQL } from "./useLazyQueryQL";

// Interfaces
import {
  ILazyQueryResult,
  IDefaultLanguageResponse,
  ITranslationsResponse,
  ITranslations,
} from "../utils/interfaces";

export const useTranslations = () => {
  const { profile } = useUser();
  const isLoggedIn = !!profile?._id;

  const [translations, setTranslations] = useState<ITranslations>({});

  // Default Language Query (for guests)
  const { data: defaultLangData, fetch: fetchDefaultLanguage } =
    useLazyQueryQL(GET_DEFAULT_LANGUAGE, {
      fetchPolicy: "network-only",
      debounceMs: 5000,
    }) as ILazyQueryResult<IDefaultLanguageResponse | undefined, undefined>;

  // Translation by language code
  const { data: translationsData, fetch: fetchTranslations } =
    useLazyQueryQL(GET_TRANSLATIONS_BY_LANGUAGE_CODE, {
      fetchPolicy: "cache-first",
      debounceMs: 5000,
    }) as ILazyQueryResult<ITranslationsResponse | undefined, { languageCode: string }>;

  // Fetch default language or user language
  useEffect(() => {
    if (isLoggedIn /* && profile.languageCode */) {
    //   fetchTranslations({ languageCode: profile.languageCode });
    } else {
      fetchDefaultLanguage();
    }
  }, [isLoggedIn, /* profile.languageCode */]);

  // If default language fetched (for guests)
  useEffect(() => {
    const code = defaultLangData?.defaultLanguage?.code;
    if (code) {
      fetchTranslations({ languageCode: code });
    }
  }, [defaultLangData]);

  // Set final translations when data is loaded
  useEffect(() => {
    if (translationsData?.translations?.translations) {
      setTranslations(translationsData.translations.translations);
    }
  }, [translationsData]);

  // Translation accessor
  const t = (key: string, fallback?: string) => {
    return translations?.[key] ?? fallback ?? key;
  };

  return {
    t, // usage: t("home") or t("home", "Home")
  };
};
