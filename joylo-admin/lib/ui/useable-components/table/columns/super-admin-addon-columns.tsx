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
  const { getTranslation: t, selectedLanguage } = useLangTranslation();


  return [
    {
      headerName: t('Title'), propertyName: 'title', body: (item: IAddon) => {
        return (
          <div>
            {typeof item.title === "object" ? item?.title[selectedLanguage] : item?.title ?? '---'}
          </div>
        )
      }
    },
    {
      headerName: t('Description'),
      propertyName: 'description',
      body: (item: IAddon) => {
        return (
          <div>
            {typeof item.description === "object" ? item?.description[selectedLanguage] : item?.description ?? '---'}
          </div>
        )
      }
    },
    {
      headerName: t('Category'),
      propertyName: 'categoryIds',
      body: (item: IAddon) => {
        return (
          <div className='flex flex-col gap-1'>
            {item.categoryIds?.length}
          </div>
        )
      }
    },
    {
      headerName: t('options'),
      propertyName: 'options',
      body: (item: IAddon) => {
        return (
          <div key={item._id}>
            {item.options.length ?? 0}
          </div>
        )
      }

    },
    {
      propertyName: 'actions',
      body: (option: IAddon) => (
        <ActionMenu items={menuItems} data={option} onToggle={() => { }} />
      ),
    },
  ];
};
