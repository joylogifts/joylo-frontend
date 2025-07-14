// Expo
import { Link, Stack } from 'expo-router'

// Core
import { StyleSheet } from 'react-native'

// Components
import { ThemedText } from '@/lib/ui/useable-components/ThemedText'
import { ThemedView } from '@/lib/ui/useable-components/ThemedView'

// Hooks
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/lib/context/global/language.context'

export default function NotFoundScreen() {
  // Hooks
  const { getTranslation: t } = useLanguage()
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">{t('this_screen_does_not_exist')}</ThemedText>
        <Link
          href="/"
          style={styles.link}
        >
          <ThemedText type="link">{t('go_to_home_screen')}</ThemedText>
        </Link>
      </ThemedView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
})
