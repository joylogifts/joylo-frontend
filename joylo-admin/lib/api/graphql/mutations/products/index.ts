import { gql } from '@apollo/client';

export const UPDATE_PENDING_PRODUCT_STATUS = gql`
    mutation UpdatePendingProductStatus(
        $pendingProductRequestId: String!
        $status: PendingProductStatus!
        $reason: String
    ) {
        updatePendingProductApprovalStatus(
            pendingProductRequestId: $pendingProductRequestId
            status: $status
            reason: $reason
        ) {
            id
            storeId
            categoryId
            productId
            status
            reason
            productData {
                _id
                title
                description
                variations {
                    _id
                    title
                    price
                    discounted
                }
            }
        }
    }
`;
