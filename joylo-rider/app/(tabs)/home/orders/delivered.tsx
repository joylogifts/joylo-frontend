// Components
import { useLanguage } from '@/lib/context/global/language.context'
import HomeDeliveredOrdersMain from '@/lib/ui/screen-components/home/orders/main/delivered-orders'

// Hooks
import { useTranslation } from 'react-i18next'

export default function HomeScreen() {
  // Hooks
  const { getTranslation: t } = useLanguage()
  return (
    <HomeDeliveredOrdersMain
      route={{ key: 'delivered', title: t('delivered_orders') }}
    />
  )
}
