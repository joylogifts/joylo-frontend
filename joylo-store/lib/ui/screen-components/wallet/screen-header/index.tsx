// Components
import { useLanguage } from "@/lib/context/global/language.context";
import CustomScreenHeader from "@/lib/ui/useable-components/custom-screen-header";

// Hooks

export default function WalletScreenHeader() {
  // Hooks
  const { getTranslation } = useLanguage();
  return <CustomScreenHeader title={getTranslation("earnings")} />;
}
