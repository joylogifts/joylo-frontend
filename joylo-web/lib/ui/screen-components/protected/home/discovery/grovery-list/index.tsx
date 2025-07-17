import SliderCard from "@/lib/ui/useable-components/slider-card";
// Hook
import useNearByRestaurantsPreview from "@/lib/hooks/useNearByRestaurantsPreview";
// loading skeleton
import SliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/slider.loading.skeleton";
import { useLangTranslation } from "@/lib/context/global/language.context";

function GroceryList() {
  const { error, loading, groceriesData } = useNearByRestaurantsPreview();
  const { getTranslation } = useLangTranslation();
  if (loading) {
    return <SliderSkeleton />;
  }

  if (error) {
    return;
  }

  return <SliderCard title={getTranslation("grocery_list")} data={groceriesData || []} />;
}

export default GroceryList;
