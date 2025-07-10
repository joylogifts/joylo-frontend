// Components
import CustomButton from "@/lib/ui/useable-components/button";
import CustomPasswordTextField from "@/lib/ui/useable-components/password-input-field";

// Hooks
import { useAuth } from "@/lib/context/auth/auth.context";
import useToast from "@/lib/hooks/useToast";
import { useLangTranslation } from "@/lib/context/global/language.context";

// Interfaces
import { IEnterPasswordProps } from "@/lib/utils/interfaces";

export default function ChangePassword({
  handleFormChange,
  setFormData,
  formData,
}: IEnterPasswordProps) {
  // Hooks
  const { getTranslation } = useLangTranslation();
  const { handlePasswordReset, isLoading } =
    useAuth();
  const { showToast } = useToast();
  // Handlers
  const handleSubmit = async () => {
    if (!formData?.password || formData?.password?.length < 6) {
      return showToast({
        type: "error",
        title: getTranslation("toast_error"),
        message: getTranslation("please_enter_valid_password_message"),
      });
    }
    try {
      // update the password
      await handlePasswordReset(
        formData?.password || '',
        formData?.email || '',
        setFormData
      );
    } catch (error) {
      showToast({
        type: "error",
        title: getTranslation("toast_error"),
        message: getTranslation("failed_to_reset_password_message"),
      });
    }

  }
  return (
    <div className="flex flex-col items-start justify-between w-full h-full mt-4">
      <h1>{getTranslation("update_password_title")}</h1>
      <div className="flex flex-col gap-y-1 my-3 w-full">
        <CustomPasswordTextField
          value={formData?.password}
          showLabel={false}
          name="password"
          placeholder={getTranslation("password_label")}
          onChange={(e) => handleFormChange("password", e.target.value)}
        />

      </div>
      <CustomButton
        label={getTranslation("continue_label")}
        loading={isLoading}
        className={`bg-[#FFA500] flex items-center justify-center gap-x-4 px-3 rounded-full border border-gray-300 p-3 m-auto w-72`}
        onClick={handleSubmit}
      />
    </div>
  );
}
