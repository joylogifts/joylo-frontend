// Core
import { useContext, useState } from 'react';

// Prime React
import { FilterMatchMode } from 'primereact/api';

// Interface and Types

// Components
import Table from '@/lib/ui/useable-components/table';
import { OPTION_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/option-columns';

// Utilities and Data
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';

//Toast
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import useToast from '@/lib/hooks/useToast';
import {
  IOptions,
  IOptionsResponse,
  IQueryResult,
} from '@/lib/utils/interfaces';

// GraphQL
import { DELETE_OPTION, GET_OPTIONS, GET_OPTIONS_BY_RESTAURANT_ID } from '@/lib/api/graphql';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import { generateDummyOptions } from '@/lib/utils/dummy';
import { useMutation } from '@apollo/client';
import CategoryTableHeader from '../header/table-header';
import { useTranslations } from 'next-intl';

export default function OptionMain() {
  // Context
  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const restaurantId = restaurantLayoutContextData?.restaurantId || '';

  // Hooks
  const t = useTranslations();
  const { showToast } = useToast();

  // State - Table
  const [deleteId, setDeleteId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<IOptions[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: '' as string | null, matchMode: FilterMatchMode.CONTAINS },
  });

  // Query
  const { data, loading } = useQueryGQL(
    GET_OPTIONS,
    { storeId: restaurantId },
    {
      fetchPolicy: 'network-only',
      enabled: !!restaurantId,
      onCompleted: onFetchCategoriesByRestaurantCompleted,
      onError: onErrorFetchCategoriesByRestaurant,
    }
  ) as IQueryResult<IOptionsResponse | undefined, undefined>;

  //Mutation
  const [deleteCategory, { loading: mutationLoading }] = useMutation(
    DELETE_OPTION,
    {
      variables: {
        id: deleteId,
        restaurant: restaurantId,
      },
      refetchQueries: [
        {
          query: GET_OPTIONS_BY_RESTAURANT_ID,
          variables: { id: restaurantId },
        },
      ],
    }
  );

  // Handlers
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  // Complete and Error
  function onFetchCategoriesByRestaurantCompleted() {}
  function onErrorFetchCategoriesByRestaurant() {
    showToast({
      type: 'error',
      title: t('Option Fetch'),
      message: t('Categories fetch failed'),
      duration: 2500,
    });
  }



  return (
    <div className="p-3">
      <Table
        header={
          <CategoryTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
          />
        }
        data={
          data?.options.slice().reverse() ||
          (loading ? generateDummyOptions() : [])
        }
        filters={filters}
        setSelectedData={setSelectedProducts}
        selectedData={selectedProducts}
        loading={loading}
        columns={OPTION_TABLE_COLUMNS()}
      />
      <CustomDialog
        loading={mutationLoading}
        visible={!!deleteId}
        onHide={() => {
          setDeleteId('');
        }}
        onConfirm={() => {
          deleteCategory({
            variables: { id: deleteId },
            onCompleted: () => {
              showToast({
                type: 'success',
                title: t('Delete Option'),
                message: t('Option has been deleted successfully'),
                duration: 3000,
              });
              setDeleteId('');
            },
          });
        }}
        message={t('Are you sure you want to delete this option?')}
      />
    </div>
  );
}
