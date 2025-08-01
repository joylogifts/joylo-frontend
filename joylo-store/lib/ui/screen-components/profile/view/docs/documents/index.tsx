// Hooks
import { useLanguage } from "@/lib/context/global/language.context";
import { useUserContext } from "@/lib/context/global/user.context";

// Core
import { Text, TouchableOpacity, View } from "react-native";

// Expo
import { useApptheme } from "@/lib/context/theme.context";
import { app_theme } from "@/lib/utils/types/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Switch } from "react-native-switch";

export default function DocumentsSection() {
  // Hooks
  const { appTheme, currentTheme, toggleTheme } = useApptheme();
  const { getTranslation } = useLanguage();
  const { dataProfile } = useUserContext();
  return (
    <View className="flex flex-col h-[20%] w-full justify-between items-center">
      <View
        className="flex flex-col gap-3 items-start justify-center px-5 w-full border-b-2 py-3"
        style={{ borderColor: appTheme.borderLineColor }}
      >
        <View className="flex flex-row w-full justify-between items-start">
          <Text
            className="font-bold"
            style={{
              color: appTheme.fontMainColor,
            }}
          >
            {getTranslation("bank_details")}
          </Text>
          <TouchableOpacity
            className="top-6"
            onPress={() => router.push("/bank-management")}
          >
            <Text className="font-semibold text-[#0EA5E9]">
              {dataProfile?.bussinessDetails?.accountNumber
                ? getTranslation("update")
                : getTranslation("add")}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          className={`${dataProfile?.bussinessDetails?.accountNumber ? "bg-[#E0F2FE]" : "bg-[#FEE2E2]"} p-2 border rounded-3xl border-[#E0F2FE]`}
        >
          <Text
            className={`${dataProfile?.bussinessDetails?.accountNumber ? "text-[#0D99FF]" : "text-[#991B1B]"} font-semibold`}
          >
            {dataProfile?.bussinessDetails?.accountNumber
              ? getTranslation("submitted_data")
              : getTranslation("missing_data")}
          </Text>
        </View>
      </View>
      <View>
        <Text
          className="font-bold m-3"
          style={{
            color: appTheme.fontMainColor,
          }}
        >
          {getTranslation("other_details")}
        </Text>
        <View
          className="flex flex-row gap-3 items-center justify-between px-5 w-full border-b-2 py-3"
          style={{ borderColor: appTheme.borderLineColor }}
        >
          <Text
            style={{
              color: appTheme.fontMainColor,
            }}
          >
            {getTranslation("address")}
          </Text>
          {dataProfile?.address ? (
            <Text style={{ color: appTheme.fontSecondColor }}>
              {dataProfile?.address}
            </Text>
          ) : (
            <Ionicons name="sad-outline" color={appTheme.iconPink} size={20} />
          )}
        </View>
        <View
          className="flex flex-row gap-3 items-center justify-between px-5 w-full border-b-2 py-3"
          style={{ borderColor: appTheme.borderLineColor }}
        >
          <Text
            style={{
              color: appTheme.fontMainColor,
            }}
          >
            {getTranslation("phone")}
          </Text>
          {dataProfile?.phone ? (
            <Text style={{ color: appTheme.fontSecondColor }}>
              {dataProfile?.phone}
            </Text>
          ) : (
            <Ionicons name="sad-outline" color={appTheme.iconPink} size={20} />
          )}
        </View>
        <View
          className="flex flex-row gap-3 items-center justify-between px-5 w-full border-b-2 py-3"
          style={{ borderColor: appTheme.borderLineColor }}
        >
          <Text
            style={{
              color: appTheme.fontMainColor,
            }}
          >
            {getTranslation("username")}
          </Text>
          {dataProfile?.username ? (
            <Text style={{ color: appTheme.fontSecondColor }}>
              {dataProfile?.username}
            </Text>
          ) : (
            <Ionicons name="sad-outline" color={appTheme.iconPink} size={20} />
          )}
        </View>
        <View
          className="flex flex-row gap-3 items-center justify-between px-5 w-full border-b-2 py-3"
          style={{ borderColor: appTheme.borderLineColor }}
        >
          <Text
            style={{
              color: appTheme.fontMainColor,
            }}
          >
            {getTranslation("password")}
          </Text>
          {dataProfile?.password ? (
            <Text style={{ color: appTheme.fontSecondColor }}>
              {dataProfile?.password}
            </Text>
          ) : (
            <Ionicons name="sad-outline" color={appTheme.iconPink} size={20} />
          )}
        </View>
        <View
          className="flex flex-row gap-3 items-center justify-between px-5 w-full border-b-2 py-3"
          style={{ borderColor: appTheme.borderLineColor }}
        >
          <Text
            style={{
              color: appTheme.fontMainColor,
            }}
          >
            {getTranslation("wallet_amount")}
          </Text>
          {dataProfile?.currentWalletAmount ? (
            <Text style={{ color: appTheme.fontSecondColor }}>
              ${dataProfile?.currentWalletAmount}
            </Text>
          ) : (
            <Ionicons name="sad-outline" color={appTheme.iconPink} size={20} />
          )}
        </View>
      </View>
      <View className="flex flex-row items-center justify-between w-full my-5 px-5">
        <Text
          className="text-xl font-bold"
          style={{
            color: appTheme.fontMainColor,
          }}
        >
          {getTranslation("theme")}
        </Text>
        <View className="flex flex-row  items-center justify-center">
          <Switch
            containerStyle={{ width: "20%" }}
            switchWidthMultiplier={3}
            activeText={"Dark"}
            inActiveText={"Light"}
            renderInsideCircle={() => {
              return (
                <Ionicons
                  name={
                    currentTheme === "dark"
                      ? "moon"
                      : currentTheme === "light"
                        ? "sunny"
                        : "phone-portrait"
                  }
                  size={22}
                />
              );
            }}
            circleActiveColor={appTheme.primary}
            backgroundActive={appTheme.primary}
            activeTextStyle={{ color: appTheme.black }}
            value={currentTheme === "dark"}
            onValueChange={() => toggleTheme(currentTheme as app_theme)}
          />
        </View> 
      </View>
    </View>
  );
}
