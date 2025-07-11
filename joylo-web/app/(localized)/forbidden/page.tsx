"use client";

import { useLangTranslation } from "@/lib/context/global/language.context";

const Forbidden = () => {
  const { getTranslation } = useLangTranslation();
  return (
    <main className="h-screen w-full flex flex-col gap-2 justify-center items-center bg-white">
      <h1 className="text-9xl font-extrabold text-black tracking-widest">
        {getTranslation("forbidden_403_code")}
      </h1>
      <div className="bg-[#FFA500] text-white px-2 text-sm rounded rotate-12 absolute">
        {getTranslation("forbidden_label")}
      </div>
    </main>
  );
};

export default Forbidden;
