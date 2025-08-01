import React, { useState, useContext, useCallback, useLayoutEffect, useRef, useEffect } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { LocationContext } from '../../context/Location'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { theme } from '../../utils/themeColors'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import styles from './styles'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import CustomMarker from '../../assets/SVG/imageComponents/CustomMarker'
import { customMapStyle } from '../../utils/customMapStyles'
import { useTranslation } from 'react-i18next'
import SearchModal from '../../components/Address/SearchModal'
import { Feather } from '@expo/vector-icons'
import ModalDropdown from '../../components/Picker/ModalDropdown'
import { useNavigation } from '@react-navigation/native'
import MapView from './MapView'
import screenOptions from './screenOptions'
import { useLocation } from '../../ui/hooks'
import UserContext from '../../context/User'

import useGeocoding from '../../ui/hooks/useGeocoding'
import blackmarker from '../../assets/images/user.png'
import darkMapStyle from '../../utils/DarkMapStyles'
import { useLanguage } from '@/src/context/Language'

const LATITUDE = 33.699265
const LONGITUDE = 72.974575
const LATITUDE_DELTA = 0.04
const LONGITUDE_DELTA = 0.04
export default function AddNewAddress(props) {
  const { isLoggedIn } = useContext(UserContext)
  const {getAddress} = useGeocoding()
  const [searchModalVisible, setSearchModalVisible] = useState(false)
  const [cityModalVisible, setCityModalVisible] = useState(false)
  const { longitude, latitude, id, prevScreen } = props?.route.params || {}
  const [selectedValue, setSelectedValue] = useState({
    city: '',
    address: '',
    latitude: LATITUDE,
    longitude: LONGITUDE
  })
  const { setLocation } = useContext(LocationContext)
  const mapRef = useRef()

  const themeContext = useContext(ThemeContext)
  const { getTranslation: t, dir } = useLanguage()
  const currentTheme = { isRTL: dir === 'rtl', ...theme[themeContext.ThemeValue] }
  const inset = useSafeAreaInsets()
  const navigation = useNavigation()
  const { getCurrentLocation } = useLocation()
  const setCurrentLocation = async () => {
    const { coords, error } = await getCurrentLocation()
    if (!error) {
      setCoordinates({
        latitude: coords.latitude,
        longitude: coords.longitude
      })
    }
  }
  useLayoutEffect(() => {
    navigation.setOptions(
      screenOptions({
        title: t('add_address'),
        fontColor: currentTheme.newFontcolor,
        backColor: currentTheme.newheaderBG,
        iconColor: currentTheme.newIconColor,
        lineColor: currentTheme.newIconColor,
        setCurrentLocation,
        locationPrevScreen: prevScreen
      })
    )
  }, [prevScreen])
  const onSelectCity = (item) => {
    setCoordinates({
      latitude: +item.latitude,
      longitude: +item.longitude
    })
    setCityModalVisible(false)
  }
  const onRegionChangeComplete = useCallback(async (coordinates) => {
    const response = await getAddress(coordinates.latitude, coordinates.longitude)
    setSelectedValue({
      city: response.city,
      address: response.formattedAddress,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    })
  })
  const setCoordinates = useCallback((location) => {
    mapRef.current.fitToCoordinates([
      {
        latitude: location.latitude,
        longitude: location.longitude
      }
    ])
  })
  useEffect(() => {
    onRegionChangeComplete({ longitude, latitude })
  }, [])
  const onSelectLocation = () => {
    setLocation({
      label: 'Location',
      deliveryAddress: selectedValue.address,
      latitude: selectedValue.latitude,
      longitude: selectedValue.longitude,
      city: selectedValue.city
    })
    if (isLoggedIn) {
      // console.log("props?.route.params.prevScreen=>", props?.route.params.prevScreen);
      navigation.navigate('SaveAddress', {
        locationData: {
          id,
          label: 'Location',
          deliveryAddress: selectedValue.address,
          latitude: selectedValue.latitude,
          longitude: selectedValue.longitude,
          city: selectedValue.city,
          prevScreen: props?.route.params.prevScreen ? props?.route.params.prevScreen : null
        }
      })
    } else {
      navigation.navigate('Main')
    }
  }
  return (
    <>
      <View style={styles().flex}>
        <View style={[styles().mapView, { height: '55%' }]}>
          <MapView
            ref={mapRef}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA
            }}
            customMapStyle={themeContext.ThemeValue === 'Dark' ? darkMapStyle : customMapStyle}
            onRegionChangeComplete={onRegionChangeComplete}
          />
          <View style={styles().mainContainer}>
            {/* <CustomMarker
              width={40}
              height={40}
              transform={[{ translateY: -20 }]}
              translateY={-20}
            /> */}
            <Image source={blackmarker} width={40} height={40} />
          </View>
        </View>
        <View style={styles(currentTheme).container2}>
          <TextDefault textColor={currentTheme.newFontcolor} H3 bolder isRTL style={styles().addressHeading}>
            {t('add_address')}
          </TextDefault>
          <CityModal theme={currentTheme} setCityModalVisible={setCityModalVisible} selectedValue={selectedValue.city} cityModalVisible={cityModalVisible} onSelect={onSelectCity} t={t} />
          <View style={[styles(currentTheme).textInput]}>
            <TouchableOpacity onPress={() => setSearchModalVisible(true)}>
              {/* <Text
                style={{
                  color: currentTheme.newFontcolor,
                  overflow: 'scroll'
                }}
              >
                {selectedValue.address || t('address')}
              </Text> */}
              <TextDefault textColor={currentTheme.newFontcolor} isRTL>
                {selectedValue.address || t('address')}
              </TextDefault>
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.7} style={styles(currentTheme).emptyButton} onPress={onSelectLocation} disabled={!selectedValue.address || !selectedValue.city}>
            <TextDefault textColor={currentTheme.buttonText} center H5>
              {t('save_btn')}
            </TextDefault>
          </TouchableOpacity>
          <SearchModal
            visible={searchModalVisible}
            onClose={() => setSearchModalVisible(false)}
            onSubmit={(description, coords) => {
              setSearchModalVisible(false)
              setCoordinates({
                latitude: coords.lat,
                longitude: coords.lng
              })
            }}
          />
        </View>
        <View style={{ paddingBottom: inset.bottom }} />
      </View>
    </>
  )
}
const CityModal = React.memo(
  function CityModal({ theme, setCityModalVisible, selectedValue, cityModalVisible, onSelect, t }) {
    return (
      <View style={styles().dropdownContainer}>
        <TouchableOpacity
          style={styles(theme).button1}
          onPress={() => {
            setCityModalVisible(true)
          }}
        >
          {selectedValue && <Text style={styles(theme).cityField}>{selectedValue}</Text>}
          {!selectedValue && <Text style={styles(theme).cityField}>{t('select_city')}</Text>}
          <Feather name='chevron-down' size={18} color={theme.newIconColor} style={styles().icon1} />
        </TouchableOpacity>
        <ModalDropdown
          theme={theme}
          visible={cityModalVisible}
          onItemPress={onSelect}
          onClose={() => {
            setCityModalVisible(false)
          }}
        />
      </View>
    )
  },
  (prevprops, nextprops) => {
    return prevprops?.cityModalVisible === nextprops?.cityModalVisible && prevprops?.selectedValue === nextprops?.selectedValue
  }
)
