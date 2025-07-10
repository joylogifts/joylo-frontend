// libraries
import React from "react";
import { useLangTranslation } from "@/lib/context/global/language.context";

// Components
import HomeCard from "@/lib/ui/useable-components/Home-Card";
import MoveableCard from "@/lib/ui/useable-components/Moveable-Card";

// images
import deliveryFee from "@/public/assets/images/png/deliveryFee.webp";
import ZeroDelivery from "@/public/assets/images/png/0delivery.webp";
import RestaurantApp from "@/public/assets/images/png/restaurantApp.png"
import RiderApp from "@/public/assets/images/png/riderApp.png"
import CustomerApp from "@/public/assets/images/png/CustomerApp.png"


const EnategaInfo: React.FC = () => {
  const { getTranslation } = useLangTranslation();
  return (
    <div className="mt-[80px] mb-[80px]">
      <div className="flex flex-col justify-center items-center my-[20px]">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold m-4">
          {getTranslation("life_tastes_better_with_joylo")}
        </h1>
        <p className="m-4 text-xl md:text-2xl lg:text-3xl">
          {getTranslation("almost_everything_delivered_to_you")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ">
        <MoveableCard
          image={deliveryFee}
          heading={getTranslation("real_support_from_real_people_heading")}
          subText={getTranslation("real_support_from_real_people_subtext")}
        />
        <MoveableCard
          image={ZeroDelivery}
          heading={getTranslation("zero_delivery_fees_with_joylo_heading")}
          subText={getTranslation("zero_delivery_fees_with_joylo_subtext")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-[30px] mb-[30px]">
        <HomeCard image={CustomerApp} heading={getTranslation("fresh_groceries_delivered_heading")} subText={getTranslation("go_to_joylo_app_subtext")} link={"https://play.google.com/store/apps/details?id=com.enatega.multivendor&hl=en"}/>
        <HomeCard image={RestaurantApp} heading={getTranslation("restaurants_earn_more_heading")} subText={getTranslation("go_to_joylo_restaurant_app_subtext")} link={"https://play.google.com/store/apps/details?id=multivendor.enatega.restaurant&hl=en"} />
        <HomeCard image={RiderApp} heading={getTranslation("riders_reaches_fast_heading")} subText={getTranslation("go_to_joylo_rider_app_subtext")} link={"https://play.google.com/store/apps/details?id=com.enatega.multirider&hl=en"}/>
      </div>
    </div>
  );
};

export default EnategaInfo;
