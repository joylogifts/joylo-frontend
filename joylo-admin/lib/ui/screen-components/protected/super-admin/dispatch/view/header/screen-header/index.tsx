//Components
import { useLangTranslation } from '@/lib/context/global/language.context';
import HeaderText from '@/lib/ui/useable-components/header-text';

// Hooks
import { } from 'next-intl';

export default function DispatchHeader() {
  // Hooks

  const { getTranslation } = useLangTranslation();
  return (
    <div className="sticky top-0 z-10 w-full flex-shrink-0 bg-white p-3 shadow-sm">
      <div className="flex w-full justify-between">
        <HeaderText text={getTranslation('dispatch')} />
      </div>
    </div>
  );
}
