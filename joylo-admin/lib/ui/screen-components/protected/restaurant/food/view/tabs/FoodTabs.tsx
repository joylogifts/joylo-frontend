import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useLangTranslation } from '@/lib/context/global/language.context';

const tabs = [
  { key: 'approved', label: 'approved' },
  { key: 'pending', label: 'pending' },
  { key: 'rejected', label: 'rejected' },
];

type TabKey = 'pending' | 'approved' | 'rejected';

const FoodTabs = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('activeTab') || 'approved';

  // Hooks
  const { getTranslation } = useLangTranslation();

  const handleTabClick = (tab: TabKey) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('activeTab', tab);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mt-4">
      <div className="flex space-x-4 border-b border-gray-200 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              handleTabClick(tab.key as TabKey);
            }}
            className={`px-4 py-2 font-medium rounded-t-md transition-all duration-200 
                            ${
                              activeTab === tab.key
                                ? 'bg-orange-100 text-orange-400 border-b-2 border-orange-400'
                                : 'text-gray-500 hover:text-orange-400'
                            }
                        `}
          >
            {getTranslation(tab.label)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FoodTabs;
