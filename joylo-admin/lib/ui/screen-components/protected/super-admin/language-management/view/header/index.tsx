// Core
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { useContext, useRef } from 'react';
import { useMountEffect } from 'primereact/hooks';
import { Messages } from 'primereact/messages';
// Components
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';

// Constants
import HeaderText from '@/lib/ui/useable-components/header-text';

// Context
import { LanguageManagementContext } from '@/lib/context/super-admin/language-management.context';

export default function LanguageManagementHeader() {
  // Context
  const { onToggleLangFormVisibility } = useContext(LanguageManagementContext);

  // Ref
  const message1 = useRef<Messages>(null);
  const message2 = useRef<Messages>(null);

  useMountEffect(() => {
    message1.current?.clear();
    message2.current?.clear();
    message1.current?.show({
      id: '1',
      sticky: true,
      severity: 'error',
      // summary: '',
      detail:
        'Translation key-value pairs are static and used across all apps (admin, web, mobile). Only developers should add or modify them. Deleting them will raise issues in the system.',
      closable: false,
      icon: <></>,
    });

    message2.current?.show({
      id: '1',
      sticky: true,
      severity: 'info',
      summary: '',
      detail: `Click the "Add Language" button to generate a new language by translating content from the default language (e.g., English). While dynamic content is being translated in the background, the status will show "Processing". The new language becomes available to users once translation is complete.
.
        `,
      closable: false,
      icon: <></>,
    });
  });

  return (
    <div className="hidden w-full flex-shrink-0 border-b pt-3 sm:block">
      <div className="mb-4 flex flex-col items-center justify-between sm:flex-row">
        <div className="flex flex-col">
          <HeaderText text="Language Management" />
          {/* <TextComponent
            className={`w-42 m-0 flex flex-1 text-[12px] text-gray-400`}
            text="Note: The key-value pairs in the translation section represent static keywords used across all applications, including but not limited to the admin panel, customer/rider/store mobile apps, and the web platform. Only developers are responsible for dynamically adding or modifying these entries."
          /> */}
        </div>

        <TextIconClickable
          className="rounded border-gray-300 bg-black text-white sm:w-auto"
          icon={faAdd}
          iconStyles={{ color: 'white' }}
          title="Add Language"
          onClick={() => onToggleLangFormVisibility(true)}
        />
      </div>

      <Messages ref={message1} className="language-message" />
      <Messages ref={message2} className="language-message" />
    </div>
  );
}
