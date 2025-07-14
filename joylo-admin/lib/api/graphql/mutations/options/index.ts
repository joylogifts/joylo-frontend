import { gql } from '@apollo/client';

export const CREATE_OPTIONS = gql`
  mutation CreateOptions($optionInput: [OptionInput!]) {
    createOptions(optionInput: $optionInput)
  }
`;

export const DELETE_OPTION = gql`
  mutation DeleteOption($id: String!) {
    deleteOption(id: $id) {
      _id
      title
      description
      price
      isActive
    }
  }
`;

export const EDIT_OPTION = gql`
  mutation EditOption($optionInput: OptionInput) {
    editOption(optionInput: $optionInput) {
      _id
      title
      price
      isActive
    }
  }
`;

export const ENABLE_STORE_OPTION = gql`
  mutation SetStoreOptionConfig(
    $storeId: String!
    $optionId: String!
    $enabled: Boolean!
  ) {
    setStoreOptionConfig(
      storeId: $storeId
      optionId: $optionId
      enabled: $enabled
    ) {
      _id
      storeId
      addonId
      enabled
      enabledOptionIds
    }
  }
`;
