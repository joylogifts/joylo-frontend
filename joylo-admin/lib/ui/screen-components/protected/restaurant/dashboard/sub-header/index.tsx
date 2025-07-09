import { useLangTranslation } from '@/lib/context/global/language.context';
import DateFilterCustomTab from '@/lib/ui/useable-components/date-filter-custom-tab';
import { IDashboardSubHeaderComponentsProps } from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl';

export default function DashboardSubHeader({
  dateFilter,
  handleDateFilter,
}: IDashboardSubHeaderComponentsProps) {
  // Hooks
  const t = useTranslations();
  const { getTranslation } = useLangTranslation();
  return (
    <div className="flex flex-row items-center justify-between px-4 py-3 bg-white rounded-lg ">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {getTranslation('business_overview')}
        </h2>
      </div>
      <DateFilterCustomTab
        options={[
          getTranslation('all'),
          getTranslation('today'),
          getTranslation('week'),
          getTranslation('month'),
          getTranslation('year'),
          getTranslation('custom'),
        ]}
        selectedTab={dateFilter?.dateKeyword ?? getTranslation('all')}
        setSelectedTab={(tab: string) =>
          handleDateFilter({ ...dateFilter, dateKeyword: tab })
        }
      />
    </div>
  );
}
