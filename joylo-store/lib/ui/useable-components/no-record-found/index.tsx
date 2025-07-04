// Icons
import { useLanguage } from "@/lib/context/global/language.context";
import { useApptheme } from "@/lib/context/theme.context";
import { Ionicons } from "@expo/vector-icons";

// Core
import { Text, View } from "react-native";

export default function NoRecordFound({
  msg = "no_record_found",
}: {
  msg?: string;
}) {
  // Hooks
  const { appTheme } = useApptheme();
  const { getTranslation } = useLanguage();
  return (
    <View className="items-center flex flex-row my-24 justify-center">
      <Text
        className="font-bold text-center"
        style={{ color: appTheme.fontMainColor }}
      >
        {getTranslation(msg)}
      </Text>
      <Ionicons name="sad-outline" color={appTheme.primary} size={20} />
    </View>
  );
}
