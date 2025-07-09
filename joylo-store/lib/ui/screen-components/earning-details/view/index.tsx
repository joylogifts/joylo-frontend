// Core
import { View } from "react-native";

// Interfaces
import {
  IEarningDetailsMainProps,
  IStoreEarnings,
  IStoreEarningsResponse,
} from "@/lib/utils/interfaces/rider-earnings.interface";

// Hooks
import { useLanguage } from "@/lib/context/global/language.context";
import { useUserContext } from "@/lib/context/global/user.context";
import { QueryResult, useQuery } from "@apollo/client";
import { useEffect, useMemo, useState } from "react";

// GraphQL
import { STORE_EARNINGS_GRAPH } from "@/lib/apollo/queries/earnings.query";

// Components
import EarningDetailsHeader from "../header";
import EarningsDetailStacks from "./earnings";

// Skeletons
import { EarningsSummaryMainLoading } from "@/lib/ui/skeletons";
import EarningDetailsDateFilter from "../date-filter";

// React Native Flash Message
import { showMessage } from "react-native-flash-message";

export default function EarningDetailsMain({
  dateFilter,
  setDateFilter,
}: IEarningDetailsMainProps) {
  // Hooks
  const { getTranslation } = useLanguage();

  // States
  const [isFiltering, setIsFiltering] = useState(false);
  const [isDateFilterVisible, setIsDateFilterVisible] = useState(false);
  const [storeEarnings, setStoreEarnings] = useState<IStoreEarnings[]>(
    [] as IStoreEarnings[],
  );

  // Contexts
  const { setModalVisible, userId } = useUserContext();

  // Queries
  const {
    loading: isStoreEarningsLoading,
    refetch: fetchStoreEarnings,
    data: storeEarningsGraphData,
  } = useQuery(STORE_EARNINGS_GRAPH, {
    onError: (err) => {
      console.error(err);
      showMessage({
        message:
          err.graphQLErrors[0].message ||
          err.networkError?.message ||
          "Failed to fetch earnings",
        type: "danger",
        duration: 1000,
      });
    },
    variables: {
      storeId: userId ?? "",
    },
  }) as QueryResult<
    IStoreEarningsResponse | undefined,
    {
      storeId: string;
      startDate?: string;
      endDate?: string;
    }
  >;

  // Handlers
  async function handleDateFilterSubmit() {
    setIsFiltering(true);
    // Validation
    if (!dateFilter.startDate) {
      setIsFiltering(false);
      return showMessage({
        message: getTranslation("please_select_a_start_date"),
        type: "danger",
        duration: 1000,
      });
    } else if (!dateFilter.endDate) {
      setIsFiltering(false);
      return showMessage({
        message: getTranslation("please_select_an_end_date"),
        type: "danger",
        duration: 1000,
      });
    } else if (new Date(dateFilter.startDate) > new Date(dateFilter.endDate)) {
      setIsFiltering(false);
      return showMessage({
        message: getTranslation("start_date_cannot_be_after_end_date"),
        type: "danger",
        duration: 1000,
      });
    }
    if (!userId) {
      setIsFiltering(false);
      return showMessage({
        message: getTranslation("please_log_in_to_view_your_earnings"),
        type: "danger",
        duration: 1000,
      });
    }

    // Fetch with filters
    await fetchStoreEarnings({
      storeId: userId,
      startDate: dateFilter.startDate,
      endDate: dateFilter.endDate,
      // page: pagination.page,
      // limit: pagination.limit,
    });

    setIsFiltering(false);
    setIsDateFilterVisible(false);
  }
  const sortedEarnings = useMemo(() => {
    if (!storeEarningsGraphData?.storeEarningsGraph?.earnings?.length)
      return [];
    return [...storeEarningsGraphData.storeEarningsGraph.earnings].sort(
      (a, b) =>
        new Date(String(a._id)).setHours(0, 0, 0, 0) -
        new Date(String(b._id)).setHours(23, 59, 59, 999),
    );
  }, [storeEarningsGraphData?.storeEarningsGraph.earnings]);
  useEffect(() => {
    if (sortedEarnings.length) {
      setStoreEarnings(sortedEarnings);
    }
  }, [sortedEarnings.length]);
  // If loading
  if (isStoreEarningsLoading || isFiltering)
    return <EarningsSummaryMainLoading />;
  return (
    <View>
      <EarningDetailsDateFilter
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        handleFilterSubmit={handleDateFilterSubmit}
        isFiltering={isStoreEarningsLoading || isFiltering}
        isDateFilterVisible={isDateFilterVisible}
        setIsDateFilterVisible={setIsDateFilterVisible}
        refetchDeafult={fetchStoreEarnings}
      />
      <EarningDetailsHeader />
      <EarningsDetailStacks
        setModalVisible={setModalVisible}
        userId={userId}
        storeEarnings={storeEarnings}
        isLoading={isStoreEarningsLoading}
      />
    </View>
  );
}
