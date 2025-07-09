import { useLanguage } from "@/lib/context/global/language.context";
import { useUserContext } from "@/lib/context/global/user.context";
import { useApptheme } from "@/lib/context/theme.context";
import EarningBottomBar from "@/lib/ui/screen-components/earnings/view/bottom-bar";
import { Stack, usePathname } from "expo-router";

export default function StackLayout() {
  // Hooks
  const { getTranslation } = useLanguage();
  const { appTheme } = useApptheme();
  const { modalVisible, setModalVisible } = useUserContext();
  const pathname = usePathname();
  return (
    <>
      <Stack
        screenOptions={{
          headerTitle:
            pathname.startsWith("/earnings/earnings-detail") ?
              getTranslation("earnings_summary")
            : pathname.startsWith("/earnings/earnings-order-details") ?
              getTranslation("deliveries")
            : getTranslation("earnings"),
          headerBackTitle: getTranslation("earnings"),
          headerTitleAlign: "center",
          headerTintColor: appTheme.fontMainColor,
          headerTitleStyle: { color: appTheme.fontMainColor },
          headerStyle: { backgroundColor: appTheme.themeBackground },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: true,
            headerTitle: getTranslation("earnings"),
          }}
        />
        <Stack.Screen
          name="(routes)"
          options={{
            headerShown: true,
            headerTitle: getTranslation("earnings_order_details"),
            headerBackTitle: getTranslation("earnings"),
          }}
        />
      </Stack>
      <EarningBottomBar
        totalDeliveries={modalVisible.totalDeliveries}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        totalEarnings={modalVisible?.totalEarningsSum ?? 0}
      />
    </>
  );
}
