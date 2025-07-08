import React, { useContext } from 'react'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { View } from 'react-native'
import { useLanguage } from '@/src/context/Language'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { alignment } from '../../utils/alignment'

import styles from './styles'
import color from '../../components/Text/TextDefault/styles'

const Taxes = ({ tax, deliveryCharges, currency }) => {
  const themeContext = useContext(ThemeContext)
  const { getTranslation: t, dir } = useLanguage()
  const currentTheme = {
    isRTL: dir === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  return (
    <View>
      <View
        style={{
          flexDirection: theme?.isRTL ? 'row-reverse' : 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <TextDefault H5 isRTL bolder style={{ ...alignment.Mmedium }} textColor={currentTheme.gray900} bold>
          {' '}
          {t('tax_charges')}
        </TextDefault>
        <TextDefault style={{ ...alignment.Mmedium }} bolder H5>
          {' '}
          {currency}
          {tax}{' '}
        </TextDefault>
      </View>
      <View
        style={{
          flexDirection: theme?.isRTL ? 'row-reverse' : 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <TextDefault H5 style={{ ...alignment.Mmedium, textAlign: 'center' }} textColor={currentTheme.gray900} bolder isRTL>
          {' '}
          {t('delivery_charges')}
        </TextDefault>
        <TextDefault H5 bolder style={{ ...alignment.Mmedium }}>
          {' '}
          {currency}
          {deliveryCharges}{' '}
        </TextDefault>
      </View>
    </View>
  )
}

export default Taxes
