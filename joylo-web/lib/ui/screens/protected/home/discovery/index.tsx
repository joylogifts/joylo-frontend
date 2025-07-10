import {
    DiscoveryBannerSection,
    RestaurantsNearYou,
    MostOrderedRestaurants,
    GroceryList,
    TopGroceryPicks,
    TopRatedVendors,
    PopularRestaurants,
    PopularStores,
    OrderItAgain,
} from "@/lib/ui/screen-components/protected/home";
// ui componnet
import CuisinesSection from "@/lib/ui/useable-components/cuisines-section";
// hooks
import useGetCuisines from "@/lib/hooks/useGetCuisines";
import { useLangTranslation } from "@/lib/context/global/language.context";


export default function DiscoveryScreen() {
    const { getTranslation } = useLangTranslation();
    const { restaurantCuisinesData, groceryCuisinesData, error, loading } =
        useGetCuisines();
    return (
        <>
            <DiscoveryBannerSection />
            <OrderItAgain />
            <MostOrderedRestaurants />
            <CuisinesSection
                title={getTranslation("restaurant_cuisines_title")}
                data={restaurantCuisinesData}
                loading={loading}
                error={!!error}
            />
            <RestaurantsNearYou />
            <CuisinesSection
                title={getTranslation("grocery_cuisines_title")}
                data={groceryCuisinesData}
                loading={loading}
                error={!!error}
            />
            <GroceryList />
            <TopGroceryPicks />
            <TopRatedVendors />
            <PopularRestaurants />
            <PopularStores />
        </>
    );
}
