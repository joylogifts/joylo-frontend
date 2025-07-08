import { IAddon } from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl';
import CustomInputSwitch from '../../custom-input-switch';
import { useContext, useState } from 'react';
import {
  ENABLE_STORE_ADDON,
  GET_ADDONS
} from '@/lib/api/graphql';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import { ApolloError, useMutation } from '@apollo/client';
import useToast from '@/lib/hooks/useToast';


export const ADDON_TABLE_COLUMNS = () => {
  // Hooks
  const t = useTranslations();
  const { showToast } = useToast();

  const {
    restaurantLayoutContextData: { restaurantId },
  } = useContext(RestaurantLayoutContext);
  // State
  const [isAddonLoading, setIsAddonLoading] = useState<string>('');

  // API
  const [toggleAddonStatus] = useMutation(ENABLE_STORE_ADDON, {
    refetchQueries: [
      {
        query: GET_ADDONS,
        variables: { storeId : restaurantId },
      },
    ],
    onCompleted: () => {
      showToast({
        type: 'success',
        title: 'Addon Status',
        message: 'Addon status has been updated.',
      });
      setIsAddonLoading('');
    },
    onError: ({ networkError, graphQLErrors }: ApolloError) => {
      showToast({
        type: 'error',
        title: 'Addon Status',
        message:
          networkError?.message ??
          graphQLErrors[0]?.message ??
          'Addon status failed to change',
      });
      setIsAddonLoading('');
    },
  });

  // Handlers
  const onToggleAddonStatus = async (addonId: string, status: boolean) => {
    try {
      setIsAddonLoading(addonId);

      await toggleAddonStatus({
        variables: {
          enabled: status,
          addonId,
          storeId: restaurantId,
        },
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Addon Status',
        message: 'Addon status failed to change',
      });
      setIsAddonLoading('');
    }
  };

  return [
    { headerName: t('Title'), propertyName: 'title' },
    { 
      headerName: t('Description'), 
      propertyName: 'description',
      body : (item : IAddon) => {
        return (
          <div>
            {item?.description ?? '---'}
          </div>
        )
      }
    },
    { 
      headerName: t('Category'), 
      propertyName: 'categoryIds',
      body : (item : IAddon) => {
        return (
          <div className='flex flex-col gap-1'>
            {item.categoryIds?.map((item :string) => <span key={item}>{item}</span>)}
          </div>
        )
      }
    },
    // { headerName: t('Sub-Category'), propertyName: 'subCategoryId.title' },
    {
      headerName: 'Status',
      propertyName: 'isActive',
      body: (item: IAddon) => {
        return (
          <CustomInputSwitch
            loading={isAddonLoading === item._id}
            isActive={item.isActive}
            onChange={() => {
              onToggleAddonStatus(item._id.toString(), !item.isActive)
            }}
          />
        );
      },
    },
    // {
    //   propertyName: 'actions',
    //   body: (option: IAddon) => (
    //     <ActionMenu items={menuItems} data={option} onToggle={() => {}} />
    //   ),
    // },
  ];
};
