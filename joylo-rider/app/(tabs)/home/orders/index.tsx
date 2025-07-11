// Components
import { useLanguage } from "@/lib/context/global/language.context";
import HomeNewOrdersMain from "@/lib/ui/screen-components/home/orders/main/new-orders";
import { useTranslation } from "react-i18next";

export default function HomeScreen() {
    // Hooks
    const {getTranslation:t} = useLanguage();
  return (
    <HomeNewOrdersMain route={{ key: "new_orders", title: t("new_orders") }} />
  );
}
