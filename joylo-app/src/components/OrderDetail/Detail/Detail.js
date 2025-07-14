import { View, Image } from 'react-native'
import React from 'react'
import TextDefault from '../../Text/TextDefault/TextDefault'
import styles from './styles'
import { useLanguage } from '@/src/context/Language'
import { alignment } from '../../../utils/alignment'
import { scale } from '../../../utils/scaling'
import { ChatButton } from './ChatButton'
import { ORDER_STATUS_ENUM } from '../../../utils/enums'
import { formatNumber } from '../../../utils/formatNumber'

export default function Detail({ theme, from, orderNo, deliveryAddress, items, currencySymbol, subTotal, tip, tax, deliveryCharges, total, navigation, id, rider, orderStatus }) {
  const riderPhone = rider?.phone
  const { getTranslation: t, selectedLanguage } = useLanguage()
  console.log(items, "items")
  return (
    <View style={styles.container(theme)}>
      {rider && orderStatus !== ORDER_STATUS_ENUM.DELIVERED && orderStatus !== ORDER_STATUS_ENUM.CANCELLED && <ChatButton onPress={() => navigation.navigate('ChatWithRider', { id, orderNo, total, riderPhone })} title={t('let_s_chat_with_rider')} description={t('ask_for_contactless_delivery')} theme={theme} />}
      <TextDefault textColor={theme.gray500} bolder H4 style={{ ...alignment.MBsmall }} isRTL>
        {from}
      </TextDefault>
      <View style={{ flexDirection: theme?.isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 4 }}>
        <TextDefault textColor={theme.gray500} bolder H5 style={{ ...alignment.MBmedium }} isRTL>
          {t('your_order')}
        </TextDefault>
        <TextDefault textColor={theme.lightBlue} bolder H4 style={{ ...alignment.MBmedium }} isRTL>
          #{orderNo}
        </TextDefault>
      </View>

      <View style={{ flexDirection: theme?.isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', ...alignment.MBsmall, paddingRight: 10 }}>
        <TextDefault textColor={theme.gray500} bolder H5 bold isRTL>
          {t('items_and_quantity')} ({items.length})
        </TextDefault>
        <TextDefault textColor={theme.gray500} bolder H5 bold isRTL>
          {t('price')}
        </TextDefault>
      </View>

      <View style={styles.itemsContainer}>
        {items.map((item) => (
          <ItemRow key={item._id} theme={theme} quantity={item.quantity} title={`${typeof item?.title === "object" ? item?.title[selectedLanguage] : item?.title} ${typeof item.variation.title === "object" ? item.variation.title[selectedLanguage] : item.variation.title}`} currency={currencySymbol} price={item.variation.price} options={item.addons.map((addon) => addon.options.map(({ title }) => typeof title === "object" ? title[selectedLanguage] : title))} image={item?.image} />
        ))}
      </View>
    </View>
  )
}
const ItemRow = ({ theme, quantity, title, options = ['raita', '7up'], price, currency, image }) => {
  const { getTranslation: t, sendNotification } = useLanguage()
  console.log(options, 'options')
  return (
    <View style={styles.itemRow(theme)}>
      <View>
        <Image
          style={{
            width: scale(48),
            height: scale(64),
            borderRadius: scale(8)
          }}
          source={image ? { uri: image } : require('../../../assets/images/food_placeholder.png')}
        ></Image>
      </View>
      <View style={{ width: '60%', justifyContent: 'center' }}>
        <TextDefault left numberOfLines={1} textColor={theme.gray900} H5 bolder style={{ ...alignment.MBxSmall }} isRTL>
          {title}
        </TextDefault>

        {options.length > 0 && (
          <TextDefault bold textColor={theme.gray600} left style={{ ...alignment.MBxSmall }} isRTL>
            {options.join(',')}
          </TextDefault>
        )}

        <TextDefault Regular left bolder textColor={theme.gray900} isRTL>
          x{quantity}
        </TextDefault>
      </View>
      <TextDefault style={{ width: '20%', textAlign: 'right', paddingRight: 10 }} bolder textColor={theme.gray900} H5 isRTL>
        {currency}
        {formatNumber(price)}
      </TextDefault>
    </View>
  )
}
