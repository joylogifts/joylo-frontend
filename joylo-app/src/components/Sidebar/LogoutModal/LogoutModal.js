import React, { useContext } from 'react'
import { View, TouchableOpacity, Modal, Pressable } from 'react-native'
import { useLanguage } from '@/src/context/Language'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../Text/TextDefault/TextDefault'
import styles from './styles'
import { Feather } from '@expo/vector-icons'

const LogoutModal = ({ visible, onCancel, onLogout, showCrossButton }) => {
  const { getTranslation, dir } = useLanguage()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: dir === 'rtl', ...theme[themeContext.ThemeValue] }

  return (
    <Modal visible={visible} animationType='slide' transparent>
      <View style={styles().layout}>
        <Pressable style={styles().backdrop} onPress={onCancel} />
        <View style={styles(currentTheme).modalContainer}>
          <View style={styles(currentTheme).flexRow}>
            <TextDefault textColor={currentTheme.fontMainColor} bolder H3 style={styles().modalHeader} isRTL>
              {getTranslation('logging_out')}
            </TextDefault>
            {showCrossButton && <Feather name='x-circle' size={24} color={currentTheme.newFontcolor} onPress={onCancel} />}
          </View>

          <TextDefault textColor={currentTheme.fontMainColor} style={styles().modalText} isRTL>
            {getTranslation('see_you_again_soon')}
          </TextDefault>

          <TouchableOpacity style={[styles(currentTheme).btn, styles(currentTheme).btnLogout]} onPress={onLogout}>
            <TextDefault bolder H4 textColor={currentTheme.red600}>
              {getTranslation('logout')}
            </TextDefault>
          </TouchableOpacity>

          <TouchableOpacity style={[styles(currentTheme).btn, styles(currentTheme).btnCancel]} onPress={onCancel}>
            <TextDefault bolder H4 textColor={currentTheme.linkColor}>
              {getTranslation('cancel')}
            </TextDefault>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default LogoutModal
