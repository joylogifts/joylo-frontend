import React, { createContext, useState, useEffect, useContext } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import { GET_LANGUAGES, GET_TRANSLATIONS_BY_LANGUAGE_CODE } from '../apollo/queries'
import { useTranslation } from 'react-i18next'
import { SET_USER_LANGUAGE } from '../apollo/mutations'

const SET_USER_LANGUAGE_API = gql`${SET_USER_LANGUAGE}`;

const LanguageContext = createContext(null)

export const LanguageProvider = ({ children }) => {

  const { data: languagesData, loading: languagesLoading, error: languagesError } = useQuery(GET_LANGUAGES)

  const rtlLanguages = ['ar', 'he', 'fa', 'ur']
  const [dir, setDir] = useState('ltr')

  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [translations, setTranslations] = useState({})
  const [translationsLoading, setTranslationsLoading] = useState(false)

  const [setUserLanguageMutation] = useMutation(SET_USER_LANGUAGE_API, {
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


  const handleStoreLanguage = async (code) => {
    await setUserLanguageMutation({ variables: { languageCode: code } })
  }

  const handleDefaultLanguage = () => {
    if (!languagesLoading && languagesData?.languages) {
      const defaultLang = languagesData.languages.find((l) => l.isDefault)?.code
      if (defaultLang) {
        setSelectedLanguage((prev) => prev || defaultLang)
      }
    }
  }
  // useEffect(() => {
  //   if (!languagesLoading && languagesData?.languages) {
  //     const defaultLang = languagesData.languages.find((l) => l.isDefault)?.code
  //     if (defaultLang) {
  //       setSelectedLanguage((prev) => prev || defaultLang)
  //     }
  //   }
  // }, [languagesData, languagesLoading])

  useEffect(() => {
    if (selectedLanguage) {
      handleStoreLanguage(selectedLanguage);
    }
  }, [selectedLanguage]);

  const { data: translationsData, loading: translationsQueryLoading } = useQuery(GET_TRANSLATIONS_BY_LANGUAGE_CODE, {
    variables: { languageCode: selectedLanguage || '' },
    skip: !selectedLanguage
  })

  useEffect(() => {
    if (selectedLanguage) {
      setDir(rtlLanguages.includes(selectedLanguage) ? 'rtl' : 'ltr')
    }
  }, [selectedLanguage])

  useEffect(() => {
    setTranslationsLoading(translationsQueryLoading)
    if (translationsData?.translations?.translations) {
      setTranslations(translationsData.translations.translations)
    }
  }, [translationsData, translationsQueryLoading])

  const getTranslation = (key) => {
    return translations[key] ?? key
  }

  const value = {
    languages: languagesData?.languages || [],
    languagesLoading,
    languagesError,
    selectedLanguage,
    setSelectedLanguage,
    translations,
    translationsLoading,
    getTranslation,
    handleDefaultLanguage,
    dir
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
