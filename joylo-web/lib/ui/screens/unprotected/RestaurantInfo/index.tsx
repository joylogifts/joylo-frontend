// library imports
import React from "react";

// components imports
import EmailForm from "@/lib/ui/useable-components/RiderandRestaurantsInfos/Form";
import Heading from "@/lib/ui/useable-components/RiderandRestaurantsInfos/Heading/Heading";
import SideContainers from "@/lib/ui/useable-components/RiderandRestaurantsInfos/SideContainers/SideCard";
import WhyCardsList from "@/lib/ui/useable-components/RiderandRestaurantsInfos/WhyCards/WhyCardsList";
import WhyChoose from "@/lib/ui/useable-components/RiderandRestaurantsInfos/WhyChoose";
import StartingImage from "@/lib/ui/useable-components/RiderandRestaurantsInfos/StartingImage/StartingImage";

// image imports
import WorldClassCustomers from "@/public/assets/images/png/WorldClassCustomer.webp";
import enategaApp from "@/public/assets/images/png/enategaApp.png";
import growth from "@/public/assets/images/png/Growth.png";
import getMoreOrders from "@/public/assets/images/png/GetMoreOrders.png";
import deliverMoreCustomers from "@/public/assets/images/png/deliverToCustomer.png";
import restaurantBanner from "@/public/assets/images/png/restaurant-banner.png";

import { useLangTranslation } from "@/lib/context/global/language.context";

// cards data will be filled in component with translation

// sideCards data will be filled in component with translation

// Restaurant Info Page
const RestInfo = () => {
    const { getTranslation } = useLangTranslation();

    // Fill translation values for cards
    const cards = [
        {
            heading: getTranslation("grow_with_joylo"),
            text: getTranslation("access_active_customer_base"),
            image: growth,
            color: "#f7fbfe",
        },
        {
            heading: getTranslation("get_more_orders"),
            text: getTranslation("increase_orders_reaching_customers"),
            image: getMoreOrders,
            color: "#faf7fc",
        },
        {
            heading: getTranslation("deliver_to_more_customers"),
            text: getTranslation("rider_partners_deliver_in_30_minutes"),
            image: deliverMoreCustomers,
            color: "#fbfbfb",
        },
    ];

    const sideCards = [
        {
            image: enategaApp,
            heading: getTranslation("how_joylo_works"),
            subHeading: getTranslation("how_joylo_works_desc"),
            right: false,
        },
        {
            image: WorldClassCustomers,
            heading: getTranslation("world_class_customer_support"),
            subHeading: getTranslation("world_class_customer_support_desc"),
            right: true,
        },
    ];

    return (
        <div className="w-screen  h-auto">
            <Heading
                heading={getTranslation(
                    "reach_more_customers_and_grow_your_business_with_joylo"
                )}
                subHeading={getTranslation(
                    "partner_with_joylo_to_create_more_sales"
                )}
            />
            <StartingImage image={restaurantBanner} />
            <WhyChoose
                heading={getTranslation("why_deliver_with_joylo")}
                subHeading={getTranslation(
                    "rider_partner_earn_money_flexible_schedule"
                )}
            />
            <WhyCardsList cards={cards} />
            <SideContainers sideCards={sideCards} />
            <hr className="w-[30%] ml-12 border-4 border-primary-color my-12 rounded" />
            <EmailForm
                heading={getTranslation("become_a_restaurant")}
                role={getTranslation("vendor_registration")}
            />
        </div>
    );
};

export default RestInfo;
