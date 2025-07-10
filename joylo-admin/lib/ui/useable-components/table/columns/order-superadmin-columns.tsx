import { useLangTranslation } from '@/lib/context/global/language.context';
import { IExtendedOrder } from '@/lib/utils/interfaces';
import { } from 'next-intl';
const dateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: true,
};

export const ORDER_SUPER_ADMIN_COLUMNS = () => {
  // Hooks

  const { getTranslation } = useLangTranslation();
  return [
    {
      headerName: getTranslation('order_id'),
      propertyName: 'orderId',
    },
    {
      headerName: getTranslation('items'),
      propertyName: 'itemsTitle',
    },
    {
      headerName: getTranslation('payment'),
      propertyName: 'paymentMethod',
    },
    {
      headerName: getTranslation('order_status'),
      propertyName: 'orderStatus',
    },
    {
      headerName: getTranslation('reason'),
      propertyName: 'reason',
      body: (rowData: IExtendedOrder) => {
        if (!rowData.reason) {
          return <span>-</span>;
        }
        return <span>{rowData.reason}</span>;
      },
    },
    {
      headerName: getTranslation('created_at'),
      propertyName: 'DateCreated',
      body: (rowData: IExtendedOrder) => {
        let date: string | number | Date = Number(rowData?.createdAt || null);
        if (date) {
          const newDate = new Date(date).toLocaleDateString(
            'en-US',
            dateOptions
          );
          return <span className="text-center">{newDate}</span>;
        }
      },
    },
    {
      headerName: getTranslation('delivery_address'),
      propertyName: 'OrderdeliveryAddress',
    },
  ];
};
