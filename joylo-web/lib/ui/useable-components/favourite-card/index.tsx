import { useLangTranslation } from "@/lib/context/global/language.context";
import type React from "react";

import TextComponent from "../text-field";
import ImageComponent from "../card-image-component";
// import IconText from "../icon-text";
import { IFavoriteCardProps } from "@/lib/utils/interfaces/favourite.restaurants.interface";
import IconWithTitle from "../icon-with-title";
import { ClockSvg, CycleSvg, FaceSvg } from "@/lib/utils/assets/svg";
import { useConfig } from "@/lib/context/configuration/configuration.context";
import { useWindowWidth } from "@/lib/hooks/useWindowWidth";
import { usePathname } from "next/navigation";

const FavoriteCard: React.FC<IFavoriteCardProps> = ({ item }) => {
    const { getTranslation, selectedLanguage } = useLangTranslation();
    const pathname = usePathname();
    const width = useWindowWidth();
    const { DELIVERY_RATE } = useConfig();
    return (
        <div className="relative p-0 border border-gray-200 rounded-lg shadow-lg w-full h-[255px] cursor-pointer">
            <hr className="border-t-2 border-gray-300 border-dashed my-2 absolute bottom-10 w-full" />
            <div className="flex flex-col h-full w-full">
                <div className="relative w-full h-52 overflow-hidden rounded-t-lg">
                    <ImageComponent src={item?.image} alt={typeof item?.name === "object" ? item?.name[selectedLanguage] : item?.name} />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-center justify-between">
                        <div>
                            <TextComponent
                                text={
                                    typeof item?.name === "object" ? item?.name[selectedLanguage] : item?.name
                                        ? pathname === "/profile" &&
                                          width >= 1024 &&
                                          width <= 1150 &&
                                          item?.name?.length > 12
                                            ? item?.name.slice(0, 10) + "..."
                                            : item?.name
                                        : getTranslation("not_available_label")
                                }
                                title={
                                    item?.name
                                        ? width >= 1024 &&
                                          width <= 1150 &&
                                          item?.name?.length > 12
                                            ? item?.name
                                            : ""
                                        : ""
                                }
                                className="text-lg font-medium text-gray-800 mb-1"
                            />
                            <TextComponent
                                text={
                                    typeof item?.categories?.[0]?.title === "object" ? item?.categories?.[0]?.title[selectedLanguage] : item?.categories?.[0]?.title ||
                                    getTranslation("not_available_label")
                                }
                                className="text-sm text-gray-600 mb-6"
                            />
                        </div>
                        <p className=" text-[#FFA500] bg-[#FFDBBB] p-2 rounded-md font-light text-xs flex items-center justify-center">
                            {`${item?.deliveryTime}`}{" "}
                            {getTranslation("min_label")}
                        </p>
                    </div>
                    <div className="flex items-center justify-start mt-auto gap-4">
                        <IconWithTitle
                            logo={() => <ClockSvg isBlue={true} />}
                            title={
                                item?.deliveryTime +
                                " " +
                                getTranslation("mins_label")
                            }
                            isBlue={true}
                        />

                        {DELIVERY_RATE && (
                            <IconWithTitle
                                logo={CycleSvg}
                                title={DELIVERY_RATE}
                            />
                        )}
                        <IconWithTitle
                            logo={FaceSvg}
                            title={Number(item?.reviewAverage)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FavoriteCard;
