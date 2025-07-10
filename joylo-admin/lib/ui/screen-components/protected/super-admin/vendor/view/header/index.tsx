// Core
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';

// Context
import { VendorContext } from '@/lib/context/super-admin/vendor.context';

// Components
import CustomTextField from '@/lib/ui/useable-components/input-field';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';

// Constants
import HeaderText from '@/lib/ui/useable-components/header-text';

import { useLangTranslation } from '@/lib/context/global/language.context';

export default function VendorHeader() {
  // Hooks

  const { getTranslation } = useLangTranslation();

  // Context
  const { onSetVendorFormVisible, globalFilter, onSetGlobalFilter } =
    useContext(VendorContext);

  return (
    <div className="hidden w-full flex-shrink-0 border-b p-3 sm:block">
      <div className="mb-4 flex flex-col items-center justify-between sm:flex-row">
        <HeaderText text={getTranslation('vendors')} />

        <TextIconClickable
          className="rounded border-gray-300 bg-black text-white sm:w-auto"
          icon={faAdd}
          iconStyles={{ color: 'white' }}
          title={getTranslation('add_vendor')}
          onClick={() => {
            onSetVendorFormVisible(true);
          }}
        />
      </div>

      <div className="flex-colm:flex-row flex w-fit items-center space-y-4 sm:space-x-4 sm:space-y-0">
        <div className="w-60">
          <CustomTextField
            type="text"
            name="vendorFilter"
            maxLength={35}
            placeholder={getTranslation('keyword_search')}
            showLabel={false}
            value={globalFilter ?? ''}
            onChange={(e) => onSetGlobalFilter(e.target.value)}
          />
        </div>
        {/* <VendorCustomTab
          options={options}
          selectedTab={selectedVendorFilter}
          setSelectedTab={setSelectedVendorFilter}
          className="w-full sm:w-auto"
        /> */}
      </div>
    </div>
  );
}
