// Components
import HeaderText from '@/lib/ui/useable-components/header-text';
import StatsCard from '@/lib/ui/useable-components/stats-card';

// Icons
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';


import { IEarningsRestaurantHeaderComponentProps } from '@/lib/utils/interfaces/earnings.interface';
import { useLangTranslation } from '@/lib/context/global/language.context';

const EarningsRestaurantHeader = ({
  earnings,
}: IEarningsRestaurantHeaderComponentProps) => {
  // Hooks

  const { getTranslation } = useLangTranslation();

  return (
    <div className="sticky top-0 z-10 w-full flex-shrink-0 bg-white p-3 shadow-sm">
      <div className="flex w-full justify-between">
        <HeaderText text={getTranslation('earnings')} />
      </div>
      <div className="grid grid-cols-1 items-center gap-6 p-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <StatsCard
          label={getTranslation('total_stores_earning')}
          total={earnings?.storeTotal || 0}
          icon={faDollarSign}
          loading={false}
          route=""
          isClickable={false}
        />
      </div>
    </div>
  );
};

export default EarningsRestaurantHeader;
