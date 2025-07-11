import { useLangTranslation } from "@/lib/context/global/language.context";
import { ITabItem } from "@/lib/utils/interfaces";

export const TabItem: React.FC<{
  tab: ITabItem;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}> = ({ tab, isActive, onClick, className = "" }) => {
  const { getTranslation } = useLangTranslation();
  return (
    <span
      key={tab.path}
      onClick={onClick}
      className={`
        cursor-pointer 
        transition-colors 
        whitespace-nowrap 
        ${className}
        ${isActive
          ? "border-b-[3px] border-black text-black"
          : "text-gray-500 hover:text-gray-700"
        }
      `}
    >
      {getTranslation(tab.label)}
    </span>
  );
};
