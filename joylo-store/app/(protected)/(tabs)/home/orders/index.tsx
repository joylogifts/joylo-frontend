import HomeNewOrdersMain from "@/lib/ui/screen-components/home/orders/main/new-orders";
import { useLanguage } from "@/lib/context/global/language.context";

export default function HomeScreen() {
  // Hooks
  const { getTranslation } = useLanguage();

  return (
    <HomeNewOrdersMain route={{ key: "new_orders", title: getTranslation("new_orderss") }} />
  );
}
