// Interface and Types

// Components
import { useLangTranslation } from '@/lib/context/global/language.context';
import HeaderText from '@/lib/ui/useable-components/header-text';



const AddonHeader = () => {
  // Hooks

  const { getTranslation } = useLangTranslation();

  return (
    <div className="sticky top-0 z-10 w-full flex-shrink-0 bg-white p-3 shadow-sm">
      <div className="flex w-full justify-between">
        <HeaderText text={getTranslation('addons')} />
        {/* <TextIconClickable
          className="rounded border-gray-300 bg-black text-white sm:w-auto"
          icon={faAdd}
          iconStyles={{ color: 'white' }}
          title={getTranslation('add_add_on')}
          onClick={() => setIsAddAddonVisible(true)}
        /> */}
      </div>
    </div>
  );
};

export default AddonHeader;
