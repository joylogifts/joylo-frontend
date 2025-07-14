import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react'
import { useQuery, ApolloError } from '@apollo/client'
import { GET_LANGUAGES, GET_TRANSLATIONS_BY_LANGUAGE_CODE } from '../../apollo/queries/language.query'
import { useTranslation } from 'react-i18next'
import { i18n } from 'i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface Language {
  _id: string
  label: string
  code: string
  processed: boolean
  processedAt: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

interface TranslationsData {
  translations: {
    languageCode: string
    translations: Record<string, string>
  }
}

interface LanguagesData {
  languages: Language[]
}

interface LanguageContextType {
  languages: Language[]
  languagesLoading: boolean
  languagesError: ApolloError | undefined
  selectedLanguage: string | null
  setSelectedLanguage: React.Dispatch<React.SetStateAction<string | null>>
  translations: Record<string, string>
  translationsLoading: boolean
  getTranslation: (key: string) => string
  i18n: i18n
}

const LanguageContext = createContext<LanguageContextType | null>(null)

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { data: languagesData, loading: languagesLoading, error: languagesError } = useQuery<LanguagesData>(GET_LANGUAGES)

  const { i18n } = useTranslation()

  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [translationsLoading, setTranslationsLoading] = useState(false)

  // Initialize language from AsyncStorage
  useEffect(() => {
    const initLanguage = async () => {
      try {
        const storedLang = await AsyncStorage.getItem('lang')
        if (storedLang) {
          setSelectedLanguage(storedLang)
          await i18n.changeLanguage(storedLang)
        } else if (!languagesLoading && languagesData?.languages) {
          const defaultLang = languagesData.languages.find((l: Language) => l.isDefault)?.code
          if (defaultLang) {
            setSelectedLanguage(defaultLang)
            await i18n.changeLanguage(defaultLang)
            await AsyncStorage.setItem('lang', defaultLang)
          }
        }
      } catch (error) {
        console.error('Error initializing language:', error)
      }
    }
    initLanguage()
  }, [languagesData, languagesLoading])

  // Update translations when language changes
  useEffect(() => {
    if (selectedLanguage) {
      i18n.changeLanguage(selectedLanguage)
      AsyncStorage.setItem('lang', selectedLanguage)
    }
  }, [selectedLanguage])

  const { data: translationsData, loading: translationsQueryLoading } = useQuery<TranslationsData>(
    GET_TRANSLATIONS_BY_LANGUAGE_CODE,
    {
      variables: { languageCode: selectedLanguage || '' },
      skip: !selectedLanguage
    }
  )

  useEffect(() => {
    setTranslationsLoading(translationsQueryLoading)
    if (translationsData?.translations?.translations) {
      setTranslations(translationsData.translations.translations)
    }
  }, [translationsData, translationsQueryLoading])

  const getTranslation = (key: string): string => {
    return translations[key] ?? key
  }
  

  const value: LanguageContextType = {
    languages: languagesData?.languages || [],
    languagesLoading,
    languagesError,
    selectedLanguage,
    setSelectedLanguage,
    translations,
    translationsLoading,
    getTranslation,
    i18n
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}