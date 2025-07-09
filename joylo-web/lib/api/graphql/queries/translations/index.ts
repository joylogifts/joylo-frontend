import { gql } from "@apollo/client";

export const GET_DEFAULT_LANGUAGE = gql`
  query GetDefaultLanguage {
    defaultLanguage {
      _id
      label
      code
      isDefault
      createdAt
      updatedAt
    }
  }
`;

export const GET_LANGUAGES = gql`
  query GetLanguages {
    languages {
      _id
      label
      code
      processed
      processedAt
      isDefault
      createdAt
      updatedAt
    }
  }
`;

export const GET_TRANSLATIONS_BY_LANGUAGE_CODE = gql`
  query GetTranslationsByLangCode($languageCode: String!) {
    translations(languageCode: $languageCode) {
      languageCode
      translations
      createdAt
      updatedAt
    }
  }
`;
