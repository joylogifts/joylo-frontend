'use client';

// React imports
import { useContext } from 'react';

// Context imports
import { RestaurantsContext } from '@/lib/context/super-admin/restaurants.context';

// Component imports
import HeaderText from '@/lib/ui/useable-components/header-text';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';

// Icon imports
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { } from 'next-intl';
import { useLangTranslation } from '@/lib/context/global/language.context';

export default function RestaurantsScreenHeader() {
  // Hooks

  const { getTranslation } = useLangTranslation();

  // Context
  const { onRestaurantsFormVisible } = useContext(RestaurantsContext);
  return (
    <div className="sticky top-0 z-10 w-full flex-shrink-0 bg-white p-3 shadow-sm">
      <div className="flex w-full justify-between">
        <HeaderText text={getTranslation('stores')} />
        <TextIconClickable
          className="rounded border-gray-300 bg-black text-white sm:w-auto"
          icon={faAdd}
          iconStyles={{ color: 'white' }}
          title={getTranslation('add_store')}
          onClick={() => onRestaurantsFormVisible(true)}
        />
      </div>
    </div>
  );
}
