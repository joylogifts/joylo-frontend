import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
// UI
import CustomTab from "@/lib/ui/useable-components/custom-tab";
import Spinner from "@/lib/ui/useable-components/spinner";
// Constants
import { NO_ORDER_PROMPT, ORDER_DISPATCH_TYPE } from "@/lib/utils/constants";

// Interface
import { IOrderTabsComponentProps } from "@/lib/utils/interfaces";
import { IOrder } from "@/lib/utils/interfaces/order.interface";

// Hook
import { useApptheme } from "@/lib/context/theme.context";
import useOrders from "@/lib/hooks/useOrders";
import Order from "@/lib/ui/useable-components/order";
import { WalletIcon } from "@/lib/ui/useable-components/svg";
import { ORDER_TYPE } from "@/lib/utils/types";
import { useLanguage } from "@/lib/context/global/language.context";

const { height } = Dimensions.get("window");

function HomeDeliveredOrdersMain(props: IOrderTabsComponentProps) {
  // Props
  const { route } = props;

  // Hooks
  const { getTranslation } = useLanguage();
  const { appTheme } = useApptheme();
  const {
    loading,
    error,
    data,
    processingOrders,
    refetch,
    currentTab,
    setCurrentTab,
  } = useOrders();

  // const { loading: mutateLoading } = useAcceptOrder();

  // States
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState<IOrder[]>([]);

  // Handlers
  const onInitOrders = () => {
    if (loading || error) return;
    if (!data) return;

    const _orders = processingOrders?.filter((order) =>
      currentTab === ORDER_DISPATCH_TYPE[0]
        ? !order?.isPickedUp
        : order?.isPickedUp,
    );
    setOrders(_orders ?? []);
  };

  const onRefresh = () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  };

  // Use Effect
  useEffect(() => {
    onInitOrders();
  }, [data?.restaurantOrders, route.key, currentTab]);

  useEffect(() => {
    // Trigger refetch when orders length changes
    if (orders?.length === 0) {
      refetch();
    }
  }, [orders?.length]);

  // Calculate the marginBottom dynamically
  const marginBottom = Platform.OS === "ios" ? height * 0.4 : height * 0.35;

  return (
    <View
      className="pt-14 flex-1 items-center pb-16"
      style={[style.container, { backgroundColor: appTheme.themeBackground }]}
    >
      <CustomTab
        options={ORDER_DISPATCH_TYPE}
        selectedTab={currentTab}
        setSelectedTab={setCurrentTab}
        deliveryCount={
          processingOrders?.filter((o) => !o.isPickedUp).length ?? 0
        }
        pickupCount={
          processingOrders?.filter((o) => !!o.isPickedUp).length ?? 0
        }
      />

      {loading ? (
        <View className="flex-1">
          <Spinner />
        </View>
      ) : orders?.length > 0 ? (
        <FlatList
          className={`w-full h-[${height}px] mb-[${marginBottom}px]`}
          keyExtractor={(item) => item._id}
          data={orders}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item }: { item: IOrder }) => (
            <Order tab={route.key as ORDER_TYPE} order={item} key={item._id} />
          )}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  minHeight:
                    height > 670
                      ? height - height * 0.5
                      : height - height * 0.6,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <WalletIcon
                  height={100}
                  width={100}
                  color={appTheme.fontMainColor}
                />
                {orders?.length === 0 ? (
                  <Text
                    style={{
                      color: appTheme.fontSecondColor,
                      fontSize: 18,
                      fontWeight: "500",
                      fontFamily: "Inter",
                    }}
                  >
                    {getTranslation(NO_ORDER_PROMPT[route.key])}
                  </Text>
                ) : (
                  <Text style={{ color: appTheme.fontMainColor }}>
                    {getTranslation("pull_down_to_refresh")}
                  </Text>
                )}
              </View>
            );
          }}
        />
      ) : (
        <View
          style={{
            minHeight:
              height > 670 ? height - height * 0.5 : height - height * 0.6,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <WalletIcon height={100} width={100} color={appTheme.fontMainColor} />
          {orders?.length === 0 ? (
            <Text
              style={{
                color: appTheme.fontSecondColor,
                fontSize: 18,
                fontWeight: "500",
                fontFamily: "Inter",
              }}
            >
              {getTranslation(NO_ORDER_PROMPT[route.key])}
            </Text>
          ) : (
            <Text style={{ color: appTheme.fontMainColor }}>
              {getTranslation("pull_down_to_refresh")}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

export default HomeDeliveredOrdersMain;

const style = StyleSheet.create({
  container: {
    paddingBottom: Platform.OS === "android" ? 50 : 80,
  },
});
