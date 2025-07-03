import { IActionMenuProps, IAddon } from '@/lib/utils/interfaces';
import ActionMenu from '../../action-menu';
import { useTranslations } from 'next-intl';
import CustomInputSwitch from '../../custom-input-switch';
import { useContext, useState } from 'react';
import {
  GET_ADDONS_BY_RESTAURANT_ID,
  TOGGLE_ADDON_STATUS,
} from '@/lib/api/graphql';
import { RestaurantLayoutContext } from '@/lib/context/super-admin/layout-restaurant.context';
import { ApolloError, useMutation } from '@apollo/client';
import useToast from '@/lib/hooks/useToast';

export const ADDON_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<IAddon>['items'];
}) => {
  // Hooks
  const t = useTranslations();
  const { showToast } = useToast();

  const {
    restaurantLayoutContextData: { restaurantId },
  } = useContext(RestaurantLayoutContext);
  // State
  const [isAddonLoading, setIsAddonLoading] = useState<string>('');

  // API
  const [toggleAddonStatus] = useMutation(TOGGLE_ADDON_STATUS, {
    refetchQueries: [
      {
        query: GET_ADDONS_BY_RESTAURANT_ID,
        variables: { id: restaurantId },
      },
    ],
    onCompleted: () => {
      showToast({
        type: 'success',
        title: 'Addon Status',
        message: 'Addon status can be updated.',
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
          status,
          addonId,
          restaurant: restaurantId,
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
    { headerName: t('Description'), propertyName: 'description' },
    { headerName: t('Minimum'), propertyName: 'quantityMinimum' },
    { headerName: t('Maximum'), propertyName: 'quantityMaximum' },
    { headerName: t('Category'), propertyName: 'categoryId.title' },
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
    {
      propertyName: 'actions',
      body: (option: IAddon) => (
        <ActionMenu items={menuItems} data={option} onToggle={() => {}} />
      ),
    },
  ];
};
