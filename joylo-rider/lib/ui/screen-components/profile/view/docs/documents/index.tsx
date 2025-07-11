// Hooks
import { useUserContext } from "@/lib/context/global/user.context";
import { useTranslation } from "react-i18next";

// Types & Interfaces
import { TRiderProfileBottomBarBit } from "@/lib/utils/types/rider";
import { Dispatch, SetStateAction } from "react";

// Core
import { useApptheme } from "@/lib/context/global/theme.context";
import { Text, TouchableOpacity, View } from "react-native";
import { useLanguage } from "@/lib/context/global/language.context";

export default function DocumentsSection({
  setIsFormOpened,
}: {
  setIsFormOpened: Dispatch<SetStateAction<TRiderProfileBottomBarBit>>;
}) {
  // Hooks
  const { appTheme } = useApptheme();
  const { getTranslation: t } = useLanguage();
  const { dataProfile } = useUserContext();
  return (
    <View
      className="flex flex-col h-[24%] w-full justify-between items-center"
      style={{ backgroundColor: appTheme.screenBackground }}
    >
      <View className="flex flex-col gap-3 items-start justify-center px-5 w-full border-b-2  border-b-gray-200 py-3">
        <View className="flex flex-row w-full justify-between">
          <Text className="font-bold" style={{ color: appTheme.mainTextColor }}>
            {t("driving_license")}
          </Text>
          <TouchableOpacity onPress={() => setIsFormOpened("LICENSE_FORM")}>
            <Text className="font-semibold text-[#0EA5E9]">
              {dataProfile?.licenseDetails ? t("update") : t("add")}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          className={`${dataProfile?.licenseDetails ? "bg-[#E0F2FE]" : "bg-[#FEE2E2]"} p-2 border rounded-3xl border-[#E0F2FE]`}
        >
          <Text
            className={`${dataProfile?.licenseDetails ? "text-[#0D99FF]" : "text-[#991B1B]"} font-semibold`}
          >
            {dataProfile?.licenseDetails
              ? t("submitted_data")
              : t("missing_data")}
          </Text>
        </View>
      </View>
      <View className="flex flex-col gap-3 items-start justify-center px-5 w-full border-b-2  border-b-gray-200 py-3">
        <View className="flex flex-row w-full justify-between">
          <Text className="font-bold" style={{ color: appTheme.mainTextColor }}>
            {t("vehicle_plate")}
          </Text>
          <TouchableOpacity onPress={() => setIsFormOpened("VEHICLE_FORM")}>
            <Text className="font-semibold text-[#0EA5E9]">
              {dataProfile?.vehicleDetails ? t("update") : t("add")}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          className={`${dataProfile?.vehicleDetails ? "bg-[#E0F2FE]" : "bg-[#FEE2E2]"} p-3 border rounded-3xl border-[#E0F2FE]`}
        >
          <Text
            className={`${dataProfile?.vehicleDetails ? "text-[#0D99FF]" : "text-[#991B1B]"} font-semibold`}
          >
            {dataProfile?.vehicleDetails
              ? t("submitted_data")
              : t("missing_data")}
          </Text>
        </View>
      </View>
    </View>
  );
}
