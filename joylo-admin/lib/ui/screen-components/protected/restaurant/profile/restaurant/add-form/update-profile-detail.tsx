import React, { useContext, useMemo } from 'react';
import { Form, Formik } from 'formik';
import { useMutation } from '@apollo/client';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

import { ProfileContext } from '@/lib/context/restaurant/profile.context';
import { ToastContext } from '@/lib/context/global/toast.context';

import CustomButton from '@/lib/ui/useable-components/button';
import CustomDropdownComponent from '@/lib/ui/useable-components/custom-dropdown';
import CustomMultiSelectComponent from '@/lib/ui/useable-components/custom-multi-select';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomIconTextField from '@/lib/ui/useable-components/input-icon-field';
import CustomPasswordTextField from '@/lib/ui/useable-components/password-input-field';
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';
import CustomUploadImageComponent from '@/lib/ui/useable-components/upload/upload-image';

import {
  MAX_LANSDCAPE_FILE_SIZE,
  MAX_SQUARE_FILE_SIZE,
  ProfileErrors,
  RestaurantErrors,
  SHOP_TYPE,
} from '@/lib/utils/constants';
import { RestaurantSchema } from '@/lib/utils/schema/restaurant';
import { EDIT_RESTAURANT, GET_CUISINES } from '@/lib/api/graphql';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import { onErrorMessageMatcher, toTextCase } from '@/lib/utils/methods';

import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';

import {
  IUpdateProfileProps,
  IUpdateProfileForm,
  IQueryResult,
} from '@/lib/utils/interfaces';

import {
  ICuisine,
  IGetCuisinesData,
} from '@/lib/utils/interfaces/cuisine.interface';

import CustomPhoneTextField from '@/lib/ui/useable-components/phone-input-field';
import { useLangTranslation } from '@/lib/context/global/language.context';

export default function UpdateRestaurantDetails({
  stepperProps,
}: IUpdateProfileProps) {
  const { onStepChange, order } = stepperProps ?? {
    onStepChange: () => { },
    order: -1,
  };

  // Hooks

  const { getTranslation } = useLangTranslation();

  // Contexts
  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const { restaurantId } = restaurantLayoutContextData;

  const { showToast } = useContext(ToastContext);
  const { restaurantProfileResponse, refetchRestaurantProfile } =
    useContext(ProfileContext);

  const [editRestaurant] = useMutation(EDIT_RESTAURANT, {
    onError: ({ graphQLErrors, networkError }) => {
      showToast({
        type: 'error',
        title: getTranslation('edit_store'),
        message:
          graphQLErrors[0]?.message ??
          networkError?.message ??
          getTranslation('store_edit_failed'),
        duration: 2500,
      });
    },
    onCompleted: async () => {
      showToast({
        type: 'success',
        title: getTranslation('store_details_saved'),
        message: getTranslation('store_has_been_updated_successfully'),
        duration: 3000,
      });

      await refetchRestaurantProfile();

      onStepChange(order + 1);
    },
  });

  const cuisineResponse = useQueryGQL(GET_CUISINES, {
    debounceMs: 300,
  }) as IQueryResult<IGetCuisinesData | undefined, undefined>;

  const cuisinesDropdown = useMemo(
    () =>
      cuisineResponse.data?.cuisines?.map((cuisine: ICuisine) => ({
        label: toTextCase(cuisine.name, 'title'),
        code: cuisine.name,
      })),
    [cuisineResponse.data?.cuisines]
  );

  const initialValues: IUpdateProfileForm = useMemo(() => {
    const restaurantData = restaurantProfileResponse.data?.restaurant;
    return {
      name: restaurantData?.name ?? '',
      username: restaurantData?.username ?? '',
      password: restaurantData?.password ?? '',
      confirmPassword: restaurantData?.password ?? '',
      phoneNumber: restaurantData?.phone ?? '',
      address: restaurantData?.address ?? '',
      deliveryTime: restaurantData?.deliveryTime ?? 0,
      minOrder: restaurantData?.minimumOrder ?? 0,
      salesTax: restaurantData?.tax ?? 0,
      shopType:
        SHOP_TYPE.find((type) => type.code === restaurantData?.shopType) ??
        null,
      cuisines: Array.isArray(restaurantData?.cuisines)
        ? restaurantData.cuisines.map((cuisine) => ({
          label: toTextCase(cuisine, 'title'),
          code: cuisine,
        }))
        : [],
      image: restaurantData?.image ?? '',
      logo: restaurantData?.logo ?? '',
      email: restaurantData?.username ?? '',
      orderprefix: restaurantData?.orderPrefix ?? '',
    };
  }, [restaurantProfileResponse.data?.restaurant]);

  const onEditRestaurant = async (data: IUpdateProfileForm) => {
    if (!restaurantId) {
      showToast({
        type: 'error',
        title: getTranslation('edit_store'),
        message: getTranslation('store_edit_failed_please_select_a_vendor'),
        duration: 2500,
      });
      return;
    }

    try {
      await editRestaurant({
        variables: {
          restaurantInput: {
            _id: restaurantId,
            name: data.name,
            phone: data.phoneNumber,
            address: data.address,
            image: data.image,
            logo: data.logo,
            deliveryTime: data.deliveryTime,
            minimumOrder: data.minOrder,
            username: data.username,
            password: data.password,
            shopType: data.shopType?.code,
            salesTax: data.salesTax,
            orderPrefix: data.orderprefix,
            cuisines: data.cuisines.map((cuisine) => cuisine.code),
          },
        },
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: getTranslation('store_details'),
        message: getTranslation('something_went_wrong_please_try_again'),
      });
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-start">
      <div className="h-full w-full">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col mb-2">
            <span className="text-lg">{getTranslation('update_profile')}</span>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={RestaurantSchema}
            onSubmit={(values) => {
              return onEditRestaurant(values);
            }}
            validateOnChange={false}
            enableReinitialize
          >
            {({
              values,
              errors,
              handleChange,
              handleSubmit,
              isSubmitting,
              setFieldValue,
            }) => {
              return (
                <Form onSubmit={handleSubmit}>
                  <div className="space-y-3 mb-2">
                    <CustomIconTextField
                      type="email"
                      name="username"
                      placeholder={getTranslation('email')}
                      maxLength={35}
                      showLabel={true}
                      iconProperties={{
                        icon: faEnvelope,
                        position: 'right',
                        style: { marginTop: '1px' },
                      }}
                      value={values.username}
                      onChange={handleChange}
                      style={{
                        borderColor: onErrorMessageMatcher(
                          'username',
                          errors?.username,
                          ProfileErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />

                    <CustomPasswordTextField
                      placeholder={getTranslation('password')}
                      name="password"
                      maxLength={20}
                      value={values.password}
                      showLabel={true}
                      onChange={handleChange}
                      style={{
                        borderColor: onErrorMessageMatcher(
                          'password',
                          errors?.password,
                          ProfileErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />

                    <div>
                      <CustomPasswordTextField
                        placeholder={getTranslation('confirm_password')}
                        name="confirmPassword"
                        maxLength={20}
                        showLabel={true}
                        value={values.confirmPassword ?? ''}
                        onChange={handleChange}
                        feedback={false}
                        style={{
                          borderColor: onErrorMessageMatcher(
                            'confirmPassword',
                            errors?.confirmPassword,
                            ProfileErrors
                          )
                            ? 'red'
                            : '',
                        }}
                      />
                    </div>

                    <CustomTextField
                      type="text"
                      name="name"
                      placeholder={getTranslation('name')}
                      maxLength={35}
                      value={values.name}
                      onChange={handleChange}
                      showLabel={true}
                      style={{
                        borderColor: onErrorMessageMatcher(
                          'name',
                          errors?.name,
                          ProfileErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />
                    <div>
                      <label className="mb-[4px] text-[14px] font-medium text-[#09090B]">
                        {getTranslation('phone')}
                      </label>
                      <CustomPhoneTextField
                        mask="999-999-9999"
                        name="phoneNumber"
                        showLabel={true}
                        // placeholder="Phone Number"
                        onChange={(e) => {
                          // console.log("phone number format ==> ", e, code);
                          setFieldValue('phoneNumber', e);
                          // setCountryCode(code);
                        }}
                        value={values.phoneNumber}
                        // value={values.phoneNumber?.toString().match(/\(\+(\d+)\)\s(.+)/)?.[2]}
                        type="text"
                        className="rounded-[6px] border-[#D1D5DB]"
                        style={{
                          borderColor: onErrorMessageMatcher(
                            'phoneNumber',
                            errors?.phoneNumber,
                            RestaurantErrors
                          )
                            ? 'red'
                            : '',
                        }}
                      />
                    </div>

                    <CustomTextField
                      placeholder={getTranslation('address')}
                      name="address"
                      type="text"
                      maxLength={100}
                      showLabel={true}
                      value={values.address}
                      onChange={handleChange}
                      style={{
                        borderColor: onErrorMessageMatcher(
                          'address',
                          errors?.address,
                          ProfileErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />

                    <CustomNumberField
                      suffix=" m"
                      min={0}
                      max={500}
                      placeholder={getTranslation('delivery_time')}
                      name="deliveryTime"
                      showLabel={true}
                      value={values.deliveryTime}
                      onChange={setFieldValue}
                      style={{
                        borderColor: onErrorMessageMatcher(
                          'deliveryTime',
                          errors?.deliveryTime,
                          ProfileErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />

                    <CustomNumberField
                      min={1}
                      max={99999}
                      placeholder={getTranslation('min_order')}
                      name="minOrder"
                      showLabel={true}
                      value={values.minOrder}
                      onChange={setFieldValue}
                      style={{
                        borderColor: onErrorMessageMatcher(
                          'minOrder',
                          errors?.minOrder,
                          ProfileErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />

                    <CustomNumberField
                      suffix=" %"
                      min={0}
                      max={100}
                      placeholder={getTranslation('service_charges')}
                      minFractionDigits={2}
                      maxFractionDigits={2}
                      name="salesTax"
                      showLabel={true}
                      value={values.salesTax}
                      onChange={setFieldValue}
                      style={{
                        borderColor: onErrorMessageMatcher(
                          'salesTax',
                          errors?.salesTax,
                          ProfileErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />

                    <CustomTextField
                      placeholder={getTranslation('order_prefix')}
                      name="orderprefix"
                      type="text"
                      maxLength={100}
                      showLabel={true}
                      value={values.orderprefix}
                      onChange={handleChange}
                      style={{
                        borderColor: onErrorMessageMatcher(
                          'orderprefix',
                          errors?.orderprefix,
                          ProfileErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />

                    <CustomDropdownComponent
                      name="shopType"
                      placeholder={getTranslation('shop_category')}
                      selectedItem={values.shopType}
                      setSelectedItem={setFieldValue}
                      options={SHOP_TYPE}
                      showLabel={true}
                      style={{
                        borderColor: onErrorMessageMatcher(
                          'shopType',
                          errors?.shopType,
                          ProfileErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />

                    <CustomMultiSelectComponent
                      name="cuisines"
                      placeholder={getTranslation('cuisines')}
                      options={cuisinesDropdown ?? []}
                      selectedItems={values.cuisines}
                      setSelectedItems={setFieldValue}
                      showLabel={true}
                      style={{
                        borderColor: onErrorMessageMatcher(
                          'cuisines',
                          errors?.cuisines as string,
                          ProfileErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />

                    <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 p-4">
                      <CustomUploadImageComponent
                        key="logo"
                        name="logo"
                        title={getTranslation('upload_profile_image')}
                        fileTypes={['image/jpg', 'image/webp', 'image/jpeg']}
                        maxFileHeight={1080}
                        maxFileWidth={1080}
                        maxFileSize={MAX_SQUARE_FILE_SIZE}
                        orientation="SQUARE"
                        onSetImageUrl={setFieldValue}
                        existingImageUrl={values.logo}
                        showExistingImage={true}
                        style={{
                          borderColor: onErrorMessageMatcher(
                            'logo',
                            errors?.logo as string,
                            ProfileErrors
                          )
                            ? 'red'
                            : '',
                        }}
                      />
                      <CustomUploadImageComponent
                        key="image"
                        name="image"
                        title={getTranslation('upload_image')}
                        fileTypes={['image/jpg', 'image/webp', 'image/jpeg']}
                        maxFileHeight={841}
                        maxFileWidth={1980}
                        maxFileSize={MAX_LANSDCAPE_FILE_SIZE}
                        orientation="LANDSCAPE"
                        onSetImageUrl={setFieldValue}
                        existingImageUrl={values.image}
                        showExistingImage={true}
                        style={{
                          borderColor: onErrorMessageMatcher(
                            'image',
                            errors?.image as string,
                            ProfileErrors
                          )
                            ? 'red'
                            : '',
                        }}
                      />
                    </div>

                    <div className="flex justify-end mt-4">
                      <CustomButton
                        className="w-fit h-10 bg-black text-white border-gray-300 px-8"
                        label={getTranslation('update')}
                        type="submit"
                        loading={isSubmitting}
                      />
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
}
