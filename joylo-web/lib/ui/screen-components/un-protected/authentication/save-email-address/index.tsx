// Components
import CustomButton from "@/lib/ui/useable-components/button";
import CustomTextField from "@/lib/ui/useable-components/input-field";

// Interfaces
import { ISaveEmailAddressProps } from "@/lib/utils/interfaces";

// Icons
import EmailIcon from "@/public/assets/images/svgs/email";

// Hooks
import { useAuth } from "@/lib/context/auth/auth.context";
import useToast from "@/lib/hooks/useToast";
import useUser from "@/lib/hooks/useUser";
import { useLangTranslation } from "@/lib/context/global/language.context";

export default function SaveEmailAddress({
  handleChangePanel,
}: ISaveEmailAddressProps) {
  // Hooks
  const { getTranslation } = useLangTranslation();
  const {showToast} = useToast();
  const { setUser, user, sendOtpToEmailAddress, setIsAuthModalVisible, isLoading} = useAuth();
  const {profile} = useUser();

  // Handlers
  const handleSubmit = async () => {
    try {
      if (!user?.email) {
        showToast({
          type: "error",
          title: getTranslation("toast_error"),
          message: getTranslation("please_enter_valid_email_address_message"),
        });
        return;
      }
      if (!profile?.emailIsVerified) {
        await sendOtpToEmailAddress(user?.email);
        handleChangePanel(3);
        return;
      } else{
        showToast({
          type:"info",
          title: getTranslation("email_verification_label"),
          message:getTranslation("your_email_already_verified_message")
        })
        if(profile?.phoneIsVerified){
          handleChangePanel(0);
          setIsAuthModalVisible(false)
          showToast({
            type: "success",
            title: getTranslation("login_label"),
            message: getTranslation("login_success_message"),
          });
        }else{
          handleChangePanel(4);
        }
        
      }
    } catch (error) {
      console.error('An error occurred while saving email address:', error);
    }
  }
  const handleChange = (email: string) => {
    setUser((prev) => ({
      ...prev,
      email,
    }));
  };
  return (
    <div className="flex flex-col items-start justify-between w-full h-full">
      <EmailIcon />
      <div className="flex flex-col w-full h-auto self-start left-2 my-2">
        <h3 className="text-2xl">
          {getTranslation("please_enter_your_email_address_label")}? 
        </h3>
        <span className="font-bold">{getTranslation("example_email_label")}</span>
      </div>
      <div className="flex flex-col gap-y-1 my-6 w-full">
        <CustomTextField
          value={user?.email}
          showLabel={false}
          name=""
          type="text"
          placeholder={getTranslation("email_label")}
          onChange={(e) => handleChange(e.target.value)}
        />
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
