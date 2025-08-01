// Core
import { useEffect, useMemo, useState, useContext } from 'react';

// Prime React
import { Chart } from 'primereact/chart';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import { GET_DASHBOARD_RESTAURANT_SALES_ORDER_COUNT_DETAILS_BY_YEAR } from '@/lib/api/graphql';
import {
  IDashboardRestaurantSalesOrderCountDetailsByYearResponseGraphQL,
  IQueryResult,
} from '@/lib/utils/interfaces';
import DashboardUsersByYearStatsSkeleton from '@/lib/ui/useable-components/custom-skeletons/dasboard.user.year.stats.skeleton';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import { } from 'next-intl';
import { useLangTranslation } from '@/lib/context/global/language.context';

// Dummy

export default function GrowthOverView() {
  // Hooks

  const { getTranslation } = useLangTranslation();

  // Context
  const {
    restaurantLayoutContextData: { restaurantId },
  } = useContext(RestaurantLayoutContext);

  // States
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  // Query
  const { data, loading } = useQueryGQL(
    GET_DASHBOARD_RESTAURANT_SALES_ORDER_COUNT_DETAILS_BY_YEAR,
    {
      restaurant: restaurantId,
      year: new Date().getFullYear(),
    },
    {
      fetchPolicy: 'network-only',
      enabled: !!restaurantId,
      debounceMs: 300,
    }
  ) as IQueryResult<
    IDashboardRestaurantSalesOrderCountDetailsByYearResponseGraphQL | undefined,
    undefined
  >;

  const dashboardSalesOrderCountDetailsByYear = useMemo(() => {
    if (!data) return null;
    return {
      salesAmount:
        data?.getRestaurantDashboardSalesOrderCountDetailsByYear?.salesAmount ??
        [],
      ordersCount:
        data?.getRestaurantDashboardSalesOrderCountDetailsByYear?.ordersCount ??
        [],
    };
  }, [data]);

  // Handlers
  const onChartDataChange = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const data = {
      labels: [
        getTranslation('january'),
        getTranslation('february'),
        getTranslation('march'),
        getTranslation('april'),
        getTranslation('may'),
        getTranslation('june'),
        getTranslation('july'),
        getTranslation('august'),
        getTranslation('september'),
        getTranslation('october'),
        getTranslation('november'),
        getTranslation('december'),
      ],
      datasets: [
        {
          label: getTranslation('sales_amount'),
          data: dashboardSalesOrderCountDetailsByYear?.salesAmount ?? [],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          backgroundColor: documentStyle.getPropertyValue('--pink-100'),
          tension: 0.5,
        },
        {
          label: getTranslation('orders_count'),
          data: dashboardSalesOrderCountDetailsByYear?.ordersCount ?? [],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          backgroundColor: documentStyle.getPropertyValue('--blue-100'),
          tension: 0.5,
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,

      plugins: {
        legend: {
          marginBottom: '20px',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            backgroundColor: textColor,
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  };
  // Use Effect
  useEffect(() => {
    onChartDataChange();
  }, [dashboardSalesOrderCountDetailsByYear]);

  return (
    <div className={`w-full p-3`}>
      <h2 className="text-lg font-semibold">
        {getTranslation('growth_overview')}
      </h2>
      <p className="text-gray-500">
        {getTranslation('tracking_store_growth_over_the_year')}
      </p>
      <div className="mt-4">
        {loading ? (
          <DashboardUsersByYearStatsSkeleton />
        ) : (
          <Chart type="line" data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
}
