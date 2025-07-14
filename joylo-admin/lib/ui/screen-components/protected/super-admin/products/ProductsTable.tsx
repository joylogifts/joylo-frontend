import { GET_PENDING_PRODUCTS } from '@/lib/api/graphql';
import { UPDATE_PENDING_PRODUCT_STATUS } from '@/lib/api/graphql/mutations/products';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import useToast from '@/lib/hooks/useToast';
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';
import Table from '@/lib/ui/useable-components/table';
import { SUPER_ADMIN_PRODUCTS_COLUMNS } from '@/lib/ui/useable-components/table/columns/super-admin-products-columns';
import { IActionMenuItem, IPendingProduct, IProductsPagination, IQueryResult, PendingProductResponse } from '@/lib/utils/interfaces';
import { useMutation } from '@apollo/client';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

const initState = { pendingProductRequestId : '' , status : ''}

const ProductsTable = ({ status }: { status: string }) => {
    const t = useTranslations();
    const { showToast } = useToast();


    const [products, setProducts] = useState<IPendingProduct[]>([]);
    const [pagination , setPagination] = useState<IProductsPagination>({
        currentPage : 1,
        totalPages : 1,
        totalItems : 1,
        pageSize : 10
    })

    const [updatedData, setUpdatedData] = useState(initState);
    const [reason , setReason] = useState<string>('');


    const {
        data,
        loading,
    } = useQueryGQL(
        GET_PENDING_PRODUCTS,
        { 
            filter: { status } ,
            pagination : { 
                pageNo : pagination.currentPage , 
                pageSize : 10 
            }
        },
        {
            fetchPolicy: 'network-only',
            onError: () => {
                showToast({
                    type: 'error',
                    title: t('Foods Fetch'),
                    message: t('Foods fetch failed'),
                    duration: 2500,
                });
            },
        }
    ) as IQueryResult<PendingProductResponse | undefined, undefined>;


    useEffect(() => {
        if (data?.getPendingProducts) {
            setProducts(data.getPendingProducts.data);
            setPagination({...data.getPendingProducts.pagination , pageSize : 10 })
        }
    }, [data]);

    const onPageChange = ( page : number ) => {
        setPagination((prev : IProductsPagination) => {
            return {...prev , currentPage : page }
        })
    }


    const [updateStatus, { loading: mutationLoading }] = useMutation(
        UPDATE_PENDING_PRODUCT_STATUS,
        {
            variables: updatedData,
            refetchQueries: [
                {
                    query: GET_PENDING_PRODUCTS,
                    variables: { status }
                },
            ],
        }
    );


    const menuItems: IActionMenuItem<IPendingProduct>[] = [
        {
            label: t('Approve'),
            command: (item?: IPendingProduct) => {
                if (item?._id) {
                    setUpdatedData({ pendingProductRequestId: item?._id, status: 'approved'})
                }
            },
        },
        {
            label: t('Reject'),
            command: (item?: IPendingProduct) => {
                if (item?._id) {
                    setUpdatedData({ pendingProductRequestId: item?._id, status: 'rejected' })
                }
            },
        },
    ];


    return (
        <div>
            {
                loading
                ?
                    <div>
                        Loading...
                    </div>
                :
                    <>
                        <Table
                            data={products.map((item) => ({ _id: item.id, ...item }))}
                            loading={loading}
                            columns={SUPER_ADMIN_PRODUCTS_COLUMNS({ menuItems , status })}
                            selectedData={[]}
                            setSelectedData={function (): void {
                                throw new Error('Function not implemented.');
                            }}
                            onPageChange={onPageChange}
                            currentPage={pagination.currentPage}
                            totalRecords={pagination.totalItems}   
                            rowsPerPage={pagination.pageSize}
                        />
                        <CustomDialog
                            loading={mutationLoading}
                            visible={!!updatedData.pendingProductRequestId}
                            onHide={() => {
                                setUpdatedData(initState);
                            }}
                            buttonConfig={{
                                primaryButtonProp : {
                                    bgColor : updatedData.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                                }
                            }}
                            onConfirm={() => {
                                updateStatus({
                                    variables: {...updatedData , reason },
                                    onCompleted: () => {
                                        showToast({
                                            type: 'success',
                                            title: `Product Updated`,
                                            message: `Product has been ${status} successfully`,
                                            duration: 3000,
                                        });
                                        setUpdatedData(initState);
                                    },
                                    onError: (err) => {
                                        showToast({
                                            type: 'error',
                                            title: t('Delete Category'),
                                            message:
                                                err.message ||
                                                err.clientErrors[0].message ||
                                                err.networkError?.message ||
                                                t(
                                                    'An error occured while deleteing the category, please try again later'
                                                ),
                                        });
                                    },
                                });
                            }}
                            title={`${updatedData.status === 'approved' ? 'Approve' : 'Reject'} Product`}
                            message={`Are you sure you want to ${updatedData.status === 'approved' ? 'Approve' : 'Reject'} this product?`}
                            showReasonInput={updatedData.status === 'rejected'}
                            reasonRequired={updatedData.status === 'rejected'}
                            setReason={setReason}

                        />
                    </>
            }
        </div>
    )
}

export default ProductsTable;