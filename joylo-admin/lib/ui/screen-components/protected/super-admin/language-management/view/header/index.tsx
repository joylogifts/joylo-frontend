// Core
import { faAdd } from '@fortawesome/free-solid-svg-icons';

// Components
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';

// Constants
import HeaderText from '@/lib/ui/useable-components/header-text';
import { useContext } from 'react';
import { LanguageManagementContext } from '@/lib/context/super-admin/language-management.context';

export default function LanguageManagementHeader() {


  // Context
  const {onToggleLangFormVisibility} = useContext(LanguageManagementContext)

  return (
    <div className="hidden w-full flex-shrink-0 border-b pt-3 sm:block">
      <div className="mb-4 flex flex-col items-center justify-between sm:flex-row">
        <HeaderText text="Language Management" />

        <TextIconClickable
          className="rounded border-gray-300 bg-black text-white sm:w-auto"
          icon={faAdd}
          iconStyles={{ color: 'white' }}
          title="Add Language"
          onClick={() => onToggleLangFormVisibility(true)}
        />
      </div>
    </div>
  );
}
