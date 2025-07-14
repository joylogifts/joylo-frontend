
import { useContext, useState } from 'react';

// Prime React
import { FilterMatchMode } from 'primereact/api';

// Interface and Types
import {
  IAddon,
  IGetAddonsResponse,
  IQueryResult,
} from '@/lib/utils/interfaces';

// Components
import Table from '@/lib/ui/useable-components/table';
import { ADDON_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/addon-columns';
import CategoryTableHeader from '../header/table-header';


import { generateDummyAddons } from '@/lib/utils/dummy';

// Context
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import useToast from '@/lib/hooks/useToast';


import { GET_ADDONS } from '@/lib/api/graphql/queries/addon';

// Context
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import { } from 'next-intl';
import { useLangTranslation } from '@/lib/context/global/language.context';

export default function OptionMain() {
  // Context
  const { restaurantLayoutContextData : { restaurantId } } = useContext(RestaurantLayoutContext);

  // Hooks

  const { getTranslation } = useLangTranslation();
  const { showToast } = useToast();


  const [selectedProducts, setSelectedProducts] = useState<IAddon[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: '' as string | null, matchMode: FilterMatchMode.CONTAINS },
  });

  // Query
  const { data, loading } = useQueryGQL(
    GET_ADDONS,
    { storeId: restaurantId },
    {
      fetchPolicy: 'network-only',
      enabled: !!restaurantId,
      onCompleted: onFetchAddonsByRestaurantCompleted,
      onError: onErrorFetchAddonsByRestaurant,
    }
  ) as IQueryResult<IGetAddonsResponse | undefined, undefined>;

  

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
      title: getTranslation('addons_fetch'),
      message: getTranslation('addons_fetch_failed'),
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
          data?.addons.slice().reverse() ||
          (loading ? generateDummyAddons() : [])
        }
        filters={filters}
        setSelectedData={setSelectedProducts}
        selectedData={selectedProducts}
        loading={loading}
        columns={ADDON_TABLE_COLUMNS()}
      />
      
    </div>
  );
}
