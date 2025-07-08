import React, { createContext, useState, useEffect, useContext } from 'react'
import { useQuery } from '@apollo/client'
import { GET_LANGUAGES, GET_TRANSLATIONS_BY_LANGUAGE_CODE } from '../apollo/queries'
import { useTranslation } from 'react-i18next'
const LanguageContext = createContext(null)

export const LanguageProvider = ({ children }) => {

  const { data: languagesData, loading: languagesLoading, error: languagesError } = useQuery(GET_LANGUAGES)

  const rtlLanguages = ['ar', 'he', 'fa', 'ur']
  const [dir, setDir] = useState('ltr')

  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [translations, setTranslations] = useState({})
  const [translationsLoading, setTranslationsLoading] = useState(false)

  useEffect(() => {
    if (!languagesLoading && languagesData?.languages) {
      const defaultLang = languagesData.languages.find((l) => l.isDefault)?.code
      if (defaultLang) {
        setSelectedLanguage((prev) => prev || defaultLang)
      }
    }
  }, [languagesData, languagesLoading])

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
