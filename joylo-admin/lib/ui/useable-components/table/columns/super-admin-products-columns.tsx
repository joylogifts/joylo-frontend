import Image from 'next/image';
import { IActionMenuProps, IPendingProduct } from '@/lib/utils/interfaces';
import ActionMenu from '../../action-menu';
import { useLangTranslation } from '@/lib/context/global/language.context';

interface Props {
    menuItems: IActionMenuProps<IPendingProduct>['items'];
    status: string;
}

export const SUPER_ADMIN_PRODUCTS_COLUMNS = ({ menuItems, status }: Props) => {
    const { getTranslation, selectedLanguage } = useLangTranslation();
    const columns = [
        {
            headerName: getTranslation('title'), propertyName: 'productData.title', body: (item: IPendingProduct) => {
                return (
                    <div>
                        {typeof item.productData.title === "object" ? item.productData.title[selectedLanguage] : item.productData.title ?? '---'}
                    </div>
                )
            }
        },
        { headerName: getTranslation('store'), propertyName: 'storeId.name' },
        {
            headerName: getTranslation('category'),
            propertyName: 'categoryId.title',
            body: (item: IPendingProduct) => {
                return (
                    <div className='flex flex-col gap-1'>
                        {typeof item.categoryId.title === "object" ? item.categoryId.title[selectedLanguage] : item.categoryId.title ?? '---'}
                    </div>
                )
            }
        },
        {
            headerName: getTranslation('image'),
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
            headerName: getTranslation('status'),
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
            headerName: getTranslation('actions'),
            propertyName: 'actions',
            body: (item: IPendingProduct) => (
                <ActionMenu items={menuItems} data={item} />
            ),
        });
    }

    if (status === 'rejected') {
        columns.push({
            headerName: getTranslation('reason'),
            propertyName: 'reason'
        });
    }

    return columns;
};
