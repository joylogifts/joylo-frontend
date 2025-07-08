import { BackButton } from '../../components/Header/HeaderIcons/HeaderIcons'
import { scale } from '../../utils/scaling'
import { useLanguage } from '@/src/context/Language'

const navigationOptions = (headerText) => {
  const { getTranslation: t } = useLanguage()

  return {
    headerTitle: t('title_reorder'),
    headerTitleAlign: 'left',
    headerRight: null,
    headerTitleContainerStyle: {
      marginLeft: scale(0)
    },
    headerBackImage: () => BackButton({ iconColor: headerText, icon: 'leftArrow' })
  }
}

export default navigationOptions
