// Moti
import { MotiText, MotiView } from "moti";
import { Skeleton } from "moti/skeleton";

// Hooks
import { useApptheme } from "@/lib/context/theme.context";
import { useLanguage } from "@/lib/context/global/language.context";

export default function EarningSummaryHeader() {
  // Hooks
  const { appTheme, currentTheme } = useApptheme();
  const { getTranslation } = useLanguage();
  return (
    <MotiView
      className="flex flex-col gap-3 p-3 w-full "
      style={{ backgroundColor: appTheme.themeBackground }}
    >
      <MotiView>
        <MotiText
          className="font-bold text-lg pb-5 mt-0"
          style={{
            color: appTheme.fontMainColor,
            backgroundColor: appTheme.themeBackground,
          }}
        >
          {getTranslation("summary")}
        </MotiText>
      </MotiView>
      <MotiView className="flex flex-row justify-between w-[95%]">
        <MotiView className="flex flex-col gap-2 items-center">
          <MotiText
            className="text-lg "
            style={{ color: appTheme.fontSecondColor }}
          >
            {getTranslation("total_earnings")}
          </MotiText>
          <Skeleton
            colorMode={currentTheme ?? "light"}
            width={100}
            height={70}
          />
        </MotiView>
        <MotiView className="flex flex-col gap-2 items-center">
          <MotiText
            className="text-lg "
            style={{ color: appTheme.fontSecondColor }}
          >
            {getTranslation("total_tips")}
          </MotiText>
          <Skeleton
            colorMode={currentTheme ?? "light"}
            width={100}
            height={70}
          />
        </MotiView>
        <MotiView className="flex flex-col gap-2 items-center">
          <MotiText
            className="text-lg "
            style={{ color: appTheme.fontSecondColor }}
          >
            {getTranslation("total_deliveries")}
          </MotiText>
          <Skeleton
            colorMode={currentTheme ?? "light"}
            width={100}
            height={70}
          />
        </MotiView>
      </MotiView>
    </MotiView>
  );
}
