import React, { useState, useContext } from 'react'
import { View, TouchableOpacity, Alert, TextInput } from 'react-native'
import styles from './styles'
import Modal from 'react-native-modal'
import { changePassword } from '../../apollo/mutations'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import { theme } from '../../utils/themeColors'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { alignment } from '../../utils/alignment'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { Feather } from '@expo/vector-icons'
import { useLanguage } from '@/src/context/Language'

const CHANGE_PASSWORD = gql`
  ${changePassword}
`

function ChangePassword(props) {
  const { getTranslation } = useLanguage()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [oldPasswordError, setOldPasswordError] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  const [mutate, { loading }] = useMutation(CHANGE_PASSWORD, {
    onError,
    onCompleted
  })

  function onError(error) {
    if (error.networkError) {
      FlashMessage({
        message: error.networkError.result.errors[0].message
      })
    } else if (error.graphQLErrors) {
      FlashMessage({
        message: error.graphQLErrors[0].message
      })
    }
  }
  function clearFields() {
    setOldPassword('')
    setNewPassword('')
    setOldPasswordError('')
    setNewPasswordError('')
  }

  function onCompleted(data) {
    if (data.changePassword) {
      clearFields()
      FlashMessage({
        message: getTranslation('update_password')
      })
      props.hideModal()
    } else {
      Alert.alert('Error', getTranslation('invalid_password'))
    }
  }

  return (
    <Modal onBackButtonPress={props.hideModal} onBackdropPress={props.hideModal} isVisible={props.modalVisible} animationType='slide' onModalHide={clearFields}>
      <View style={styles(currentTheme).modalContainer}>
        <View style={styles().modalHeader}>
          <View activeOpacity={0.7} style={styles().modalheading}>
            <TextDefault H4 bolder textColor={currentTheme.newFontcolor} center>
              {getTranslation('change_password')}
            </TextDefault>
          </View>
          <Feather name='x-circle' size={24} color={currentTheme.newIconColor} onPress={() => props.hideModal()} />
        </View>

        <View style={{ ...alignment.MTsmall, gap: 8 }}>
          <TextDefault uppercase bold textColor={currentTheme.gray500}>
            {getTranslation('current_password')}
          </TextDefault>
          <TextInput
            style={[
              styles(currentTheme).modalInput,
              {
                borderBottomColor: oldPasswordError ? currentTheme.textErrorColor : currentTheme.tagColor,
                borderBottomWidth: 1
              }
            ]}
            maxLength={20}
            secureTextEntry
            value={oldPassword}
            onChangeText={(text) => {
              setOldPassword(text)
              setOldPasswordError(text ? '' : getTranslation('pass_err_1'))
            }}
            onBlur={() => {
              setOldPasswordError(!oldPassword ? getTranslation('pass_err_1') : '')
            }}
          />
          {oldPasswordError ? (
            <TextDefault small textColor={currentTheme.textErrorColor}>
              {oldPasswordError}
            </TextDefault>
          ) : null}
        </View>

        <View style={{ ...alignment.MTmedium, gap: 8 }}>
          <TextDefault uppercase bold textColor={currentTheme.gray500}>
            {getTranslation('new_password')}
          </TextDefault>
          <TextInput
            style={[
              styles(currentTheme).modalInput,
              {
                borderBottomColor: newPasswordError ? currentTheme.textErrorColor : currentTheme.tagColor,
                borderBottomWidth: 1
              }
            ]}
            maxLength={20}
            secureTextEntry
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text)
              setNewPasswordError(text ? '' : getTranslation('pass_err_1'))
            }}
            onBlur={() => {
              setNewPasswordError(!newPassword ? getTranslation('pass_err_1') : '')
            }}
          />
          {newPasswordError ? (
            <TextDefault small textColor={currentTheme.textErrorColor}>
              {newPasswordError}
            </TextDefault>
          ) : null}
        </View>

        <TouchableOpacity
          disabled={loading}
          onPress={() => {
            if (newPassword === '' || oldPassword === '') {
              props.hideModal()
            }
            const newPasswordError = newPassword === '' ? getTranslation('pass_err_1') : ''
            const oldPasswordError = oldPassword === '' ? getTranslation('pass_err_1') : ''
            setNewPasswordError(newPasswordError)
            setOldPasswordError(oldPasswordError)

            if (oldPasswordError.length === 0 && newPasswordError.length === 0) {
              mutate({ variables: { oldPassword, newPassword } })
            }
          }}
          style={[styles(currentTheme).btnContainer]}
        >
          <TextDefault textColor={currentTheme.newFontcolor} style={styles().checkoutBtn} bold H4>
            {newPassword !== '' && oldPassword !== '' ? getTranslation('apply') : getTranslation('cancel')}
          </TextDefault>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

export default ChangePassword
