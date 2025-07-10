// Interfaces
import { useLanguage } from "@/lib/context/global/language.context";
import { useApptheme } from "@/lib/context/global/theme.context";
import { IRiderEarningsOrderProps } from "@/lib/utils/interfaces/rider-earnings.interface";
import { useTranslation } from "react-i18next";

// Core
import { Text, View } from "react-native";

export default function OrderStack({
  orderId,
  amount,
  isLast,
}: IRiderEarningsOrderProps) {
  // Hooks
  const { appTheme } = useApptheme();
  const { getTranslation: t } = useLanguage();
  return (
    <View
      className="border-b-2 flex flex-row items-center justify-between p-3"
      style={{
        borderBottomColor: appTheme.borderLineColor,
        backgroundColor: appTheme.screenBackground,
        marginBottom: isLast ? 100 : 0,
      }}
    >
      <View className="flex flex-col gap-3 p-1 justify-center  float-start">
        <Text style={{ color: appTheme.fontMainColor }}>
          {t("order_id")}
          {orderId.slice(0, orderId.length - orderId.length / 2)}
        </Text>
        <Text style={{ color: appTheme.fontSecondColor }}>{t("payment")}</Text>
      </View>
      <View className="flex flex-col gap-3 p-1 justify-center  items-end">
        <Text className="bg-[#D1FAE5] rounded-xl p-1 text-[#065F46]">
          {t("completed")}
        </Text>
        <Text className="font-bold" style={{ color: appTheme.fontMainColor }}>
          ${amount}
        </Text>
      </View>
    </View>
  );
}
