// slider card
import SliderCard from "@/lib/ui/useable-components/slider-card";
// hook
import useMostOrderedRestaurants from "@/lib/hooks/useMostOrderedRestaurants";
// loading skeleton
import SliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/slider.loading.skeleton";
import { useLangTranslation } from "@/lib/context/global/language.context";

function TopGroceryPicks() {
  const { error, loading, groceriesData } = useMostOrderedRestaurants();
  const { getTranslation } = useLangTranslation();
  if (loading) {
    return <SliderSkeleton />;
  }

  if (error) {
    return;
  }

  return <SliderCard title={getTranslation("top_grocery_picks")} data={groceriesData || []} />;
}

export default TopGroceryPicks;
