/* eslint-disable react/display-name */
import React, { useRef, useContext, useLayoutEffect, useState, useEffect } from 'react'
import { View, SafeAreaView, TouchableOpacity, Animated, StatusBar, Platform, RefreshControl, Image, FlatList, ScrollView } from 'react-native'
import { Modalize } from 'react-native-modalize'
import { MaterialIcons, SimpleLineIcons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { useQuery, useMutation } from '@apollo/client'
import { useCollapsibleSubHeader, CollapsibleSubHeaderAnimator } from 'react-navigation-collapsible'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder'
import gql from 'graphql-tag'
import { useLocation } from '../../ui/hooks'
import Search from '../../components/Main/Search/Search'
import Item from '../../components/Main/Item/Item'
import UserContext from '../../context/User'
import { restaurantList } from '../../apollo/queries'
import { selectAddress } from '../../apollo/mutations'
import { scale } from '../../utils/scaling'
import styles from './styles'
import TextError from '../../components/Text/TextError/TextError'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import navigationOptions from './navigationOptions'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { LocationContext } from '../../context/Location'
import { ActiveOrdersAndSections } from '../../components/Main/ActiveOrdersAndSections'
import { alignment } from '../../utils/alignment'
import Spinner from '../../components/Spinner/Spinner'
import analytics from '../../utils/analytics'
import MapSection from '../MapSection/index'
import { useTranslation } from 'react-i18next'
import useGeocoding from '../../ui/hooks/useGeocoding'

import useNetworkStatus from '../../utils/useNetworkStatus'
import ErrorView from '../../components/ErrorView/ErrorView'
import { useLanguage } from '@/src/context/Language'

const RESTAURANTS = gql`
  ${restaurantList}
`
const SELECT_ADDRESS = gql`
  ${selectAddress}
`

function Main(props) {
  const Analytics = analytics()

  const { getTranslation: t } = useLanguage()
  const [busy, setBusy] = useState(false)
  const { loadingOrders, isLoggedIn, profile } = useContext(UserContext)
  const { location, setLocation } = useContext(LocationContext)
  const [search, setSearch] = useState('')
  const modalRef = useRef(null)
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { getCurrentLocation } = useLocation()
  const { getAddress } = useGeocoding()
  const { data, refetch, networkStatus, loading, error } = useQuery(RESTAURANTS, {
    variables: {
      longitude: location.longitude || null,
      latitude: location.latitude || null,
      ip: null
    },
    fetchPolicy: 'network-only'
  })
  const [mutate, { loading: mutationLoading }] = useMutation(SELECT_ADDRESS, {
    onError
  })

  const { onScroll /* Event handler */, containerPaddingTop /* number */, scrollIndicatorInsetTop /* number */, translateY } = useCollapsibleSubHeader()

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.newheaderColor)
    }
    StatusBar.setBarStyle(themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content')
  })
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_MAIN)
    }
    Track()
  }, [])
  useLayoutEffect(() => {
    navigation.setOptions(
      navigationOptions({
        headerMenuBackground: currentTheme.newheaderColor,
        horizontalLine: currentTheme.newheaderColor,
        fontMainColor: currentTheme.darkBgFont,
        iconColorPink: currentTheme.black,
        open: onOpen
      })
    )
  }, [navigation, currentTheme])

  const onOpen = () => {
    const modal = modalRef.current
    if (modal) {
      modal.open()
    }
  }

  function onError(error) {
    console.log(error)
  }

  const addressIcons = {
    Home: 'home',
    Work: 'briefcase',
    Other: 'location-pin'
  }

  const setAddressLocation = async (address) => {
    setLocation({
      _id: address._id,
      label: address.label,
      latitude: Number(address.location.coordinates[1]),
      longitude: Number(address.location.coordinates[0]),
      deliveryAddress: address.deliveryAddress,
      details: address.details
    })
    mutate({ variables: { id: address._id } })
    modalRef.current.close()
  }
  const setCurrentLocation = async () => {
    setBusy(true)

    const { error, coords } = await getCurrentLocation()

    if (!coords || !coords.latitude || !coords.longitude) {
      console.error('Invalid coordinates:', coords)
      setBusy(false)
      return
    }

    // Get the address function from the hook

    try {
      // Fetch the address using the geocoding hook
      const { formattedAddress, city } = await getAddress(coords.latitude, coords.longitude)

      let address = formattedAddress || 'Unknown Address'

      if (address.length > 21) {
        address = address.substring(0, 21) + '...'
      }

      if (error) {
        navigation.navigate('SelectLocation')
      } else {
        modalRef.current?.close()
        setLocation({
          label: 'currentLocation',
          latitude: coords.latitude,
          longitude: coords.longitude,
          deliveryAddress: address
        })
        setBusy(false)
      }
    } catch (fetchError) {
      console.error('Error fetching address using Google Maps API:', fetchError.message)
    }
  }

  // const setCurrentLocation = async () => {
  //   setBusy(true)
  //   const { error, coords } = await getCurrentLocation()

  //   const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
  //   fetch(apiUrl)
  //     .then(response => response.json())
  //     .then(data => {
  //       if (data.error) {
  //         console.log('Reverse geocoding request failed:', data.error)
  //       } else {
  //         let address = data.display_name
  //         if (address.length > 21) {
  //           address = address.substring(0, 21) + '...'
  //         }

  //         if (error) navigation.navigate('SelectLocation')
  //         else {
  //           modalRef.current.close()
  //           setLocation({
  //             label: 'currentLocation',
  //             latitude: coords.latitude,
  //             longitude: coords.longitude,
  //             deliveryAddress: address
  //           })
  //           setBusy(false)
  //         }
  //         console.log(address)
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error fetching reverse geocoding data:', error)
  //     })
  // }

  const modalHeader = () => (
    <View style={[styles().addressbtn]}>
      <TouchableOpacity style={[styles(currentTheme).addressContainer]} activeOpacity={0.7} onPress={setCurrentLocation}>
        <View style={styles().addressSubContainer}>
          <MaterialCommunityIcons name='target' size={scale(25)} color={currentTheme.black} />
          <View style={styles().mL5p} />
        </View>
      </TouchableOpacity>
      <View style={styles().addressTick}>
        {location.label === 'currentLocation' && <MaterialIcons name='check' size={scale(15)} color={currentTheme.iconColorPink} />}
        {busy && <Spinner size={'small'} backColor={currentTheme.themeBackground} />}
      </View>
    </View>
  )

  const emptyView = () => {
    if (loading || mutationLoading || loadingOrders) return loadingScreen()
    else {
      return (
        <View style={styles().emptyViewContainer}>
          <TextDefault textColor={currentTheme.fontMainColor}>{t('noRestaurants')}</TextDefault>
        </View>
      )
    }
  }

  const modalFooter = () => (
    <View style={styles().addressbtn}>
      <View style={styles(currentTheme).addressContainer}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            if (isLoggedIn) {
              navigation.navigate('NewAddress')
            } else {
              const modal = modalRef.current
              modal?.close()
              props?.navigation.navigate({ name: 'CreateAccount' })
            }
          }}
        >
          <View style={styles().addressSubContainer}>
            <AntDesign name='pluscircleo' size={scale(12)} color={currentTheme.black} />
            <View style={styles().mL5p} />
            <TextDefault bold>{t('add_address')}</TextDefault>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles().addressTick}></View>
    </View>
  )

  function loadingScreen() {
    return (
      <View style={styles(currentTheme).screenBackground}>
        <Search search={''} setSearch={() => { }} placeHolder={t('search_restaurant')} />
        <Placeholder Animation={(props) => <Fade {...props} style={styles(currentTheme).placeHolderFadeColor} duration={600} />} style={styles(currentTheme).placeHolderContainer}>
          <PlaceholderLine style={styles().height200} />
          <PlaceholderLine />
        </Placeholder>
        <Placeholder Animation={(props) => <Fade {...props} style={styles(currentTheme).placeHolderFadeColor} duration={600} />} style={styles(currentTheme).placeHolderContainer}>
          <PlaceholderLine style={styles().height200} />
          <PlaceholderLine />
        </Placeholder>
        <Placeholder Animation={(props) => <Fade {...props} style={styles(currentTheme).placeHolderFadeColor} duration={600} />} style={styles(currentTheme).placeHolderContainer}>
          <PlaceholderLine style={styles().height200} />
          <PlaceholderLine />
        </Placeholder>
      </View>
    )
  }

  if (error) return <TextError text={t('networkError')} />

  if (loading || mutationLoading || loadingOrders) return loadingScreen()

  const { restaurants, sections } = data.nearByRestaurants

  const searchRestaurants = (searchText) => {
    const data = []
    const regex = new RegExp(searchText, 'i')
    restaurants.forEach((restaurant) => {
      const resultName = restaurant.name.search(regex)
      if (resultName < 0) {
        const resultCatFoods = restaurant.categories?.some((category) => {
          const result = category.title.search(regex)
          if (result < 0) {
            const result = category.foods?.some((food) => {
              const result = food.title.search(regex)
              return result > -1
            })
            return result
          }
          return true
        })
        if (!resultCatFoods) {
          const resultOptions = restaurant.options?.some((option) => {
            const result = option.title.search(regex)
            return result > -1
          })
          if (!resultOptions) {
            const resultAddons = restaurant.addons?.some((addon) => {
              const result = addon.title.search(regex)
              return result > -1
            })
            if (!resultAddons) return
          }
        }
      }
      data.push(restaurant)
    })
    return data
  }

  // Flatten the array. That is important for data sequence
  const restaurantSections = sections.map((sec) => ({
    ...sec,
    restaurants: sec.restaurants.map((id) => restaurants.filter((res) => res._id === id)).flat()
  }))

  const { isConnected: connect, setIsConnected: setConnect } = useNetworkStatus()
  if (!connect) return <ErrorView refetchFunctions={[refetch]} />
  return (
    <>
      <SafeAreaView edges={['bottom', 'left', 'right']} style={[styles().flex, { backgroundColor: 'black' }]}>
        <View style={[styles().flex, styles(currentTheme).screenBackground]}>
          <View style={styles().flex}>
            <View style={styles().mainContentContainer}>
              <View style={[styles().flex, styles().subContainer]}>
                <View style={styles().searchbar}>
                  <Search setSearch={setSearch} search={search} placeHolder={t('search_restaurant')} />
                </View>
                <ScrollView>
                  <View style={styles().mainItemsContainer}>
                    <View style={styles().mainItem}>
                      <View>
                        <TextDefault H4 bolder textColor={currentTheme.fontThirdColor} style={styles().ItemName}>
                          {t('foodDelivery')}
                        </TextDefault>
                        <TextDefault Normal textColor={currentTheme.fontThirdColor} style={styles().ItemDescription}>
                          {t('OrderfoodLove')}
                        </TextDefault>
                      </View>

                      <Image
                        source={{
                          uri: 'https://enatega.com/wp-content/uploads/2024/02/pngimg-1.png'
                        }}
                        style={styles().popularMenuImg}
                        resizeMode='contain'
                      />
                    </View>
                    <View style={styles().mainItem}>
                      <TextDefault H4 bolder textColor={currentTheme.fontThirdColor} style={styles().ItemName}>
                        {t('grocery')}
                      </TextDefault>
                      <TextDefault Normal textColor={currentTheme.fontThirdColor} style={styles().ItemDescription}>
                        {t('essentialsDeliveredFast')}
                      </TextDefault>
                      <Image
                        source={{
                          uri: 'https://enatega.com/wp-content/uploads/2024/02/pngwing-4.png'
                        }}
                        style={styles().popularMenuImg}
                        resizeMode='contain'
                      />
                    </View>
                  </View>
                  <View>
                    <TextDefault
                      numberOfLines={1}
                      textColor={currentTheme.fontFourthColor}
                      style={{
                        ...alignment.MLlarge,

                        ...alignment.PTmedium
                      }}
                      bolder
                      H4
                    >
                      {t('orderItAgain')}
                    </TextDefault>
                    <TextDefault
                      Normal
                      textColor={currentTheme.secondaryText}
                      style={[
                        styles().ItemDescription,
                        {
                          ...alignment.MLlarge
                        }
                      ]}
                    >
                      {t('mostOrderedNow')}
                    </TextDefault>
                    {search ? null : <ActiveOrdersAndSections sections={restaurantSections} />}
                  </View>
                </ScrollView>

                {/* <Animated.FlatList
                  contentInset={{ top: containerPaddingTop }}
                  contentContainerStyle={{
                    paddingTop: Platform.OS === 'ios' ? 0 : containerPaddingTop
                  }}
                  contentOffset={{ y: -containerPaddingTop }}
                  onScroll={onScroll}
                  scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
                  showsVerticalScrollIndicator={false}
                  ListHeaderComponent={
                    search ? null : (
                      <ActiveOrdersAndSections sections={restaurantSections} />
                    )
                  }
                  ListEmptyComponent={emptyView()}
                  keyExtractor={(item, index) => index.toString()}
                  refreshControl={
                    <RefreshControl
                      progressViewOffset={containerPaddingTop}
                      colors={[currentTheme.iconColorPink]}
                      refreshing={networkStatus === 4}
                      onRefresh={() => {
                        if (networkStatus === 7) {
                          refetch()
                        }
                      }}
                    />
                  }
                  data={search ? searchRestaurants(search) : restaurants}
                  renderItem={({ item }) => <Item item={item} />}
                /> */}
                {/* <CollapsibleSubHeaderAnimator translateY={translateY}>
                  <Search setSearch={setSearch} search={search} /> 
                  <MapSection location={location} restaurants={restaurants} />
                </CollapsibleSubHeaderAnimator> */}
              </View>
            </View>
          </View>

          <Modalize
            ref={modalRef}
            modalStyle={styles(currentTheme).modal}
            modalHeight={350}
            overlayStyle={styles(currentTheme).overlay}
            handleStyle={styles(currentTheme).handle}
            handlePosition='inside'
            openAnimationConfig={{
              timing: { duration: 400 },
              spring: { speed: 20, bounciness: 10 }
            }}
            closeAnimationConfig={{
              timing: { duration: 400 },
              spring: { speed: 20, bounciness: 10 }
            }}
            flatListProps={{
              data: isLoggedIn && profile ? profile.addresses : '',
              ListHeaderComponent: modalHeader(),
              ListFooterComponent: modalFooter(),
              showsVerticalScrollIndicator: false,
              keyExtractor: (item) => item._id,
              renderItem: ({ item: address }) => (
                <View style={styles().addressbtn}>
                  <TouchableOpacity style={styles(currentTheme).addressContainer} activeOpacity={0.7} onPress={() => setAddressLocation(address)}>
                    <View style={styles().addressSubContainer}>
                      <SimpleLineIcons name={addressIcons[address.label]} size={scale(12)} color={currentTheme.black} />
                      <View style={styles().mL5p} />
                      <TextDefault bold>{t(address.label)}</TextDefault>
                    </View>
                    <View style={styles().addressTextContainer}>
                      <TextDefault style={{ ...alignment.PLlarge }} textColor={currentTheme.fontSecondColor} small>
                        {address.deliveryAddress}
                      </TextDefault>
                    </View>
                  </TouchableOpacity>
                  <View style={styles().addressTick}>{address._id === location?._id && ![t('current_location'), t('selected_location')].includes(location.label) && <MaterialIcons name='check' size={scale(25)} color={currentTheme.iconColorPink} />}</View>
                </View>
              )
            }}
          ></Modalize>
        </View>
      </SafeAreaView>
    </>
  )
}

export default Main
