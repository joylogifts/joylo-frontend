import { useLangTranslation } from '@/lib/context/global/language.context';
import { IActionMenuProps } from '@/lib/utils/interfaces';
import { IEarning } from '@/lib/utils/interfaces';


export const EARNING_COLUMNS = ({
  isSuperAdmin = false,
}: {
  menuItems: IActionMenuProps<IEarning>['items'];
  isSuperAdmin?: boolean;
}) => {
  // Hooks

  const { getTranslation } = useLangTranslation();

  console.log({ isSuperAdmin });

  // Columns
  return [
    {
      headerName: getTranslation('order_id'),
      propertyName: 'orderId',
    },
    {
      headerName: getTranslation('created_at'),
      propertyName: 'createdAt',
      body: (earning: IEarning) => {
        const date = new Date(earning?.createdAt);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        return <div>{formattedDate}</div>;
      },
    },
    {
      headerName: getTranslation('order_type'),
      propertyName: 'orderType',
    },
    {
      headerName: getTranslation('payment_method'),
      propertyName: 'paymentMethod',
    },
    {
      headerName: getTranslation('platform_earnings'),
      propertyName: 'platformEarnings.totalEarnings',
      hidden: !isSuperAdmin,
      body: (earning: IEarning) =>
        isSuperAdmin ? (
          <div>${earning?.platformEarnings?.totalEarnings?.toFixed(2)}</div>
        ) : (
          <span>-</span>
        ),
    },
    {
      headerName: getTranslation('store') + ' ' + getTranslation('id'),
      propertyName: 'storeEarnings.storeId.username',
      body: (earning: IEarning) => (
        <div>{earning?.storeEarnings?.storeId?.username}</div>
      ),
    },
    {
      headerName: getTranslation('store_earnings'),
      propertyName: 'storeEarnings.totalEarnings.',

      body: (earning: IEarning) => (
        <div>${earning?.storeEarnings?.totalEarnings?.toFixed(2)}</div>
      ),
    },
    {
      headerName: getTranslation('rider') + ' ' + getTranslation('id'),
      propertyName: 'riderEarnings.riderId.username',
      hidden: !isSuperAdmin,
      body: (earning: IEarning) => (
        <div>{earning?.riderEarnings?.riderId?.username}</div>
      ),
    },
    {
      headerName: getTranslation('riders') + ' ' + getTranslation('earnings'),
      propertyName: 'riderEarnings.totalEarnings',
      hidden: !isSuperAdmin,
      body: (earning: IEarning) => (
        <div>${earning?.riderEarnings?.totalEarnings?.toFixed(2)}</div>
      ),
    },
  ];
};
