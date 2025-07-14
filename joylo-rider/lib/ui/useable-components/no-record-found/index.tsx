// Icons
import { useLanguage } from "@/lib/context/global/language.context";
import { useApptheme } from "@/lib/context/global/theme.context";
import { Ionicons } from "@expo/vector-icons";

// Hooks
import { useTranslation } from "react-i18next";

// Core
import { Text, View } from "react-native";

export default function NoRecordFound() {
  // Hooks
  const { appTheme } = useApptheme();
  const {  getTranslation:t } = useLanguage();
  return (
    <View className="items-center flex flex-row my-24 justify-center">
      <Text
        className="font-bold text-center"
        style={{ color: appTheme.fontMainColor }}
      >
        {t("no_record_found")}
      </Text>
      <Ionicons name="sad-outline" size={20} />
    </View>
  );
}
