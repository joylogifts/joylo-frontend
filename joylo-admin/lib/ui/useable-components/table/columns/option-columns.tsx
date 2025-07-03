import { IActionMenuProps, IOptions } from '@/lib/utils/interfaces';
import ActionMenu from '../../action-menu';
import { useTranslations } from 'next-intl';
import CustomInputSwitch from '../../custom-input-switch';
import { useState } from 'react';

export const OPTION_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<IOptions>['items'];
}) => {
  // Hooks
  const t = useTranslations();
  const [isActive , setIsActive] = useState(false);
  const [selectedItem , setSelectedItem] = useState<null | string>(null);

  return [
    { headerName: t('Title'), propertyName: 'title' },
    { headerName: t('Price'), propertyName: 'price' },
    { headerName: t('Description'), propertyName: 'description' },
    {
      headerName : 'Status',
      propertyName: 'status',
      body : (item : IOptions) =>  {
        return (
            <CustomInputSwitch
              loading={false}
              isActive={isActive}
              onChange={() => {
                setSelectedItem(item._id)
                setIsActive(prev => !prev)
              }}
            />
        )
      }
    }
    // {
    //   propertyName: 'actions',
    //   body: (option: IOptions) => (
    //     <ActionMenu items={menuItems} data={option} />
    //   ),
    // },
  ];
};
