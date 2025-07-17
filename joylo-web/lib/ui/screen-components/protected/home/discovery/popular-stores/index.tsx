import CuisinesSliderCard from "@/lib/ui/useable-components/cuisines-slider-card";
// hook
import useMostOrderedRestaurants from "@/lib/hooks/useMostOrderedRestaurants";
// loading skeleton
import CuisinesSliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/cuisines.slider.skeleton";
import { useLangTranslation } from "@/lib/context/global/language.context";

function PopularStores() {
  const { error, loading, groceriesData } = useMostOrderedRestaurants();
  const { getTranslation } = useLangTranslation();
  if (loading) {
    return <CuisinesSliderSkeleton />;
  }

  if (error) {
    return;
  }

  return (
    <CuisinesSliderCard
      title={getTranslation("popular_stores")}
      data={groceriesData || []}
      showLogo={true}
      last={true}
      cuisines={false}
    />
  );
}

export default PopularStores;
