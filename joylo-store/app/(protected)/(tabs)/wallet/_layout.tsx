import { useApptheme } from "@/lib/context/theme.context";
import { Stack } from "expo-router";
import { useLanguage } from "@/lib/context/global/language.context";

export default function StackLayout() {
  // Hooks
  const { getTranslation } = useLanguage();
  const { appTheme } = useApptheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: appTheme.screenBackground,
        },
        headerTitleStyle: {
          color: appTheme.fontMainColor,
        },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: true, headerTitle: getTranslation("wallet") }}
      />
      <Stack.Screen
        name="(routes)/success"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
