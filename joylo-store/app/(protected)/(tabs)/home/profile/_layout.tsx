import { Stack } from "expo-router";
import { useLanguage } from "@/lib/context/global/language.context";

export default function ProfileLayout() {
  // Hooks
  const { getTranslation } = useLanguage();
  return (
    <Stack
      screenOptions={{ headerTitle: "", headerBackButtonMenuEnabled: true }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: getTranslation("profile"),
          headerBackButtonMenuEnabled: true,
        }}
      />
    </Stack>
  );
}
