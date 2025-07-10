import React, { useContext } from 'react'
import { View } from 'react-native'
import styles from './styles'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { useLanguage } from '@/src/context/Language'

function TitleComponent(props) {
  const { getTranslation, dir } = useLanguage()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: dir === 'rtl', ...theme[themeContext.ThemeValue] }

  // Helper to translate if string and snake_case
  const translateIfKey = (val) => (typeof val === 'string' && /^[a-z0-9_]+$/.test(val) ? getTranslation(val) : val)

  return (
    <View style={styles(currentTheme).mainContainer}>
      <View>
        <TextDefault numberOfLines={1} textColor={currentTheme.fontMainColor} H6 bolder isRTL>
          {translateIfKey(props?.title)}
        </TextDefault>
        <TextDefault numberOfLines={1} textColor={currentTheme.fontSecondColor} small isRTL>
          {translateIfKey(props?.subTitle)}
        </TextDefault>
      </View>
      <View style={styles(currentTheme).rightContainer}>
        <TextDefault textColor={currentTheme.color2} H6 center>
          {translateIfKey(props?.status)}
        </TextDefault>
      </View>
    </View>
  )
}

export default TitleComponent
