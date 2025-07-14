import { useLanguage } from "@/lib/context/global/language.context";
import CustomScreenHeader from "@/lib/ui/useable-components/custom-screen-header";
import { useTranslation } from "react-i18next";

export default function WalletScreenHeader() {
  // Hooks
  const { getTranslation:t } = useLanguage();
  return <CustomScreenHeader title={t("earnings")} />;
}
