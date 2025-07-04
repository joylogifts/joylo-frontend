import { useApptheme } from "@/lib/context/theme.context";
import { useLanguage } from "@/lib/context/global/language.context";
import { HapticTab } from "@/lib/ui/useable-components/HapticTab";
import {
  CurrencyIcon,
  HomeIcon,
  PersonIcon,
  WalletIcon,
} from "@/lib/ui/useable-components/svg";
import { Tabs, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

const RootLayout = () => {
  const [tabKey, setTabKey] = useState(0);
  const pathName = usePathname();
  const { getTranslation } = useLanguage();
  const { appTheme } = useApptheme();

  useEffect(() => {
    setTabKey((prev) => prev + 1);
  }, [pathName]);

  return (
    <Tabs
      key={tabKey}
      screenOptions={{
        tabBarActiveTintColor: appTheme.primary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: appTheme.tabNaviatorBackground,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderTopWidth: 0.5,
            shadowColor: appTheme.black,
            shadowOffset: { width: 0, height: -5 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            zIndex: 0,
          },
          android: {
            position: "absolute",
            backgroundColor: appTheme.tabNaviatorBackground,
            display: pathName.startsWith("/wallet/success") ? "none" : "flex",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderTopWidth: 0.5,
            elevation: 5,
            shadowOffset: { width: 0, height: -5 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          href: "/(protected)/(tabs)/home/orders",
          title: getTranslation("home"),
          tabBarIcon: ({ color }) => (
            <HomeIcon
              color={color}
              width={25}
              height={25}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: getTranslation("wallet"),
          tabBarIcon: ({ color }) => (
            <WalletIcon
              color={color}
              width={25}
              height={25}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: getTranslation("earnings"),
          tabBarIcon: ({ color }) => (
            <CurrencyIcon
              color={color}
              width={25}
              height={25}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: true,
          headerTitle: getTranslation("profile"),
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: appTheme.themeBackground },
          headerTitleStyle: { color: appTheme.fontMainColor },
          title: getTranslation("profile"),
          tabBarIcon: ({ color }) => (
            <PersonIcon
              color={color}
              width={25}
              height={25}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default RootLayout;
