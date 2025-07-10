// Components
import CustomButton from "@/lib/ui/useable-components/button";

// Interfaces
import {
  IPhoneVerificationProps,
  IUpdateUserPhoneArguments,
  IUpdateUserResponse,
} from "@/lib/utils/interfaces";
import { ApolloError, useMutation } from "@apollo/client";

// Hooks
import { useAuth } from "@/lib/context/auth/auth.context";
import { useConfig } from "@/lib/context/configuration/configuration.context";
import useToast from "@/lib/hooks/useToast";
import useUser from "@/lib/hooks/useUser";
import { useLangTranslation } from "@/lib/context/global/language.context";
import { useEffect, useState } from "react";

// Prime React
import { InputOtp } from "primereact/inputotp";

// GQL
import { UPDATE_USER } from "@/lib/api/graphql";

export default function PhoneVerification({
  phoneOtp,
  setPhoneOtp,
  handleChangePanel,
}: IPhoneVerificationProps) {
  // States
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  // Hooks
  const { SKIP_MOBILE_VERIFICATION, TEST_OTP } = useConfig();
  const { getTranslation } = useLangTranslation();
  const {
    user,
    otp,
    setOtp,
    sendOtpToPhoneNumber,
    setIsAuthModalVisible,
    isRegistering,
    setIsRegistering,
    isLoading,
    setIsLoading,
  } = useAuth();
  const { showToast } = useToast();
  const { profile } = useUser();

  // Mutations
  const [updateUser] = useMutation<
    IUpdateUserResponse,
    undefined | IUpdateUserPhoneArguments
  >(UPDATE_USER, {
    onError: (error: ApolloError) => {
      showToast({
        type: "error",
        title: getTranslation("toast_error"),
        message:
          error.cause?.message ||
          getTranslation("error_occurred_while_updating_user_message"),
      });
    },
  });

  // Handlers
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (String(phoneOtp) === String(otp) && !!user?.phone) {
        const args =
          isRegistering ?
            {
              name: user?.name ?? "",
              phoneIsVerified: true,
            }
            : {
              phone: user?.phone,
              name: user?.name ?? "",
              phoneIsVerified: true,
            };

        const userData = await updateUser({
          variables: args,
        });
        setOtp("");
        setPhoneOtp("");
        if (!userData.data?.updateUser?.emailIsVerified && !user.email) {
          handleChangePanel(5);
        } else if (!userData.data?.updateUser?.emailIsVerified && user.email) {
          handleChangePanel(3);
        } else {
          handleChangePanel(0);
          setIsAuthModalVisible(false);
        }
        return showToast({
          type: "success",
          title: getTranslation("phone_verification_label"),
          message: getTranslation("your_phone_number_verified_successfully_message"),
        });
      } else {
        showToast({
          type: "error",
          title: getTranslation("otp_error_label"),
          message: getTranslation("please_enter_valid_otp_code_message"),
        });
      }
    } catch (error) {
      console.error(
        "Error while updating user and phone otp verification:",
        error,
      );
    } finally {
      setIsLoading(false);
      setIsRegistering(false);
    }
  };

  const handleResendPhoneOtp = async () => {
    if (user?.phone) {
      setIsResendingOtp(true);
      await sendOtpToPhoneNumber(user?.phone);
      showToast({
        type: "success",
        title: getTranslation("otp_resent_label"),
        message: getTranslation("resent_otp_code_to_your_phone_message"),
      });
      setIsResendingOtp(false);
    } else {
      showToast({
        type: "error",
        title: getTranslation("toast_error"),
        message: getTranslation("please_reenter_your_valid_phone_number_message"),
      });
      handleChangePanel(4);
    }
  };

  // UseEffects
  useEffect(() => {
    if (SKIP_MOBILE_VERIFICATION) {
      setOtp(TEST_OTP);
      showToast({
        type: "success",
        title: getTranslation("phone_verification_label"),
        message: getTranslation("your_phone_number_verified_successfully_message"),
      });
      if (!profile?.emailIsVerified) {
        handleChangePanel(5);
      } else {
        handleChangePanel(0);
        setIsAuthModalVisible(false);
      }
    }
  }, [SKIP_MOBILE_VERIFICATION]);



  return (
    <div className=" flex flex-col justify-between item-center self-center">
      <p>
        {getTranslation("otp_sent_code_to_label")}
        <span className="font-bold">{user?.phone}</span>
      </p>
      <p className="font-light text-sm mb-2">{getTranslation("please_check_your_inbox_message")}</p>
      <InputOtp
        value={phoneOtp}
        onChange={(e) => setPhoneOtp(String(e.value))}
        color="red"
        autoFocus={true}
        mask
        maxLength={6}
        length={6}
        className=" w-full h-20 my-2"
        onPaste={(e) =>
          setPhoneOtp(
            String(e.clipboardData.items[0].getAsString((data) => data)),
          )
        }

        placeholder="12314"
      />
      {/* create a span and give a margin top */}
      <span className="mt-4"></span>
      <CustomButton
        label={getTranslation("continue_label")}
        loading={isLoading}
        className={`bg-[#FFA500] flex items-center justify-center gap-x-4 px-3 rounded-full border border-gray-300 p-3 m-auto w-72 my-1`}
        onClick={handleSubmit}
      />
      <CustomButton
        label={getTranslation("resend_otp_label")}
        className={`bg-[#fff] flex items-center justify-center gap-x-4 px-3 rounded-full border border-gray-300 p-3 m-auto w-72 my-1`}
        onClick={handleResendPhoneOtp}
        loading={isResendingOtp}
      />
    </div>
  );
}
