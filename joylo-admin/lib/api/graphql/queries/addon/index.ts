import { gql } from '@apollo/client';

export const GET_ADDONS_BY_RESTAURANT_ID = gql`
  query Restaurant($id: String) {
    restaurant(id: $id) {
      _id
      addons {
        _id
        title
        description
        quantityMinimum
        quantityMaximum
        options
        # categoryId
        # subCategoryId
        # isActive
      }
    }
  }
`;

export const GET_ADDONS = gql`
  query GetAddons($storeId: String) {
    addons(storeId: $storeId) {
      _id
      title
      categoryIds
      description
      isActive
      options
    }
  }
`;

export const ENABLE_STORE_ADDON = gql`
  mutation SetStoreAddonConfig(
    $storeId: String!
    $addonId: String!
    $enabled: Boolean!
  ) {
    setStoreAddonConfig(
      storeId: $storeId
      addonId: $addonId
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
