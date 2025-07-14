import Image from 'next/image';
import { IPendingProduct } from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl';

export const PENDING_PRODUCT_COLUMNS = ({ status } : { status : string }) => {



	const columns = [
		{ headerName: 'Title', propertyName: 'productData.title' },
		{ headerName: 'Description', propertyName: 'productData.description' },
		{
			headerName: 'Category',
			propertyName: 'categoryId.title'
		},
		{
			headerName: 'Image',
			propertyName: 'productData.image',
			body: (item: IPendingProduct) =>
				item.productData.image ? (
					<Image src={item.productData.image} width={40} height={40} alt="item.png" />
				) : (
					<></>
				),
		},
		{
			headerName: 'Status',
			propertyName: 'status',
			body: (item: IPendingProduct) => {
				console.log({ item })
				return (
					<div
						className={`capitalize ${item.status === 'pending' ? 'text-yellow-500' : item.status === 'approved' ? 'text-green-500' : 'text-red-500'
							}`}
					>
						{item.status}
					</div>
				);
			},
		},
	];

	if(status === 'rejected') {
		columns.push({
			headerName: 'Rejection Reason',
			propertyName: 'reason'
		})
	}

	return columns;
};
