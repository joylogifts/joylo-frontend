import { View } from 'react-native'
import React, { useContext } from 'react'
import TextDefault from '../Text/TextDefault/TextDefault'
import Row from './Row'
import { scale } from '../../utils/scaling'
import { relatedItems as relatedItemsQuery, restaurant as restaurantQuery } from '../../apollo/queries'
import { gql, useApolloClient, useQuery } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { useLanguage } from '@/src/context/Language'

const RELATED_ITEMS = gql`
  ${relatedItemsQuery}
`
const RESTAURANT = gql`
  ${restaurantQuery}
`

const Section = ({ itemId, restaurantId }) => {
  const { getTranslation: t } = useLanguage()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const client = useApolloClient()
  const { loading, error, data } = useQuery(RELATED_ITEMS, {
    variables: { itemId, restaurantId }
  })
  if (loading) return <View />
  if (error) return <View />
  const { relatedItems } = data
  if (relatedItems.length < 1) return <View />
  const result = client.readQuery({
    query: RESTAURANT,
    variables: { id: restaurantId }
  })

  const slicedItems = relatedItems.length > 3 ? relatedItems.slice(0, 3) : relatedItems
  return (
    <View>
      <View style={{ marginBottom: scale(15) }}>
        <TextDefault H4 bolder textColor={currentTheme.newFontcolor} isRTL>
          {t('frequently_bought_together')}
        </TextDefault>
      </View>
      {slicedItems.map((id) => (
        <Row key={id} id={id} restaurant={result?.restaurant} />
      ))}
    </View>
  )
}
export default Section
