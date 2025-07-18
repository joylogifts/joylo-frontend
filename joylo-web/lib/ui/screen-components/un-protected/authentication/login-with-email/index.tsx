// Components
import CustomButton from "@/lib/ui/useable-components/button";
import CustomTextField from "@/lib/ui/useable-components/input-field";

// Interfaces
import { ILoginWithEmailProps } from "@/lib/utils/interfaces";

// Icons
import EmailIcon from "@/public/assets/images/svgs/email";

// Hooks
import { useAuth } from "@/lib/context/auth/auth.context";
import useToast from "@/lib/hooks/useToast";
import { useLangTranslation } from "@/lib/context/global/language.context";

export default function LoginWithEmail({
  handleChangePanel,
  formData,
  handleFormChange,
}: ILoginWithEmailProps) {
  // Hooks
  const { getTranslation } = useLangTranslation();
  const { setUser, checkEmailExists, isLoading } = useAuth();
  const { showToast } = useToast();

  // Handlers
  const handleSubmit = async () => {
    if (!formData?.email) {
      return showToast({
        type: "error",
        title: getTranslation("toast_error"),
        message: getTranslation("please_enter_valid_email_address_message"),
      });
    } else {
      // Check if the email exits
      const emailExists = await checkEmailExists(formData?.email);
      if (emailExists._id && emailExists.userType !== "default") {
        showToast({
          type: "warn",
          title: getTranslation("login_label"),
          message: getTranslation("email_associated_with_another_provider_message"),
        });
        // re-direct to main modal
        return handleChangePanel(0);
      } else if (emailExists.userType === "default") {
        // re-direct to enter password
        return handleChangePanel(7);
      } else {
        // re-direct to registration
        handleChangePanel(2);
      }
    }
  };

  const handleChange = (email: string) => {
    handleFormChange("email", email);
    setUser((prev) => ({
      ...prev,
      email,
    }));
  };
  return (
    <div className="flex flex-col items-start justify-between w-full h-full">
      <EmailIcon />
      <div className="flex flex-col w-full h-auto self-start left-2 my-2">
        <h3 className="text-2xl">{getTranslation("whats_your_email_label")}? </h3>
        <p>{getTranslation("well_check_if_you_have_an_account_message")}</p>
      </div>
      <div className="flex flex-col gap-y-1 my-6 w-full">
        <CustomTextField
          value={formData?.email}
          showLabel={false}
          name="email"
          type="text"
          placeholder={getTranslation("email_label")}
          onChange={(e) => handleChange(e.target.value)}
        />
        <span
          className="self-end font-semibold text-sm underline cursor-pointer text-[#FFA500]"
          onClick={() => handleChangePanel(0)}
        >
          {getTranslation("continue_with_google_instead_label")}
        </span>
      </div>
      <CustomButton
        label={getTranslation("continue_label")}
        loading={isLoading}
        onClick={handleSubmit}
        className={`bg-[#FFA500] flex items-center justify-center gap-x-4 px-3 rounded-full border border-gray-300 p-3 m-auto w-72`}
      />
    </div>
  );
}
