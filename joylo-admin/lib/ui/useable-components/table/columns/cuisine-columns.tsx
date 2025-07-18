// Interfaces
import { IActionMenuProps } from '@/lib/utils/interfaces';
import { ICuisine } from '@/lib/utils/interfaces/cuisine.interface';

// Components
import ActionMenu from '../../action-menu';
import Image from 'next/image';

// Hooks
import { useMemo } from 'react';

import { useLangTranslation } from '@/lib/context/global/language.context';

export const CUISINE_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<ICuisine>['items'];
}) => {
  // Hooks

  const { getTranslation, selectedLanguage } = useLangTranslation();

  // Cuisine Columns
  const cuisine_columns = useMemo(
    () => [
      {
        headerName: getTranslation('image'),
        propertyName: 'image',
        body: (data: ICuisine) => (
          <div className="flex h-8 w-8 items-center justify-start overflow-hidden rounded-md">
            <Image
              src={
                data?.image ||
                'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
              }
              alt={
                typeof data?.description === 'object'
                  ? data?.description?.[selectedLanguage] ||
                  getTranslation('cuisine')
                  : data?.description || getTranslation('cuisine')
              }
              width={100}
              height={100}
            />
          </div>
        ),
      },
      {
        headerName: getTranslation('name'),
        body: (data: ICuisine) => (
          <span className="text-sm">
            {typeof data?.name === 'object'
              ? data?.name[selectedLanguage] || ''
              : data?.name || ''}
          </span>
        ),
        propertyName: 'name',
      },
      {
        headerName: getTranslation('description'),
        propertyName: 'description',
        body: (data: ICuisine) => (
          <span className="text-sm">
            {typeof data?.description === 'object'
              ? data?.description?.[selectedLanguage] || ''
              : data?.description || ''}
          </span>
        ),
      },
      {
        headerName: getTranslation('shop_category'),
        propertyName: 'shopType',
      },
      {
        headerName: getTranslation('actions'),
        propertyName: 'action',
        body: (rowData: ICuisine) => (
          <div className="three-dots">
            <ActionMenu data={rowData} items={menuItems} />
          </div>
        ),
      },
    ],
    [menuItems]
  );
  return cuisine_columns;
};
