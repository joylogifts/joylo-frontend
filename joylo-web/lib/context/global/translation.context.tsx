// import React, { createContext, useEffect, useState, ReactNode } from "react";

// // Hooks
// import { useLazyQueryQL } from "@/lib/hooks/useLazyQueryQL";
// import useUser from "@/lib/hooks/useUser";

// // API
// import { GET_DEFAULT_LANGUAGE, GET_TRANSLATIONS_BY_LANGUAGE_CODE } from "@/lib/api/graphql";

// // Interface
// import { IDefaultLanguageResponse, ILazyQueryResult, ITranslations, ITranslationsResponse } from "@/lib/utils/interfaces";



// interface TranslationsContextValue {
//   t: (key: string, fallback?: string) => string;
//   translations: ITranslations;
// }

// export const TranslationsContext = createContext<TranslationsContextValue | undefined>(undefined);

// export const TranslationsProvider = ({ children }: { children: ReactNode }) => {
//   const { profile } = useUser();
//   const isLoggedIn = !!profile?._id;

//   const [translations, setTranslations] = useState<ITranslations>({});

//   const { data: defaultLangData, fetch: fetchDefaultLanguage } =
//     useLazyQueryQL(GET_DEFAULT_LANGUAGE, {
//       fetchPolicy: "network-only",
//       debounceMs: 5000,
//     }) as ILazyQueryResult<IDefaultLanguageResponse | undefined, undefined>;

//   const { data: translationsData, fetch: fetchTranslations } =
//     useLazyQueryQL(GET_TRANSLATIONS_BY_LANGUAGE_CODE, {
//       fetchPolicy: "cache-first",
//       debounceMs: 5000,
//     }) as ILazyQueryResult<ITranslationsResponse | undefined, { languageCode: string }>;

//   useEffect(() => {
//     if (isLoggedIn /* && profile.languageCode */) {
//     //   fetchTranslations({ languageCode: profile.languageCode });
//     } else {
//       fetchDefaultLanguage();
//     }
//   }, [isLoggedIn,/*  profile.languageCode */]);

//   useEffect(() => {
//     const code = defaultLangData?.defaultLanguage?.code;
//     if (code) {
//       fetchTranslations({ languageCode: code });
//     }
//   }, [defaultLangData]);

//   useEffect(() => {
//     if (translationsData?.translations?.translations) {
//       setTranslations(translationsData.translations.translations);
//     }
//   }, [translationsData]);

//   const t = (key: string, fallback?: string): string => {
//     return translations?.[key] ?? fallback ?? key;
//   };

//   return (
//     <TranslationsContext.Provider value={{ t, translations }}>
//       {children}
//     </TranslationsContext.Provider>
//   );
// };
