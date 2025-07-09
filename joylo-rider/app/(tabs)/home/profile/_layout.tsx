// Expo
import { useLanguage } from "@/lib/context/global/language.context";
import { Stack } from "expo-router";

// Hooks
import { useTranslation } from "react-i18next";

export default function ProfileLayout() {
  // Hooks
  const { getTranslation:t } = useLanguage();
  return (
    <Stack
      screenOptions={{ headerTitle: "", headerBackButtonMenuEnabled: true }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: t("profile"),
          headerBackButtonMenuEnabled: true,
        }}
      />
    </Stack>
  );
}
