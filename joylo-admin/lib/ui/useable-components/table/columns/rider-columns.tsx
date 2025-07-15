// Core
import { useContext, useState } from 'react';

// Custom Components
import ActionMenu from '@/lib/ui/useable-components/action-menu';
import CustomInputSwitch from '../../custom-input-switch';

// Interfaces and Types
import { IActionMenuProps } from '@/lib/utils/interfaces/action-menu.interface';
import { IRiderResponse } from '@/lib/utils/interfaces/rider.interface';

// GraphQL
import { GET_RIDERS, TOGGLE_RIDER } from '@/lib/api/graphql';
import { useMutation } from '@apollo/client';
import { ToastContext } from '@/lib/context/global/toast.context';

import { toTextCase } from '@/lib/utils/methods';
import { useLangTranslation } from '@/lib/context/global/language.context';
// import { toTextCase } from '@/lib/utils/methods';

export const RIDER_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<IRiderResponse>['items'];
}) => {
  // Hooks

  const { getTranslation } = useLangTranslation();

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRider, setSelectedRider] = useState<{
    id: string;
    isActive: boolean;
  }>({ id: '', isActive: false });

  const { showToast } = useContext(ToastContext);

  // GraphQL mutation hook
  const [mutateToggle, { loading }] = useMutation(TOGGLE_RIDER, {
    refetchQueries: [{ query: GET_RIDERS }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      setIsLoading(false);
      showToast({
        type: 'success',
        title: getTranslation('banner_status'),
        message: getTranslation('status_change_successfully'),
      });
    },
    onError: () => {
      setIsLoading(false);
      showToast({
        type: 'error',
        title: getTranslation('banner_status'),
        message: getTranslation('status_change_failed'),
      });
    },
  });

  // Handle availability toggle
  const onHandleBannerStatusChange = async (isActive: boolean, id: string) => {
    try {
      setIsLoading(true);
      setSelectedRider({ id, isActive });
      await mutateToggle({ variables: { id } });
    } catch (error) {
      showToast({
        type: 'error',
        title: getTranslation('banner_status'),
        message: getTranslation('something_went_wrong'),
      });
    } finally {
      setSelectedRider({ id: '', isActive: false });
      setIsLoading(false);
    }
  };

  return [
    { headerName: getTranslation('name'), propertyName: 'name' },
    { headerName: getTranslation('username'), propertyName: 'username' },
    { headerName: getTranslation('phone'), propertyName: 'phone' },
    {
      headerName: getTranslation('zone'),
      propertyName: 'zone',
      body: (rider: IRiderResponse) => rider.zone.title,
    },
    {
      headerName: getTranslation('vehicle_type'),
      propertyName: 'vehicleType',
      body: (rider: IRiderResponse) =>
        toTextCase(rider.vehicleType.replaceAll('_', ' '), 'title'),
    },
    {
      headerName: getTranslation('available'),
      propertyName: 'available',
      body: (rider: IRiderResponse) => (
        <CustomInputSwitch
          loading={rider._id === selectedRider.id && (loading || isLoading)}
          isActive={rider.available}
          onChange={async () => {
            if (loading || isLoading) return;
            await onHandleBannerStatusChange(!rider.available, rider._id);
          }}
        />
      ),
    },
    {
      propertyName: 'actions',
      body: (rider: IRiderResponse) => (
        <ActionMenu items={menuItems} data={rider} />
      ),
    },
  ];
};
