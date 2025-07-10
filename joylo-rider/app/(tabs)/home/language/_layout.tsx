// Expo
import { useLanguage } from '@/lib/context/global/language.context'
import { Stack } from 'expo-router'

// Hooks
import { useTranslation } from 'react-i18next'

export default function Layout() {
  // Hooks
  const { getTranslation: t } = useLanguage()
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index" // This is the name of the page and must match the url from root
        options={{
          title: t('language'),
        }}
      />
    </Stack>
  )
}
