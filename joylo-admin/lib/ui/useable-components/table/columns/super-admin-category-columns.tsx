import { IActionMenuProps, ICategory } from '@/lib/utils/interfaces';
import ActionMenu from '../../action-menu';
import { ReactNode, } from 'react';
import { useTranslations } from 'next-intl';



interface ColumnDefinition {
  headerName: string;
  propertyName: string;
  body?: (data: ICategory) => ReactNode;
}



export const CATEGORY_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<ICategory>['items'];
}) => {
  // Hooks
  const t = useTranslations();



  // Define base columns
  const columns: ColumnDefinition[] = [];
  
  columns.push({ headerName: t('Title'), propertyName: 'title' })
  

  columns.push({
    propertyName: 'isActive',
    headerName: 'Status',
    body: (category: ICategory) => {
      return (
        <div className={`${category.isActive ? 'text-green-500' : 'text-orange-500'}`}>
          {category.isActive ? 'Active' : 'Inactive'}
        </div>
      );
    },
  });

  columns.push({
    propertyName: 'actions',
    headerName: '',
    body: (rider: ICategory) => {
      return (
        <div className="flex justify-between items-center">
          <ActionMenu items={menuItems} data={rider} />
        </div>
      );
    },
  });

  return columns;
};