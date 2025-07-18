import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import {
  IQueryResult,
  IStoreRidersResponse,
  UserTypeEnum,
} from '@/lib/utils/interfaces';
import { useMemo, useState } from 'react';
import {
  IEarningTableHeaderProps,
  OrderTypeEnum,
  PaymentMethodEnum,
} from '@/lib/utils/interfaces/';
import { } from 'use-intl';

import { useQueryGQL } from '@/lib/hooks/useQueryQL';

import { GET_STORE_RIDER } from '@/lib/api/graphql/queries/concurrent';
import { useLangTranslation } from '@/lib/context/global/language.context';

export default function EarningTableHeader({
  globalFilterValue,
  onGlobalFilterChange,
  dateFilters,
  setDateFilters,
}: IEarningTableHeaderProps) {
  const [errors, setErrors] = useState({ startDate: '', endDate: '' });
  const [userType, setUserType] = useState<UserTypeEnum>();
  // Hooks

  const { getTranslation } = useLangTranslation();

  // Query
  const { data } = useQueryGQL(GET_STORE_RIDER, {
    fetchPolicy: 'network-only',
  }) as IQueryResult<IStoreRidersResponse | undefined, undefined>;

  const storesDropdown = useMemo(
    () =>
      data?.restaurants?.map((store) => {
        return { label: store.name, value: store._id };
      }),
    [data?.restaurants]
  );

  const ridersDropdown = useMemo(
    () =>
      data?.riders.map((rider) => {
        return { label: rider.name, value: rider._id };
      }),
    [data?.riders]
  );

  // Constants
  const userTypes = [
    { label: getTranslation('all'), value: UserTypeEnum.ALL },
    { label: getTranslation('rider'), value: UserTypeEnum.RIDER },
    { label: getTranslation('store'), value: UserTypeEnum.STORE },
  ];

  const orderTypes = [
    { label: getTranslation('all'), value: OrderTypeEnum.ALL },
    { label: getTranslation('delivery'), value: OrderTypeEnum.RIDER },
    { label: getTranslation('pickup'), value: OrderTypeEnum.STORE },
  ];

  const paymentTypes = [
    { label: getTranslation('all'), value: PaymentMethodEnum.ALL },
    { label: getTranslation('cod'), value: PaymentMethodEnum.COD },
    { label: getTranslation('paypal'), value: PaymentMethodEnum.PAYPAL },
    { label: getTranslation('stripe'), value: PaymentMethodEnum.STRIPE },
  ];

  // Handlers
  const handleStartDateChange = (e: { value: Date | null }) => {
    const newStartDate = e.value ? e.value.toISOString() : '';
    if (
      dateFilters.endingDate &&
      new Date(newStartDate) > new Date(dateFilters.endingDate)
    ) {
      setErrors((prev) => ({
        ...prev,
        startDate: getTranslation('start_date_cannot_be_after_the_end_date'),
      }));
      return;
    }
    setErrors((prev) => ({ ...prev, startDate: '' }));
    setDateFilters((prev) => ({ ...prev, startingDate: newStartDate }));
  };

  const handleEndDateChange = (e: { value: Date | null }) => {
    const newEndDate = e.value ? e.value.toISOString() : '';
    if (
      dateFilters.startingDate &&
      new Date(newEndDate) < new Date(dateFilters.startingDate)
    ) {
      setErrors((prev) => ({
        ...prev,
        endDate: getTranslation('end_date_cannot_be_before_the_start_date'),
      }));
      return;
    }
    setErrors((prev) => ({ ...prev, endDate: '' }));
    setDateFilters((prev) => ({ ...prev, endingDate: newEndDate }));
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-4">
        <span className="p-input-icon-left w-full md:w-auto">
          <i className="pi pi-search" />
          <InputText
            className="w-[14rem] h-10 border-[1px] border-gray-300 rounded-[0.3rem] pl-3 pr-3"
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder={getTranslation('search')}
          />
        </span>
        <div className="flex flex-col">
          <Calendar
            className="w-[14rem] h-10 border-[1px] border-gray-300 rounded-[0.3rem] pl-3 pr-3 text-sm"
            placeholder={getTranslation('start_date')}
            value={
              dateFilters.startingDate
                ? new Date(dateFilters.startingDate)
                : null
            }
            onChange={(e) => handleStartDateChange(e as { value: Date | null })}
            dateFormat="dd/mm/yy"
            showIcon
          />
          {errors.startDate && (
            <small className="mt-1 text-xs text-red-500">
              {errors.startDate}
            </small>
          )}
        </div>
        <div className="flex flex-col">
          <Calendar
            className="w-[14rem] h-10 border-[1px] border-gray-300 rounded-[0.3rem] pl-3 pr-3 text-sm"
            placeholder={getTranslation('end_date')}
            value={
              dateFilters.endingDate ? new Date(dateFilters.endingDate) : null
            }
            onChange={(e) => handleEndDateChange(e as { value: Date | null })}
            dateFormat="dd/mm/yy"
            showIcon
          />
          {errors.endDate && (
            <small className="mt-1 text-xs text-red-500">
              {errors.endDate}
            </small>
          )}
        </div>
        <Dropdown
          className="w-[14rem] h-10 border-[1px] border-gray-300 rounded-[0.3rem] pl-3 pr-3 text-sm"
          options={userTypes}
          value={userType}
          onChange={(e) => {
            if (e.value === UserTypeEnum.ALL) {
              setDateFilters((prev) => ({
                ...prev,
                userType: e.value,
                userId: undefined,
              }));
            } else {
              setUserType(e.value);
            }
          }}
          placeholder={`${getTranslation('select')} ${getTranslation('user')} ${getTranslation('type')}`}
        />
        {userType !== undefined && userType !== 'ALL' && (
          <Dropdown
            className="w-[14rem] h-10 border-[1px] border-gray-300 rounded-[0.3rem] pl-3 pr-3 text-sm"
            options={userType === 'RIDER' ? ridersDropdown : storesDropdown}
            value={dateFilters.userId}
            onChange={(e) =>
              setDateFilters((prev) => ({ ...prev, userType, userId: e.value }))
            }
            placeholder={getTranslation('select_user_id')}
          />
        )}
        <Dropdown
          className="w-[14rem] h-10 border-[1px] border-gray-300 rounded-[0.3rem] pl-3 pr-3 text-sm"
          options={orderTypes}
          value={dateFilters.orderType}
          onChange={(e) =>
            setDateFilters((prev) => ({ ...prev, orderType: e.value }))
          }
          placeholder={`${getTranslation('select')} ${getTranslation('order')} ${getTranslation('type')}`}
        />
        <Dropdown
          className="w-[14rem] h-10 border-[1px] border-gray-300 rounded-[0.3rem] pl-3 pr-3 text-sm"
          options={paymentTypes}
          value={dateFilters.paymentMethod}
          onChange={(e) =>
            setDateFilters((prev) => ({ ...prev, paymentMethod: e.value }))
          }
          placeholder={getTranslation(
            `${getTranslation('select')} ${getTranslation('payment_method')}`
          )}
        />
      </div>
    </div>
  );
}
