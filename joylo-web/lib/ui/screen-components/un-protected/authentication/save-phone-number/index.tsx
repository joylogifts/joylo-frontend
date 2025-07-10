// Components
import CustomPhoneTextField from "@/lib/ui/useable-components/phone-input-field";

// Icons
import PhoneIcon from "@/lib/utils/assets/svg/phone";

// Hooks
import { useAuth } from "@/lib/context/auth/auth.context";
import useToast from "@/lib/hooks/useToast";
import useUser from "@/lib/hooks/useUser";
import CustomButton from "@/lib/ui/useable-components/button";
import { useLangTranslation } from "@/lib/context/global/language.context";

export default function SavePhoneNumber() {

  // Hooks
  const { getTranslation } = useLangTranslation();
  const { sendOtpToPhoneNumber, setUser, user, isLoading } = useAuth();
  const {profile}=useUser();
  const { showToast } = useToast();

  // Handlers
  const handleChange = (val:string) => {
    setUser((prev) => ({
      ...prev,
      phone: val,
    }))
  }
  const handleSubmit = async () => {
    try {
      if(!user?.phone) {
        showToast({
          type: "error",
          title: getTranslation("toast_error"),
          message: getTranslation("please_enter_valid_phone_number_message"),
        });
        return;
      }else if(profile?.phoneIsVerified){
        showToast({
          type: "info",
          title: getTranslation("phone_verification_label"),
          message: getTranslation("your_phone_number_already_verified_message"),
        });
        return;
      }else{
        await sendOtpToPhoneNumber(user?.phone)
      }
    } catch (error) {
      console.log(error);
      showToast({
        type: "error",
        title: getTranslation("toast_error"),
        message: getTranslation("error_occurred_while_saving_phone_number_message"),
      });
    }
  };
  return (
    <div className="flex flex-col justify-between p-3 items-start w-[100%] ">
      <div className="self-start my-1">
        <PhoneIcon />
      </div>
      <h2 className="font-bold text-xl my-1">
        {getTranslation("whats_your_mobile_number_label")}
      </h2>
      <p className="my-1">
        {getTranslation("we_need_this_to_verify_and_secure_your_account_message")}
      </p>
      <div className="flex my-1">
        <CustomPhoneTextField
          mask="999 999 999 999"
          name="phone"
          showLabel={false}
          type="text"
          className="min-w-[22vw]"
          value={user?.phone}
          onChange={handleChange}
        />
      </div>
      <CustomButton
        className={`bg-[#FFA500] flex items-center justify-center gap-x-4 px-3 rounded-full border border-gray-300 p-3 m-auto w-72 my-1`}
        onClick={handleSubmit}
        loading={isLoading}
        label={getTranslation("continue_label")}
      />
    </div>
  );
}
