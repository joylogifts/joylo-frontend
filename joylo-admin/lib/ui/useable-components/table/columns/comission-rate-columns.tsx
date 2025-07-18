// Core
import React from 'react';
import { Form, Formik } from 'formik';

// Custom Components
import CustomCommissionTextField from '../../custom-commission-input';
import CustomButton from '../../button';

// Interfaces and Types
import {
  ICommissionColumnProps,
  IRestaurantResponse,
} from '@/lib/utils/interfaces';

import { useLangTranslation } from '@/lib/context/global/language.context';

export const COMMISSION_RATE_COLUMNS = ({
  handleSave,
  handleCommissionRateChange,
  loadingRestaurant,
}: ICommissionColumnProps & { loadingRestaurant: string | null }) => {
  // Hooks

  const { getTranslation } = useLangTranslation();
  return [
    {
      headerName: getTranslation('name'),
      propertyName: 'name',
      body: (restaurant: IRestaurantResponse) => (
        <span style={{ fontWeight: 'bold' }}>{restaurant.name}</span>
      ),
    },
    {
      headerName: getTranslation('set_commission_rate'),
      propertyName: 'commissionRate',
      body: (restaurant: IRestaurantResponse) => (
        <Formik
          initialValues={{
            [`commissionRate-${restaurant._id}`]: restaurant.commissionRate,
          }}
          onSubmit={() => {
            handleSave(restaurant._id);
          }}
        >
          {({ values, handleChange, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div className="flex">
                <CustomCommissionTextField
                  type="number"
                  name={`commissionRate-${restaurant._id}`}
                  value={String(values[`commissionRate-${restaurant._id}`])}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleChange(e);
                    handleCommissionRateChange(
                      restaurant._id,
                      parseFloat(e.target.value)
                    );
                  }}
                  min={0}
                  max={100}
                  showLabel={false}
                  loading={false}
                />
              </div>
            </Form>
          )}
        </Formik>
      ),
    },
    {
      headerName: getTranslation('actions'),
      propertyName: 'action',
      body: (restaurant: IRestaurantResponse) => (
        <Formik initialValues={{}} onSubmit={() => handleSave(restaurant._id)}>
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <CustomButton
                type="submit"
                className="mt-2 flex h-10 w-24 rounded-md border border-gray-500 bg-white px-4 text-black transition-colors duration-200 hover:bg-black hover:text-white"
                label={getTranslation('save')}
                rounded={false}
                loading={loadingRestaurant === restaurant._id || isSubmitting}
                disabled={loadingRestaurant === restaurant._id || isSubmitting}
              />
            </Form>
          )}
        </Formik>
      ),
    },
  ];
};
