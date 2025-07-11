import React from 'react'
import { View, TouchableOpacity, Modal, Text, TouchableWithoutFeedback, Pressable } from 'react-native'
import { Feather } from '@expo/vector-icons'
import styles from './styles'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { scale } from '../../utils/scaling'
import Spinner from '../../components/Spinner/Spinner'
import { useLanguage } from '@/src/context/Language'

const DeleteEditModal = ({ modalVisible, setModalVisible, currentTheme, selectedAddress, loading, onDelete, onEdit, editButton, deleteAllButton }) => {
  const { getTranslation } = useLanguage()
  return (
    <Modal animationType='slide' transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
      <View style={styles().layout}>
        <Pressable style={styles().backdrop} onPress={() => setModalVisible(false)} />
        <View style={styles(currentTheme).modalContainer}>
          <View style={styles(currentTheme).modalView}>
            <View style={[styles(currentTheme).modalHead]}>
              <TextDefault Bold H4 textColor={currentTheme.fontMainColor} isRTL>
                {/* {selectedAddress?.deliveryAddress} */}
                {selectedAddress ? selectedAddress?.deliveryAddress : getTranslation('are_you_sure_you_want_to_delete_selected_addresses')}
              </TextDefault>
              <Feather name='x-circle' size={24} color={currentTheme.newFontcolor} onPress={() => setModalVisible(false)} />
            </View>
            {deleteAllButton ? (
              <TouchableOpacity style={[styles(currentTheme).btn, styles(currentTheme).btnDelete, { opacity: loading ? 0.5 : 1 }]} onPress={() => onDelete()} disabled={loading}>
                {loading ? (
                  <Spinner spinnerColor={currentTheme.spinnerColor} backColor='transparent' size='small' />
                ) : (
                  <TextDefault bolder H4 textColor={currentTheme.red600}>
                    {getTranslation('delete')}
                  </TextDefault>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles(currentTheme).btn, styles(currentTheme).btnDelete, { opacity: loading ? 0.5 : 1 }]} onPress={() => onDelete(selectedAddress._id)} disabled={loading}>
                {loading ? (
                  <Spinner spinnerColor={currentTheme.spinnerColor} backColor='transparent' size='small' />
                ) : (
                  <TextDefault bolder H4 textColor={currentTheme.red600}>
                    {getTranslation('delete')}
                  </TextDefault>
                )}
              </TouchableOpacity>
            )}
            {editButton && (
              <TouchableOpacity style={[styles(currentTheme).btn, styles(currentTheme).btnEdit, { opacity: loading ? 0.5 : 1 }]} onPress={() => onEdit(selectedAddress)} disabled={loading}>
                <TextDefault bolder H4 textColor={currentTheme.linkColor}>
                  {getTranslation('edit')}
                </TextDefault>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles(currentTheme).btn, styles(currentTheme).btnCancel]}
              onPress={() => {
                setModalVisible(false)
              }}
              disabled={loading}
            >
              <TextDefault bolder H4 textColor={currentTheme.fontMainColor}>
                {getTranslation('cancel')}
              </TextDefault>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default DeleteEditModal
