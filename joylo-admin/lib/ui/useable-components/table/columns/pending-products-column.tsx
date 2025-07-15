import Image from 'next/image';
import { IPendingProduct } from '@/lib/utils/interfaces';
import { useLangTranslation } from '@/lib/context/global/language.context';

export const PENDING_PRODUCT_COLUMNS = ({ status }: { status: string }) => {

	const { selectedLanguage } = useLangTranslation();

	const columns = [
		{
			headerName: 'Title', propertyName: 'productData.title', body: (item: IPendingProduct) => {
				return (
					<div>
						{typeof item.productData.title === "object" ? item.productData.title[selectedLanguage] : item.productData.title ?? '---'}
					</div>
				)
			}
		},
		{
			headerName: 'Description', propertyName: 'productData.description',
			body: (item: IPendingProduct) => {
				return (
					<div>
						{typeof item.productData.description === "object" ? item.productData.description[selectedLanguage] : item.productData.description ?? '---'}
					</div>
				)
			}
		},
		{
			headerName: 'Category',
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

	if (status === 'rejected') {
		columns.push({
			headerName: 'Rejection Reason',
			propertyName: 'reason',
			body: (item: IPendingProduct) => {
				return (
					<div>
						{typeof item?.reason === "object" && item?.reason !== null ? item?.reason[selectedLanguage] : item?.reason ?? '---'}
					</div>
				);
			},
		})
	}

	return columns;
};
