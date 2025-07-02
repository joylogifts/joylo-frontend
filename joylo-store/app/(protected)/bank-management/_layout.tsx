import { useApptheme } from "@/lib/context/theme.context";
import { Stack } from "expo-router";
import { useLanguage } from "@/lib/context/global/language.context";

export default function Layout() {
  // Hooks
  const { appTheme } = useApptheme();
  const { getTranslation } = useLanguage();
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: "center",
        headerTintColor: appTheme.fontMainColor,
        headerTitleStyle: { color: appTheme.fontMainColor },
        headerStyle: { backgroundColor: appTheme.themeBackground },
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="index" // This is the name of the page and must match the url from root
        options={{
          title: getTranslation("bank_management"),
        }}
      />
    </Stack>
  );
}
