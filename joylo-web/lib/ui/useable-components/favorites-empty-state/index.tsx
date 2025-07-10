"use client"
import { useLangTranslation } from "@/lib/context/global/language.context";

import Link from "next/link"
import Lottie from "lottie-react"
import { useEffect, useState } from "react";
export default function FavoritesEmptyState() {
  const { getTranslation } = useLangTranslation();
  const [animationData, setAnimationData] = useState<null | object>(null);
  useEffect(() => {
    fetch("/assets/lottie/favourite.json")
      .then((res) => res.json())
      .then(setAnimationData)
      .catch((err) => console.error("Failed to load Lottie JSON", err));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-white max-w-md mx-auto">
      <div className="w-32 h-32 md:w-60 md:h-60 flex items-center justify-center">
        <Lottie animationData={animationData} loop={true} autoplay={true} />
      </div>
      <h1 className="text-xl md:text-2xl font-medium text-gray-800 mb-3 text-center">{getTranslation("no_favorites_yet")}</h1>
      <p className="text-sm md:text-base text-gray-500 mb-6 text-center">
        {getTranslation("favorites_empty_state_description")}
      </p>
      <Link
        href="/store"
        className="inline-flex items-center justify-center px-6 py-3 bg-[#FFDBBB]  text-black hover:text-white font-medium rounded-full transition-colors hover:bg-[#FFA500] focus:outline-none focus:ring-2 focus:ring-[#FFA500] focus:ring-offset-2"
      >
        {getTranslation("explore_store")}
      </Link>
    </div>
  )
}