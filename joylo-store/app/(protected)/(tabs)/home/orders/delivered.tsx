import HomeDeliveredOrdersMain from "@/lib/ui/screen-components/home/orders/main/delivered-orders";
import { useLanguage } from "@/lib/context/global/language.context";

export default function HomeScreen() {
  // Hooks
  const { getTranslation } = useLanguage();
  return (
    <HomeDeliveredOrdersMain
      route={{ key: "delivered", title: getTranslation("delivered_orders") }}
    />
  );
}
