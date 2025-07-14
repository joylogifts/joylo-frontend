import { useLangTranslation } from "@/lib/context/global/language.context";
import { useAuth } from "@/lib/context/auth/auth.context";
import React from "react";

const LoginInForSavedAddresses = ({ handleModalToggle }) => {
    const { authToken } = useAuth();
    const { getTranslation } = useLangTranslation();
    return (
        <div>
            <button className="underline" onClick={handleModalToggle}>
                {!authToken
                    ? getTranslation("login_for_saved_address")
                    : getTranslation("view_saved_addresses")}
            </button>
        </div>
    );
};

export default LoginInForSavedAddresses;
