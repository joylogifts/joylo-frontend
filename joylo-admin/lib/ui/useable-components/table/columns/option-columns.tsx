import { IActionMenuProps, IOptions } from '@/lib/utils/interfaces';
import ActionMenu from '../../action-menu';

import { useLangTranslation } from '@/lib/context/global/language.context';

export const OPTION_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<IOptions>['items'];
}) => {
  // Hooks
  const { getTranslation, selectedLanguage } = useLangTranslation();
  return [
    {
      headerName: getTranslation('title'),
      propertyName: 'title',
      body: (option: IOptions) => (
        <span className="text-sm">
          {typeof option?.title === 'object'
            ? option?.title[selectedLanguage] || ''
            : option?.title || ''}
        </span>
      ),
    },
    {
      headerName: getTranslation('image'),
      propertyName: 'image',
    },
    { headerName: getTranslation('price'), propertyName: 'price' },
    {
      headerName: getTranslation('description'),
      propertyName: 'description',
      body: (option: IOptions) => (
        <span className="text-sm">
          {typeof option?.description === 'object'
            ? option?.description[selectedLanguage] || ''
            : option?.description || ''}
        </span>
      ),
    },

    {
      propertyName: 'actions',
      body: (option: IOptions) => (
        <ActionMenu items={menuItems} data={option} />
      ),
    },
  ];
};
