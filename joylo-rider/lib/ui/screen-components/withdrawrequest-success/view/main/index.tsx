// Components
import SuccessModal from "../success-modal";

// Core
import { View } from "react-native";

// Hooks
import { useApptheme } from "@/lib/context/global/theme.context";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/lib/context/global/language.context";

export default function WithdrawRquestSuccessMain() {
  // Hooks
  const { appTheme } = useApptheme();
  const {  getTranslation:t } = useLanguage();
  return (
    <View
      className="items-center justify-center h-full"
      style={{ backgroundColor: appTheme.screenBackground }}
    >
      <SuccessModal
        message={t("your_request_for_withdrawal_has_been_submittedd")}
      />
    </View>
  );
}
