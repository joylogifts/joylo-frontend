// CSS
import { useLangTranslation } from '@/lib/context/global/language.context';
import classes from './table-header.module.css';

// Components
import CustomTextField from '@/lib/ui/useable-components/input-field';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';
import { IDispatchTableHeaderProps } from '@/lib/utils/interfaces/dispatch.interface';

// Icons
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { } from 'next-intl';

// Prime react
import { Checkbox } from 'primereact/checkbox';
import { OverlayPanel } from 'primereact/overlaypanel';
import { ChangeEvent, useCallback, useRef, useState } from 'react';

export default function DispatchTableHeader({
  selectedActions,
  setSelectedActions,
  search,
  setSearch,
}: IDispatchTableHeaderProps) {
  // Hooks

  const { getTranslation } = useLangTranslation();

  // Ref
  const overlayPanelRef = useRef<OverlayPanel>(null);

  // States
  const [searchValue, setSearchValue] = useState('');

  // Checkbox toggle
  const toggleAction = (action: string) => {
    const updatedActions = selectedActions.includes(action)
      ? selectedActions.filter((a) => a !== action)
      : [...selectedActions, action];
    setSelectedActions(updatedActions);
  };

  // Actions
  const menuItems = [
    {
      label: getTranslation('pending'),
      value: 'PENDING',
    },
    {
      label: getTranslation('assigned'),
      value: 'ASSIGNED',
    },
    {
      label: getTranslation('accepted'),
      value: 'ACCEPTED',
    },
    {
      label: getTranslation('picked'),
      value: 'PICKED',
    },
    {
      label: getTranslation('delivered'),
      value: 'DELIVERED',
    },
  ];

  // Debounce Search Handler
  const debounceSearch = useCallback((delay: number, val: string) => {
    let timer: ReturnType<typeof setTimeout>;
    setSearch(val);
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => setSearch(val), delay);
    };
  }, []);

  return (
    <div className="mb-4 flex flex-col gap-6">
      <div className="flex-colm:flex-row flex w-fit items-center gap-2">
        <div className="w-60">
          <CustomTextField
            type="text"
            name="vendorFilter"
            maxLength={35}
            showLabel={false}
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              debounceSearch(300, e.target.value)
            }
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

              <div className="border-b border-t py-1">
                {menuItems
                  .filter((item) =>
                    item.label.toLowerCase().includes(searchValue.toLowerCase())
                  )
                  .map((item, index) => (
                    <div
                      key={index}
                      className={`${classes.filter} my-2 flex items-center justify-between`}
                    >
                      <div className="flex">
                        <Checkbox
                          inputId={`action-${item.value}`}
                          checked={selectedActions.includes(item.value)}
                          onChange={() => toggleAction(item.value)}
                          className={`${classes.checkbox}`}
                        />
                        <label
                          htmlFor={`action-${item.value}`}
                          className="ml-1 text-sm"
                        >
                          {item.label}
                        </label>
                      </div>
                    </div>
                  ))}
              </div>
              <p
                className="mt-3 text-center text-sm cursor-pointer"
                onClick={() => setSelectedActions([])}
              >
                {getTranslation('clear_filters')}
              </p>
            </div>
          </OverlayPanel>

          <TextIconClickable
            className="w-20 rounded border border-dotted border-[#E4E4E7] text-black"
            icon={faAdd}
            iconStyles={{ color: 'black' }}
            title={
              selectedActions.length > 0
                ? getTranslation('filter')
                : getTranslation('actions')
            }
            onClick={(e) => overlayPanelRef.current?.toggle(e)}
          />
        </div>
      </div>
    </div>
  );
}
