import { useLangTranslation } from "@/lib/context/global/language.context";

import { StaticImageData } from "next/image";
import React from "react";

interface StratingImageProps {
    image: string | StaticImageData;
}

import Image from "next/image";

const StartingImage: React.FC<StratingImageProps> = ({ image }) => {
    const { getTranslation } = useLangTranslation();
    return (
        <div className="w-full h-[200px] md:h-[500px]">
            <Image
                src={image}
                alt={getTranslation("banner_image_alt")}
                className="w-full h-full  object-cover md:object-contain"
            />
        </div>
    );
};

export default StartingImage;
