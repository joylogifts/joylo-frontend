import { useLanguage } from "@/lib/context/global/language.context";
import { useUserContext } from "@/lib/context/global/user.context";
import { useApptheme } from "@/lib/context/theme.context";
import { usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function UnavailableStatus() {
  // Hooks
  const { getTranslation } = useLanguage();
  const { appTheme } = useApptheme();
  const pathName = usePathname();
  const { dataProfile } = useUserContext();
  const insets = useSafeAreaInsets();

  // States
  const [isAvailable, setIsAvailable] = useState(true);

  // UseEffects
  useEffect(() => {
    if (dataProfile?.isAvailable) {
      setIsAvailable(true);
    } else {
      setIsAvailable(false);
    }
  }, [dataProfile?.isAvailable]);

  if (pathName === "/login") return null;
  if (isAvailable) return null;

  return (
    <View
      style={{
        backgroundColor: appTheme.black,
        paddingTop: insets.top - 9, // Ensures it stays below the notch
        paddingHorizontal: 16,
        paddingBottom: 2,
        position: "absolute",
        width: "100%",
        zIndex: 50,
      }}
    >
      <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
        {getTranslation("you_are_currently_unavailable")}.
      </Text>
    </View>
  );
}
