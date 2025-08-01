import React, { useContext } from 'react'
import { View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import UserContext from '../../../context/User'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import styles from './stylesV2'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'
import { useLanguage } from '@/src/context/Language'

function DrawerProfile(props) {
  const { getTranslation } = useLanguage()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { isLoggedIn, loadingProfile, profile } = useContext(UserContext)

  if (loadingProfile) return <TextDefault>{getTranslation('loading')}</TextDefault>
  return (
    <View style={styles(currentTheme).mainContainer}>
      {!isLoggedIn && (
        <View style={styles().logInContainer}>
          <TouchableOpacity
            style={{ ...alignment.PTxSmall, ...alignment.PBxSmall }}
            onPress={() => {
              props?.navigation.navigate({ name: 'CreateAccount' })
            }}
          >
            <TextDefault style={styles(currentTheme).alignLeft} textColor={currentTheme.fontMainColor} bold H5>
              {getTranslation('login_create_account')}
            </TextDefault>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles().loggedInContainer}>
        {isLoggedIn && profile && (
          <View style={styles().subContainer}>
            <View style={styles(currentTheme).imgContainer}>
              <TextDefault textColor={currentTheme.tagColor} bold H1>
                {profile.name.substr(0, 1).toUpperCase()}
              </TextDefault>
            </View>
            <TextDefault textColor={currentTheme.fontMainColor} bolder H2>
              {profile.name}
            </TextDefault>
          </View>
        )}
      </View>
    </View>
  )
}

export default DrawerProfile
