import React, { useState, useContext } from 'react'
import { View, TouchableOpacity } from 'react-native'
import RadioButton from '../../../ui/FdRadioBtn/RadioBtn'
import ConfigurationContext from '../../../context/Configuration'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/src/context/Language'

function RadioComponent(props) {
  const { getTranslation: t, dir } = useLanguage()
  const [selected, setSelected] = useState(props?.selected || null)
  const [options] = useState(props?.options)
  const configuration = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: dir === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  function onPress(option) {
    setSelected(option)
    props.onPress(option)
  }

  return (
    <View>
      {options.map((option) => (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPress.bind(this, option)}
          key={option._id}
          style={styles(currentTheme).mainContainer}
          // disabled={option.isOutOfStock}
        >
          <View style={styles(currentTheme).leftContainer}>
            <RadioButton size={11} outerColor={currentTheme.iconColorDark} innerColor={currentTheme.main} animation={'bounceIn'} isSelected={selected ? selected._id === option._id : false} onPress={onPress.bind(this, option)} />
            <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).title} bolder isRTL>
              {option.title}
            </TextDefault>
          </View>
          <View style={styles(currentTheme).rightContainer}>
            <TextDefault textColor={currentTheme.fontMainColor} bolder isRTL>{`${configuration.currencySymbol}${option.price}`}</TextDefault>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default RadioComponent
