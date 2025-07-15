import { IActionMenuProps, IOptions } from '@/lib/utils/interfaces';
import ActionMenu from '../../action-menu';
import { useLangTranslation } from '@/lib/context/global/language.context';

export const OPTION_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<IOptions>['items'];
}) => {
  // Hooks
  const { getTranslation: t, selectedLanguage } = useLangTranslation();
  return [
    {
      headerName: t('title'), propertyName: 'title', body: (option: IOptions) => (
        <span>{typeof option.title === "object" ? option.title[selectedLanguage].toString() : option?.title ?? '---'}</span>
      )
    },
    { headerName: t('price'), propertyName: 'price' },
    {
      headerName: t('description'),
      propertyName: 'description',
      body: (option: IOptions) => (
        <span>{typeof option.description === "object" ? option.description[selectedLanguage].toString() : option.description ?? '---'}</span>
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
