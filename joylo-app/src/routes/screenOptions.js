/* eslint-disable react/display-name */
import React from 'react'
import { RightButton, BackButton } from '../components/Header/HeaderIcons/HeaderIcons'
import { StyleSheet } from 'react-native'
import { textStyles } from '../utils/textStyles'
import { scale } from '../utils/scaling'
import { useLanguage } from '@/src/context/Language'

const screenOptions = (props) => {
  const { getTranslation } = useLanguage()
  return {
    headerTitleAlign: 'center',
    headerBackTitleVisible: false,
    headerStyle: {
      backgroundColor: props.backColor,
      borderBottomColor: props.lineColor,
      borderBottomWidth: StyleSheet.hairlineWidth
    },
    headerTitleStyle: {
      color: props.textColor,
      ...textStyles.Bolder,
      ...textStyles.B700,
      backgroundColor: 'transparent'
    },
    headerTitleContainerStyle: {
      marginHorizontal: scale(35)
    },
    headerBackImage: () => BackButton({ iconColor: props.textColor, icon: 'leftArrow' }),
    headerRight: () => <RightButton icon='cart' iconColor={props.iconColor} menuHeader={false} t={getTranslation} />
  }
}
export default screenOptions
