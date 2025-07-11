import { IActionMenuProps, IOptions } from '@/lib/utils/interfaces';
import ActionMenu from '../../action-menu';
import { useTranslations } from 'next-intl';

export const OPTION_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<IOptions>['items'];
}) => {
  // Hooks
  const t = useTranslations();
  return [
    { headerName: t('Title'), propertyName: 'title' },
    { headerName: t('Price'), propertyName: 'price' },
    { 
      headerName: t('Description'), 
      propertyName: 'description', 
      body: (option: IOptions) => (
        <span>{option.description.toString() ?? '---'}</span>
      )
    },
    {
      propertyName: 'actions',
      body: (option: IOptions) => (
        <ActionMenu items={menuItems} data={option} />
      ),
    },
  ];
};
