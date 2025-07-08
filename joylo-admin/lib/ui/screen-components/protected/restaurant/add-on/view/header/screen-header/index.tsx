// Interface and Types

// Components
import HeaderText from '@/lib/ui/useable-components/header-text';

// Icons
import { useTranslations } from 'next-intl';

const AddonHeader = () => {
  // Hooks
  const t = useTranslations();
  return (
    <div className="sticky top-0 z-10 w-full flex-shrink-0 bg-white p-3 shadow-sm">
      <div className="flex w-full justify-between">
        <HeaderText text={t('Addons')} />
        {/* <TextIconClickable
          className="rounded border-gray-300 bg-black text-white sm:w-auto"
          icon={faAdd}
          iconStyles={{ color: 'white' }}
          title={t('Add Add-on')}
          onClick={() => setIsAddAddonVisible(true)}
        /> */}
      </div>
    </div>
  );
};

export default AddonHeader;
