// Interface
import { ILanguageManagementMobileTabsComponentProps } from '@/lib/utils/interfaces';


export default function LanguageManagementMobilesTabs({
  activeTab,
  setActiveTab,
}: ILanguageManagementMobileTabsComponentProps) {
  
  return (
    <div className="flex border-b bg-gray-100 sm:hidden">
      <button
        className={`flex-1 px-4 py-2 text-center ${
          activeTab === 'language'
            ? 'border-b-2 border-black bg-white font-bold'
            : ''
        }`}
        onClick={() => setActiveTab('language')}
      >
        Language
      </button>
      <button
        className={`flex-1 px-4 py-2 text-center ${
          activeTab === 'translations'
            ? 'border-b-2 border-black bg-white font-bold'
            : ''
        }`}
        onClick={() => setActiveTab('translations')}
      >
        Translations
      </button>
    </div>
  );
}
