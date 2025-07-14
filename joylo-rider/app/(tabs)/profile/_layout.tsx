// Expo
import { useLanguage } from "@/lib/context/global/language.context";
import { useApptheme } from "@/lib/context/global/theme.context";
import { Stack } from "expo-router";

// Hooks
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileLayout() {
  // Hooks
  const { getTranslation: t } = useLanguage();
  const { appTheme } = useApptheme();
  const {top} = useSafeAreaInsets()

  return (
    <View style={{paddingTop: top+10, flex: 1, backgroundColor: appTheme.themeBackground}}>
      <Stack screenOptions={{ headerShown: false, headerShadowVisible: false }}>
        <Stack.Screen
          name="index"
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            headerTitle: t("profile"),
            headerTitleStyle: { color: appTheme.mainTextColor },
            headerStyle: { backgroundColor: appTheme.themeBackground },
          }}
        />
      </Stack>
    </View>
  );
}
