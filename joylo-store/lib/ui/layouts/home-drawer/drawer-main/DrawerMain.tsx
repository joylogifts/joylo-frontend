import { useApptheme } from "@/lib/context/theme.context";
import { useLanguage } from "@/lib/context/global/language.context";
import CustomDrawerContent from "@/lib/ui/screen-components/home/drawer/drawer-content";
import {
  CardIcon,
  HelpIcon,
  HomeIcon,
  LanguageIcon,
} from "@/lib/ui/useable-components/svg";
import ScheduleIcon from "@/lib/ui/useable-components/svg/schedule";
import { Colors } from "@/lib/utils/constants";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { Drawer } from "expo-router/drawer";
import { TouchableOpacity } from "react-native";

export default function DrawerMain() {
  // Hooks
  const { appTheme } = useApptheme();
  const { getTranslation } = useLanguage();
  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      initialRouteName="orders"
      screenOptions={({ navigation }) => ({
        swipeEnabled: false,
        lazy: true,
        headerTintColor: appTheme.fontMainColor,
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
        drawerActiveBackgroundColor: Colors.light.lowOpacityPrimaryColor,
        drawerActiveTintColor: Colors.light.mainTextColor,
        headerShadowVisible: false,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: appTheme.screenBackground,
        },
        drawerStatusBarAnimation: "slide",
        drawerItemStyle: {
          borderRadius: 0,
          marginTop: 4,
        },
        drawerStyle: {
          marginBottom: 45,
        },
      })}
    >
      <Drawer.Screen
        name="orders"
        options={{
          drawerLabel: getTranslation("home"),
          title: getTranslation("orders"),
          drawerIcon: ({ color, size }) => (
            <HomeIcon color={color} height={size} width={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="work-schedule"
        options={{
          drawerLabel: getTranslation("work_schedule"),
          title: getTranslation("work_schedule"),
          drawerIcon: ({ color, size }) => (
            <ScheduleIcon color={color} height={size + 20} width={size + 20} />
          ),
        }}
      />
      <Drawer.Screen
        name="language"
        options={{
          drawerLabel: getTranslation("language"),
          title: getTranslation("language"),
          drawerIcon: ({ color, size }) => (
            <LanguageIcon color={color} height={size} width={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="bank-management"
        options={{
          drawerLabel: getTranslation("bank_management"),
          title: getTranslation("bank_management"),
          drawerIcon: ({ color, size }) => (
            <CardIcon color={color} height={size} width={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="help"
        options={{
          drawerLabel: getTranslation("help"),
          title: getTranslation("help"),
          drawerIcon: ({ color, size }) => (
            <HelpIcon color={color} height={size} width={size} />
          ),
        }}
      />
    </Drawer>
  );
}
