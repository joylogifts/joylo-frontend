import CustomTextField from '@/lib/ui/useable-components/input-field';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';
import { IOrderSuperAdminHeaderProps } from '@/lib/utils/interfaces';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { Checkbox } from 'primereact/checkbox';
import { OverlayPanel } from 'primereact/overlaypanel';
import React, { useRef } from 'react';
import classes from './order-superadmin.header.module.css';
import { IMenuItem } from '@/lib/utils/interfaces/orders/order-vendor.interface';

import { useTranslations } from 'next-intl';
import DateFilterCustomTab from '@/lib/ui/useable-components/date-filter-custom-tab';
import { useLangTranslation } from '@/lib/context/global/language.context';

const OrderSuperAdminTableHeader: React.FC<IOrderSuperAdminHeaderProps> = ({
  setSelectedActions,
  selectedActions,
  globalFilterValue,
  onGlobalFilterChange,
  dateFilter,
  handleDateFilter,
}) => {
  // Hooks
  const t = useTranslations();
  const { getTranslation } = useLangTranslation();

  // Refs
  const overlayPanelRef = useRef<OverlayPanel>(null);

  const toggleAction = (action: string) => {
    setSelectedActions((prevActions: string[]) =>
      prevActions.includes(action)
        ? prevActions.filter((a: string) => a !== action)
        : [...prevActions, action]
    );
  };

  const menuItems: IMenuItem[] = [
    { label: getTranslation('pending_cap'), value: 'PENDING' },
    { label: getTranslation('accepted_cap'), value: 'ACCEPTED' },
    { label: getTranslation('assigned_cap'), value: 'ASSIGNED' },
    { label: getTranslation('picked_cap'), value: 'PICKED' },
    { label: getTranslation('delivered_cap'), value: 'DELIVERED' },
    { label: getTranslation('cancelled_cap'), value: 'CANCELLED' },
  ];

  return (
    <div className="mb-4 flex flex-col gap-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="flex w-full flex-row items-center gap-4 sm:w-auto sm:flex-col">
          <div className="sm:hidden">
            <TextIconClickable
              className="flex h-10 w-10 items-center justify-center rounded-full border border-dotted border-[#E4E4E7]"
              icon={faAdd}
              iconStyles={{ color: 'black' }}
              onClick={(e) => overlayPanelRef.current?.toggle(e)}
            />
          </div>

          <CustomTextField
            type="text"
            name="riderFilter"
            maxLength={35}
            className="w-64"
            showLabel={false}
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder={getTranslation('search_orders')}
          />
        </div>

        <div className="hidden sm:block">
          <TextIconClickable
            className="w-44 rounded border border-dotted border-[#E4E4E7] text-black"
            icon={faAdd}
            iconStyles={{ color: 'black' }}
            title={getTranslation('orders_status')}
            onClick={(e) => overlayPanelRef.current?.toggle(e)}
          />
        </div>

        <DateFilterCustomTab
          options={[
            getTranslation('all'),
            getTranslation('today'),
            getTranslation('week'),
            getTranslation('month'),
            getTranslation('year'),
            getTranslation('custom'),
          ]}
          selectedTab={dateFilter.dateKeyword}
          setSelectedTab={(tab: string) =>
            handleDateFilter({ ...dateFilter, dateKeyword: tab })
          }
        />

        <OverlayPanel ref={overlayPanelRef} dismissable>
          <div className="w-60">
            <div className="border-b border-t py-1">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className={`${classes.filter} my-2 flex items-center justify-between`}
                >
                  <div className="flex items-center">
                    <Checkbox
                      inputId={`action-${item.value}`}
                      checked={selectedActions.includes(item.value)}
                      onChange={() => toggleAction(item.value)}
                      className={`${classes.checkbox}`}
                    />
                    <label
                      htmlFor={`action-${item.value}`}
                      className="ml-2 text-sm"
                    >
                      {item.label}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <p
              className="mt-3 cursor-pointer text-center text-sm"
              onClick={() => setSelectedActions([])}
            >
              {getTranslation('clear_filters')}
            </p>
          </div>
        </OverlayPanel>
      </div>
    </div>
  );
};

export default OrderSuperAdminTableHeader;
