// Core
import { useContext, useState } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';

// Prime React
import { Sidebar } from 'primereact/sidebar';

// Interface and Types
import { ICouponRestaurantForm } from '@/lib/utils/interfaces/forms/coupon-restaurant.form.interface';
import { ICouponRestaurantAddFormComponentProps } from '@/lib/utils/interfaces/coupons-restaurant.interface';

// Components
import CustomButton from '@/lib/ui/useable-components/button';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';
import Toggle from '@/lib/ui/useable-components/toggle';

// Context
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';

// Utilities and Constants
import { CouponRestaurantFormSchema } from '@/lib/utils/schema';

//Toast
import useToast from '@/lib/hooks/useToast';

//GraphQL
import { useMutation } from '@apollo/client';
import {
  CREATE_RESTAURANT_COUPON,
  EDIT_RESTAURANT_COUPON,
} from '@/lib/api/graphql/mutations/coupons-restaurant';
import { GET_RESTAURANT_COUPONS } from '@/lib/api/graphql/queries/coupons-restaurant';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { useLangTranslation } from '@/lib/context/global/language.context';

export default function CouponsAddForm({
  onHide,
  coupon,
  position = 'right',
  isAddCouponVisible,
}: ICouponRestaurantAddFormComponentProps) {
  // Context
  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const restaurantId = restaurantLayoutContextData?.restaurantId || '';

  // State
  const initialValues: ICouponRestaurantForm = {
    title: '',
    discount: null,
    enabled: true,
    lifeTimeActive: false,
    endDate: '',
    ...coupon,
  };
  const [endDateError, setEndDateError] = useState('');

  // Hooks
  const t = useTranslations();
  const { getTranslation } = useLangTranslation();
  const { showToast } = useToast();

  // Mutation
  const mutation = coupon ? EDIT_RESTAURANT_COUPON : CREATE_RESTAURANT_COUPON;
  const [mutate, { loading: mutationLoading }] = useMutation(mutation, {
    refetchQueries: [
      { query: GET_RESTAURANT_COUPONS, variables: { restaurantId } },
    ],
  });

  // Form Submission
  const handleSubmit = (
    values: ICouponRestaurantForm,
    { resetForm }: FormikHelpers<ICouponRestaurantForm>
  ) => {
    if (!values.lifeTimeActive && !values.endDate) {
      setEndDateError(
        getTranslation('end_date_is_required_when_lifetime_is_not_active')
      );
      return;
    }
    mutate({
      variables: {
        restaurantId: restaurantId,
        couponInput: {
          _id: coupon ? coupon._id : '',
          title: values.title,
          discount: values.discount,
          enabled: values.enabled,
          lifeTimeActive: values.lifeTimeActive,
          endDate: values.lifeTimeActive ? '' : values.endDate,
        },
      },
      onCompleted: () => {
        showToast({
          type: 'success',
          title: getTranslation('success'),
          message: coupon
            ? getTranslation('coupon_updated')
            : getTranslation('coupon_added'),
          duration: 3000,
        });
        resetForm();
        onHide();
        setEndDateError(''); // reset error on success
      },
      onError: (error) => {
        let message = '';
        try {
          message = error.graphQLErrors[0]?.message;
        } catch (err) {
          message = getTranslation('action_failed_try_again');
        }
        showToast({
          type: 'error',
          title: getTranslation('error'),
          message,
          duration: 3000,
        });
        setEndDateError(''); // reset error on error
      },
    });
  };

  return (
    <Sidebar
      visible={isAddCouponVisible}
      position={position}
      onHide={onHide}
      className="w-full sm:w-[600px]"
    >
      <div className="flex h-full w-full items-center justify-start">
        <div className="h-full w-full">
          <div className="flex flex-col gap-2">
            <div className="mb-2 flex flex-col">
              <span className="text-lg">
                {coupon ? getTranslation('edit') : getTranslation('add')}{' '}
                {getTranslation('coupon')}
              </span>
            </div>

            <div>
              <Formik
                initialValues={initialValues}
                validationSchema={CouponRestaurantFormSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleSubmit,
                  setFieldValue,
                }) => {
                  return (
                    <Form onSubmit={handleSubmit}>
                      <div className="space-y-4 flex flex-col">
                        <CustomTextField
                          type="text"
                          name="title"
                          placeholder={getTranslation('title')}
                          maxLength={35}
                          value={values.title}
                          onChange={handleChange}
                          showLabel={true}
                          style={{
                            borderColor:
                              errors.title && touched.title ? 'red' : '',
                          }}
                        />

                        <CustomNumberField
                          min={0}
                          placeholder={getTranslation('discount')}
                          minFractionDigits={0}
                          maxFractionDigits={2}
                          name="discount"
                          showLabel={true}
                          value={values.discount}
                          useGrouping={false}
                          onChange={setFieldValue}
                          style={{
                            borderColor:
                              errors.discount && touched.discount ? 'red' : '',
                          }}
                        />

                        <Toggle
                          checked={values.enabled}
                          onClick={() => {
                            setFieldValue('enabled', !values.enabled);
                          }}
                          showLabel
                          placeholder={getTranslation('status')}
                        />

                        <Toggle
                          checked={values.lifeTimeActive}
                          onClick={() => {
                            setFieldValue(
                              'lifeTimeActive',
                              !values.lifeTimeActive
                            );
                            if (!values.lifeTimeActive) {
                              setFieldValue('endDate', '');
                              setEndDateError('');
                            }
                          }}
                          showLabel
                          placeholder={getTranslation('lifetime_active')}
                        />

                        {!values.lifeTimeActive && (
                          <CustomTextField
                            type="date"
                            name="endDate"
                            placeholder={getTranslation('end_date')}
                            value={values.endDate}
                            onChange={(e) => {
                              setFieldValue('endDate', e.target.value);
                              setEndDateError(''); // reset on change
                            }}
                            showLabel={true}
                            style={{
                              borderColor: endDateError ? 'red' : '',
                            }}
                          />
                        )}
                        {endDateError && (
                          <span className="text-red-500 text-sm -mt-2">
                            {endDateError}
                          </span>
                        )}

                        <CustomButton
                          className="h-10 ml-auto  w-fit border-gray-300 bg-black px-8 text-white"
                          label={
                            coupon
                              ? getTranslation('update')
                              : getTranslation('add')
                          }
                          type="submit"
                          loading={mutationLoading}
                        />
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
