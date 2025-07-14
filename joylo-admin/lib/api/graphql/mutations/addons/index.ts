import { gql } from '@apollo/client';

export const CREATE_ADDONS = gql`
  mutation CreateAddon($addonInput: [AddonInput]) {
    createAddons(addonInput: $addonInput)
 }
`;
export const EDIT_ADDON = gql`
  mutation EditAddon($addonInput: AddonInput) {
    editAddon(addonInput: $addonInput) {
        _id
        title
        options
        isActive
        categoryIds
    }
 }
`;

export const TOGGLE_ADDON_STATUS = gql`
  mutation ToggleAddonStatus(
    $restaurant: String!
    $addonId: String!
    $status: Boolean!
  ) {
    toggleAddonStatus(
      restaurant: $restaurant
      addonId: $addonId
      status: $status
    )
  }
`;

export const DELETE_ADDON = gql`
  mutation DeleteAddon($id: String!) {
    deleteAddon(id: $id) {
        _id
        title
        options
        isActive
        categoryIds
    }
 }
`;
