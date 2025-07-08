import React, { useLayoutEffect } from 'react'
import { View, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, TextInput, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './styles'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import screenOptions from './screenOptions'
import { FontAwesome, SimpleLineIcons } from '@expo/vector-icons'
import CountryPicker from 'react-native-country-picker-modal'
import useRegister from './useRegister'
import { useLanguage } from '@/src/context/Language'
import SignUpSvg from '../../assets/SVG/imageComponents/SignUpSvg'
import { useHeaderHeight } from '@react-navigation/elements'
import { scale } from '../../utils/scaling'
import { I18nManager } from 'react-native'

function Register(props) {
  const { email, setEmail, emailError, firstname, setFirstname, firstnameError, lastname, setLastname, lastnameError, password, setPassword, passwordError, phone, setPhone, phoneError, showPassword, setShowPassword, country, countryCode, registerAction, onCountrySelect, currentTheme } = useRegister()

  const { getTranslation } = useLanguage()
  const headerHeight = useHeaderHeight()
  useLayoutEffect(() => {
    props?.navigation.setOptions(
      screenOptions({
        fontColor: currentTheme.newFontcolor,
        backColor: currentTheme.themeBackground,
        iconColor: currentTheme.newIconColor,
        navigation: props?.navigation
      })
    )
  }, [props?.navigation])

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={[styles().flex, { backgroundColor: currentTheme.themeBackground }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles().flex} keyboardVerticalOffset={headerHeight}>
        <ScrollView style={styles().flex} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} alwaysBounceVertical={false}>
          <View style={styles(currentTheme).mainContainer}>
            <View style={styles().subContainer}>
              <View>
                <SignUpSvg fillColor={currentTheme.svgFill} strokeColor={currentTheme.newIconColor} />
              </View>
              <View style={styles(currentTheme).textContainer}>
                <View>
                  <TextDefault H1 textColor={currentTheme.fontMainColor} style={styles().title} isRTL>
                    {getTranslation('lets_get_started')}
                  </TextDefault>
                  <TextDefault H5 textColor={currentTheme.fontMainColor} style={styles().title} isRTL>
                    {getTranslation('create_account_first')}
                  </TextDefault>
                </View>
              </View>
              <View style={styles().form}>
                <View>
                  <TextInput placeholder={getTranslation('email')} style={[styles(currentTheme).textField, emailError && styles(currentTheme).errorInput]} placeholderTextColor={currentTheme.fontSecondColor} value={email} onChangeText={(e) => setEmail(e)} />
                  {emailError && (
                    <TextDefault style={styles().error} bold textColor={currentTheme.textErrorColor} isRTL>
                      {emailError}
                    </TextDefault>
                  )}
                </View>
                <View>
                  <TextInput placeholder={getTranslation('first_name_ph')} style={[styles(currentTheme).textField, firstnameError && styles(currentTheme).errorInput]} placeholderTextColor={currentTheme.fontSecondColor} value={firstname} onChangeText={(e) => setFirstname(e)} />
                  {firstnameError && (
                    <TextDefault style={styles().error} bold textColor={currentTheme.textErrorColor} isRTL>
                      {firstnameError}
                    </TextDefault>
                  )}
                </View>
                <View>
                  <TextInput placeholder={getTranslation('last_name_ph')} style={[styles(currentTheme).textField, lastnameError && styles(currentTheme).errorInput]} placeholderTextColor={currentTheme.fontSecondColor} value={lastname} onChangeText={(e) => setLastname(e)} />
                  {lastnameError && (
                    <TextDefault style={styles().error} bold textColor={currentTheme.textErrorColor} isRTL>
                      {lastnameError}
                    </TextDefault>
                  )}
                </View>
                <View style={styles(currentTheme).passwordField}>
                  <TextInput secureTextEntry={showPassword} placeholder={getTranslation('password')} style={[styles(currentTheme).textField, styles().passwordInput, passwordError && styles(currentTheme).errorInput]} placeholderTextColor={currentTheme.fontSecondColor} value={password} onChangeText={(e) => setPassword(e)} />
                  <View>
                    <FontAwesome onPress={() => setShowPassword(!showPassword)} name={showPassword ? 'eye' : 'eye-slash'} size={24} color={currentTheme.fontFourthColor} style={styles(currentTheme).eyeBtn} />
                  </View>
                </View>
                {passwordError && (
                  <View>
                    <TextDefault style={styles().error} bold textColor={currentTheme.textErrorColor} isRTL>
                      {passwordError}
                    </TextDefault>
                  </View>
                )}
                <View style={styles(currentTheme).number}>
                  <View style={[styles(currentTheme).textField, styles(currentTheme).countryCode, { padding: Platform.OS === 'ios' ? scale(5) : scale(12) }]}>
                    <CountryPicker countryCode={countryCode} onSelect={(country) => onCountrySelect(country)} withAlphaFilter withFilter />
                    <TextDefault textColor={currentTheme.newFontcolor} style={{ marginTop: Platform.OS === 'android' ? 7 : 10 }} isRTL>
                      {/* {country?.cca2} */}+{country?.callingCode[0]}
                    </TextDefault>
                  </View>
                  <View style={[styles(currentTheme).textField, styles(currentTheme).phoneNumber, phoneError && styles(currentTheme).errorInput, { padding: scale(0) }]}>
                    <View style={styles().phoneFieldInner}>
                      {/* <TextDefault textColor={currentTheme.newFontcolor}>
                        +{country.callingCode[0]}{' '}
                      </TextDefault> */}
                      <TextInput placeholder={getTranslation('phone_number')} placeholderTextColor={currentTheme.fontSecondColor} value={phone} onChangeText={(e) => setPhone(e)} style={styles(currentTheme).phoneField} />
                    </View>
                  </View>
                </View>
                {phoneError && (
                  <View style={{ marginLeft: '30%' }}>
                    <TextDefault style={styles(currentTheme).error} bold textColor={currentTheme.textErrorColor} isRTL>
                      {phoneError}
                    </TextDefault>
                  </View>
                )}
              </View>
            </View>
            <View style={styles().btnContainer}>
              <TouchableOpacity onPress={() => registerAction()} activeOpacity={0.7} style={styles(currentTheme).btn}>
                <TextDefault H4 textColor={currentTheme.black} bold>
                  {getTranslation('get_registered')}
                </TextDefault>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Register
