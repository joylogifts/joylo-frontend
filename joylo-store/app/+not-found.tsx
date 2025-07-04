// Expo
import { Link, Stack } from "expo-router";

// Core
import { StyleSheet } from "react-native";

// Components
import { ThemedText } from "@/lib/ui/useable-components/ThemedText";
import { ThemedView } from "@/lib/ui/useable-components/ThemedView";

// Hooks
import { useApptheme } from "@/lib/context/theme.context";
import { useLanguage } from "@/lib/context/global/language.context";

export default function NotFoundScreen() {
  // Hooks
  const { appTheme } = useApptheme();
  const { getTranslation } = useLanguage();
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={{ color: appTheme.fontMainColor }}>
          {getTranslation("this_screen_does_not_exist")}
        </ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">{getTranslation("go_to_home_screen")}</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
