import { IActionMenuProps, IAddon } from '@/lib/utils/interfaces';
import ActionMenu from '../../action-menu';

import { useLangTranslation } from '@/lib/context/global/language.context';

export const ADDON_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<IAddon>['items'];
}) => {
  // Hooks

  const { getTranslation, selectedLanguage } = useLangTranslation();

  return [
    {
      headerName: getTranslation('title'),
      propertyName: 'title',
      body: (addon: IAddon) => (
        <span className="text-sm">
          {typeof addon?.title === 'object'
            ? addon?.title[selectedLanguage] || ''
            : addon?.title || ''}
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
      body: (addon: IAddon) => (
        <span className="text-sm">
          {typeof addon?.description === 'object'
            ? addon?.description[selectedLanguage] || ''
            : addon?.description || ''}
        </span>
      ),
    },
    { headerName: getTranslation('minimum'), propertyName: 'quantityMinimum' },
    { headerName: getTranslation('maximum'), propertyName: 'quantityMaximum' },
    {
      propertyName: 'actions',
      body: (option: IAddon) => (
        <ActionMenu items={menuItems} data={option} onToggle={() => { }} />
      ),
    },
  ];
};
