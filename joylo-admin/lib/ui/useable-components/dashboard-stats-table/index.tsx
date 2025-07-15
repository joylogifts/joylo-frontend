import React from 'react';
import { IDashboardStatsTableComponentsProps } from '@/lib/utils/interfaces';
import DashboardStatsTableSkeleton from '../custom-skeletons/dashboard.stats.table.skeleton';
import {
  formatNumber,
  formatNumberWithCurrency,
} from '@/lib/utils/methods/currency';

import { useLangTranslation } from '@/lib/context/global/language.context';

export default function DashboardStatsTable({
  loading,
  title,
  data,
  amountConfig,
}: IDashboardStatsTableComponentsProps) {

  const { getTranslation } = useLangTranslation();

  if (loading) return <DashboardStatsTableSkeleton />;

  return (
    <div className="w-full mx-auto">
      <div className="bg-white shadow-md rounded-lg border border-gray-300">
        <div className="flex justify-between items-center bg-gray-100 p-4 rounded-t-lg">
          <h2 className="text-lg font-bold text-gray-800">
            {getTranslation(title.toLowerCase().split(' ').join('_'))}
          </h2>
          <i className="fas fa-arrow-down text-primary-color"></i>
        </div>
        <div className="p-4 max-h-40 overflow-y-auto ">
          {data.map((item, index: number) => (
            <div
              key={index}
              className={`flex justify-between py-2 ${index !== data.length - 1 ? 'border-b border-gray-300' : ''}`}
            >
              <span className="text-gray-800">
                {getTranslation(item.label.toLowerCase().split(' ').join('_'))}
              </span>
              <span className="text-gray-800">
                {amountConfig
                  ? amountConfig?.format === 'currency'
                    ? formatNumberWithCurrency(
                      item.value,
                      amountConfig.currency
                    )
                    : formatNumber(item.value)
                  : item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
