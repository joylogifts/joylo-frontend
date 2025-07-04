// Core
import { CustomContinueButton } from "@/lib/ui/useable-components";

// Hooks
import { useLanguage } from "@/lib/context/global/language.context";

export default function UpdateScheduleBtn({
  onHandlerSubmit,
  isUpatingSchedule,
}: {
  onHandlerSubmit: () => Promise<void>;
  isUpatingSchedule: boolean;
  width: number;
}) {
  // Hooks
  const { getTranslation } = useLanguage();

  return (
    <CustomContinueButton
      title={getTranslation("update_schedule")}
      onPress={onHandlerSubmit}
      isLoading={isUpatingSchedule}
    />
  );
}
