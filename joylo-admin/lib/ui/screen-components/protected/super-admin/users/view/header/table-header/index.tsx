// Custom Components
import { useLangTranslation } from '@/lib/context/global/language.context';
import CustomTextField from '@/lib/ui/useable-components/input-field';

// Interfaces
import { IUsersTableHeaderProps } from '@/lib/utils/interfaces';
import { } from 'next-intl';

export default function UsersTableHeader({
  globalFilterValue,
  onGlobalFilterChange,
}: IUsersTableHeaderProps) {
  // Hooks

  const { getTranslation } = useLangTranslation();

  return (
    <div className="mb-4 flex flex-col gap-6">
      <div className="flex-colm:flex-row flex w-fit items-center gap-2">
        <div className="w-60">
          <CustomTextField
            type="text"
            name="userFilter"
            maxLength={35}
            showLabel={false}
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder={getTranslation('keyword_search')}
          />
        </div>
      </div>
    </div>
  );
}
