import React from 'react'
import { View } from 'react-native'
import TextDefault from '../Text/TextDefault/TextDefault'
import SmallStarIcon from '../../assets/SVG/small-star-icon'
import { styles } from './styles'
import { alignment } from '../../utils/alignment'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/src/context/Language'

const ReviewCard = ({ theme, name, rating, description, date }) => {
  return (
    <View style={styles.cardContainer(theme)}>
      <TextDefault bold H5 textColor={theme.gray700} isRTL>
        {name}
      </TextDefault>
      <View style={styles.reviewContainer(theme)}>
        <StarRating numberOfStars={5} rating={rating} />
        <TextDefault textColor={theme.gray500} isRTL>
          {date}
          {/* {t('daysAgo')} */}
        </TextDefault>
      </View>
      <TextDefault textColor={theme.gray500} numberOfLines={5} isRTL>
        {description}
      </TextDefault>
    </View>
  )
}

const StarRating = ({ numberOfStars, rating }) => {
  const { getTranslation: t } = useLanguage()
  const stars = Array.from({ length: numberOfStars }, (_, index) => index)
  return (
    <View style={styles.smallStarContainer}>
      {stars.map((index) => (
        <View key={`star-${index}`} style={{ ...alignment.MxSmall }}>
          <SmallStarIcon isFilled={index + 1 <= rating} />
        </View>
      ))}
    </View>
  )
}

export default ReviewCard
