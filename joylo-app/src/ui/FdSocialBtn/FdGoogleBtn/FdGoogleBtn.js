import React, { useContext } from 'react'
import { TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import styles from './styles'
import { scale } from '../../../utils/scaling'
import Spinner from '../../../components/Spinner/Spinner'
import { theme } from '../../../utils/themeColors'
import ThemeContext from '../../ThemeContext/ThemeContext'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/src/context/Language'

const FdGoogleBtn = (props) => {
  const themeContext = useContext(ThemeContext)
  const { getTranslation: t, dir } = useLanguage()
  const currentTheme = { isRTL: dir === 'rtl', ...theme[themeContext.ThemeValue] }

  return (
    <TouchableOpacity activeOpacity={0.7} style={styles(currentTheme).mainContainer} onPressIn={props?.onPressIn} onPress={props?.onPress}>
      {props?.loadingIcon ? (
        <Spinner backColor={currentTheme.themeBackground} spinnerColor={currentTheme.main} />
      ) : (
        <>
          <FontAwesome name='google' size={scale(18)} color={currentTheme.newIconColor} />
          <TextDefault H4 center textColor={currentTheme.newFontcolor} bold>
            {t('continue_with_google')}
          </TextDefault>
        </>
      )}
    </TouchableOpacity>
  )
}

export default FdGoogleBtn
