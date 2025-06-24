import { IActionMenuProps, IAddon } from '@/lib/utils/interfaces';
import ActionMenu from '../../action-menu';
import { useTranslations } from 'next-intl';
import { useLangTranslation } from '@/lib/context/global/language.context';

export const ADDON_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<IAddon>['items'];
}) => {
  // Hooks
  const t = useTranslations();
  const { getTranslation } = useLangTranslation();

  return [
    { headerName: getTranslation('title'), propertyName: 'title' },
    { headerName: getTranslation('description'), propertyName: 'description' },
    { headerName: getTranslation('minimum'), propertyName: 'quantityMinimum' },
    { headerName: getTranslation('maximum'), propertyName: 'quantityMaximum' },
    {
      propertyName: 'actions',
      body: (option: IAddon) => (
        <ActionMenu items={menuItems} data={option} onToggle={() => {}} />
      ),
    },
  ];
};
