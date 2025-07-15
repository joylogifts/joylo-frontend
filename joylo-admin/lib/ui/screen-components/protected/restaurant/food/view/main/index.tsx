// Core
import {
  LazyQueryResultTuple,
  QueryResult,
  useLazyQuery,
  useMutation,
  useQuery,
} from '@apollo/client';
import { useContext, useEffect, useState } from 'react';

// Prime React
import { FilterMatchMode } from 'primereact/api';

// Interface and Types
import {
  IActionMenuItem,
  IFood,
  IFoodByRestaurantResponse,
  IFoodNew,
  IQueryResult,
  ISubCategoryResponse,
  ISubCategorySingleResponse,
  IVariationForm,
} from '@/lib/utils/interfaces';

// Components
import Table from '@/lib/ui/useable-components/table';
import FoodsTableHeader from '../header/table-header';
import { FOODS_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/foods-columns';

// Utilities and Data
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';
import { generateDummyFoods } from '@/lib/utils/dummy';

// Context
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import { FoodsContext } from '@/lib/context/restaurant/foods.context';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';

// Hooks
import useToast from '@/lib/hooks/useToast';

// GraphQL
import { DELETE_FOOD } from '@/lib/api/graphql';
import {
  GET_FOODS_BY_RESTAURANT_ID,
} from '@/lib/api/graphql/queries';
import {
  GET_SUBCATEGORIES,
  GET_SUBCATEGORY,
} from '@/lib/api/graphql/queries/sub-categories';

import { useLangTranslation } from '@/lib/context/global/language.context';

export default function FoodsMain() {
  // Context
  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const { onSetFoodContextData, onFoodFormVisible } = useContext(FoodsContext);
  const restaurantId = restaurantLayoutContextData?.restaurantId || '';

  // Hooks

  const { showToast } = useToast();
  const { getTranslation } = useLangTranslation();

  // State - Table
  const [foodItems, setFoodItems] = useState<IFoodNew[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState({ id: '', categoryId: '' });
  const [selectedProducts, setSelectedProducts] = useState<IFoodNew[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: '' as string | null, matchMode: FilterMatchMode.CONTAINS },
  });

  // Query
  const {
    data: foodsData,
    loading,
    refetch,
  } = useQueryGQL(
    GET_FOODS_BY_RESTAURANT_ID,
    { id: restaurantId },  
    {
      fetchPolicy: 'network-only',
      enabled: !!restaurantId,
      onError: onErrorFetchFoodsByRestaurant,
    }
  ) as IQueryResult<IFoodByRestaurantResponse | undefined, undefined>;


 /*  const { data } = useQueryGQL(
    GET_ADDONS_BY_RESTAURANT_ID,
    { id: restaurantId },
    {
      fetchPolicy: 'network-only',
      enabled: !!restaurantId,
    }
  ) as IQueryResult<IAddonByRestaurantResponse | undefined, undefined>; */

  const [fetchSubcategory, { loading: subCategoriesLoading }] = useLazyQuery(
    GET_SUBCATEGORY,
    {
      fetchPolicy: 'network-only',
      refetchWritePolicy: 'overwrite',
      onError(err) {
        console.log({ err });
      },
    }
  ) as LazyQueryResultTuple<
    ISubCategorySingleResponse | undefined,
    { id: string }
  >;

  const { data: sub_categories } = useQuery(
    GET_SUBCATEGORIES
  ) as QueryResult<ISubCategoryResponse>;

  //Mutation
  const [deleteFood, { loading: mutationLoading }] = useMutation(DELETE_FOOD, {
    refetchQueries: [
      {
        query: GET_FOODS_BY_RESTAURANT_ID,
        variables: { id: restaurantId },
      },
    ],
    onCompleted: () => {
      showToast({
        type: 'success',
        title: getTranslation('delete_food'),
        message: `${getTranslation('food_has_been_deleted_successfully')}.`,
      });
      setDeleteId({ id: '', categoryId: '' });
      refetch();
    },
  });

  // Memoized Data
/*   const addons = useMemo(
    () =>
      data?.restaurant?.addons.map((addon: IAddon) => {
        return { label: addon.title, code: addon._id };
      }),
    [data?.restaurant?.addons]
  ); */

  // Handlers
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  // Restaurant Profile Complete
  function onFetchFoodsByRestaurantCompleted() {
    if (!foodsData) return;
    const refined_food_items: IFoodNew[] = [];
    setIsLoading(true);
    foodsData.restaurant.categories.map((ctg) =>
      ctg.foods.map((fd: IFood) => {
        return refined_food_items.push({
          __typename: fd.__typename,
          _id: fd._id,
          description: fd.description,
          image: fd.image,
          isActive: fd.isActive,
          isOutOfStock: fd.isOutOfStock,
          subCategory: {
            code: fd.subCategory,
            label: typeof sub_categories?.subCategories.find(
              (sub_ctg) => sub_ctg._id === fd.subCategory
            )?.title,
          },
          category: {
            code: ctg._id,
            label: ctg.title,
          },
          title: fd.title,
          variations: fd.variations,
          isReturnAble: fd.isReturnAble
        });
      })
    );
    setFoodItems(refined_food_items);
    setIsLoading(false);
  }
  // Restaurant Zone Info Error
  function onErrorFetchFoodsByRestaurant() {
    showToast({
      type: 'error',
      title: getTranslation('foods_fetch'),
      message: getTranslation('foods_fetch_failed'),
      duration: 2500,
    });
  }

  // Constants
  const menuItems: IActionMenuItem<IFoodNew>[] = [
    {
      label: getTranslation('edit'),
      command: async (data?: IFoodNew) => {
        if (subCategoriesLoading) {
          return console.log({ subCategoriesLoading });
        }

        const sub_ctg_id = foodsData?.restaurant.categories.flatMap((fd) =>
          fd.foods.filter((_fd) => _fd._id === data?._id)
        )[0].subCategory;

        await fetchSubcategory({
          variables: {
            id: sub_ctg_id || '',
          },
        });

        if (data && !subCategoriesLoading) {
          let _variation = null;
          const _variations =
            (data?.variations?.map(({ discounted, ...variation }) => {
              _variation = { ...variation };
              // delete _variation.__typename;

              return {
                ..._variation,
                discounted: discounted,
               /*  addons: variation?.addons?.map((addonId) => {
                  return (
                    addons?.find(
                      (addon: IDropdownSelectItem) => addon.code === addonId
                    ) ?? ({} as IDropdownSelectItem)
                  );
                }), */
              };
            }) as IVariationForm[]) ?? ([] as IVariationForm[]);

          if (!subCategoriesLoading) {
            await onSetFoodContextData({
              food: {
                _id: data._id ?? null,
                data: data,
                variations: _variations,
              },
              isEditing: true,
            });
            onFoodFormVisible(true);
          }
        }
      },
    },
    {
      label: getTranslation('delete'),
      command: (data?: IFoodNew) => {
        if (data) {
          setDeleteId({ id: data._id, categoryId: data?.category?.code ?? '' });
        }
      },
    },
  ];

  // Use Effect
  useEffect(() => {
    onFetchFoodsByRestaurantCompleted();
  }, [foodsData?.restaurant.categories]);

  return (
    <div className="p-3">
      <Table
        header={
          <FoodsTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
          />
        }
        data={foodItems || (loading || isLoading ? generateDummyFoods() : [])}
        filters={filters}
        setSelectedData={setSelectedProducts}
        selectedData={selectedProducts}
        loading={loading}
        columns={FOODS_TABLE_COLUMNS({ menuItems })}
      />
      <CustomDialog
        loading={mutationLoading}
        visible={!!deleteId?.id}
        onHide={() => {
          setDeleteId({ id: '', categoryId: '' });
        }}
        onConfirm={() => {
          deleteFood({
            variables: { ...deleteId, restaurant: restaurantId },
          });
        }}
        message={getTranslation('are_you_sure_you_want_to_delete_this_option')}
      />
    </div>
  );
}
