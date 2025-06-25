import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { useState } from 'react';
import {
  IEarningTableHeaderProps,
  OrderTypeEnum,
  PaymentMethodEnum,
} from '@/lib/utils/interfaces/earnings.interface';
import { useTranslations } from 'next-intl';
import { useLangTranslation } from '@/lib/context/global/language.context';

export default function EarningRestaurantTableHeader({
  globalFilterValue,
  onGlobalFilterChange,
  dateFilters,
  setDateFilters,
}: IEarningTableHeaderProps) {
  // Hooks
  const t = useTranslations();
  const { getTranslation } = useLangTranslation();

  // States
  const [errors, setErrors] = useState({ startDate: '', endDate: '' });

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

  const handleStartDateChange = (e: { value: Date | null }) => {
    const newStartDate = e.value ? e.value.toISOString() : '';
    if (
      dateFilters.endingDate &&
      new Date(newStartDate) > new Date(dateFilters.endingDate)
    ) {
      setErrors((prev) => ({
        ...prev,
        startDate: `${getTranslation('start_date_cannot_be_after_the_end_date')}.`,
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
        endDate: `${getTranslation('end_date_cannot_be_before_the_start_date')}.`,
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
          placeholder={`${getTranslation('select')} ${getTranslation('payment_method')})`}
        />
      </div>
    </div>
  );
}
