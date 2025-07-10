// Moti
import { useLanguage } from "@/lib/context/global/language.context";
import { useApptheme } from "@/lib/context/global/theme.context";
import { MotiView, Text } from "moti";

// Hooks
import { useTranslation } from "react-i18next";

export default function EarningHeadingSkeleton() {
  // Hooks
  const { appTheme } = useApptheme();
  const { getTranslation: t } = useLanguage();
  return (
    <MotiView
      className="p-3  flex flex-row w-full justify-between px-5"
      style={{ backgroundColor: appTheme.themeBackground }}
    >
      <Text className="font-bold text-lgpb-5 mt-0">{t("recent_activity")}</Text>
      <Text className="text-sm text-[#3B82F6] font-bold">{t("see_more")}</Text>
    </MotiView>
  );
}
