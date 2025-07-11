// Core
import { useContext, useState } from 'react';

// Prime React
import { FilterMatchMode } from 'primereact/api';


// Components
import Table from '@/lib/ui/useable-components/table';
import { CATEGORY_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/category-columns';

// Utilities and Data

//Toast
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import useToast from '@/lib/hooks/useToast';
import {
  ICategoriesResponse,
  ICategory,
  IQueryResult,
} from '@/lib/utils/interfaces';

// GraphQL
import {
  GET_CATEGORIES,
} from '@/lib/api/graphql';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import { generateDummyCategories } from '@/lib/utils/dummy';
import CategoryTableHeader from '../header/table-header';
import SubCategoriesPreiwModal from '../modal';
import { } from 'next-intl';
import { useLangTranslation } from '@/lib/context/global/language.context';

export default function CategoryMain() {
  // Hooks


  // Context
  const {
    restaurantLayoutContextData,
    subCategoryParentId,
    isSubCategoryModalOpen,
    setIsSubCategoryModalOpen,
  } = useContext(RestaurantLayoutContext);

  const shopType = restaurantLayoutContextData?.shopType || '';
  console.log("🚀 ~ shopType:", shopType)

  // Hooks
  const { showToast } = useToast();
  const { getTranslation } = useLangTranslation();

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
      fetchPolicy: 'network-only',
      onCompleted: onFetchCategoriesByRestaurantCompleted,
      onError: onErrorFetchCategoriesByRestaurant,
    }
  ) as IQueryResult<ICategoriesResponse | undefined, undefined>;


  // Handlers
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };


  // Restaurant Profile Complete
  function onFetchCategoriesByRestaurantCompleted() {}

  // Restaurant Zone Info Error
  function onErrorFetchCategoriesByRestaurant() {
    showToast({
      type: 'error',
      title: getTranslation('category_fetch'),
      message: getTranslation('categories_fetch_failed'),
      duration: 2500,
    });
  }

  return (
    <div className="p-3">
      {/* Sub-CTG Preview Modal  */}
      <SubCategoriesPreiwModal
        isSubCategoryModalOpen={isSubCategoryModalOpen}
        setIsSubCategoryModalOpen={setIsSubCategoryModalOpen}
        subCategoryParentId={subCategoryParentId}
      />
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
        columns={CATEGORY_TABLE_COLUMNS()}
      />

    </div>
  );
}
