import { useLangTranslation } from '@/lib/context/global/language.context';
import { IExtendedOrder } from '@/lib/utils/interfaces';

const dateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: true,
};

export const ORDER_COLUMNS = () => {
  // Hooks

  const { getTranslation } = useLangTranslation();
  return [
    {
      headerName: getTranslation('order_id'),
      propertyName: 'orderId',
    },
    {
      propertyName: 'itemsTitle',
      headerName: getTranslation('items'),
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
      headerName: getTranslation('created_at'),
      propertyName: 'DateCreated',
      body: (rowData: IExtendedOrder) => {
        const formatedDate = new Date(
          Number(rowData?.createdAt)
        ).toLocaleDateString('en-US', dateOptions);
        return <span>{formatedDate}</span>;
      },
    },
    {
      headerName: getTranslation('delivery_address'),
      propertyName: 'OrderdeliveryAddress',
    },
  ];
};
