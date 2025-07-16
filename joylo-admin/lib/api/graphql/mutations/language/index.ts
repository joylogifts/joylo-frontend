import { gql } from '@apollo/client';

export const CREATE_LANGUAGE = gql`
  mutation CreateLanguage($input: LanguageInput!) {
    createLanguage(input: $input) {
      _id
      label
      code
      isDefault
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_LANGUAGE = gql`
  mutation UpdateLanguage($id: ID!, $input: LanguageInput!) {
    updateLanguage(id: $id, input: $input) {
      _id
      label
      code
      isDefault
      createdAt
      updatedAt
    }
  }
`;

export const SET_DEFAULT_LANGUAGE = gql`
  mutation SetDefaultLanguage($id: ID!) {
    setDefaultLanguage(id: $id)
  }
`;

export const DELETE_LANGUAGE = gql`
  mutation DeleteLanguage($id: ID!) {
    deleteLanguage(id: $id)
  }
`;

// Translations
export const MODIFY_TRANSLATIONS = gql`
  mutation ModifyTranslations(
    $keys: [String!]!
    $inputs: [TranslationKeyValueInput!]!
  ) {
    deleteTranslationKeys(keys: $keys) {
      success
      message
    }

    upsertDefaultTranslations(inputs: $inputs)
  }
`;

export const SET_USER_LANGUAGE = gql`
  mutation SetUserLanguage($languageCode: String!) {
    setUserLanguage(languageCode: $languageCode)
  }
`;
