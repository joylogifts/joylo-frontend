import HomeProcessingOrdersMain from "@/lib/ui/screen-components/home/orders/main/processing-orders";
import { useLanguage } from "@/lib/context/global/language.context";

export default function HomeScreen() {
  // Hooks
  const { getTranslation } = useLanguage();

  return (
    <HomeProcessingOrdersMain
      route={{ key: "processing", title: getTranslation("processing_orders") }}
    />
  );
}
