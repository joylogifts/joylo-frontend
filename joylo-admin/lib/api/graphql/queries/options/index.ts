import { gql } from '@apollo/client';

export const GET_OPTIONS_BY_RESTAURANT_ID = gql`
  query Restaurant($id: String) {
    restaurant(id: $id) {
      _id
      options {
        _id
        title
        description
        price
      }
    }
  }
`;

export const GET_OPTIONS = gql`
  query GetOptions($storeId: String)  {
    options(storeId: $storeId) {
        _id
        title
        description
        price
        isActive
    }
}`
