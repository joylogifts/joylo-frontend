// Core
import { useState } from 'react';

// Prime React
import { FilterMatchMode } from 'primereact/api';

// Interface and Types

// Components
import Table from '@/lib/ui/useable-components/table';
import { CATEGORY_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/super-admin-category-columns';

// Utilities and Data
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';
import { IActionMenuItem } from '@/lib/utils/interfaces/action-menu.interface';

//Toast
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import useToast from '@/lib/hooks/useToast';
import {
  ICategoriesResponse,
  ICategory,
  ICategoryMainComponentsProps,
  IQueryResult,
} from '@/lib/utils/interfaces';

// GraphQL
import {
  DELETE_CATEGORY,
  GET_CATEGORIES,
} from '@/lib/api/graphql';
import { generateDummyCategories } from '@/lib/utils/dummy';
import { useMutation } from '@apollo/client';
import CategoryTableHeader from '../header/table-header';
import { useLangTranslation } from '@/lib/context/global/language.context';

export default function CategoryMain({
  setIsAddCategoryVisible,
  setCategory,
}: ICategoryMainComponentsProps) {

  // Hooks
  const { showToast } = useToast();
    const { getTranslation } = useLangTranslation();

  // State - Table
  const [deleteId, setDeleteId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<ICategory[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: '' as string | null, matchMode: FilterMatchMode.CONTAINS },
  });

  // Queries
  const { data, loading } = useQueryGQL(
    GET_CATEGORIES,
    {},
    {
      fetchPolicy: 'network-only'
    }
  ) as IQueryResult<ICategoriesResponse | undefined, undefined>;


  //Mutation
  const [deleteCategory, { loading: mutationLoading }] = useMutation(
    DELETE_CATEGORY,
    {
      variables: {
        id: deleteId,
      },
      refetchQueries: [
        {
          query: GET_CATEGORIES,
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

  


  // Constants
  const menuItems: IActionMenuItem<ICategory>[] = [
    {
      label: getTranslation('edit'),
      command: (data?: ICategory) => {
        console.log({ data })
        if (data) {
          setIsAddCategoryVisible(true);
          setCategory(data);
        }
      },
    },
    {
      label: getTranslation('delete'),
      command: (data?: ICategory) => {
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
          data?.categories.slice().reverse() ||
          (loading ? generateDummyCategories() : [])
        }
        filters={filters}
        setSelectedData={setSelectedProducts}
        selectedData={selectedProducts}
        loading={loading}
        columns={CATEGORY_TABLE_COLUMNS({
          menuItems,
        })}
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
                title: getTranslation('delete_category'),
                message: `${getTranslation('category_deleted_successfully')}.`,
                duration: 3000,
              });
              setDeleteId('');
            },
            onError: (err) => {
              showToast({
                type: 'error',
                title:  getTranslation('delete_category'),
                message:
                  err.message ||
                  err.clientErrors[0].message ||
                  err.networkError?.message ||
                  getTranslation(
                    'category_deletion_failed'
                  ),
              });
            },
          });
        }}
        message={getTranslation('category_delete_confirmation')}
      />
    </div>
  );
}
