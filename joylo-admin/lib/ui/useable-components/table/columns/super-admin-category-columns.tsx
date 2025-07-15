import { IActionMenuProps, ICategory } from '@/lib/utils/interfaces';
import ActionMenu from '../../action-menu';
import { ReactNode } from 'react';
import { useLangTranslation } from '@/lib/context/global/language.context';

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
  const { getTranslation, selectedLanguage } = useLangTranslation();

  // Define base columns
  const columns: ColumnDefinition[] = [];

  columns.push({
    headerName: getTranslation('title'),
    propertyName: 'title',
    body: (data: ICategory) => (
      <span className="text-sm">
        {typeof data?.title === 'object'
          ? data?.title[selectedLanguage] || ''
          : data?.title || ''}
      </span>
    ),
  });

  columns.push({
    propertyName: 'isActive',
    headerName: getTranslation('status'),
    body: (category: ICategory) => {
      return (
        <div
          className={`${category.isActive ? 'text-green-500' : 'text-orange-500'}`}
        >
          {category.isActive ? getTranslation('active') : getTranslation('in-active')}
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
