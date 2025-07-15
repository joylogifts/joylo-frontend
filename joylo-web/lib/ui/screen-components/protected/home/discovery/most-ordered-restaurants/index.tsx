import SliderCard from "@/lib/ui/useable-components/slider-card";
// hook
import useMostOrderedRestaurants from "@/lib/hooks/useMostOrderedRestaurants";
// loading skeleton
import SliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/slider.loading.skeleton";
import { useLangTranslation } from "@/lib/context/global/language.context";

function MostOrderedRestaurants() {
  const { queryData, error, loading } = useMostOrderedRestaurants()
  const { getTranslation } = useLangTranslation();
  if (loading) {
    return <SliderSkeleton />;
  }

  if (error) {
    return;
  }
  return (
    <SliderCard
      title={getTranslation("most_ordered_restaurants")}
      data={queryData || []}
    />
  );
}

export default MostOrderedRestaurants;
