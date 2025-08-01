"use client";
import { useLangTranslation } from "@/lib/context/global/language.context";
import ActionButton from "@/lib/ui/useable-components/action-button";
import CustomButton from "@/lib/ui/useable-components/button";
import RenderAspects from "@/lib/ui/useable-components/render-aspects";
import { IRenderStepTwoProps } from "@/lib/utils/interfaces/ratings.interface";

// Render the second step - Aspects selection with option to add comment
const RenderStepTwo = ({
    selectedAspects,
    handleAspectToggle,
    handleNext,
    handleSubmitDebounced,
}: IRenderStepTwoProps) => {
    const { getTranslation } = useLangTranslation();
    return (
        <div className="w-full flex flex-col justify-center items-center">
            <RenderAspects
                selectedAspects={selectedAspects}
                handleAspectToggle={handleAspectToggle}
            />
            <CustomButton
                label={getTranslation("add_a_comment_button")}
                onClick={handleNext} // Go to comment step
                className="!font-thin border border-gray-400  py-2 px-10 rounded-full bg-[#FFDBBB] text-gray-600 mb-4 flex items-center justify-center gap-2 transition-colors"
            />
            <ActionButton onClick={handleSubmitDebounced} primary>
                {getTranslation("submit_button")}
            </ActionButton>
        </div>
    );
};

export default RenderStepTwo;
