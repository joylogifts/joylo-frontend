import { gql } from '@apollo/client';

export const GET_FOODS_BY_RESTAURANT_ID = gql`
  query Restaurant($id: String) {
    restaurant(id: $id) {
      _id
      categories {
        _id
        title
        foods {
          _id
          title
          description
          isOutOfStock
          subCategory
          variations {
            _id
            title
            price
            discounted
            # addons
            isOutOfStock
          }
          image
          isActive
          subCategory
          isReturnAble
        }
      }
    }
  }
`;


export const GET_PENDING_PRODUCTS = gql`
  query GetPendingProductsRequest($filter: PendingProductsFilterInput, $pagination: PaginationInput) {
    getPendingProducts(filter: $filter, pagination: $pagination) {
        pagination {
             currentPage
            totalPages
            totalItems
            pageSize
            hasPrevPage
            hasNextPage
        }
        data {
            id
            storeId
            categoryId
            productId
            status
            reason
            approvalType
            previousProductData {
                _id
                title
                description
                image
                variations {
                    _id
                    title
                    price
                    discounted
                }
            }
            productData {
                _id
                title
                description
                image
                variations {
                    _id
                    title
                    price
                    discounted
                }
            }
        }
    }
}

`