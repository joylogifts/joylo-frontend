import { useState, useContext } from 'react'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { emailRegex, passRegex, nameRegex, phoneRegex } from '../../utils/regex'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useLanguage } from '@/src/context/Language'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import { phoneExist } from '../../apollo/mutations'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'

const PHONE = gql`
  ${phoneExist}
`

const useRegister = () => {
  const navigation = useNavigation()
  const { getTranslation, dir } = useLanguage()
  const route = useRoute()
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState(route.params?.email || '')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(true)
  const [firstnameError, setFirstnameError] = useState(null)
  const [lastnameError, setLastnameError] = useState(null)
  const [emailError, setEmailError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [phoneError, setPhoneError] = useState(null)
  const [countryCode, setCountryCode] = useState('IL')
  const [country, setCountry] = useState({
    callingCode: ['972'],
    cca2: 'IL',
    currency: ['ILS'],
    flag: 'flag-il',
    name: 'Israel',
    region: 'Asia',
    subregion: 'Western Asia'
  })

  const [phoneExist, { loading }] = useMutation(PHONE, {
    onCompleted,
    onError
  })

  const onCountrySelect = (country) => {
    setCountryCode(country.cca2)
    setCountry(country)
  }

  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: dir === 'rtl', ...theme[themeContext.ThemeValue] }

  function validateCredentials() {
    let result = true

    setEmailError(null)
    setPasswordError(null)
    setPhoneError(null)
    setFirstnameError(null)
    setLastnameError(null)

    if (!email) {
      setEmailError(getTranslation('email_err_1'))
      result = false
    } else if (!emailRegex.test(email.trim())) {
      setEmailError(getTranslation('email_err_2'))
      result = false
    }

    if (!password) {
      setPasswordError(getTranslation('pass_err_1'))
      result = false
    } else if (passRegex.test(password) !== true) {
      setPasswordError(getTranslation('pass_err_2'))
      result = false
    }

    if (!phone) {
      setPhoneError(getTranslation('mobile_err_1'))
      result = false
    } else if (!phoneRegex.test(phone)) {
      setPhoneError(getTranslation('mobile_err_2'))
      result = false
    }

    if (!firstname) {
      setFirstnameError(getTranslation('firstname_err_1'))
      result = false
    } else if (!nameRegex.test(firstname)) {
      setFirstnameError(getTranslation('firstname_err_2'))
      result = false
    }

    if (!lastname) {
      setLastnameError(getTranslation('lastname_err_1'))
      result = false
    } else if (!nameRegex.test(lastname)) {
      setLastnameError(getTranslation('lastname_err_2'))
      result = false
    }
    return result
  }

  async function registerAction() {
    if (validateCredentials()) {
      phoneExist({ variables: { phone: country.callingCode[0] + phone } })
    }
  }

  function onCompleted(data) {
    const { phoneExist } = data
    try {
      if (phoneExist && phoneExist.phone) {
        FlashMessage({
          message: getTranslation('phone_number_exist')
        })
      } else {
        // navigation.navigate('Otp', {
        //   email,
        //   password,
        //   name: `${firstname} ${lastname}`,
        //   phone: `+${country.callingCode[0]}${phone}`
        // })

        navigation.navigate('EmailOtp', {
          user: {
            phone: '+'.concat(country.callingCode[0]).concat(phone),
            email: email.toLowerCase().trim(),
            password: password,
            name: firstname + ' ' + lastname
          }
        })
        
      }
    } catch (e) {
      FlashMessage({
        message: getTranslation('phone_checking_error')
      })
    }
  }

  function onError(error) {
    try {
      FlashMessage({
        message: error.graphQLErrors[0].message
      })
    } catch (e) {
      FlashMessage({
        message: getTranslation('phone_checking_error')
      })
    }
  }

  return {
    email,
    setEmail,
    emailError,
    firstname,
    setFirstname,
    firstnameError,
    lastname,
    setLastname,
    lastnameError,
    password,
    setPassword,
    passwordError,
    phone,
    setPhone,
    phoneError,
    showPassword,
    setShowPassword,
    country,
    countryCode,
    registerAction,
    onCountrySelect,
    themeContext,
    currentTheme,
    loading
  }
}

export default useRegister
