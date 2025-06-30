import { useContext } from "react";
import { TranslationsContext } from "../context/global/translation.context";


const useTranslations = () => {
  const context = useContext(TranslationsContext);
  if (!context) {
    throw new Error("useTranslations must be used within a TranslationsProvider");
  }
  return context;
};

export default useTranslations;
