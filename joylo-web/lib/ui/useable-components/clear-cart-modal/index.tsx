"use client";

import React from "react";
import { useLangTranslation } from "@/lib/context/global/language.context";
import { Button } from "primereact/button";
import CustomDialog from "@/lib/ui/useable-components/custom-dialog";

interface ClearCartModalProps {
    isVisible: boolean;
    onHide: () => void;
    onConfirm: () => void;
}

export default function ClearCartModal(props: ClearCartModalProps) {
    const { isVisible, onHide, onConfirm } = props;
    const { getTranslation } = useLangTranslation();
    return (
        <CustomDialog
            visible={isVisible}
            onHide={onHide}
            width="450px"
            height="auto"
            className="clear-cart-modal"
        >
            <div className="p-6">
                <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        {getTranslation("are_you_sure_label")}
                    </h2>
                    <p className="text-gray-600">
                        {getTranslation("clear_cart_warning_message")}
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        className="bg-primary-color text-white border-none py-2 px-4 rounded-full font-medium"
                        onClick={onConfirm}
                        label={getTranslation("ok_label")}
                    />
                    <Button
                        className="bg-transparent text-gray-700 border border-gray-300 py-2 px-4 rounded-full font-medium"
                        onClick={onHide}
                        label={getTranslation("cancel_label")}
                    />
                </div>
            </div>
        </CustomDialog>
    );
}
