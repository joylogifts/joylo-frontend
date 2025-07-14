import React, { useState, useEffect } from 'react'
import { View, Modal, Pressable } from 'react-native'
import TextDefault from '../Text/TextDefault/TextDefault'
import Button from '../Button/Button'
import styles from './styles'
import { alignment } from '../../utils/alignment'
import { ORDER_STATUS_ENUM } from '../../utils/enums'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/src/context/Language'
import Spinner from '../Spinner/Spinner'
import { scale } from '../../utils/scaling'

export const CancelModal = ({ theme, modalVisible, setModalVisible, cancelOrder, loading, orderStatus }) => {
  const { getTranslation: t } = useLanguage()
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    if (orderStatus === ORDER_STATUS_ENUM.CANCELLED) {
      setIsCancelling(false)
    }
  }, [orderStatus]);

  const handleCancelOrder = async () => {
    setIsCancelling(true)
    await cancelOrder()
  }

  return (
    <Modal animationType='slide' visible={modalVisible} transparent={true}>
      <Pressable style={styles.container(theme)} onPress={setModalVisible}>
        {orderStatus === ORDER_STATUS_ENUM.CANCELLED ? (
          <View style={styles.modalContainer(theme)}>
            <View style={{ ...alignment.MBsmall }}>
              <TextDefault H4 bolder textColor={theme.gray900}>
                {t('your_order_is_cancelled')}
              </TextDefault>
            </View>
            <View>
              <TextDefault H5 textColor={theme.gray500}>
                {t('if_you_have_any_questions_feel_free_to_reach_out_to_our_support_team')}
              </TextDefault>
            </View>
          </View>
        ) : (
          <View style={styles.modalContainer(theme)}>
            <View style={{ ...alignment.MBsmall }}>
              <TextDefault H4 bolder textColor={theme.gray900}>
                {t('cancel_your_order')}
              </TextDefault>
            </View>
            <View>
              <TextDefault H5 textColor={theme.gray500}>
                {t('we_ve_got_your_order_and_may_find_you_a_rider_any_second_now_cancel_anyway')}
              </TextDefault>
            </View>
            {isCancelling ? (
              <View style={{ height: scale(20), marginTop: scale(15) }}>
                <Spinner spinnerColor={theme.main} backColor='transparent' size='small' />
              </View>
            ) : (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ ...alignment.MTlarge }}>
                  <Button text={t('cancel_your_order')} buttonProps={{ onPress: handleCancelOrder, disabled: isCancelling }} buttonStyles={[styles.cancelButtonContainer(theme), { backgroundColor: theme.red600 }]} textProps={{ textColor: theme.white }} textStyles={{ ...alignment.Pmedium }} />
                </View>
                <View style={{ ...alignment.MTsmall }}>
                  <Button text={t('i_will_wait_for_my_order')} buttonProps={{ onPress: setModalVisible }} buttonStyles={styles.dismissButtonContainer(theme)} textStyles={{ ...alignment.Pmedium, color: theme.newIconColor }} />
                </View>
              </View>
            )}
          </View>
        )}
      </Pressable>
    </Modal>
  )
}
