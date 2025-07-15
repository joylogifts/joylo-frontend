'use client';
// GraphQL
import { CREATE_COUPON, EDIT_COUPON, GET_COUPONS } from '@/lib/api/graphql';

// Contexts
import { ToastContext } from '@/lib/context/global/toast.context';

// Components
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';

// Interfaces
import { IAddCouponProps } from '@/lib/utils/interfaces/coupons.interface';

// Schema
import { CouponFormSchema } from '@/lib/utils/schema/coupon';

// Formik
import { Form, Formik } from 'formik';

// Prime react
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';

// Hooks
import { useMutation } from '@apollo/client';
import { ChangeEvent, useContext, useState } from 'react';
import CustomInputSwitch from '@/lib/ui/useable-components/custom-input-switch';
import { onErrorMessageMatcher } from '@/lib/utils/methods';
import { CouponErrors } from '@/lib/utils/constants';

import { useLangTranslation } from '@/lib/context/global/language.context';

export default function CouponForm({
  setVisible,
  isEditing,
  visible,
  setIsEditing,
}: IAddCouponProps) {
  // Hooks
  const { showToast } = useContext(ToastContext);
  const [endDateError, setEndDateError] = useState('');

  const { getTranslation } = useLangTranslation();

  // Initial values
  const initialValues = {
    _id: isEditing.bool ? isEditing?.data?._id : '',
    title: isEditing.bool ? isEditing?.data?.title : '',
    discount: isEditing.bool ? isEditing?.data?.discount : 0,
    enabled: isEditing.bool ? isEditing?.data?.enabled : true,
    endDate: isEditing.bool ? isEditing?.data?.endDate : '',
    lifeTimeActive: isEditing.bool ? isEditing?.data?.lifeTimeActive : false,
  };

  // Mutations
  const [CreateCoupon, { loading: createCouponLoading }] = useMutation(
    CREATE_COUPON,
    {
      refetchQueries: [{ query: GET_COUPONS }],
      onCompleted: () => {
        showToast({
          title: `${isEditing.bool ? getTranslation('edit') : getTranslation('new')} ${getTranslation('coupon')}`,
          type: 'success',
          message: getTranslation('coupon_has_been_added_successfully'),
          duration: 2000,
        });
        setIsEditing({
          bool: false,
          data: {
            __typename: '',
            _id: '',
            discount: 0,
            enabled: false,
            title: '',
            endDate: '',
            lifeTimeActive: false,
          },
        });
        setEndDateError('');
      },
      onError: (err) => {
        showToast({
          title: `${isEditing.bool ? getTranslation('edit') : getTranslation('new')} ${getTranslation('coupon')}`,
          type: 'error',
          message:
            err.message ||
            `${getTranslation('coupon')} ${isEditing.bool ? getTranslation('edition') : getTranslation('creation')} ${getTranslation('failed')}`,
          duration: 2000,
        });
        setIsEditing({
          bool: false,
          data: {
            __typename: '',
            _id: '',
            discount: 0,
            enabled: false,
            title: '',
            endDate: '',
            lifeTimeActive: false,
          },
        });
        setEndDateError('');
      },
    }
  );
  const [editCoupon, { loading: editCouponLoading }] = useMutation(
    EDIT_COUPON,
    {
      refetchQueries: [{ query: GET_COUPONS }],
      onCompleted: () => {
        showToast({
          title: `${isEditing.bool ? getTranslation('edit') : getTranslation('new')} ${getTranslation('coupon')}`,
          type: 'success',
          message: `${getTranslation('coupon_has_been')} ${isEditing.bool ? getTranslation('edited') : getTranslation('added')}  ${getTranslation('successfully')}`,
          duration: 2000,
        });
        setIsEditing({
          bool: false,
          data: {
            __typename: '',
            _id: '',
            discount: 0,
            enabled: false,
            title: '',
            endDate: '',
            lifeTimeActive: false,
          },
        });
        setEndDateError('');
      },
      onError: (err) => {
        showToast({
          title: `${isEditing.bool ? getTranslation('edit') : getTranslation('new')} ${getTranslation('coupon')}`,
          type: 'error',
          message:
            err.message ||
            `${getTranslation('coupon')} ${isEditing.bool ? getTranslation('edition') : getTranslation('creation')} ${getTranslation('failed')}`,
          duration: 2000,
        });
        setIsEditing({
          bool: false,
          data: {
            __typename: '',
            _id: '',
            discount: 0,
            enabled: false,
            title: '',
            endDate: '',
            lifeTimeActive: false,
          },
        });
        setEndDateError('');
      },
    }
  );

  return (
    <Sidebar
      visible={visible}
      onHide={() => {
        setVisible(false);
      }}
      position="right"
      className="w-full sm:w-[450px]"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={CouponFormSchema}
        onSubmit={async (values, { setSubmitting }) => {
          if (!values.lifeTimeActive && !values.endDate) {
            setEndDateError('End Date is required');
            return;
          }
          setSubmitting(true);
          let formData;
          if (!isEditing.bool) {
            formData = {
              title: values.title,
              discount: values.discount,
              enabled: values.enabled,
              endDate: values.endDate,
              lifeTimeActive: values.lifeTimeActive,
            };
          } else {
            formData = {
              _id: values._id,
              title: values.title,
              discount: values.discount,
              enabled: values.enabled,
              endDate: values.endDate,
              lifeTimeActive: values.lifeTimeActive,
            };
          }

          if (!isEditing.bool) {
            await CreateCoupon({
              variables: {
                couponInput: formData,
              },
            });
          } else {
            await editCoupon({
              variables: {
                couponInput: formData,
              },
            });
          }
          setIsEditing({
            bool: false,
            data: {
              __typename: '',
              _id: '',
              discount: 0,
              enabled: true,
              title: '',
              endDate: '',
              lifeTimeActive: false,
            },
          });
          setVisible(false);
          setEndDateError('');
          setSubmitting(false);
        }}
        validateOnChange={true}
      >
        {({ errors, handleSubmit, values, isSubmitting, setFieldValue }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <h2 className='className="mb-3 text-xl font-bold'>
                    {isEditing.bool
                      ? getTranslation('edit')
                      : getTranslation('add')}{' '}
                    {getTranslation('coupon')}
                  </h2>
                  <div className="flex items-center gap-x-1">
                    {values.enabled
                      ? getTranslation('enabled')
                      : getTranslation('disabled')}
                    <CustomInputSwitch
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setFieldValue('enabled', e.target.checked)
                      }
                      isActive={values.enabled}
                      className={values.enabled ? 'p-inputswitch-checked' : ''}
                    />
                  </div>
                </div>
                <CustomTextField
                  value={values.title}
                  name="title"
                  showLabel={true}
                  placeholder={getTranslation('title')}
                  type="text"
                  onChange={(e) => setFieldValue('title', e.target.value)}
                  style={{
                    borderColor: onErrorMessageMatcher(
                      'title',
                      errors?.title,
                      CouponErrors
                    )
                      ? 'red'
                      : '',
                  }}
                />

                <CustomNumberField
                  value={values.discount}
                  name="discount"
                  minFractionDigits={0}
                  maxFractionDigits={2}
                  showLabel={true}
                  suffix="%"
                  placeholder={getTranslation('discount')}
                  onChange={setFieldValue}
                  min={0}
                  max={100}
                  style={{
                    borderColor: onErrorMessageMatcher(
                      'discount',
                      errors?.discount,
                      CouponErrors
                    )
                      ? 'red'
                      : '',
                  }}
                />

                <CustomInputSwitch
                  label={getTranslation('lifetime_active')}
                  isActive={values.lifeTimeActive}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFieldValue('lifeTimeActive', e.target.checked)
                  }
                />

                {!values.lifeTimeActive && (
                  <CustomTextField
                    value={values.endDate ? values.endDate : ''}
                    name="endDate"
                    showLabel={true}
                    type="date"
                    placeholder={getTranslation('end_date')}
                    onChange={(e) => setFieldValue('endDate', e.target.value)}
                    style={{
                      borderColor: endDateError ? 'red' : '',
                    }}
                  />
                )}

                <button
                  className="float-end h-10 w-fit rounded-md border-gray-300 bg-black px-8 text-white"
                  disabled={
                    isSubmitting || editCouponLoading || createCouponLoading
                  }
                  type="submit"
                >
                  {isSubmitting || editCouponLoading || createCouponLoading ? (
                    <ProgressSpinner
                      className="m-0 h-6 w-6 items-center self-center p-0"
                      strokeWidth="5"
                      style={{ fill: 'white', accentColor: 'white' }}
                      color="white"
                    />
                  ) : isEditing.bool ? (
                    getTranslation('update')
                  ) : (
                    getTranslation('add')
                  )}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Sidebar>
  );
}
