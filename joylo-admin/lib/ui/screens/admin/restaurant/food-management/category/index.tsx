// Hooks
import { useContext } from 'react';

// Components
import CategoryAddForm from '@/lib/ui/screen-components/protected/restaurant/category/add-form';
import CategoryHeader from '@/lib/ui/screen-components/protected/restaurant/category/view/header/screen-header';
import CategoryMain from '@/lib/ui/screen-components/protected/restaurant/category/view/main';
import SubCategoriesAddForm from '@/lib/ui/screen-components/protected/restaurant/category/add-subcategories';

// Contexts
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';

export default function CategoryScreen() {
  // Contexts
  const {
    isAddSubCategoriesVisible,
    setIsAddSubCategoriesVisible,
    category,
    setCategory,
    setSubCategories,
  } = useContext(RestaurantLayoutContext);

  return (
    <div className="screen-container">
      <CategoryHeader  />

      <CategoryMain />
      {/* Sub Categories Form  */}
      <SubCategoriesAddForm
        onHide={() => {
          setIsAddSubCategoriesVisible({
            bool: false,
            parentCategoryId: '',
          });
          setCategory(null);
          setSubCategories([]);
        }}
        isAddSubCategoriesVisible={isAddSubCategoriesVisible}
        category={category}
      />
      {/* Parent Categories Forms  */}
      <CategoryAddForm />
    </div>
  );
}
