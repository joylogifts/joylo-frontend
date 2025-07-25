import React, { useState, useRef, useContext, useEffect } from 'react'
import { View, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar, Modal, ScrollView, AppState, Linking } from 'react-native'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { scale } from '../../utils/scaling'
import { Deactivate, REQUEST_DELETE_USER_ACCOUNT } from '../../apollo/mutations'
import { FavouriteRestaurant, profile } from '../../apollo/queries'
import { theme } from '../../utils/themeColors'
import UserContext from '../../context/User'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import styles from './styles'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import { useNavigation, useRoute } from '@react-navigation/native'
import analytics from '../../utils/analytics'
import { Feather, MaterialIcons, EvilIcons } from '@expo/vector-icons'
import { HeaderBackButton } from '@react-navigation/elements'
import navigationService from '../../routes/navigationService'
import { useLanguage } from '@/src/context/Language'
import Spinner from '../../components/Spinner/Spinner'
import { LocationContext } from '../../context/Location'
import ButtonContainer from '../../components/Account/ButtonContainer/ButtonContainer'
import { pushToken, updateNotificationStatus } from '../../apollo/mutations'
import CheckboxBtn from '../../ui/FdCheckbox/CheckboxBtn'
import LogoutModal from '../../components/Sidebar/LogoutModal/LogoutModal'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import LanguageModal from '../../components/LanguageModalize/LanguageModal'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Localization from 'expo-localization'
import { languageTypes } from '../../components/LanguageModalize/LanguageModal'

import useNetworkStatus from '../../utils/useNetworkStatus'
import ErrorView from '../../components/ErrorView/ErrorView'

const PUSH_TOKEN = gql`
  ${pushToken}
`
const UPDATE_NOTIFICATION_TOKEN = gql`
  ${updateNotificationStatus}
`

const DEACTIVATE = gql`
  ${Deactivate}
`

const PROFILE = gql`
  ${profile}
`

function Account(props) {
  const Analytics = analytics()
  const navigation = useNavigation()
  const route = useRoute()
  const { params } = route
  const { getTranslation, dir, selectedLanguage, setSelectedLanguage, languages, languagesLoading, languagesError } = useLanguage()
  const [toggleView, setToggleView] = useState(true)
  const [showPass, setShowPass] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [lngModalVisible, setLngModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  const [spinnerLoading, setSpinnerLoading] = useState(false)

  const [orderNotification, orderNotificationSetter] = useState()
  const [offerNotification, offerNotificationSetter] = useState()
  const [btnText, setBtnText] = useState(null)
  const [appState, setAppState] = useState(AppState.currentState)

  const [uploadToken] = useMutation(PUSH_TOKEN)
  const { logout } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const { isConnected: connect, setIsConnected: setConnect } = useNetworkStatus()
  const { profile, loadingProfile, errorProfile } = useContext(UserContext)
  const [mutate, { loading }] = useMutation(UPDATE_NOTIFICATION_TOKEN, {
    onCompleted,
    onError,
    refetchQueries: [{ query: PROFILE }]
  })

  const currentTheme = {
    isRTL: dir === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const [deleteUserAccount, { loading: deactivateLoading }] = useMutation(REQUEST_DELETE_USER_ACCOUNT, {
    onCompleted: onCompletedDeactivate,
    onError: onErrorDeactivate
  })
/*   const [deactivated, { loading: deactivateLoading }] = useMutation(DEACTIVATE, {
    onCompleted: onCompletedDeactivate,
    onError: onErrorDeactivate
  }) */


  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
    }
    StatusBar.setBarStyle(themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content')
  }, [])

  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_PROFILE)
    }
    Track()
  }, [])
  useEffect(() => {
    props.navigation.setOptions({
      title: getTranslation('account'),
      headerRight: null,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: currentTheme.newFontcolor,
        fontWeight: 'bold'
      },
      headerTitleContainerStyle: {
        marginTop: '2%',
        paddingLeft: scale(25),
        paddingRight: scale(25),
        height: '75%',
        marginLeft: 0
      },
      headerStyle: {
        backgroundColor: currentTheme.newheaderBG,
        elevation: 0
      },
      passChecker: showPass,
      closeIcon: toggleView,
      closeModal: setToggleView,
      modalSetter: setModalVisible,
      passwordButton: setShowPass,
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=''
          backImage={() => (
            <View>
              <MaterialIcons name='arrow-back' size={25} color={currentTheme.newIconColor} />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
    checkPermission()
  }, [props.navigation, showPass, toggleView, themeContext.ThemeValue, selectedLanguage])

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange)
  }, [])

  useEffect(() => {
    orderNotificationSetter(profile?.isOrderNotification)
    offerNotificationSetter(profile?.isOfferNotification)
  }, [profile])

  // useEffect(() => {
  //   if (!lngModalVisible) {
  //     fetchSelectedLanguage()
  //   }
  // }, [lngModalVisible])

  useEffect(() => {
    return () => {
      setSpinnerLoading(false)
    }
  }, [])

  const _handleAppStateChange = async (nextAppState) => {
    if (nextAppState === 'active') {
      let token = null
      const permission = await getPermission()
      if (permission === 'granted') {
        if (!profile.notificationToken) {
          token = await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig.extra.eas.projectId
          })
          uploadToken({ variables: { token: token.data } })
        }
        offerNotificationSetter(profile?.isOfferNotification)
        orderNotificationSetter(profile?.isOrderNotification)
      } else {
        offerNotificationSetter(false)
        orderNotificationSetter(false)
      }
    }
    setAppState(nextAppState)
  }

  // const fetchSelectedLanguage = async () => {
  //   const lang = await AsyncStorage.getItem('enatega-language-name')
  //   const systemLangCode = Localization.locale.split('-')[0]

  //   if (lang) {
  //     setselectedLanguage(lang)
  //   } else {
  //     // Find the language value based on the system language code
  //     const matchedLanguage = languageTypes.find((langType) => langType.code === systemLangCode)
  //     // Set to the language value if found, otherwise default to 'English'
  //     setselectedLanguage(matchedLanguage ? matchedLanguage.value : 'English')
  //   }
  // }

  async function checkPermission() {
    const permission = await getPermission()
    if (permission !== 'granted') {
      offerNotificationSetter(false)
      orderNotificationSetter(false)
    } else {
      offerNotificationSetter(profile?.isOfferNotification)
      orderNotificationSetter(profile?.isOrderNotification)
    }
  }

  async function getPermission() {
    const { status } = await Notifications.getPermissionsAsync()
    return status
  }

  function toggleTheme() {
    if (themeContext.ThemeValue === 'Pink') {
      themeContext.dispatch({ type: 'Dark' })
    } else {
      themeContext.dispatch({ type: 'Pink' })
    }
  }

  const onCompletedDeactivate = () => {
    setDeleteModalVisible(false)
    logout()
      .then(() => {
        navigation.reset({
          routes: [{ name: 'Main' }]
        })
        FlashMessage({ message: getTranslation('account_deactivated'), duration: 5000 })
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const onErrorDeactivate = (error) => {
    if (error.graphQLErrors) {
      FlashMessage({
        message: error.graphQLErrors[0].message
      })
    } else if (error.networkError) {
      FlashMessage({
        message: error.networkError.result.errors[0].message
      })
    } else {
      FlashMessage({
        message: getTranslation('could_not_delete_account_please_try_again_later')
      })
    }
  }

  const handleCancel = () => {
    setModalVisible(false)
  }
  const handleLogout = async () => {
    try {
      setSpinnerLoading(true)
      setModalVisible(false)
      await Analytics.track(Analytics.events.USER_LOGGED_OUT)
      await Analytics.identify(null, null)
      await logout()
      navigation.reset({
        routes: [{ name: 'Main' }]
      })
      // navigation.closeDrawer()
      FlashMessage({ message: getTranslation('logout_message') })
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }
  const logoutClick = () => {
    setModalVisible(true)
  }

  async function deactivatewithemail() {
    try {
      await deleteUserAccount()
      setDeleteModalVisible(false)
      await logout()
      navigation.reset({
        routes: [{ name: 'Main' }]
      })
      FlashMessage({ message: getTranslation('account_deactivated') })
    } catch (error) {
      console.error('Error during deactivation mutation:', error)
    }
  }

  function onCompleted() {
    FlashMessage({
      message: getTranslation('notification_status_updated')
    })
  }

  function onError(error) {
    if (error.graphQLErrors) {
      FlashMessage({
        message: error.graphQLErrors[0].message
      })
    } else {
      FlashMessage({
        message: getTranslation('error_in_profile')
      })
    }
  }

  async function updateNotificationStatus(notificationCheck) {
    let orderNotify, offerNotify
    if (!Device.isDevice) {
      FlashMessage({
        message: getTranslation('notification_not_work')
      })
      console.log('Device is not available, returning early')
      return
    }

    const permission = await getPermission()
    if (!profile.notificationToken || permission !== 'granted') {
      console.log('Permission not granted or notification token not available, opening settings')
      Linking.openSettings()
    }

    if (notificationCheck === 'offer') {
      console.log('Updating offer notification')
      offerNotificationSetter(!offerNotification)
      orderNotify = orderNotification
      offerNotify = !offerNotification
    }

    if (notificationCheck === 'order') {
      console.log('Updating order notification')
      orderNotificationSetter(!orderNotification)
      orderNotify = !orderNotification
      offerNotify = offerNotification
    }

    console.log('Calling mutate with variables:', {
      offerNotification: offerNotify,
      orderNotification: orderNotify
    })
    mutate({
      variables: {
        offerNotification: offerNotify,
        orderNotification: orderNotify
      }
    })
  }

  if (errorProfile) {
    FlashMessage({
      message: getTranslation('error_in_profile')
    })
  }

  if (loadingProfile || spinnerLoading) return <Spinner backColor={currentTheme.CustomLoadingBG} spinnerColor={currentTheme.main} />

  if (!connect) return <ErrorView refetchFunctions={[]} />

  return (
    <>
      <View style={styles(currentTheme).formContainer}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={styles(currentTheme).flex}>
          <ScrollView style={styles().flex} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} alwaysBounceVertical={false}>
            <View style={styles(currentTheme).mainContainer}>
              <View style={styles(currentTheme).padding}>
                <TextDefault H2 bolder textColor={currentTheme.fontThirdColor} isRTL>
                  {getTranslation('account')}
                </TextDefault>
              </View>

              <View style={styles(currentTheme).subContainer}>
                <View>
                  <ButtonContainer title={getTranslation('email')} detail={profile?.email} status={profile?.emailIsVerified ? getTranslation('verified') : getTranslation('not_verified_label')} onPress='null' />
                  <View style={styles(currentTheme).line} />
                  <ButtonContainer
                    title={getTranslation('phone')}
                    detail={profile?.phone}
                    status={profile?.phoneIsVerified ? getTranslation('verified') : getTranslation('not_verified_label')}
                    onPress={() =>
                      navigation.navigate('PhoneNumber', {
                        prevScreen: 'Account'
                      })
                    }
                  />
                  <View style={styles(currentTheme).line} />
                  <ButtonContainer
                    title={getTranslation('name')}
                    detail={profile?.name}
                    status='null'
                    onPress={() =>
                      navigation.navigate('EditName', {
                        name: profile?.name,
                        phone: profile?.phone
                      })
                    }
                  />
                  <View style={styles(currentTheme).line} />

                  <View style={[styles().padding]}>
                    <TextDefault H5 bolder textColor={currentTheme.fontThirdColor} isRTL>
                      {getTranslation('language')}
                    </TextDefault>
                    <TouchableOpacity
                      style={[styles(currentTheme).linkContainer, styles(currentTheme).flexRow]}
                      onPress={() => {
                        setLngModalVisible(true)
                      }}
                    >
                      <TextDefault style={styles().drawerContainer} textColor={currentTheme.fontMainColor} small H5 bolder isRTL>
                        {!languagesLoading && !languagesError && languages.find((item) => item.code === selectedLanguage)?.label}
                      </TextDefault>

                      <View style={[styles(currentTheme).leftContainer, styles(currentTheme).flexRow]}>
                        <TextDefault style={styles().drawerContainer} textColor={currentTheme.linkColor} small H5 bolder isRTL>
                          {getTranslation('edit')}
                        </TextDefault>
                        <EvilIcons name={currentTheme.isRTL ? 'chevron-left' : 'chevron-right'} size={scale(30)} color={currentTheme.darkBgFont} />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles(currentTheme).line} />

                  <ButtonContainer title={getTranslation('delete_account')} detail={''} status='null' onPress={() => setDeleteModalVisible(true)} />
                  <View style={styles(currentTheme).line} />
                </View>

                <View style={styles(currentTheme).mainContainerArea}>
                  <View style={[styles(currentTheme).languageContainer, styles().checkboxSettings, styles().padding]}>
                    <View>
                      <CheckboxBtn
                        checked={orderNotification}
                        onPress={() => {
                          updateNotificationStatus('order')
                          setBtnText('order')
                        }}
                      />
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        updateNotificationStatus('order')
                        setBtnText('order')
                      }}
                    >
                      <View style={styles(currentTheme).notificationChekboxContainer}>
                        <TextDefault
                          // numberOfLines={1}
                          textColor={currentTheme.darkBgFont}
                          style={alignment.MLsmall}
                          isRTL
                        >
                          {' '}
                          {getTranslation('receive_push_notification')}{' '}
                        </TextDefault>
                      </View>
                      {loading && btnText === 'order' && (
                        <View>
                          <Spinner size='small' backColor='transparent' spinnerColor={currentTheme.main} />
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>

                  <View style={[styles(currentTheme).languageContainer, styles().checkboxSettings, styles().padding]}>
                    <View>
                      <CheckboxBtn
                        checked={offerNotification}
                        onPress={() => {
                          updateNotificationStatus('offer')
                          setBtnText('offer')
                        }}
                      />
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        updateNotificationStatus('offer')
                        setBtnText('offer')
                      }}
                    >
                      <View style={styles(currentTheme).notificationChekboxContainer}>
                        <TextDefault
                          // numberOfLines={1}
                          textColor={currentTheme.darkBgFont}
                          style={alignment.MLsmall}
                          isRTL
                        >
                          {getTranslation('receive_offer_by_email')}{' '}
                        </TextDefault>
                      </View>
                      {loading && btnText === 'offer' && (
                        <View>
                          <Spinner size='small' backColor='transparent' spinnerColor={currentTheme.main} />
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>

                  <View style={[styles(currentTheme).languageContainer, styles().checkboxSettings, styles().padding]}>
                    <View>
                      <CheckboxBtn checked={themeContext.ThemeValue === 'Dark'} onPress={() => toggleTheme()} />
                    </View>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => toggleTheme()}>
                      <View style={styles(currentTheme).notificationChekboxContainer}>
                        <TextDefault numberOfLines={1} textColor={currentTheme.darkBgFont} style={alignment.MLsmall} isRTL>
                          {' '}
                          {getTranslation('turn_on_dark_theme')}{' '}
                        </TextDefault>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                <View>
                  <TextDefault H2 bolder textColor={currentTheme.fontThirdColor} style={styles().padding} isRTL>
                    {getTranslation('legal')}
                  </TextDefault>
                  <ButtonContainer
                    title={getTranslation('service_terms')}
                    detail={''}
                    status='null'
                    onPress={() => {
                      Linking.openURL('https://multivendor.enatega.com/#/terms')
                    }}
                  />
                  <View style={styles(currentTheme).line} />

                  <ButtonContainer
                    title={getTranslation('privacy_policy')}
                    detail={''}
                    status='null'
                    onPress={() => {
                      Linking.openURL('https://multivendor.enatega.com/#/privacy')
                    }}
                  />
                </View>

             
                <View style={styles(currentTheme).containerButton}>
                  <TouchableOpacity activeOpacity={0.5} style={styles(currentTheme).addButton} onPress={logoutClick}>
                    <View style={styles(currentTheme).contentContainer}>
                      <TextDefault bold H5 textColor={currentTheme.red600}>
                        {getTranslation('logout')}
                      </TextDefault>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>

          <Modal
            onBackdropPress={() => setDeleteModalVisible(false)}
            onBackButtonPress={() => setDeleteModalVisible(false)}
            visible={deleteModalVisible}
            onRequestClose={() => {
              setDeleteModalVisible(false)
            }}
          >
            <View style={styles().centeredView}>
              <View style={styles(currentTheme).modalView}>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 24,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: scale(10)
                  }}
                >
                  <TextDefault bolder H3 textColor={currentTheme.newFontcolor} isRTL>
                    {getTranslation('delete_confirmation')}
                  </TextDefault>
                  <Feather name='x-circle' size={24} color={currentTheme.newFontcolor} onPress={() => setDeleteModalVisible(!deleteModalVisible)} />
                </View>
                <TextDefault H5 textColor={currentTheme.newFontcolor} isRTL>
                  {getTranslation('permanent_delete_message')}
                </TextDefault>
                <TouchableOpacity style={[styles(currentTheme).btn, styles().btnDelete, { opacity: deactivateLoading ? 0.5 : 1 }]} onPress={deactivatewithemail} disabled={deactivateLoading}>
                  {deactivateLoading ? (
                    <Spinner backColor='transparent' size='small' />
                  ) : (
                    <TextDefault bolder H4 textColor={currentTheme.white}>
                      {getTranslation('yes_sure')}
                    </TextDefault>
                  )}
                </TouchableOpacity>
                <TouchableOpacity style={[styles(currentTheme).btn, styles().btnCancel]} onPress={() => setDeleteModalVisible(false)} disabled={deactivateLoading}>
                  <TextDefault bolder H4 textColor={currentTheme.black}>
                    {getTranslation('no_delete')}
                  </TextDefault>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <LogoutModal visible={modalVisible} onCancel={handleCancel} onLogout={handleLogout} showCrossButton />
          <LanguageModal currentTheme={currentTheme} modalVisible={lngModalVisible} setModalVisible={setLngModalVisible} showCrossButton />
        </KeyboardAvoidingView>
      </View>
    </>
  )
}

export default Account
