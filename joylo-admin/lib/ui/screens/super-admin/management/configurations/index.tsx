// Components
import ConfigHeader from '@/lib/ui/screen-components/protected/super-admin/configuration/view/header';
import ConfigMain from '@/lib/ui/screen-components/protected/super-admin/configuration/view/main';
import NoData from '@/lib/ui/useable-components/no-data';

// Hooks
import { useConfiguration } from '@/lib/hooks/useConfiguration';
import { } from 'next-intl';
import { useLangTranslation } from '@/lib/context/global/language.context';

export default function ConfigurationsScreen() {
  // Hooks

  const { getTranslation } = useLangTranslation();
  const { ISPAID_VERSION } = useConfiguration();
  return (
    <div className="screen-container">
      <ConfigHeader />
      {ISPAID_VERSION ? (
        <ConfigMain />
      ) : (
        <NoData
          title={getTranslation('payment_required')}
          message={getTranslation(
            'please_complete_your_purchase_to_gain_full_access_to_the_product'
          )}
        />
      )}
    </div>
  );
}
