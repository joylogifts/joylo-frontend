// Interfaces
import { useLanguage } from "@/lib/context/global/language.context";
import { useApptheme } from "@/lib/context/theme.context";
import { IStoreEarningsOrderProps } from "@/lib/utils/interfaces/rider-earnings.interface";

// Core
import { Text, View } from "react-native";

export default function OrderStack({
  orderId,
  amount,
}: IStoreEarningsOrderProps) {
  // Hooks
  const { appTheme } = useApptheme();
  const { getTranslation } = useLanguage();

  return (
    <View className="border-b-2 border-b-gray-200 flex flex-row items-center justify-between p-3">
      <View className="flex flex-col gap-3 p-1 justify-center  float-start">
        <Text style={{ color: appTheme.fontSecondColor }}>
          {getTranslation("order_id")}
          {orderId.substring(0, orderId.length - (orderId.length - 8))}
        </Text>
        <Text style={{ color: appTheme.fontMainColor }}>{getTranslation("payment")}</Text>
      </View>

      <View className="flex flex-col gap-3 p-1 justify-center  items-end">
        <Text className="bg-[#D1FAE5] rounded-xl p-1 text-[#065F46]">
          {getTranslation("completed")}
        </Text>
        <Text className="font-bold" style={{ color: appTheme.fontMainColor }}>
          ${amount}
        </Text>
      </View>
    </View>
  );
}
