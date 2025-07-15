// Interfaces and Types
import { useLangTranslation } from '@/lib/context/global/language.context';
import { IVendorStoreDetails } from '@/lib/utils/interfaces';


export const VENDOR_STORE_DETAILS_COLUMN = () => {
  // Hooks

  const { getTranslation } = useLangTranslation();

  return [
    {
      headerName: getTranslation('store_name'),
      propertyName: 'restaurantName',
    },
    {
      headerName: getTranslation('total_orders'),
      propertyName: 'totalOrders',
      body: (store: IVendorStoreDetails) => store.totalOrders.toLocaleString(),
    },
    {
      headerName: getTranslation('total_sales'),
      propertyName: 'totalSales',
      body: (store: IVendorStoreDetails) => `$${store.totalSales.toFixed(2)}`,
    },
    {
      headerName: getTranslation('pickup_orders'),
      propertyName: 'pickUpCount',
      body: (store: IVendorStoreDetails) => store.pickUpCount.toLocaleString(),
    },
    {
      headerName: getTranslation('delivery_orders'),
      propertyName: 'deliveryCount',
      body: (store: IVendorStoreDetails) =>
        store.deliveryCount.toLocaleString(),
    },
  ];
};
