/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

// Hooks
import useAcceptOrder from "@/lib/hooks/useAcceptOrder";
import useOrderRing from "@/lib/hooks/useOrderRing";
// import usePrintOrder from "@/lib/hooks/usePrintOrder";

// Constants
import { TIMES } from "@/lib/utils/constants";

// Interface
import { ISetOrderTimeComponentProps } from "@/lib/utils/interfaces";

// UI

// Icons
import { useApptheme } from "@/lib/context/theme.context";
import { useLanguage } from "@/lib/context/global/language.context";
import CustomContinueButton from "../custom-continue-button";
import { CircleCrossIcon } from "../svg";

const SetTimeScreenAndAcceptOrder = ({
  id,
  orderId,
  handleDismissModal,
}: ISetOrderTimeComponentProps) => {
  // Hooks
  const { appTheme } = useApptheme();
  const { getTranslation } = useLanguage();

  // States
  const [selectedTime, setSelectedTime] = useState(TIMES[0]);

  const { muteRing, loading: loadingRing } = useOrderRing();
  const { acceptOrder, loading: loadingAcceptOrder } = useAcceptOrder();
  // const { printOrder } = usePrintOrder();

  const onAcceptOrderHandler = async () => {
    try {
      await acceptOrder(id, selectedTime?.toString() || "0");
      await muteRing(orderId);
      // printOrder(id);

      handleDismissModal();
    } catch (err) {
      // FlashMessageComponent({ message: err?.message ?? "Order accept failed" });
      console.log(err);
    } finally {
      handleDismissModal();
    }
  };

  return (
    <View className="flex-1 items-center justify-center px-4 pb-20">
      <View className="mt-4 mb-4 text-center flex-row justify-between items-center">
        <Text
          className="flex-1 text-center text-[16px] font-[600]"
          style={{ color: appTheme.fontMainColor }}
        >
          {getTranslation("set_preparation_time")}
        </Text>
        <TouchableOpacity onPress={handleDismissModal}>
          <CircleCrossIcon width={24} height={24} />
        </TouchableOpacity>
      </View>

      <View className="mb-6">
        <View className="flex-row flex-wrap gap-2 justify-between">
          {TIMES.map((time, index) => (
            <Pressable
              key={index}
              onPress={() => setSelectedTime(time)}
              className={`h-fit justify-center items-center  p-4 rounded-[8px] `}
              style={{
                backgroundColor:
                  selectedTime === time ? appTheme.primary : appTheme.white,
              }}
            >
              <Text
                className={`text-[Inter] text-center items-center text-[14px] font-medium`}
                style={{
                  color:
                    selectedTime === time ? appTheme.white : appTheme.black,
                }}
              >
                {`${time} mins`}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View>
        <CustomContinueButton
          isLoading={loadingAcceptOrder || loadingRing}
          style={{ backgroundColor: appTheme.primary }}
          onPress={onAcceptOrderHandler}
          title={getTranslation("done")}
        />
      </View>
    </View>
  );
};

export default SetTimeScreenAndAcceptOrder;
