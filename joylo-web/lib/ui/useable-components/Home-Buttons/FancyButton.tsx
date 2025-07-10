import React from "react";
import { useLangTranslation } from "@/lib/context/global/language.context";

const FancyButton = () => {
    const { getTranslation } = useLangTranslation();
    return <div>{getTranslation("heloo_mello")}</div>;
};

export default FancyButton;
