import { IActionMenuProps, IZoneResponse } from '@/lib/utils/interfaces';
import ActionMenu from '../../action-menu';
import { useTranslations } from 'next-intl';
import { useLangTranslation } from '@/lib/context/global/language.context';

export const ZONE_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<IZoneResponse>['items'];
}) => {
  // Hooks
  const t = useTranslations();
  const { getTranslation } = useLangTranslation();
  return [
    { headerName: getTranslation('title'), propertyName: 'title' },
    { headerName: getTranslation('description'), propertyName: 'description' },
    {
      propertyName: 'actions',
      body: (zone: IZoneResponse) => (
        <ActionMenu items={menuItems} data={zone} />
      ),
    },
  ];
};
