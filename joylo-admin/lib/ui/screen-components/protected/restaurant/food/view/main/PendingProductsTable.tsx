import { GET_PENDING_PRODUCTS } from '@/lib/api/graphql';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import useToast from '@/lib/hooks/useToast';
import Table from '@/lib/ui/useable-components/table';
import { PENDING_PRODUCT_COLUMNS } from '@/lib/ui/useable-components/table/columns/pending-products-column';
import { IPendingProduct, IProductsPagination, IQueryResult, PendingProductResponse } from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl';
import React, { useContext, useEffect, useState } from 'react'

const PendingProductsTable = ({ status } : { status : string}) => {
    const t = useTranslations();
    const { showToast } = useToast();

    const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
    const restaurantId = restaurantLayoutContextData?.restaurantId || '';

    const [products , setProducts] = useState<IPendingProduct[]>([])
    const [pagination , setPagination] = useState<IProductsPagination>({
        currentPage : 1,
        totalPages : 1,
        totalItems : 1,
        pageSize : 10
    })



    const {
        data,
        loading,
    } = useQueryGQL(
    GET_PENDING_PRODUCTS,
    { 
        filter : { status , storeId : restaurantId } ,
        pagination : { 
            pageNo : pagination.currentPage , 
            pageSize : pagination.pageSize 
        }
    },  
    {
        fetchPolicy: 'network-only',
        enabled: !!restaurantId,
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
            return {...prev , currentPage : page}
        })
    }


    return (
        <div>
            {
                loading
                ?
                    <div>
                        Loading...
                    </div>
                :
                    <Table       
                        data={products.map((item) => ({ _id: item.id, ...item }))}
                        loading={loading}
                        columns={PENDING_PRODUCT_COLUMNS({ status })} 
                        selectedData={[]} 
                        setSelectedData={function (): void {
                            throw new Error('Function not implemented.');
                        }}         
                        onPageChange={onPageChange}
                        currentPage={pagination.currentPage}
                        totalRecords={pagination.totalItems}   
                        rowsPerPage={pagination.pageSize}
                    />
            }
        </div>
    )
}

export default PendingProductsTable;