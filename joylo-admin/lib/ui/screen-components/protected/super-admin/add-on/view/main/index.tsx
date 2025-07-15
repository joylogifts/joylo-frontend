// Core
import { useMutation } from '@apollo/client';
import { useState } from 'react';

// Prime React
import { FilterMatchMode } from 'primereact/api';

// Interface and Types
import {
  IActionMenuItem,
  IAddon,
  IAddonMainComponentsProps,
  IGetAddonsResponse,
  IQueryResult,
} from '@/lib/utils/interfaces';

// Components
import Table from '@/lib/ui/useable-components/table';
import { ADDON_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/super-admin-addon-columns';
import CategoryTableHeader from '../header/table-header';

// Utilities and Data
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';
import { generateDummyAddons } from '@/lib/utils/dummy';

// Context
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import useToast from '@/lib/hooks/useToast';

// GraphQL
import { DELETE_ADDON } from '@/lib/api/graphql';
import { GET_ADDONS } from '@/lib/api/graphql/queries/addon';

// Context
import { useTranslations } from 'next-intl';
import { useLangTranslation } from '@/lib/context/global/language.context';


export default function OptionMain({
  setIsAddAddonVisible,
  setAddon,
}: IAddonMainComponentsProps) {
  // Context

  // Hooks
  const { getTranslation: t, selectedLanguage } = useLangTranslation();
  const { showToast } = useToast();

  // State - Table
  const [deleteId, setDeleteId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<IAddon[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: '' as string | null, matchMode: FilterMatchMode.CONTAINS },
  });

  // Query
  const { data, loading } = useQueryGQL(
    GET_ADDONS,
    {},
    {
      fetchPolicy: 'network-only',
      onCompleted: onFetchAddonsByRestaurantCompleted,
      onError: onErrorFetchAddonsByRestaurant,
    }
  ) as IQueryResult<IGetAddonsResponse | undefined, undefined>;

  //Mutation
  const [deleteAddon, { loading: mutationLoading }] = useMutation(
    DELETE_ADDON,
    {
      variables: {
        id: deleteId,
      },
      refetchQueries: [
        {
          query: GET_ADDONS,
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

  // Restaurant Profile Complete
  function onFetchAddonsByRestaurantCompleted() { }
  // Restaurant Zone Info Error
  function onErrorFetchAddonsByRestaurant() {
    showToast({
      type: 'error',
      title: t('Addons Fetch'),
      message: t('Addons fetch failed'),
      duration: 2500,
    });
  }

  // Constants
  const menuItems: IActionMenuItem<IAddon>[] = [
    {
      label: t('Edit'),
      command: (data?: IAddon) => {
        if (data) {
          setIsAddAddonVisible(true);

          setAddon(data);
        }
      },
    },
    {
      label: t('Delete'),
      command: (data?: IAddon) => {
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
          data?.addons.slice().reverse() ||
          (loading ? generateDummyAddons() : [])
        }
        filters={filters}
        setSelectedData={setSelectedProducts}
        selectedData={selectedProducts}
        loading={loading}
        columns={ADDON_TABLE_COLUMNS({ menuItems })}
      />
      <CustomDialog
        loading={mutationLoading}
        visible={!!deleteId}
        onHide={() => {
          setDeleteId('');
        }}
        onConfirm={async () => {
          await deleteAddon({
            variables: { id: deleteId },
            onCompleted: () => {
              showToast({
                type: 'success',
                title: t('Delete Add-on'),
                message: t('Add-on has been deleted successfully'),
                duration: 3000,
              });
              setDeleteId('');
            },
          });
        }}
        message={t('Are you sure you want to delete this Add-on?')}
      />
    </div>
  );
}
