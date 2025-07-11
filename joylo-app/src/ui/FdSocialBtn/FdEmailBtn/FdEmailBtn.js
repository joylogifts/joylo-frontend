import React, { useContext } from 'react'
import { TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import styles from './styles'
import { scale } from '../../../utils/scaling'
import Spinner from '../../../components/Spinner/Spinner'
import { theme } from '../../../utils/themeColors'
import ThemeContext from '../../ThemeContext/ThemeContext'
import { alignment } from '../../../utils/alignment'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/src/context/Language'

const FdEmailBtn = (props) => {
  const themeContext = useContext(ThemeContext)
  const { getTranslation: t, dir } = useLanguage()
  const currentTheme = { isRTL: dir === 'rtl', ...theme[themeContext.ThemeValue] }

  return (
    <TouchableOpacity activeOpacity={0.7} style={styles(currentTheme).mainContainer} onPress={props?.onPress}>
      {props?.loadingIcon ? (
        <Spinner backColor='rgba(0,0,0,0.1)' spinnerColor={currentTheme.main} />
      ) : (
        <>
          <MaterialIcons name='mail-outline' size={scale(18)} color={currentTheme.newIconColor} />
          <TextDefault H4 textColor={currentTheme.newFontcolor} bold>
            {t('continue_with_email')}
          </TextDefault>
        </>
      )}
    </TouchableOpacity>
  )
}

export default FdEmailBtn
