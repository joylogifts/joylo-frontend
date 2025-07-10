// Components
import { useAuth } from "@/lib/context/auth/auth.context";
import CustomButton from "@/lib/ui/useable-components/button";
import Divider from "@/lib/ui/useable-components/custom-divider";
import CustomIconButton from "@/lib/ui/useable-components/custom-icon-button";
import { ILoginWithGoogleProps } from "@/lib/utils/interfaces";

// Assets
import GoogleLogo from "@/public/assets/images/svgs/google-logo";

// Hooks
import { useLangTranslation } from "@/lib/context/global/language.context";

// Next
import Link from "next/link";

// Font Awesome

export default function LoginWithGoogle({
  googleLogin,
  handleChangePanel,
}: ILoginWithGoogleProps) {
  // Hooks
  const { getTranslation } = useLangTranslation();
  const { isLoading } = useAuth();

  return (
    <div>
      <div className="flex flex-col gap-y-2  left-0">
        <h3 className="font-medium text-2xl text-black">{getTranslation("welcome_label")}!</h3>
        <p className="font-normal">{getTranslation("sign_up_or_log_in_to_continue_message")}</p>
      </div>
      <div className="my-4">
        <CustomIconButton
          loading={isLoading}
          SvgIcon={GoogleLogo}
          title={getTranslation("sign_in_with_google_label")}
          handleClick={googleLogin}
        />
      </div>

      <div className="flex items-center justify-between w-full">
        <Divider color="border-gray-200" />
        <span className="mx-1">{getTranslation("or_label")}</span>
        <Divider color="border-gray-200" />
      </div>
      <div className="my-4">
        <CustomButton
          label={getTranslation("login_label")}
          className={`bg-[#FFA500] flex items-center justify-center gap-x-4 px-3 rounded-full border border-gray-300 p-3 m-auto w-72`}
          onClick={() => handleChangePanel(1)}
        />
      </div>
      <div className="my-4">
        <CustomButton
          label={getTranslation("sign_up_label")}
          className="bg-white flex items-center justify-center gap-x-4 px-3 rounded-full border border-gray-300 p-3 m-auto w-72"
          onClick={() => handleChangePanel(2)}
        />
      </div>
      <p>
        {getTranslation("by_signing_up_you_agree_to_our_message")} &nbsp;
        <span className="font-bold ">
          <Link href="/app/(localized)/(restaurant-store)/restaurant">
            {getTranslation("terms_label")}
          </Link>
        </span>{" "}
        &nbsp;
        {getTranslation("and_conditions_and_message")} &nbsp;
        <span className="font-bold ">
          <Link href="/app/(localized)/(restaurant-store)/restaurant">
            {getTranslation("privacy_policy_label")}
          </Link>
        </span>
        .
      </p>
    </div>
  );
}
