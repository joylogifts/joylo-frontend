// import ActionMenu from '../../action-menu';
import Image from 'next/image';

// Interface
import { IActionMenuProps, IFoodNew } from '@/lib/utils/interfaces';

import ActionMenu from '../../action-menu';
import { ApolloError, useMutation } from '@apollo/client';
import {
  GET_FOODS_BY_RESTAURANT_ID,
  UPDATE_FOOD_OUT_OF_STOCK,
} from '@/lib/api/graphql';
import { useContext, useState } from 'react';
import { ToastContext } from '@/lib/context/global/toast.context';
import CustomInputSwitch from '../../custom-input-switch';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';

import { useLangTranslation } from '@/lib/context/global/language.context';

export const FOODS_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<IFoodNew>['items'];
}) => {
  // Hooks

  const { getTranslation, selectedLanguage } = useLangTranslation();

  // Context
  const { showToast } = useContext(ToastContext);
  const {
    restaurantLayoutContextData: { restaurantId },
  } = useContext(RestaurantLayoutContext);

  // State
  const [isFoodLoading, setIsFoodLoading] = useState<string>('');

  // API
  const [updateFoodOutOfStock] = useMutation(UPDATE_FOOD_OUT_OF_STOCK, {
    refetchQueries: [
      {
        query: GET_FOODS_BY_RESTAURANT_ID,
        variables: { id: restaurantId },
      },
    ],
    onCompleted: () => {
      showToast({
        type: 'success',
        title: getTranslation('food_stock'),
        message: getTranslation(`food_stock_status_has_been_changed`),
      });
      setIsFoodLoading('');
    },
    onError: ({ networkError, graphQLErrors }: ApolloError) => {
      showToast({
        type: 'error',
        title: getTranslation('food_stock'),
        message:
          networkError?.message ??
          graphQLErrors[0]?.message ??
          getTranslation('food_stock_status_failed'),
      });
      setIsFoodLoading('');
    },
  });

  // Handlers
  const onUpdateFoodOutOfStock = async (foodId: string, categoryId: string) => {
    try {
      setIsFoodLoading(foodId);

      await updateFoodOutOfStock({
        variables: {
          id: foodId,
          categoryId,
          restaurant: restaurantId,
        },
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: getTranslation('food_stock'),
        message: getTranslation('food_stock_status_failed'),
      });
      setIsFoodLoading('');
    }
  };

  return [
    {
      headerName: getTranslation('title'),
      propertyName: 'title',
      body: (item: IFoodNew) => (
        <div>
          {typeof item.title === 'object'
            ? item.title[selectedLanguage] || ''
            : item.title || ''}
        </div>
      ),
    },
    {
      headerName: getTranslation('description'),
      propertyName: 'description',
      body: (item: IFoodNew) => (
        <div>
          {typeof item.description === 'object'
            ? item.description[selectedLanguage] || ''
            : item.description || ''}
        </div>
      ),
    },
    {
      headerName: getTranslation('category'),
      propertyName: 'category.label',
      body: (item: IFoodNew) => (
        <div>
          {typeof item?.category?.label === 'object'
            ? item?.category?.label[selectedLanguage] || ''
            : item?.category?.label || ''}
        </div>
      ),
    },
    {
      headerName: getTranslation('image'),
      propertyName: 'image',
      body: (item: IFoodNew) =>
        item.image ? (
          <Image src={item.image} width={40} height={40} alt="item.png" />
        ) : (
          <></>
        ),
    },
    {
      headerName: getTranslation('out_of_stock'),
      propertyName: 'isOutOfStock',
      body: (item: IFoodNew) => {
        return (
          <CustomInputSwitch
            loading={isFoodLoading === item._id}
            isActive={item.isOutOfStock}
            onChange={() =>
              onUpdateFoodOutOfStock(item._id, item.category?.code ?? '')
            }
          />
        );
      },
    },
    {
      propertyName: 'actions',
      body: (option: IFoodNew) => {
        return <ActionMenu items={menuItems} data={option} />;
      },
    },
  ];
};
