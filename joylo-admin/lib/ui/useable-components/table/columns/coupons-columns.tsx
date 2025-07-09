// Interfaces
import { IActionMenuProps } from '@/lib/utils/interfaces';
import { ICoupon } from '@/lib/utils/interfaces/coupons.interface';

// Components
import CustomInputSwitch from '../../custom-input-switch';
import ActionMenu from '../../action-menu';

// Hooks
import { useContext, useMemo, useState } from 'react';
import moment from 'moment';
import { useMutation } from '@apollo/client';

//GraphQL
import { EDIT_COUPON, GET_COUPONS } from '@/lib/api/graphql';

// Contexts
import { ToastContext } from '@/lib/context/global/toast.context';
import { useTranslations } from 'next-intl';
import { useLangTranslation } from '@/lib/context/global/language.context';

export const COUPONS_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<ICoupon>['items'];
}) => {
  // Hooks
  const { showToast } = useContext(ToastContext);
  // Hooks
  const t = useTranslations();
  const { getTranslation } = useLangTranslation();

  // States
  const [editCouponLoading, setEditCouponLoading] = useState({
    _id: '',
    bool: false,
  });

  // Mutations
  const [editCoupon, { loading }] = useMutation(EDIT_COUPON, {
    refetchQueries: [{ query: GET_COUPONS }],
    onCompleted: () => {
      showToast({
        title: getTranslation('edit_coupon'),
        type: 'success',
        message: getTranslation('coupon_status_has_been_edited_successfully'),
        duration: 2500,
      });
      setEditCouponLoading({
        _id: '',
        bool: false,
      });
    },
    onError: (err) => {
      showToast({
        title: getTranslation('edit_coupon'),
        type: 'error',
        message:
          err.message ||
          err?.cause?.message ||
          getTranslation('something_went_wrong_please_try_again'),
        duration: 2500,
      });
      setEditCouponLoading({
        bool: false,
        _id: '',
      });
    },
  });

  // Handlers
  async function handleEnableField(rowData: ICoupon) {
    setEditCouponLoading({
      bool: true,
      _id: rowData._id,
    });
    const updatedCoupon = {
      _id: rowData?._id,
      title: rowData?.title,
      discount: rowData?.discount,
      enabled: !rowData?.enabled,
      endDate: rowData?.endDate,
      lifeTimeActive: rowData?.lifeTimeActive,
    };
    await editCoupon({
      variables: {
        couponInput: updatedCoupon,
      },
    });
  }

  // Columns
  const coupon_columns = useMemo(
    () => [
      {
        headerName: getTranslation('name'),
        propertyName: '__typename',
      },
      {
        headerName: getTranslation('code'),
        propertyName: 'title',
      },
      {
        headerName: getTranslation('discount'),
        propertyName: 'discount',
        body: (rowData: ICoupon) => {
          return <span>{rowData.discount}%</span>;
        },
      },
      {
        headerName: getTranslation('lifetime_active'),
        propertyName: 'lifeTimeActive',
        body: (rowData: ICoupon) => (
          <span>
            {rowData.lifeTimeActive
              ? getTranslation('yes')
              : getTranslation('no')}
          </span>
        ),
      },
      {
        headerName: getTranslation('end_date'),
        propertyName: 'endDate',
        body: (rowData: ICoupon) => (
          <span>
            {rowData.endDate
              ? moment(rowData.endDate).format('YYYY-MM-DD')
              : '-'}
          </span>
        ),
      },

      {
        headerName: getTranslation('status'),
        propertyName: 'enabled',
        body: (rowData: ICoupon) => {
          return (
            <div className="flex w-full cursor-pointer items-center justify-between gap-2">
              <div className="flex w-20 items-start">
                <CustomInputSwitch
                  isActive={rowData.enabled}
                  className={
                    rowData?.enabled
                      ? 'p-inputswitch-checked absolute'
                      : 'absolute'
                  }
                  onChange={() => handleEnableField(rowData)}
                  loading={rowData._id === editCouponLoading._id && loading}
                />
              </div>
              <ActionMenu data={rowData} items={menuItems} />
            </div>
          );
        },
      },
    ],
    [loading, editCouponLoading.bool, menuItems]
  );
  return coupon_columns;
};
