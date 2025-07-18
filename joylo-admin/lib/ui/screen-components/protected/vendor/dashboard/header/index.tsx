import { useLangTranslation } from '@/lib/context/global/language.context';
import { ProfileContext } from '@/lib/context/vendor/profile.context';

import React, { useContext } from 'react';

export default function DashboardHeader() {
  const { vendorProfileResponse } = useContext(ProfileContext);
  // Hooks

  const { getTranslation } = useLangTranslation();

  return (
    <div className="m-3">
      <div className="rounded-lg bg-[#F4F4F5]">
        <div className="flex h-20 items-center pl-[1rem]">
          <span className="text-[32px] font-[500] text-[#09090B]">
            {vendorProfileResponse?.data?.getVendor?.name
              ? `${getTranslation('hi')} ${vendorProfileResponse?.data?.getVendor.name},`
              : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
