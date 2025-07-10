// Moti
import { MotiView, Text } from "moti";

// Hooks
import { useApptheme } from "@/lib/context/global/theme.context";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/lib/context/global/language.context";

export default function WalletHeadingSkeleton() {
  // Hooks
  const { appTheme } = useApptheme();
  const { getTranslation: t } = useLanguage();
  return (
    <MotiView
      className="p-3"
      style={{ backgroundColor: appTheme.themeBackground }}
    >
      <Text
        className="font-bold text-lg pb-5 mt-0"
        style={{
          backgroundColor: appTheme.themeBackground,
          color: appTheme.fontMainColor,
        }}
      >
        {t("recent_transactions")}
      </Text>
    </MotiView>
  );
}
