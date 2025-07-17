"use client";

import useNearByRestaurantsPreview from "@/lib/hooks/useNearByRestaurantsPreview";
import useGetCuisines from "@/lib/hooks/useGetCuisines";
import GenericListingComponent from "@/lib/ui/screen-components/protected/home/GenericListingComponent";
import { useLangTranslation } from "@/lib/context/global/language.context";

export default function RestaurantsScreen() {
  const { loading, error, restaurantsData } = useNearByRestaurantsPreview();
  const { restaurantCuisinesData } = useGetCuisines();
  const { getTranslation } = useLangTranslation();
  return (
    <GenericListingComponent
      headingTitle={getTranslation("restaurants_near_you")}
      cuisineSectionTitle="Browse categories"
      mainSectionTitle="All Restaurants"
      mainData={restaurantsData}
      cuisineDataFromHook={restaurantCuisinesData}
      loading={loading}
      error={!!error}
    />
  );
}
