import React, { useContext } from 'react'
import { View } from 'react-native'
import SideDrawerItems from '../Drawer/Items/DrawerItems'
import SideDrawerProfile from '../Drawer/Profile/DrawerProfile'
import { theme } from '../../utils/themeColors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import UserContext from '../../context/User'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import styles from './styles'

import analytics from '../../utils/analytics'

import { useLanguage } from '@/src/context/Language'

const datas = [
  {
    title: 'profile',
    icon: 'user',
    navigateTo: 'Profile',
    isAuth: true
  },
  {
    title: 'my_addresses',
    icon: 'location-pin',
    navigateTo: 'Addresses',
    isAuth: true
  },
  {
    title: 'favourite',
    icon: 'heart',
    navigateTo: 'Favourite',
    isAuth: true
  },
  {
    title: 'orders',
    icon: 'layers',
    navigateTo: 'MyOrders',
    isAuth: true
  },
  {
    title: 'chat',
    icon: 'bubble',
    navigateTo: 'Chat',
    isAuth: false
  },
  {
    title: 'settings',
    icon: 'settings',
    navigateTo: 'Settings',
    isAuth: true
  },
  {
    title: 'help',
    icon: 'question',
    navigateTo: 'Help',
    isAuth: true
  }
]

function SidebBar(props) {
  const Analytics = analytics()
  const { getTranslation } = useLanguage()

  const inset = useSafeAreaInsets()
  const { isLoggedIn, logout } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  return (
    <View
      style={[
        styles().flex,
        {
          justifyContent: 'space-between',
          paddingBottom: inset.bottom,
          backgroundColor: currentTheme.themeBackground
        }
      ]}
    >
      <View style={{ flexGrow: 1 }}>
        <View style={styles(currentTheme).topContainer}>
          <SideDrawerProfile navigation={props.navigation} />
        </View>
        <View style={styles(currentTheme).botContainer}>
          {datas.map((dataItem, ind) => (
            <View key={ind} style={styles().item}>
              <SideDrawerItems
                style={styles().iconContainer}
                onPress={async () => {
                  if (dataItem.isAuth && !isLoggedIn) {
                    props.navigation.navigate('CreateAccount')
                  } else {
                    props.navigation.navigate(dataItem.navigateTo)
                  }
                }}
                icon={dataItem.icon}
                title={getTranslation(dataItem.title)}
              />
            </View>
          ))}
          {isLoggedIn && (
            <View style={styles().item}>
              <SideDrawerItems
                onPress={async () => {
                  await Analytics.track(Analytics.events.USER_LOGGED_OUT)
                  await Analytics.identify(null, null)

                  await logout()
                  props.navigation.closeDrawer()
                }}
                icon={'logout'}
                title={getTranslation('title_logout')}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  )
}
export default SidebBar
