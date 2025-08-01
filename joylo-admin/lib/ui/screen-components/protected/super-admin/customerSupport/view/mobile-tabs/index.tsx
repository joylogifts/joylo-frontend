// Path: /index.tsx/mobile-tabs/view/customerSupport/super-admin/protected/screen-components/ui/lib

import { useLangTranslation } from '@/lib/context/global/language.context';


// Interface
export interface ICustomerSupportMobileTabsProps {
  activeTab: 'tickets' | 'chats';
  setActiveTab: (tab: 'tickets' | 'chats') => void;
}

export default function CustomerSupportMobilesTabs({
  activeTab,
  setActiveTab,
}: ICustomerSupportMobileTabsProps) {
  // Hooks

  const { getTranslation } = useLangTranslation();

  return (
    <div className="flex border-b bg-gray-100 sm:hidden">
      <button
        className={`flex-1 px-4 py-2 text-center ${activeTab === 'tickets'
          ? 'border-b-2 border-black bg-white font-bold'
          : ''
          }`}
        onClick={() => setActiveTab('tickets')}
      >
        {getTranslation('users')}
      </button>
      <button
        className={`flex-1 px-4 py-2 text-center ${activeTab === 'chats'
          ? 'border-b-2 border-black bg-white font-bold'
          : ''
          }`}
        onClick={() => setActiveTab('chats')}
      >
        {getTranslation('tickets')}
      </button>
    </div>
  );
}
