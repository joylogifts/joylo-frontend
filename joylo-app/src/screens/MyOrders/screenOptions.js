import i18next from '../../../i18next'
import { useLanguage } from '@/src/context/Language'
import { scale } from '../../utils/scaling'
import { HeaderBackButton } from '@react-navigation/elements'
import { View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import navigationService from '../../routes/navigationService'
import styles from './style'

const navigationOptions = (headerText, t) => ({
  headerTitle: t('orders'),
  headerTitleAlign: 'center',
  headerRight: null,
  headerTitleContainerStyle: {
    marginTop: '1%',
    paddingLeft: scale(25),
    paddingRight: scale(25),
    height: '75%',
    borderRadius: scale(10),
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: 'white'
  },
  headerStyle: {
    backgroundColor: headerText
  },

  headerLeft: () => (
    <HeaderBackButton
      truncatedLabel=''
      backImage={() => (
        <View style={styles().backBtnContainer}>
          <MaterialIcons name='arrow-back' size={30} color='black' />
        </View>
      )}
      onPress={() => {
        navigationService.goBack()
      }}
    />
  )
})
export default navigationOptions
