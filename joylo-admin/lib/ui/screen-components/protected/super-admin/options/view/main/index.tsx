// Core
import { useState } from 'react';

// Prime React
import { FilterMatchMode } from 'primereact/api';

// Interface and Types

// Components
import Table from '@/lib/ui/useable-components/table';
import { OPTION_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/super-admin-option-columns';

// Utilities and Data
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';
import { IActionMenuItem } from '@/lib/utils/interfaces/action-menu.interface';

//Toast
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import useToast from '@/lib/hooks/useToast';
import {
  IOptions,
  IOptionsMainComponentsProps,
  IOptionsResponse,
  IQueryResult,
} from '@/lib/utils/interfaces';

// GraphQL
import { DELETE_OPTION, GET_OPTIONS } from '@/lib/api/graphql';
import { generateDummyOptions } from '@/lib/utils/dummy';
import { useMutation } from '@apollo/client';
import CategoryTableHeader from '../header/table-header';
import { useLangTranslation } from '@/lib/context/global/language.context';

export default function OptionMain({
  setIsAddOptionsVisible,
  setOption,
}: IOptionsMainComponentsProps) {
  // Context

  // Hooks
  const { showToast } = useToast();
    const {getTranslation} = useLangTranslation()

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
    {},
    {
      fetchPolicy: 'network-only',
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
      },
      refetchQueries: [
        {
          query: GET_OPTIONS,
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
      title: getTranslation('option_fetch'),
      message: getTranslation('options_fetch_failed'),
      duration: 2500,
    });
  }

  // Constants
  const menuItems: IActionMenuItem<IOptions>[] = [
    {
      label: getTranslation('edit'),
      command: (data?: IOptions) => {
        if (data) {
          setIsAddOptionsVisible(true);
          setOption(data);
        }
      },
    },
    {
      label: getTranslation('delete'),
      command: (data?: IOptions) => {
        if (data) {
          setDeleteId(data._id);
        }
      },
    },
  ];

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
        columns={OPTION_TABLE_COLUMNS({ menuItems })}
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
                title: getTranslation('delete_option'),
                message: getTranslation('option_deleted_successfully'),
                duration: 3000,
              });
              setDeleteId('');
            },
          });
        }}
        message={getTranslation('option_delete_confirmation')}
      />
    </div>
  );
}
