//Components
import { useLangTranslation } from '@/lib/context/global/language.context';
import HeaderText from '@/lib/ui/useable-components/header-text';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';

//Interfaces
import { ICouponScreenHeaderProps } from '@/lib/utils/interfaces/coupons.interface';

//Icons
import { faAdd } from '@fortawesome/free-solid-svg-icons';


export default function CouponScreenHeader({
  handleButtonClick,
}: ICouponScreenHeaderProps) {
  // Hooks

  const { getTranslation } = useLangTranslation();
  return (
    <div className="sticky top-0 z-10 w-full flex-shrink-0 bg-white p-3 shadow-sm">
      <div className="flex w-full justify-between">
        <HeaderText text={getTranslation('coupons')} />
        <TextIconClickable
          className="rounded border-gray-300 bg-black text-white sm:w-auto"
          icon={faAdd}
          iconStyles={{ color: 'white' }}
          onClick={handleButtonClick}
          title={getTranslation('add_coupon')}
        />
      </div>
    </div>
  );
}
