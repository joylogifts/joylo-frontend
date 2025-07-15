
import CustomInputSwitch from '../../custom-input-switch';
import { useContext, useState } from 'react';
import { IOptions } from '@/lib/utils/interfaces';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import useToast from '@/lib/hooks/useToast';
import { ApolloError, useMutation } from '@apollo/client';
import { ENABLE_STORE_OPTION, GET_OPTIONS } from '@/lib/api/graphql';
import { useLangTranslation } from '@/lib/context/global/language.context';

export const OPTION_TABLE_COLUMNS = () => {
  // Hooks
  const { getTranslation: t, selectedLanguage } = useLangTranslation();
  const { showToast } = useToast();

  const {
    restaurantLayoutContextData: { restaurantId },
  } = useContext(RestaurantLayoutContext);
  // State
  const [isOptionLoading, setIsOptionLoading] = useState<string>('');

  // API
  const [toggelOptionStatus] = useMutation(ENABLE_STORE_OPTION, {
    refetchQueries: [
      {
        query: GET_OPTIONS,
        variables: { storeId: restaurantId },
      },
    ],
    onCompleted: () => {
      showToast({
        type: 'success',
        title: 'Option Status',
        message: 'Option status has been updated.',
      });
      setIsOptionLoading('');
    },
    onError: ({ networkError, graphQLErrors }: ApolloError) => {
      showToast({
        type: 'error',
        title: 'Option Status',
        message:
          networkError?.message ??
          graphQLErrors[0]?.message ??
          'Option status failed to change',
      });
      setIsOptionLoading('');
    },
  });

  // Handlers
  const onToggelOptionStatus = async (optionId: string, status: boolean) => {
    try {
      setIsOptionLoading(optionId);

      await toggelOptionStatus({
        variables: {
          enabled: status,
          optionId,
          storeId: restaurantId,
        },
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Option Status',
        message: 'Option status failed to change',
      });
      setIsOptionLoading('');
    }
  };

  return [
    {
      headerName: t('Title'), propertyName: 'title', body: (item: IOptions) => {
        return (
          <div>
            {typeof item.title === "object" ? item.title[selectedLanguage] : item.title ?? '---'}
          </div>
        )
      }
    },
    { headerName: t('Price'), propertyName: 'price' },
    {
      headerName: t('Description'),
      propertyName: 'description',
      body: (item: IOptions) => {
        return (
          <div>
            {typeof item.description === "object" ? item.description[selectedLanguage] : item.description ?? '---'}
          </div>
        )
      }

    },
    {
      headerName: 'Status',
      propertyName: 'status',
      body: (item: IOptions) => {
        return (
          <CustomInputSwitch
            isActive={item.isActive ? item.isActive : false}
            loading={isOptionLoading === item._id}
            onChange={() => {
              onToggelOptionStatus(item._id.toString(), !item.isActive)
            }}
          />
        )
      }
    }
    // {
    //   propertyName: 'actions',
    //   body: (option: IOptions) => (
    //     <ActionMenu items={menuItems} data={option} />
    //   ),
    // },
  ];
};
