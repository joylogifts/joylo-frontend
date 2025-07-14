import { useLanguage } from "@/lib/context/global/language.context";
import { useApptheme } from "@/lib/context/theme.context";
import { Tabs } from "expo-router";
import { Platform, Pressable, Text, View } from "react-native";

export default function Layout() {
  // Hooks
  const { appTheme } = useApptheme();
  const { getTranslation } = useLanguage();
  return (
    <Tabs
      screenOptions={{
        tabBarIcon: () => null,
        tabBarActiveTintColor: appTheme.primary,
        headerShown: false,
        tabBarIconStyle: {
          display: "none",
        },
        tabBarLabel: ({ children, focused }) => (
          <View
            className="w-full"
            style={{
              alignItems: "center",
              borderBottomWidth: focused ? 2 : 0,
              borderBottomColor: focused ? appTheme.primary : "transparent",
              paddingBottom: 8,
            }}
          >
            <Text
              style={{
                color: focused
                  ? appTheme.fontMainColor
                  : appTheme.fontSecondColor,
                fontWeight: 500,
                fontSize: 14,
                fontFamily: "Inter",
              }}
            >
              {children}
            </Text>
          </View>
        ),

        tabBarButton: (props) => {
          return (
            <Pressable
              {...props}
              android_ripple={{ color: "transparent" }}
              style={({ pressed }) => [
                props.style,
                { opacity: pressed ? 1 : 1 },
              ]}
            />
          );
        },
        tabBarPosition: "bottom",
        tabBarItemStyle: {
          height: 40,
          backgroundColor: "transparent",
        },

        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            top: 0,
            height: 30,
            backgroundColor: appTheme.themeBackground,
            shadowColor: appTheme.themeBackground,
            shadowOpacity: 0,
            paddingTop: 20,
          },
          android: {
            position: "absolute",
            top: 0,
            height: 50,
            backgroundColor: appTheme.themeBackground,
            shadowColor: appTheme.themeBackground,
            shadowOpacity: 0,
            paddingTop: 20,
            elevation: 0,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title:
              getTranslation("new_orders").length > 13
              ? getTranslation("new_orders").substring(0, 13).concat("..")
              : getTranslation("new_orders"),
        }}
      />
      <Tabs.Screen
        name="processing"
        options={{
          title:
            getTranslation("processing").length > 13
              ? getTranslation("processing").substring(0, 13).concat("..")
              : getTranslation("processing"),
        }}
      />
      <Tabs.Screen
        name="delivered"
        options={{
          title:
            getTranslation("delivered").length > 13
              ? getTranslation("delivered").substring(0, 13).concat("..")
              : getTranslation("delivered"),
        }}
      />
    </Tabs>
  );
}
