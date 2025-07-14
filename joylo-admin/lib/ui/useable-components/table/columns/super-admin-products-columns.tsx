import Image from 'next/image';
import { IActionMenuProps, IPendingProduct } from '@/lib/utils/interfaces';
import ActionMenu from '../../action-menu';

interface Props {
    menuItems: IActionMenuProps<IPendingProduct>['items'];
    status: string;
}

export const SUPER_ADMIN_PRODUCTS_COLUMNS = ({ menuItems, status }: Props) => {
    const columns = [
        { headerName: 'Title', propertyName: 'productData.title' },
        { headerName: 'Store', propertyName: 'storeId.name' },
        {
            headerName: 'Category',
            propertyName: 'categoryId.title',
        },
        {
            headerName: 'Image',
            propertyName: 'productData.image',
            body: (item: IPendingProduct) =>
                item.productData.image ? (
                    <Image
                        src={item.productData.image}
                        width={40}
                        height={40}
                        alt="item.png"
                    />
                ) : null,
        },
        {
            headerName: 'Status',
            propertyName: 'status',
            body: (item: IPendingProduct) => (
                <div
                    className={`capitalize ${item.status === 'pending' ? 'text-yellow-500' : item.status === 'approved' ? 'text-green-500' : 'text-red-500'
                        }`}
                >
                    {item.status}
                </div>
            ),
        },
    ];

    if (status === 'pending') {
        columns.push({
            headerName: 'Actions',
            propertyName: 'actions',
            body: (item: IPendingProduct) => (
                <ActionMenu items={menuItems} data={item} />
            ),
        });
    }

    if(status === 'rejected') {
         columns.push({
            headerName: 'Reason',
            propertyName: 'reason'
        });
    }

    return columns;
};
