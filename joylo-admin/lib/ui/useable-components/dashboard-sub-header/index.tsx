import { useLangTranslation } from '@/lib/context/global/language.context';
import CustomInputSwitch from '@/lib/ui/useable-components/custom-input-switch';
import CustomTab from '@/lib/ui/useable-components/custom-tab';
import { IDashboardSubHeaderComponentsProps } from '@/lib/utils/interfaces';
import { } from 'use-intl';

export default function DashboardSubHeader({
  isStoreView,
  handleViewChange,
  dateFilter,
  handleDateFilter,
}: IDashboardSubHeaderComponentsProps) {

  const { getTranslation } = useLangTranslation();

  if (!isStoreView || !handleViewChange) return;
  return (
    <div className="flex flex-row items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {getTranslation('business_overview')}
        </h2>
        <div className="flex items-center space-x-2">
          <span
            className={`font-inter text-sm font-medium leading-5 ${!isStoreView ? 'text-black' : 'text-[#71717A]'}`}
          >
            {getTranslation('graph_view')}
          </span>
          <CustomInputSwitch
            isActive={isStoreView}
            onChange={handleViewChange}
          />
          <span
            className={`font-inter text-sm font-medium leading-5 ${isStoreView ? 'text-black' : 'text-[#71717A]'}`}
          >
            {getTranslation('store_view')}
          </span>
        </div>
      </div>
      <CustomTab
        options={['All', 'Today', 'Week', 'Month', 'Year', 'Custom']}
        selectedTab={dateFilter.dateKeyword ?? 'Today'}
        setSelectedTab={(tab: string) =>
          handleDateFilter({ ...dateFilter, dateKeyword: tab })
        }
        dateFilter={dateFilter}
      />
    </div>
  );
}
