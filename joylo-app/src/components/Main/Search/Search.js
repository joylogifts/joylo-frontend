import React, { useContext } from 'react'
import { View, TouchableOpacity, TextInput } from 'react-native'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import styles from './styles'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/src/context/Language'

function Search(props) {
  const { getTranslation: t, dir } = useLanguage()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: dir == 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  return (
    <View style={styles(currentTheme, props?.newheaderColor).mainContainerHolder}>
      <View style={styles(currentTheme, props?.cartContainer).mainContainer}>
        <View style={styles(currentTheme).subContainer}>
          <View style={styles(currentTheme).leftContainer}>
            <View style={styles().searchContainer}>
              <Ionicons name='search' color={currentTheme.gray500} size={scale(20)} />
            </View>
            <View style={styles().inputContainer}>
              <TextInput style={styles(currentTheme).bodyStyleOne} placeholder={props?.placeHolder} placeholderTextColor={currentTheme.gray500} onChangeText={(text) => props?.setSearch(text)} value={props?.search} />
            </View>
          </View>
          <View style={[styles(currentTheme).filterContainer]}>
            {props?.search ? (
              <TouchableOpacity
                onPress={() => {
                  props?.setSearch('')
                }}
              >
                <AntDesign name='closecircleo' size={20} color={currentTheme.fontSecondColor} />
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

export default Search
