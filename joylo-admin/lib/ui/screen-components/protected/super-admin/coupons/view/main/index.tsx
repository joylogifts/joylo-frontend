// CSS
import './index.module.css';

// GraphQL
import { DELETE_COUPON, GET_COUPONS } from '@/lib/api/graphql';
import { useLazyQueryQL } from '@/lib/hooks/useLazyQueryQL';

// Interfaces
import {
  IActionMenuItem,
  IEditState,
  ILazyQueryResult,
} from '@/lib/utils/interfaces';
import {
  ICoupon,
  ICouponMainProps,
  IGetCouponsData,
} from '@/lib/utils/interfaces/coupons.interface';
import { IFilterType } from '@/lib/utils/interfaces/table.interface';

// Prime react
import { FilterMatchMode } from 'primereact/api';

// Hooks
import { useContext, useEffect, useState } from 'react';

import { useMutation } from '@apollo/client';

// Components
import { ToastContext } from '@/lib/context/global/toast.context';
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';
import Table from '@/lib/ui/useable-components/table';
import CouponTableHeader from '../header/table-header';

// Constants
import { generateDummyCoupons } from '@/lib/utils/dummy';
import { COUPONS_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/coupons-columns';
import { useLangTranslation } from '@/lib/context/global/language.context';

export default function CouponsMain({
  setVisible,
  isEditing,
  setIsEditing,
}: ICouponMainProps) {
  // Hooks

  const { getTranslation } = useLangTranslation();
  // Toast
  const { showToast } = useContext(ToastContext);

  // States
  const [selectedData, setSelectedData] = useState<ICoupon[]>([]);
  const [isDeleting, setIsDeleting] = useState<IEditState<ICoupon>>({
    bool: false,
    data: {
      __typename: '',
      _id: '',
      discount: 0,
      enabled: false,
      title: '',
      endDate: null,
      lifeTimeActive: false,
    },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Filters
  const filters: IFilterType = {
    global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },

    enabled: {
      value:
        selectedActions.includes('true') && selectedActions.includes('false')
          ? ''
          : selectedActions,
      matchMode: FilterMatchMode.CONTAINS,
    },
  };

  // Queries
  const { data, error, loading, fetch } = useLazyQueryQL(GET_COUPONS, {
    fetchPolicy: 'network-only',
    debounceMs: 5000,
    onCompleted: () => {
      console.log('onCompleted called!');
    },
  }) as ILazyQueryResult<IGetCouponsData | undefined, undefined>;

  // Mutations
  const [deleteCoupon, { loading: deleteCouponLoading }] = useMutation(
    DELETE_COUPON,
    {
      refetchQueries: [{ query: GET_COUPONS }],
      onCompleted: () => {
        showToast({
          title: getTranslation('delete_coupon'),
          type: 'success',
          message: getTranslation('coupon_has_been_deleted_successfully'),
          duration: 2000,
        });
      },
      onError: (err) => {
        showToast({
          title: getTranslation('delete_coupon'),
          type: 'error',
          message:
            err.message ||
            getTranslation('an_unknown_error_occurred_please_try_again'),
          duration: 2000,
        });
      },
    }
  );

  // Delete Item
  async function deleteItem() {
    await deleteCoupon({
      variables: {
        id: isDeleting?.data?._id,
      },
    });
    setIsDeleting({
      bool: false,
      data: {
        __typename: '',
        _id: '',
        discount: 0,
        enabled: false,
        title: '',
        endDate: null,
        lifeTimeActive: false,
      },
    });
  }

  // Menu Items
  const menuItems: IActionMenuItem<ICoupon>[] = [
    {
      label: getTranslation('edit'),
      command: (data?: ICoupon) => {
        if (data) {
          setIsEditing({
            bool: true,
            data: data,
          });
          setIsDeleting({
            bool: false,
            data: { ...isDeleting.data },
          });
        }
      },
    },
    {
      label: getTranslation('delete'),
      command: (data?: ICoupon) => {
        if (data) {
          setIsDeleting({
            bool: true,
            data: data,
          });
          setIsEditing({
            bool: false,
            data: { ...isEditing.data },
          });
        }
      },
    },
  ];

  // UseEffects
  useEffect(() => {
    if (isEditing.bool) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [data, isEditing.bool]);

  useEffect(() => {
    setIsLoading(true);
    fetch();
  }, []);

  useEffect(() => {
    if (!loading) {
      console.log('Query done. Data:', data);
      console.log('Query error:', error);
      setIsLoading(false);
    }
  }, [loading]);

  return (
    <div className="p-3">
      <Table
        columns={COUPONS_TABLE_COLUMNS({ menuItems })}
        data={data?.coupons || (isLoading ? generateDummyCoupons() : [])}
        selectedData={selectedData}
        setSelectedData={(e) => setSelectedData(e)}
        loading={isLoading}
        header={
          <CouponTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={(e) => setGlobalFilterValue(e.target.value)}
            selectedActions={selectedActions}
            setSelectedActions={setSelectedActions}
          />
        }
        filters={filters}
      />
      <CustomDialog
        onConfirm={deleteItem}
        onHide={() =>
          setIsDeleting({
            bool: false,
            data: {
              __typename: '',
              _id: '',
              discount: 0,
              enabled: false,
              title: '',
              endDate: '',
              lifeTimeActive: false,
            },
          })
        }
        visible={isDeleting.bool}
        loading={deleteCouponLoading}
        message={getTranslation('are_you_sure_to_delete_the_coupon')}
      />
    </div>
  );
}
