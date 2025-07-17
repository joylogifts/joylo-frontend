"use client"

import { useLangTranslation } from "@/lib/context/global/language.context"
import CustomButton from "@/lib/ui/useable-components/button"
import TextComponent from "@/lib/ui/useable-components/text-field"
import { IHeaderFavourite } from "@/lib/utils/interfaces/favourite.restaurants.interface"
import type React from "react"


export const HeaderFavourite: React.FC<IHeaderFavourite> = ({ title, onSeeAllClick }) => {
  const { getTranslation } = useLangTranslation();
  return (
    <div className="flex justify-between items-center w-full">
      <TextComponent text={title} className="text-xl md:text-2xl  font-medium" />
      <CustomButton
        label={getTranslation("see_all")}
        onClick={onSeeAllClick}
        className="text-[#0EA5E9] transition-colors duration-200 text-base md:text-lg font-light"
      />
    </div>
  )
}

export default HeaderFavourite

