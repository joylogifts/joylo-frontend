// Interface and Types
import { IStaffHeaderProps } from '@/lib/utils/interfaces';

// Components
import HeaderText from '@/lib/ui/useable-components/header-text';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';

// Icons
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { } from 'next-intl';
import { useLangTranslation } from '@/lib/context/global/language.context';

const StaffHeader = ({ setIsAddStaffVisible }: IStaffHeaderProps) => {
  // Hooks

  const { getTranslation } = useLangTranslation();
  return (
    <div className="sticky top-0 z-10 w-full flex-shrink-0 bg-white p-3 shadow-sm">
      <div className="flex w-full justify-between">
        <HeaderText className="heading" text={getTranslation('staffs')} />
        <TextIconClickable
          className="rounded border-gray-300 bg-black text-white sm:w-auto"
          icon={faAdd}
          iconStyles={{ color: 'white' }}
          title={getTranslation('add_staff')}
          onClick={() => setIsAddStaffVisible(true)}
        />
      </div>
    </div>
  );
};

export default StaffHeader;
