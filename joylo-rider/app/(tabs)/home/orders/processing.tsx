// Components
import { useLanguage } from '@/lib/context/global/language.context'
import HomeProcessingOrdersMain from '@/lib/ui/screen-components/home/orders/main/processing-orders'

// Hooks
import { useTranslation } from 'react-i18next'

export default function HomeScreen() {
  // Hooks
  const {getTranslation: t } = useLanguage()
  return (
    <HomeProcessingOrdersMain
      route={{ key: 'processing', title: t('processing_orders') }}
    />
  )
}
