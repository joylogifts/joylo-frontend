import {  ICategory} from '@/lib/utils/interfaces';
import {  ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import CustomInputSwitch from '../../custom-input-switch';



interface ColumnDefinition {
  headerName: string;
  propertyName: string;
  body?: (data: ICategory) => ReactNode;
}


export const CATEGORY_TABLE_COLUMNS = () => {
  // Hooks

  // const { getTranslation, selectedLanguage } = useLangTranslation();

  // Define base columns
  const columns: ColumnDefinition[] = [];
  
  columns.push({ headerName: t('Title'), propertyName: 'title' })
  
  
  // Add subcategories column if shop type is grocery
  // if (shopType === 'grocery') {
  //   columns.push({
  //     headerName: t('Subcategories'),
  //     propertyName: 'subcategories',
  //     body: (category: ICategory) => <SubcategoryCell categoryId={category._id} />
  //   });
  // }

  columns.push({
    headerName : 'Status',
    propertyName: 'status',
    body : () =>  {
      return (
          <CustomInputSwitch
            loading={false}
            isActive={false}
            onChange={() => {
              // setSelectedItem(item._id)
              // setIsActive(prev => !prev)
            }}
          />
      )
    }
  })
  
  // Add actions column
  
  // columns.push({
  //   propertyName: 'actions',
  //   headerName: '',
  //   body: (rider: ICategory) => {
  //     return (
  //       <div className="flex justify-between items-center">
  //         {shopType === 'grocery' && (
  //           <div>
  //             <TextIconClickable
  //               icon={faAdd}
  //               onClick={() =>
  //                 setIsAddSubCategoriesVisible({
  //                   bool: true,
  //                   parentCategoryId: rider._id,
  //                 })
  //               }
  //               title={t('Add Sub-Category')}
  //               className="border border-gray-400 border-dashed"
  //             />
  //           </div>
  //         )}
  //         <ActionMenu items={menuItems} data={rider} />
  //       </div>
  //     );
  //   },
  // });

  return columns;
};
