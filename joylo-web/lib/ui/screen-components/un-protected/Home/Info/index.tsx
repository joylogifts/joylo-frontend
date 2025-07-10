import MoveableCard from "@/lib/ui/useable-components/Moveable-Card";
import React from "react";
import TranparentButton from "@/lib/ui/useable-components/Home-Buttons/TranparentButton";
import { useLangTranslation } from "@/lib/context/global/language.context";

import riderImg from '@/public/assets/images/png/riderImg.webp'
import reachNewCustomers from '@/public/assets/images/png/reachNewCustomers.jpg'
const Info = () => {
  const { getTranslation } = useLangTranslation();
  const CourierButton = <TranparentButton text={getTranslation("for_riders_btn")} link={"/rider"} />;
  const MerchantButton = <TranparentButton text={getTranslation("for_restaurants_btn")} link={"/restaurantInfo"}/>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <MoveableCard
        button={CourierButton}
        image={
          riderImg
        }
        heading={getTranslation("becoming_a_courier_partner_heading")}
        subText={getTranslation("earn_by_delivering_to_local_customers_subtext")}
      />
      <MoveableCard
        button={MerchantButton}
        image={
         reachNewCustomers
        }
        heading={getTranslation("reach_new_customers_heading")}
        subText={getTranslation("we_help_you_grow_your_business_subtext")}
      />
    </div>
  );
};

export default Info;
