// Interface
import { useLangTranslation } from '@/lib/context/global/language.context';
import { IDateFilterCustomTabProps } from '@/lib/utils/interfaces';


const DateFilterCustomTab = ({
  options,
  selectedTab,
  setSelectedTab,
}: IDateFilterCustomTabProps) => {

  const { getTranslation } = useLangTranslation();

  return (
    <div className="flex h-10 w-fit space-x-2 rounded bg-gray-100 p-1">
      {options.map((option) => (
        <div
          key={String(option)}
          className={`flex cursor-pointer items-center justify-center rounded px-4 ${selectedTab === option
            ? 'bg-white text-black shadow'
            : 'text-gray-500'
            }`}
          onClick={() => setSelectedTab(option)}
        >
          {getTranslation(option)}
        </div>
      ))}
    </div>
  );
};

export default DateFilterCustomTab;
