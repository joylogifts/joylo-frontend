"use client";
import type React from "react";
import { useRef, useState, useEffect } from "react";
//components
import CustomButton from "@/lib/ui/useable-components/button";
// Icons
import PhoneIcon from "@/lib/utils/assets/svg/phone";
import useDebounceFunction from "@/lib/hooks/useDebounceForFunction";
import { useLangTranslation } from "@/lib/context/global/language.context";

const VerificationPhone = ({
    handleSubmitAfterVerification,
    handleResendPhoneOtp,
    phoneOtp,
    setPhoneOtp,
    user,
    showToast,
}: any) => {
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const { getTranslation } = useLangTranslation();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Initialize refs array
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, 6);

        // Set initial values from phoneOtp if it exists
        if (phoneOtp) {
            const otpArray = phoneOtp.split("").slice(0, 6);
            setOtp(otpArray.concat(Array(6 - otpArray.length).fill("")));
        }
    }, []);

    // Update parent component's phoneOtp when our local otp changes
    useEffect(() => {
        setPhoneOtp(otp.join(""));
    }, [otp, setPhoneOtp]);

    // Handle input change
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const value = e.target.value;

        // Only accept single digit numbers
        if (!/^\d*$/.test(value)) return;

        // Update the OTP array
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Take only the last character
        setOtp(newOtp);

        // Auto-focus next input if a digit was entered
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace key
    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            // Focus previous input when backspace is pressed on an empty input
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Handle paste event
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text/plain").trim();

        // Only accept digits
        const digits = pastedData.replace(/\D/g, "").slice(0, 6);

        if (digits) {
            const newOtp = [...Array(6).fill("")];
            digits.split("").forEach((digit, index) => {
                if (index < 6) newOtp[index] = digit;
            });
            setOtp(newOtp);

            // Focus the next empty input or the last input
            const lastFilledIndex = Math.min(digits.length, 5);
            inputRefs.current[lastFilledIndex]?.focus();
        }
    };

    // Handle form submission
    const handleSubmit = useDebounceFunction(
        async () => {
            if (otp.join("").length !== 6) {
                return showToast({
                    type: "error",
                    title: getTranslation("toast_error"),
                    message: getTranslation("please_enter_valid_otp_message"),
                });
            }

            handleSubmitAfterVerification();
        },
        500 // Debounce time in milliseconds
    );

    return (
        <div className="w-[300px] sm:w-full max-w-md mx-auto p-4 flex flex-col items-center bg-white rounded-3xl shadow-sm">
            <div className="mb-2">
                <PhoneIcon />
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">
                {getTranslation("otp_sent_code_to_label")}
            </h2>

            <p className="text-xl font-bold text-center text-gray-800 mb-4">
                {user?.phone || "+49 123456789"}
            </p>

            <p className="text-base text-gray-600 mb-8 text-center">
                {getTranslation("verify_your_mobile_number_label")}
            </p>

            <div className="w-full mb-8">
                <div className="flex justify-center flex-wrap gap-2 sm:gap-4">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                        <input
                            key={index}
                            ref={(el) => {
                                inputRefs.current[index] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={otp[index]}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={index === 0 ? handlePaste : undefined}
                            className="w-12 h-12 sm:w-14 sm:h-16 text-xl text-center border border-gray-300 rounded-lg focus:outline-none focus:border-[#FFA500] focus:ring-2 focus:ring-[#FFA500] focus:ring-opacity-20"
                            autoFocus={index === 0}
                        />
                    ))}
                </div>
            </div>

            <p className="text-sm text-gray-500 mb-8 text-center">
                {getTranslation("otp_valid_for_10_minutes_label")}
            </p>

            <CustomButton
                label={getTranslation("continue_label")}
                className="bg-[#FFA500] text-white flex items-center justify-center rounded-full p-3 w-full mb-4 h-14 text-lg font-medium"
                onClick={handleSubmit}
            />

            <CustomButton
                label={getTranslation("resend_otp_label")}
                className="bg-white flex items-center justify-center rounded-full border border-gray-300 p-3 w-full h-14 text-lg font-medium"
                onClick={handleResendPhoneOtp}
            />
        </div>
    );
};

export default VerificationPhone;
