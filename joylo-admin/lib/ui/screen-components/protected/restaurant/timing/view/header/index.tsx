'use client';


// Components
import { useLangTranslation } from '@/lib/context/global/language.context';
import HeaderText from '@/lib/ui/useable-components/header-text';


const TimingHeader = () => {
  // Hooks

  const { getTranslation } = useLangTranslation();

  return (
    <div className="w-full flex-shrink-0">
      <div className="flex w-full justify-between">
        <HeaderText className="heading" text={getTranslation('timing')} />
      </div>
    </div>
  );
};

export default TimingHeader;
