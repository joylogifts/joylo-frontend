// GraphQL
import { STORE_EARNINGS_GRAPH } from "@/lib/apollo/queries/earnings.query";

// Hooks
import { useLanguage } from "@/lib/context/global/language.context";
import { useUserContext } from "@/lib/context/global/user.context";
import { QueryResult, useQuery } from "@apollo/client";

// Components
import SpinnerComponent from "@/lib/ui/useable-components/spinner";

// Interfacs
import { IStoreEarningsResponse } from "@/lib/utils/interfaces/rider-earnings.interface";

// Core
import { useApptheme } from "@/lib/context/theme.context";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function EarningDetailsHeader() {
  // States
  const [storeEarningsGrandTotal, setStoreEarningsGrandTotal] = useState({
    earnings: 0,
    totalDeliveries: 0,
  });

  // Hooks
  const { appTheme } = useApptheme();
  const { getTranslation } = useLanguage();
  const { userId } = useUserContext();

  // Queries
  const { loading: isRiderEarningsLoading, data: riderEarningsData } = useQuery(
    STORE_EARNINGS_GRAPH,
    {
      variables: {
        storeId: userId ?? "",
      },
    },
  ) as QueryResult<IStoreEarningsResponse | undefined, { storeId: string }>;

  useEffect(() => {
    if (riderEarningsData?.storeEarningsGraph?.earnings?.length) {
      const totalEarnings =
        riderEarningsData?.storeEarningsGraph?.earnings?.reduce(
          (acc, curr) => acc + curr.totalEarningsSum,
          0,
        );
      const totalDeliveries =
        riderEarningsData?.storeEarningsGraph.earnings.reduce(
          (acc, curr) => acc + curr.earningsArray.length,
          0,
        );
      setStoreEarningsGrandTotal({
        earnings: totalEarnings,
        totalDeliveries: totalDeliveries,
      });
    }
  }, []);

  if (isRiderEarningsLoading) return <SpinnerComponent />;
  return (
    <View
      style={{
        backgroundColor: appTheme.themeBackground,
        borderColor: appTheme.borderLineColor,
        borderWidth: 1,
        paddingVertical: 12,
      }}
    >
      <Text
        className="left-5 text-xl font-semibold"
        style={{ color: appTheme.fontMainColor }}
      >
        {getTranslation("summary").length > 15
          ? getTranslation("summary").substring(0, 15)
          : getTranslation("summary")}
      </Text>
      <View className="flex flex-row justify-between items-center p-5">
        <View className="flex gap-2 items-center">
          <Text className="text-lg" style={{ color: appTheme.fontMainColor }}>
            {getTranslation("total_earnings").length > 15
              ? getTranslation("total_earnings")
              : getTranslation("total_earnings")}
          </Text>
          <Text
            className="font-semibold text-lg text-start self-start"
            style={{ color: appTheme.fontMainColor }}
          >
            ${Number(storeEarningsGrandTotal.earnings).toFixed(2)}
          </Text>
        </View>
        <View
          className="flex gap-2 items-center pl-3"
          style={{
            borderLeftWidth: 2,
            borderLeftColor: appTheme.borderLineColor,
          }}
        >
          <Text className="text-lg" style={{ color: appTheme.fontMainColor }}>
            {getTranslation("total_deliveries").length > 15
              ? getTranslation("total_deliveries")
              : getTranslation("total_deliveries")}
          </Text>
          <Text
            className="font-semibold text-lg text-start self-start"
            style={{ color: appTheme.fontMainColor }}
          >
            {storeEarningsGrandTotal.totalDeliveries}
          </Text>
        </View>
      </View>
    </View>
  );
}
