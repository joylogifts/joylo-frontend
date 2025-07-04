import { UPDATE_AVAILABILITY } from "@/lib/apollo/mutations/rider.mutation";
import { STORE_PROFILE } from "@/lib/apollo/queries";
import { useLanguage } from "@/lib/context/global/language.context";
import { useUserContext } from "@/lib/context/global/user.context";
import { useApptheme } from "@/lib/context/theme.context";
import SpinnerComponent from "@/lib/ui/useable-components/spinner";
import CustomSwitch from "@/lib/ui/useable-components/switch-button";
import { IStoreProfile } from "@/lib/utils/interfaces";
import { MutationTuple, useMutation } from "@apollo/client";
import { Image, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";

const CustomDrawerHeader = () => {
  // Hooks
  const { appTheme } = useApptheme();
  const { getTranslation } = useLanguage();
  const { dataProfile, userId } = useUserContext();

  // Queries
  const [toggleAvailablity, { loading }] = useMutation(UPDATE_AVAILABILITY, {
    refetchQueries: [
      { query: STORE_PROFILE, variables: { restaurantId: userId } },
    ],
    onError: (error) => {
      showMessage({
        message:
          error?.graphQLErrors[0]?.message ||
          error?.networkError?.message ||
          error?.networkError?.message ||
          getTranslation("unable_to_update_availability"),
      });
    },
  }) as MutationTuple<IStoreProfile | undefined, { restaurantId: string }>;

  // Handlers
  async function handleToggleAvailability() {
    try {
      await toggleAvailablity({ variables: { restaurantId: userId ?? "" } });
    } catch (error) {
      console.error("error whilte toggling availabibility", error);
    }
  }

  return (
    <View
      className="w-full -mt-0 h-[150px] flex-row justify-between p-4 pt-8"
      style={{ backgroundColor: appTheme.primary, marginTop: 1 }}
    >
      <View className="justify-between">
        <View
          className="w-[54px] h-[54px] rounded-full items-center justify-center overflow-hidden"
          style={{ backgroundColor: appTheme.white }}
        >
          {dataProfile?.logo ? (
            <Image
              source={{ uri: dataProfile.logo }}
              width={100}
              height={100}
              resizeMode="cover"
            />
          ) : (
            <Text
              className="text-[16px] font-semibold"
              style={{
                color: appTheme.primary,
              }}
            >
              {(() => {
                const name = dataProfile?.name;
                if (!name || typeof name !== "string") return "JS";

                const nameParts = name.split(" ");
                const firstInitial =
                  nameParts[0]?.substring(0, 1)?.toUpperCase() || "";
                const secondInitial =
                  nameParts[1]?.substring(0, 1)?.toUpperCase() || "";

                return firstInitial + secondInitial || "JS";
              })()}
            </Text>
          )}
        </View>
        <View>
          <Text
            className="font-semibold text-[16px]"
            style={{
              color: appTheme.black,
            }}
          >
            {dataProfile?.name ?? getTranslation("store_name")}
          </Text>
          <Text
            className="font-medium"
            style={{
              color: appTheme.secondaryTextColor,
            }}
          >
            {dataProfile?._id?.substring(0, 9)?.toUpperCase() ?? getTranslation("store_id")}
          </Text>
        </View>
      </View>

      <View className="items-end justify-end gap-2">
        <Text
          className="text-md"
          style={{ color: appTheme.secondaryTextColor }}
        >
          {getTranslation("availability")}
        </Text>
        {loading ? (
          <SpinnerComponent color={appTheme.secondaryTextColor} height={10} />
        ) : (
          <CustomSwitch
            value={!!dataProfile?.isAvailable}
            isDisabled={loading}
            onToggle={handleToggleAvailability}
          />
        )}
        <Text
          className="text-xs font-medium"
          style={{ color: appTheme.secondaryTextColor }}
        >
          {dataProfile?.isAvailable
            ? getTranslation("available")
            : getTranslation("not_available")}
        </Text>
      </View>
    </View>
  );
};

export default CustomDrawerHeader;
