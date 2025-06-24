// Interface and Types
import { IRiderHeaderProps } from '@/lib/utils/interfaces/rider.interface';

// Components
import HeaderText from '@/lib/ui/useable-components/header-text';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';

// Icons
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';
import { useLangTranslation } from '@/lib/context/global/language.context';

const RiderHeader = ({ setIsAddRiderVisible }: IRiderHeaderProps) => {
  // Hooks
  const t = useTranslations();
  const { getTranslation } = useLangTranslation();

  return (
    <div className="sticky top-0 z-10 w-full flex-shrink-0 bg-white p-3 shadow-sm">
      <div className="flex w-full justify-between">
        <HeaderText className="heading" text={getTranslation('riders')} />
        <TextIconClickable
          className="rounded border-gray-300 bg-black text-white sm:w-auto"
          icon={faAdd}
          iconStyles={{ color: 'white' }}
          title={getTranslation('add_rider')}
          onClick={() => setIsAddRiderVisible(true)}
        />
      </div>
    </div>
  );
};

export default RiderHeader;
