// Core
import Image from 'next/image';
// Custom Components
import ActionMenu from '@/lib/ui/useable-components/action-menu';
// Interfaces and Types
import { IActionMenuProps } from '@/lib/utils/interfaces/action-menu.interface';
import { IBannersResponse } from '@/lib/utils/interfaces/banner.interface';

import { useLangTranslation } from '@/lib/context/global/language.context';
// Interfaces and Types
export const BANNERS_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<IBannersResponse>['items'];
}) => {
  // Hooks

  const { getTranslation, selectedLanguage } = useLangTranslation();

  return [
    {
      headerName: getTranslation('image'),
      propertyName: 'image',
      body: (product: IBannersResponse) => {
        if (product.file.includes('video')) {
          return (
            <video
              autoPlay
              src={product.file}
              width={40}
              height={40}
              loop
              muted
            />
          );
        } else {
          return (
            <Image
              width={40}
              height={40}
              alt="Banner"
              src={
                product.file
                  ? product.file
                  : 'https://images.unsplash.com/photo-1595418917831-ef942bd9f9ec?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              }
            />
          );
        }
      },
    },
    {
      headerName: getTranslation('title'),
      propertyName: 'title',
      body: (banner: IBannersResponse) => (
        <span className="text-sm">
          {typeof banner.description === 'object'
            ? banner.description?.[selectedLanguage] || ''
            : banner.description || ''}
        </span>
      ),
    },
    {
      headerName: getTranslation('description'),
      propertyName: 'description',
      body: (banner: IBannersResponse) => (
        <span className="text-sm">
          {typeof banner.description === 'object'
            ? banner.description?.[selectedLanguage] || ''
            : banner.description || ''}
        </span>
      ),
    },
    { headerName: getTranslation('screen'), propertyName: 'screen' },
    { headerName: getTranslation('actions'), propertyName: 'action' },
    {
      propertyName: 'actions',
      body: (banner: IBannersResponse) => (
        <ActionMenu items={menuItems} data={banner} />
      ),
    },
  ];
};
