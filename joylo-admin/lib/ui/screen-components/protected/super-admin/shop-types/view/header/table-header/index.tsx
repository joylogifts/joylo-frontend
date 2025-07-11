// Components
import { useLangTranslation } from '@/lib/context/global/language.context';
import CustomTextField from '@/lib/ui/useable-components/input-field';

// Interface
import { IShopTypesTableHeaderProps } from '@/lib/utils/interfaces';

// Icons


// Prime react
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRef, useState } from 'react';

export default function ShopTypesTableHeader({
  globalFilterValue,
  onGlobalFilterChange,
}: IShopTypesTableHeaderProps) {
  // Hooks

  const { getTranslation } = useLangTranslation();

  //Ref
  const overlayPanelRef = useRef<OverlayPanel>(null);

  // States
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="mb-4 flex flex-col gap-6">
      <div className="flex-colm:flex-row  mt-4 flex w-fit items-center gap-2">
        <div className="w-60">
          <CustomTextField
            type="text"
            name="vendorFilter"
            maxLength={35}
            showLabel={false}
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder={getTranslation('keyword_search')}
          />
        </div>
        <div className="flex items-center">
          <OverlayPanel ref={overlayPanelRef} dismissable>
            <div className="w-60">
              <div className="mb-3">
                <CustomTextField
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={getTranslation('search')}
                  className="h-8 w-full"
                  type="text"
                  name="search"
                  showLabel={false}
                />
              </div>
            </div>
          </OverlayPanel>
        </div>
      </div>
    </div>
  );
}
