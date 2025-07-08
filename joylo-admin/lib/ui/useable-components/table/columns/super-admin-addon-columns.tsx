import { IActionMenuProps, IAddon } from '@/lib/utils/interfaces';
import ActionMenu from '../../action-menu';
import { useTranslations } from 'next-intl';


export const ADDON_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<IAddon>['items'];
}) => {
  // Hooks
  const t = useTranslations();


  return [
    { headerName: t('Title'), propertyName: 'title' },
    { 
      headerName: t('Description'), 
      propertyName: 'description',
      body : (item :IAddon) => {
        return (
          <div>
            {item.description ?? '---'}
          </div>
        )
      } 
    },
    { 
      headerName: t('Category'), 
      propertyName: 'categoryIds' ,
      body : (item : IAddon) => {
        return (
          <div className='flex flex-col gap-1'>
            {item.categoryIds?.length}
          </div>
        )
      }
    },
    { 
      headerName: t('options'), 
      propertyName: 'options' ,
      body : (item: IAddon) => {
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
        <ActionMenu items={menuItems} data={option} onToggle={() => {}} />
      ),
    },
  ];
};
