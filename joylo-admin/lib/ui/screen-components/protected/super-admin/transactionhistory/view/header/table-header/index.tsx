import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { ITransactionHistoryTableHeaderProps } from '@/lib/utils/interfaces';
import { useState } from 'react';

import { useLangTranslation } from '@/lib/context/global/language.context';

export default function TransactionHistoryTableHeader({
  globalFilterValue,
  onGlobalFilterChange,
  dateFilters,
  setDateFilters,
}: ITransactionHistoryTableHeaderProps) {
  // Hooks

  const { getTranslation } = useLangTranslation();

  // States
  const [errors, setErrors] = useState({ startDate: '', endDate: '' });

  const userTypes = [
    { label: getTranslation('all'), value: 'ALL' },
    { label: getTranslation('rider'), value: 'RIDER' },
    { label: getTranslation('store'), value: 'STORE' },
  ];

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
    <div className="flex flex-row gap-4 p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-row gap-4 md:flex-row">
        <div className="flex flex-col">
          <Calendar
            className="w-[14rem] h-10 border-[1px] border-gray-300 rounded-[0.3rem] pl-3 pr-3 text-black"
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
            <small className="p-error">{errors.startDate}</small>
          )}
        </div>
        <div className="flex flex-col">
          <Calendar
            className="w-[14rem] h-10 border-[1px] border-gray-300 rounded-[0.3rem] pl-3 pr-3 text-black"
            placeholder={getTranslation('end_date')}
            value={
              dateFilters.endingDate ? new Date(dateFilters.endingDate) : null
            }
            onChange={(e) => handleEndDateChange(e as { value: Date | null })}
            dateFormat="dd/mm/yy"
            showIcon
          />
          {errors.endDate && (
            <small className="p-error">{errors.endDate}</small>
          )}
        </div>
        <div className="mx-8">
          <Dropdown
            className="w-[14rem] h-10 border-[1px] border-gray-300 rounded-[0.3rem]  text-black"
            options={userTypes}
            value={dateFilters.userType || null}
            onChange={(e) =>
              setDateFilters((prev) => ({
                ...prev,
                userType: e.value,
              }))
            }
            placeholder={`${getTranslation('select')} ${getTranslation('user')} ${getTranslation('type')}`}
          />
        </div>
      </div>
      <div className="flex gap-4">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            className="w-[14rem] h-10 border-[1px] font-light border-gray-300 rounded-[0.3rem] pl-3 pr-3 text-black"
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder={getTranslation('search')}
          />
        </span>
      </div>
    </div>
  );
}
