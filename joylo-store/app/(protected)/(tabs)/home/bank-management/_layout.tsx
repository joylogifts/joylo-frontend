import { Stack } from "expo-router";
import { useLanguage } from "@/lib/context/global/language.context";

export default function Layout() {
  // Hooks
  const { getTranslation } = useLanguage();
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: "center",
        headerShown: false,
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
