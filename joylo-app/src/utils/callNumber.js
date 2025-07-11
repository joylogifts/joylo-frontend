import { Linking, Alert, Platform } from 'react-native'
import { useLanguage } from '../context/Language'

export const callNumber = (phone) => {
  const { getTranslation } = useLanguage()
  let phoneNumber = phone
  if (Platform.OS !== 'android') {
    phoneNumber = `telprompt:${phone}`
  } else {
    phoneNumber = `tel:${phone}`
  }
  Linking.canOpenURL(phoneNumber)
    .then((supported) => {
      if (!supported) {
        Alert.alert(getTranslation('phone_number_not_available'))
      } else {
        return Linking.openURL(phoneNumber)
      }
    })
    .catch((err) => console.log(err))
}
