'use client';

// Core
import { useState } from 'react';

// Component
import LanguageAddForm from '@/lib/ui/screen-components/protected/super-admin/language-management/form';
import DefaultTranslationAddForm from '@/lib/ui/screen-components/protected/super-admin/language-management/form';
import LanguageManagementHeader from '@/lib/ui/screen-components/protected/super-admin/language-management/view/header';
import LanguageManagementMain from '@/lib/ui/screen-components/protected/super-admin/language-management/view/main';
import LanguageManagementMobilesTabs from '@/lib/ui/screen-components/protected/super-admin/language-management/view/mobile-tabs';

// Interface & Type
import { TLanguageManagementMobileTabs } from '@/lib/utils/types/language-management';

export default function LanguageManagementScreen() {
  // States
  const [activeTab, setActiveTab] =
    useState<TLanguageManagementMobileTabs>('language');

  return (
    <div className="flex h-screen flex-col">
      <LanguageManagementHeader
      />
      <LanguageManagementMobilesTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <LanguageManagementMain
        // States
        activeTab={activeTab}
        // State Function
        setActiveTab={setActiveTab}
      />
      <LanguageAddForm />
      <DefaultTranslationAddForm />ß
    </div>
  );
}
