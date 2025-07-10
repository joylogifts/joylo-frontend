import MoveableCard from "@/lib/ui/useable-components/Moveable-Card";
import TinyTiles from "@/lib/ui/useable-components/tinyTiles";
import React from "react";
import TranparentButton from "@/lib/ui/useable-components/Home-Buttons/TranparentButton";
import { useLangTranslation } from "@/lib/context/global/language.context";

import competetiveEarning  from "@/public/assets/images/png/competitiveEarning.webp"
import flexibleHours  from "@/public/assets/images/png/flexibleHours.webp"

import Banner2 from "@/public/assets/images/png/Banner2.webp"

const Couriers:React.FC = () => {
  const { getTranslation } = useLangTranslation();
  const EarningButton = <TranparentButton text={getTranslation("learn_more_btn")} link={'restaurantInfo'} />;
  const FLexiblegButton = <TranparentButton text={getTranslation("learn_more_btn")} link={'rider'} />;
  const EarnWhereButton = <TranparentButton text={getTranslation("get_started_btn")} link={'rider'} />;
  return (
    <div className="my-[60px]">
      <MoveableCard
        image={
          Banner2
        }
        heading={getTranslation("for_riders_heading")}
        subText={getTranslation("earn_when_and_where_you_want")}
        button={EarnWhereButton}
        middle={true}
      />
      <div className="grid gird-cols-1 md:grid-cols-2 my-[30px] gap-8">
        <MoveableCard
          image={competetiveEarning}
          heading={getTranslation("competitive_earnings_heading")}
          subText={getTranslation("competitive_earnings_subtext")}
          button={EarningButton}
        />
        <MoveableCard
          image={flexibleHours}
          heading={getTranslation("flexible_hours_heading")}
          subText={getTranslation("flexible_hours_subtext")}
          button={FLexiblegButton}
        />
      </div>

      <TinyTiles
        image={
          "https://images.ctfassets.net/23u853certza/QScF4OasY8MBTmzrKJfv1/9afd4f8a826825cc097fb36606a81963/3DCourier.webp?w=200&q=90&fm=webp"
        }
        heading={getTranslation("become_a_joylo_rider_heading")}
        buttonText={getTranslation("for_riders_btn")}
        backColor={"#eaf7fc"}
        link={"/rider"}
      />
    </div>
  );
};

export default Couriers;
