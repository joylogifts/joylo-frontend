import { useLangTranslation } from '@/lib/context/global/language.context';
import CustomInputSwitch from '@/lib/ui/useable-components/custom-input-switch';
import DateFilterCustomTab from '@/lib/ui/useable-components/date-filter-custom-tab';
import { IDashboardSubHeaderComponentsProps } from '@/lib/utils/interfaces';


export default function DashboardSubHeader({
  isStoreView,
  handleViewChange,
  dateFilter,
  handleDateFilter,
}: IDashboardSubHeaderComponentsProps) {
  // Hooks

  const { getTranslation } = useLangTranslation();

  return (
    <div className="flex flex-row items-center justify-between px-4 py-3 bg-white rounded-lg ">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {getTranslation('business_overview')}
        </h2>
        <div className="flex items-center space-x-2">
          <span
            className={`text-sm leading-5 font-medium font-inter ${!isStoreView ? 'text-black' : 'text-[#71717A]'}`}
          >
            {getTranslation('graph_view')}
          </span>
          {handleViewChange && (
            <CustomInputSwitch
              isActive={isStoreView ?? false}
              onChange={handleViewChange}
            />
          )}
          <span
            className={`text-sm leading-5 font-medium font-inter ${isStoreView ? 'text-black' : 'text-[#71717A]'}`}
          >
            {getTranslation('store_view')}
          </span>
        </div>
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
        selectedTab={dateFilter?.dateKeyword ?? ''}
        setSelectedTab={(tab: string) =>
          handleDateFilter({ ...dateFilter, dateKeyword: tab })
        }
      />
    </div>
  );
}
