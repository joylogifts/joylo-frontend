// translation
import { useLangTranslation } from "@/lib/context/global/language.context";
// Prime React
import { Dialog } from "primereact/dialog";

// Components
import CustomButton from "../button";

// Interface and Types
import { IDialogComponentProps } from "@/lib/utils/interfaces/";

const CustomDialog = ({
    title = "Confirm Deletion",
    message,
    visible,
    onHide,
    onConfirm,
    loading,
    buttonConfig,
}: IDialogComponentProps) => {
    const { getTranslation } = useLangTranslation();
    const {
        primaryButtonProp: {
            label: primaryButtonLabel = getTranslation("confirm"),
            icon: primaryButtonIcon = "pi pi-check",
            textColor: primaryButtonTextColor = "text-white",
            bgColor: primaryButtonBGColor = "bg-red-500",
        } = {},
        secondaryButtonProp: {
            label: secondaryButtonLabel = getTranslation("cancel_label"),
            icon: secondaryButtonIcon = "pi pi-times",
            textColor: secondaryButtonTextColor = "text-black",
            bgColor: secondaryButtonBGColor = "bg-transparent",
        } = {},
    } = buttonConfig || {};

    const footer = (
        <div className="space-x-2">
            <CustomButton
                label={secondaryButtonLabel || getTranslation("cancel_label")}
                icon={secondaryButtonIcon || "pi pi-times"}
                onClick={onHide}
                className={`h-9 rounded border border-gray-300 px-5 ${secondaryButtonBGColor} ${secondaryButtonTextColor}`}
            />
            <CustomButton
                loading={loading}
                label={primaryButtonLabel || getTranslation("confirm")}
                className={`h-9 rounded border-gray-300 px-4 ${primaryButtonBGColor} ${primaryButtonTextColor}`}
                icon={primaryButtonIcon || "pi pi-check"}
                onClick={onConfirm}
            />
        </div>
    );

    return (
        <Dialog
            visible={visible}
            style={{ width: "32rem", textAlign: "center" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header={
                title
                    ? getTranslation(
                          title === "Confirm Deletion"
                              ? "confirm_deletion"
                              : title
                      )
                    : undefined
            }
            modal
            footer={footer}
            onHide={onHide}
        >
            <div className="confirmation-content text-center">
                <span>
                    {message || getTranslation("are_you_sure_delete_item")}
                </span>
            </div>
        </Dialog>
    );
};

export default CustomDialog;
