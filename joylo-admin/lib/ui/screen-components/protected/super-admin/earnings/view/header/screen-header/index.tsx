// Components
import { useLangTranslation } from '@/lib/context/global/language.context';
import HeaderText from '@/lib/ui/useable-components/header-text';
import StatsCard from '@/lib/ui/useable-components/stats-card';
import { IEarningsHeaderComponentProps } from '@/lib/utils/interfaces';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';
// import { useState } from 'react';

const EarningsSuperAdminHeader = ({
  earnings,
}: IEarningsHeaderComponentProps) => {
  // Hooks
  const t = useTranslations();
  const { getTranslation } = useLangTranslation();
  // Helper function to format numbers to 2 decimal places
  const formatNumber = (value: number) => Number(value.toFixed(2));

  return (
    <div className="sticky top-0 z-10 w-full flex-shrink-0 bg-white p-3 shadow-sm">
      <div className="flex w-full justify-between">
        <HeaderText text={getTranslation('earnings')} />
      </div>
      <div className="grid grid-cols-1 items-center gap-6 p-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <StatsCard
          label={getTranslation('total_platform_earning')}
          total={formatNumber(earnings?.platformTotal || 0)}
          icon={faDollarSign}
          route=""
          isClickable={false}
          // loading= {loading}
        />
        <StatsCard
          label={getTranslation('total_stores_earning')}
          total={formatNumber(earnings?.storeTotal || 0)}
          icon={faDollarSign}
          isClickable={false}
          route="" // loading={loading}
        />
        <StatsCard
          label={getTranslation('total_riders_earnings')}
          total={formatNumber(earnings?.riderTotal || 0)}
          icon={faDollarSign}
          isClickable={false}
          route="" // loading = {loading}
        />
      </div>
    </div>
  );
};

export default EarningsSuperAdminHeader;
