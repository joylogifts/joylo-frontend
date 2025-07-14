import { gql } from '@apollo/client';

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($category: GlobalCategoryInput) {
    createCategory(category: $category) {
        _id
        title
    }
 }
`;

export const EDIT_CATEGORY = gql`
  mutation EditCategory($category: GlobalCategoryInput) {
    editCategory(category: $category) {
      _id
      title
      isActive
    }
 }
`;

export const DELETE_CATEGORY = gql`
 mutation DeleteCategory($id: String! ) {
    deleteCategory(id: $id) {
      _id
      title
      isActive
      image
    }
 }
`;
