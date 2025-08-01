import { useApptheme } from "@/lib/context/theme.context";
import { Text, View } from "react-native";
import Modal from "react-native-modal";

// Interface
import { IWellDoneComponentProps } from "@/lib/utils/interfaces";
import { useLanguage } from "@/lib/context/global/language.context";

export default function WelldoneComponent({
  orderId,
  status = "Delivered",
  setOrderId,
}: IWellDoneComponentProps) {
  // Hooks
  const { getTranslation } = useLanguage();
  const { appTheme } = useApptheme();

  return (
    <Modal
      isVisible={!!orderId}
      onBackdropPress={() => setOrderId("")}
      onBackButtonPress={() => setOrderId("")}
      coverScreen={false}
    >
      <View className="h-fit w-full bg-transparent justify-around items-center">
        <View
          className="h-[120px] w-[95%] items-center justify-around rounded-[16px]"
          style={{
            backgroundColor: appTheme.themeBackground,
            borderColor: appTheme.borderLineColor,
            borderWidth: 1,
          }}
        >
          <View>
            <Text style={{ color: appTheme.fontMainColor }}>
              {getTranslation("icon_here")}
            </Text>
          </View>
          <View className="items-center">
            <Text
              className="font-inter text-lg font-bold text-center"
              style={{ color: appTheme.fontMainColor }}
            >
              {getTranslation("well_done_store")}
            </Text>
            <Text
              className="font-inter text-sm font-normal leading-[22px] text-center"
              style={{ color: appTheme.fontSecondColor }}
            >
              {getTranslation("order_number")} #{orderId} {status}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
