'use client';

// Core
import Image from 'next/image';
import { useContext, useState } from 'react';

// Context
import { ToastContext } from '@/lib/context/global/toast.context';

// Apollo Client
import { ApolloError, useMutation } from '@apollo/client';

// Custom Components
import CustomInputSwitch from '../../custom-input-switch';

// Interfaces
import { IActionMenuProps, IRestaurantResponse } from '@/lib/utils/interfaces';

// GraphQL Queries and Mutations
import { DELETE_RESTAURANT } from '@/lib/api/graphql';

// Components
import ActionMenu from '../../action-menu';
import { useTranslations } from 'next-intl';
import { useLangTranslation } from '@/lib/context/global/language.context';

export const RESTAURANT_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<IRestaurantResponse>['items'];
}) => {
  // Hooks
  const t = useTranslations();
  const { getTranslation } = useLangTranslation();

  // Context
  const { showToast } = useContext(ToastContext);

  // State
  const [deletingRestaurant, setDeletingRestaurant] = useState<{
    id: string;
    isActive: boolean;
  }>({ id: '', isActive: false });

  // API
  const [deleteRestaurant] = useMutation(DELETE_RESTAURANT, {
    onCompleted: () => {
      showToast({
        type: 'success',
        title: getTranslation('store_status'),
        message: `${getTranslation('store_has_been_marked_as')} ${deletingRestaurant.isActive ? getTranslation('in-active') : getTranslation('active')}`,
        duration: 2000,
      });
    },
    onError,
  });

  // Handle checkbox change
  const onHandleRestaurantStatusChange = async (
    isActive: boolean,
    id: string
  ) => {
    try {
      setDeletingRestaurant({
        id,
        isActive,
      });
      await deleteRestaurant({ variables: { id: id } });
    } catch (err) {
      showToast({
        type: 'error',
        title: getTranslation('store_status'),
        message: `${getTranslation('store_marked_as')} ${isActive ? getTranslation('in-active') : getTranslation('active')} ${getTranslation('failed')}`,
        duration: 2000,
      });
    } finally {
      setDeletingRestaurant({
        ...deletingRestaurant,
        id: '',
      });
    }
  };

  function onError({ graphQLErrors, networkError }: ApolloError) {
    showToast({
      type: 'error',
      title: getTranslation('store_status_change'),
      message:
        graphQLErrors[0]?.message ??
        networkError?.message ??
        getTranslation('status_change_failed'),
      duration: 2500,
    });

    setDeletingRestaurant({
      ...deletingRestaurant,
      id: '',
    });
  }

  return [
    {
      headerName: getTranslation('image'),
      propertyName: 'image',
      body: (restaurant: IRestaurantResponse) => {
        return (
          <Image
            width={30}
            height={30}
            alt={getTranslation('store')}
            src={
              restaurant.image
                ? restaurant.image
                : 'https://images.unsplash.com/photo-1595418917831-ef942bd9f9ec?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            }
          />
        );
      },
    },
    { headerName: getTranslation('id'), propertyName: 'unique_restaurant_id' },
    { headerName: getTranslation('name'), propertyName: 'name' },
    { headerName: getTranslation('vendor'), propertyName: 'username' },
    {
      headerName: getTranslation('email'),
      propertyName: 'owner.email',
    },
    { headerName: getTranslation('address'), propertyName: 'address' },
    {
      headerName: getTranslation('status'),
      propertyName: 'actions',
      body: (rowData: IRestaurantResponse) => {
        return (
          <CustomInputSwitch
            className="prevent-row-click"
            loading={rowData?._id === deletingRestaurant?.id}
            isActive={rowData.isActive}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              e.stopPropagation();
              onHandleRestaurantStatusChange(rowData.isActive, rowData._id);
            }}
          />
        );
      },
    },
    {
      headerName: getTranslation('actions'),
      propertyName: 'actions',
      body: (rowData: IRestaurantResponse) => (
        <ActionMenu items={menuItems} data={rowData} />
      ),
    },
  ];
};
