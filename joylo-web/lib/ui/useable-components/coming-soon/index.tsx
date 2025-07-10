"use client";

import { useLangTranslation } from "@/lib/context/global/language.context";

const ComingSoon = () => {
    const { getTranslation } = useLangTranslation();
    return (
        <div className="flex h-[80vh] w-screen items-center justify-center text-3xl font-bold">
            {getTranslation("coming_soon")}
        </div>
    );
};

export default ComingSoon;
