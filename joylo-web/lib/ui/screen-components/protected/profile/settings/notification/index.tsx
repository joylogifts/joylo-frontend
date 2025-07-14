"use client";

import type React from "react";
import { useState } from "react";
import CustomInputSwitch from "@/lib/ui/useable-components/custom-input-switch";
import TextComponent from "@/lib/ui/useable-components/text-field";
import { useLangTranslation } from "@/lib/context/global/language.context";

export default function NotificationSection() {
    const { getTranslation } = useLangTranslation();
    // States for notification preferences
    const [pushNotifications, setPushNotifications] = useState<boolean>(false);
    const [emailNotifications, setEmailNotifications] =
        useState<boolean>(false);

    // Handle push notifications toggle
    const handlePushNotificationsChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newValue = e.target.checked;
        setPushNotifications(newValue);
    };

    // Handle email notifications toggle
    const handleEmailNotificationsChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newValue = e.target.checked;
        setEmailNotifications(newValue);
    };

    return (
        <div className="w-full mx-auto">
            <TextComponent
                text={getTranslation("notifications_label")}
                className=" font-semibold text-gray-700 text-xl md:text-2xl   mb-4"
            />

            {/* Push Notifications */}
            <div className="py-4 border-b">
                <div className="flex justify-between items-center">
                    <TextComponent
                        text={getTranslation(
                            "push_notifications_description_label"
                        )}
                        className="font-normal text-gray-700 text-base md:text-lg "
                    />
                    <CustomInputSwitch
                        loading={false}
                        isActive={pushNotifications}
                        onChange={handlePushNotificationsChange}
                    />
                </div>
            </div>

            {/* Email Notifications */}
            <div className="py-4 border-b">
                <div className="flex justify-between items-center">
                    <TextComponent
                        text={getTranslation(
                            "email_notifications_description_label"
                        )}
                        className="font-normal text-gray-700 text-base md:text-lg   "
                    />
                    <CustomInputSwitch
                        loading={false}
                        isActive={emailNotifications}
                        onChange={handleEmailNotificationsChange}
                    />
                </div>
            </div>
        </div>
    );
}
