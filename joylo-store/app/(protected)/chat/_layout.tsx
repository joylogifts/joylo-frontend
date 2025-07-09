import { useApptheme } from "@/lib/context/theme.context";
import { Stack } from "expo-router";
import { useLanguage } from "@/lib/context/global/language.context";
import { Platform } from "react-native";

export default function LoginLayour() {
  // Hooks
  const { getTranslation } = useLanguage();
  const { appTheme } = useApptheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: Platform.select({
          ios: {
            position: "absolute",
          },

          default: {
            position: "absolute",
            backgroundColor: appTheme.themeBackground,
            elevation: 0, // Shadow for Android
            shadowColor: appTheme.themeBackground, // Shadow for iOS
            shadowOpacity: 0,
            shadowRadius: 0,
          },
        }),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: getTranslation("chat"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
