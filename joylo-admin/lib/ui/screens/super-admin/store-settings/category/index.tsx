// Hooks
import { useContext, useState } from 'react';

// Components
import CategoryAddForm from '@/lib/ui/screen-components/protected/super-admin/category/add-form';
import CategoryHeader from '@/lib/ui/screen-components/protected/super-admin/category/view/header/screen-header';
import CategoryMain from '@/lib/ui/screen-components/protected/super-admin/category/view/main';

// Contexts
import { RestaurantLayoutContext } from '@/lib/context/super-admin/layout-restaurant.context';

export default function CategoryScreen() {
  // Contexts
  const {
    setIsAddSubCategoriesVisible,
    category,
    setCategory,
    subCategories,
    setSubCategories,
  } = useContext(RestaurantLayoutContext);

  // State
  const [isAddCategoryVisible, setIsAddCategoryVisible] = useState(false);

  return (
    <div className="screen-container">
      <CategoryHeader setIsAddCategoryVisible={setIsAddCategoryVisible} />

      <CategoryMain
        setIsAddCategoryVisible={setIsAddCategoryVisible}
        setIsAddSubCategoriesVisible={setIsAddSubCategoriesVisible}
        setCategory={setCategory}
        setSubCategories={setSubCategories}
      />

      {/* Parent Categories Forms  */}
      <CategoryAddForm
        category={category}
        subCategories={subCategories}
        onHide={() => {
          setIsAddCategoryVisible(false);
          setCategory(null);
          setSubCategories([]);
        }}
        isAddCategoryVisible={isAddCategoryVisible}
      />
    </div>
  );
}
