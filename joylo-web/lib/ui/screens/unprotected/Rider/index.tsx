// import libraries
import React from "react";

// import components
import EmailForm from "@/lib/ui/useable-components/RiderandRestaurantsInfos/Form";
import Heading from "@/lib/ui/useable-components/RiderandRestaurantsInfos/Heading/Heading";
import WhyCardsList from "@/lib/ui/useable-components/RiderandRestaurantsInfos/WhyCards/WhyCardsList";
import WhyChoose from "@/lib/ui/useable-components/RiderandRestaurantsInfos/WhyChoose";

// import images
import growth from "@/public/assets/images/png/Growth.png";
import getMoreOrders from "@/public/assets/images/png/GetMoreOrders.png";
import deliverMoreCustomers from "@/public/assets/images/png/deliverToCustomer.png";
import StartingImage from "@/lib/ui/useable-components/RiderandRestaurantsInfos/StartingImage/StartingImage";
import RiderBanner from "@/public/assets/images/png/RidersBanner.webp";

import { useLangTranslation } from "@/lib/context/global/language.context";

// cards Data will be filled in component with translation

// Rider Page
const Rider = () => {
    const { getTranslation } = useLangTranslation();

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

    return (
        <div className="w-screen  h-auto">
            <Heading heading={getTranslation("become_a_joylo_rider")} />
            <StartingImage image={RiderBanner} />
            <WhyChoose
                heading={getTranslation("why_deliver_with_joylo")}
                subHeading={getTranslation(
                    "rider_partner_earn_money_flexible_schedule"
                )}
            />
            <WhyCardsList cards={cards} />
            <hr className="w-[30%] ml-12 border-4 border-primary-color my-12 rounded" />
            <EmailForm
                heading={getTranslation("become_a_rider")}
                role={getTranslation("driver_registration")}
            />
        </div>
    );
};

export default Rider;
