// Expo
import { Drawer } from "expo-router/drawer";

// Components
import CustomDrawerContent from "@/lib/ui/screen-components/home/drawer/drawer-content";

// Icons
import {
  BikeRidingIcon,
  CardIcon,
  ClockIcon,
  HelpIcon,
  // UserIcon,
  HomeIcon,
  LanguageIcon,
} from "@/lib/ui/useable-components/svg";
import { Ionicons } from "@expo/vector-icons";

// Core
import { ColorSchemeName, TouchableOpacity } from "react-native";

// React Navigation
import { DrawerActions } from "@react-navigation/native";
// Hooks

import { AppTheme } from "@/lib/utils/interfaces/app-theme";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/lib/context/global/language.context";

const DrawerMain = ({
  currentTheme,
  appTheme,
}: {
  currentTheme: ColorSchemeName;
  appTheme: AppTheme;
}) => {
  const { getTranslation: t } = useLanguage();
  console.log("rendered drawer");

  return (
    <Drawer
      key={currentTheme}
      drawerContent={CustomDrawerContent}
      initialRouteName="orders"
      screenOptions={({ navigation }) => ({
        swipeEnabled: false,
        lazy: true,
        headerStyle: {
          backgroundColor: appTheme.themeBackground,
        },
        headerTitleStyle: { color: appTheme.mainTextColor },
        headerLeft: () => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.dispatch(DrawerActions.toggleDrawer());
              }}
              style={{ marginLeft: 16 }}
            >
              <Ionicons name="menu" size={24} color={appTheme.primary} />
            </TouchableOpacity>
          );
        },
        drawerHideStatusBarOnOpen: true,
        drawerActiveBackgroundColor: appTheme?.lowOpacityPrimaryColor,
        drawerActiveTintColor: appTheme?.mainTextColor,
        headerShadowVisible: false,
        headerTitleAlign: "center",
        drawerStatusBarAnimation: "slide",
        drawerItemStyle: {
          borderRadius: 0,
          // marginTop: 4,
        },
        drawerStyle: {
          backgroundColor: appTheme?.themeBackground,
          marginBottom: 45,
        },
      })}
    >
      <Drawer.Screen
        name="orders"
        options={{
          drawerLabel: t("home"),
          title: t("orders"),
          drawerIcon: ({ color, size }) => (
            <HomeIcon
              color={appTheme.iconColor ?? color}
              height={size}
              width={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="language"
        options={{
          drawerLabel: t("language"),
          title: t("language"),
          drawerIcon: ({ color, size }) => (
            <LanguageIcon
              color={appTheme.iconColor ?? color}
              height={size}
              width={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="vehicle-type"
        options={{
          drawerLabel: t("vehicle_type"),
          title: t("vehicle_type"),
          drawerIcon: ({ color, size }) => (
            <BikeRidingIcon
              color={appTheme.iconColor ?? color}
              height={size}
              width={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="work-schedule"
        options={{
          drawerLabel: t("work_schedule"),
          title: t("work_schedule"),
          drawerIcon: ({ color, size }) => (
            <ClockIcon
              color={appTheme.iconColor ?? color}
              height={size}
              width={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="bank-management"
        options={{
          drawerLabel: t("bank_management"),
          title: t("bank_management"),
          drawerIcon: ({ color, size }) => (
            <CardIcon
              color={appTheme.iconColor ?? color}
              height={size}
              width={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="help"
        options={{
          drawerLabel: t("help"),
          title: t("help"),
          drawerIcon: ({ color, size }) => (
            <HelpIcon
              color={appTheme.iconColor ?? color}
              height={size}
              width={size}
            />
          ),
        }}
      />
    </Drawer>
  );
};

export default memo(DrawerMain);
