import React, { useContext } from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { useSubscription } from '@apollo/client'
import gql from 'graphql-tag'
import { subscriptionOrder } from '../../apollo/subscriptions'
import Heading from '../../components/MyOrders/Heading'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import TextDefault from '../Text/TextDefault/TextDefault'
import TextError from '../Text/TextError/TextError'
import { alignment } from '../../utils/alignment'
import styles from './styles'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/src/context/Language'

const ActiveOrders = ({ navigation, loading, error, activeOrders, showActiveHeader, showPastHeader }) => {
  const { getTranslation } = useLanguage()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  if (loading) {
    return <></>
  }
  if (error) return <TextError text={error.message} />

  return (
    <React.Fragment>
      {showActiveHeader && <Heading headerName={getTranslation('active_orders')} textWidth='90%' />}
      {activeOrders.map((item, index) => (
        <Item key={index.toString()} item={item} navigation={navigation} currentTheme={currentTheme} />
      ))}
      {showPastHeader && <Heading headerName={getTranslation('past_orders')} textWidth='90%' />}
    </React.Fragment>
  )
}

const Item = ({ item, navigation, currentTheme }) => {
  useSubscription(
    gql`
      ${subscriptionOrder}
    `,
    { variables: { id: item._id } }
  )
  const { getTranslation } = useLanguage()
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('OrderDetail', { _id: item._id })}>
      <View style={styles(currentTheme).container}>
        <Image style={styles(currentTheme).image} resizeMode='cover' source={{ uri: item.restaurant.image }} />
        <View style={styles(currentTheme).textContainer}>
          <View style={styles().leftContainer}>
            <TextDefault textColor={currentTheme.fontMainColor} large bolder style={alignment.MBxSmall}>
              {item.restaurant.name}
            </TextDefault>
            <TextDefault line={3} textColor={currentTheme.fontMainColor} small bold>
              {item.orderStatus === 'PENDING' ? getTranslation('pending') : getTranslation('pending')}
            </TextDefault>
          </View>
        </View>
        <View style={styles(currentTheme).line} />
        <View style={styles().rightContainer}>
          <TextDefault textColor={currentTheme.iconColorPink} bold center>
            {' '}
            {getTranslation(item.orderStatus)}
          </TextDefault>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ActiveOrders
