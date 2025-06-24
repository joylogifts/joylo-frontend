import { IActionMenuProps, IOptions } from '@/lib/utils/interfaces';
import ActionMenu from '../../action-menu';
import { useTranslations } from 'next-intl';
import { useLangTranslation } from '@/lib/context/global/language.context';

export const OPTION_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<IOptions>['items'];
}) => {
  // Hooks
  const t = useTranslations();
  const { getTranslation } = useLangTranslation();
  return [
    { headerName: getTranslation('title'), propertyName: 'title' },
    { headerName: getTranslation('price'), propertyName: 'price' },
    { headerName: getTranslation('description'), propertyName: 'description' },
    {
      propertyName: 'actions',
      body: (option: IOptions) => (
        <ActionMenu items={menuItems} data={option} />
      ),
    },
  ];
};
