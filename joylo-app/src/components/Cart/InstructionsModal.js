import React from 'react'
import { View, Modal, Pressable, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import TextDefault from '../Text/TextDefault/TextDefault'
import { useStyles } from './styles'
import { scale } from '../../utils/scaling'
import { textStyles } from '../../utils/textStyles'
import { alignment } from '../../utils/alignment'
import { useLanguage } from '@/src/context/Language'

export const InstructionsModal = ({ theme, isVisible, hideModal, onSubmit, value, setValue }) => {
  const styles = useStyles(theme)
  const { getTranslation } = useLanguage()

  return (
    <Modal visible={isVisible} animationType='slide' transparent={true}>
      <View style={styles.layout}>
        <Pressable style={styles.backdrop} onPress={hideModal} />
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <TouchableOpacity onPress={onSubmit} style={styles.closeButton}>
              <TextDefault bolder textColor={theme.newButtonText}>
                {getTranslation('done')}
              </TextDefault>
            </TouchableOpacity>
          </View>
          <View>
            <TextDefault H2 bolder textColor={theme.fontThirdColor} isRTL>
              {getTranslation('add_a_message_for_the_restaurant')}
            </TextDefault>
            <TextDefault H5 bold textColor={theme.fontThirdColor} isRTL style={styles.secondaryText}>
              {getTranslation('special_requests_allergies_dietary_restriction')}
            </TextDefault>
            <TextDefault numberOfLines={3} H5 smaller isRTL textColor={theme.secondaryText} style={styles.ternaryText}>
              {getTranslation('kindly_be_advised_that_your_message_could_also_be_visible_to_the_courier_partner_responsible_for_delivering_your_order_to_the_venue')}
            </TextDefault>
          </View>
          <View style={styles.inputContainer}>
            <TextInput value={value} onChangeText={(value) => setValue(value)} autoFocus onSubmitEditing={onSubmit} placeholderTextColor={theme.placeholderColorMsg} placeholder={getTranslation('type_here')} allowFontScaling style={{ padding: scale(10), ...textStyles.H3, flex: 1, color: theme.fontMainColor, textAlign: theme?.isRTL ? 'right' : 'left' }} maxLength={400} />
            <TouchableOpacity style={alignment.MRxSmall} onPress={() => setValue('')}>
              <Ionicons name='close-circle-outline' size={scale(18)} color={theme.fontNewColor} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
