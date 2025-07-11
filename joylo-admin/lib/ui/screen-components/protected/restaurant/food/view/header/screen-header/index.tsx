// Interface and Types

// Components
import { useLangTranslation } from '@/lib/context/global/language.context';
import { FoodsContext } from '@/lib/context/restaurant/foods.context';
import HeaderText from '@/lib/ui/useable-components/header-text';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';

// Icons
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { } from 'next-intl';
import { useContext } from 'react';

const FoodHeader = () => {
  // Hooks

  const { getTranslation } = useLangTranslation();

  // Context
  const { onFoodFormVisible } = useContext(FoodsContext);

  return (
    <div className="w-full flex-shrink-0 sticky top-0 bg-white z-10 shadow-sm p-3">
      <div className="flex w-full justify-between">
        <HeaderText text={getTranslation('products')} />
        <TextIconClickable
          className="rounded border-gray-300 bg-black text-white sm:w-auto"
          icon={faAdd}
          iconStyles={{ color: 'white' }}
          title={getTranslation('add_product')}
          onClick={() => onFoodFormVisible(true)}
        />
      </div>
    </div>
  );
};

export default FoodHeader;
