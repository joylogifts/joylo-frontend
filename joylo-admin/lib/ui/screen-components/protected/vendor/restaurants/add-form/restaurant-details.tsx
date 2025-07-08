// Core
import { useContext, useMemo } from 'react';
import { Form, Formik } from 'formik';
import { ApolloCache, ApolloError, useMutation } from '@apollo/client';

// Icons
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

// Interfaces and Types
import {
  IAddRestaurantComponentProps,
  ICreateRestaurant,
  ICreateRestaurantResponse,
  IDropdownSelectItem,
  IQueryResult,
  IRestaurantsByOwnerResponseGraphQL,
  IRestaurantForm,
} from '@/lib/utils/interfaces';
import {
  ICuisine,
  IGetCuisinesData,
} from '@/lib/utils/interfaces/cuisine.interface';

// Components
import CustomButton from '@/lib/ui/useable-components/button';
import CustomDropdownComponent from '@/lib/ui/useable-components/custom-dropdown';
import CustomMultiSelectComponent from '@/lib/ui/useable-components/custom-multi-select';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomIconTextField from '@/lib/ui/useable-components/input-icon-field';
import CustomPasswordTextField from '@/lib/ui/useable-components/password-input-field';
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';
import CustomUploadImageComponent from '@/lib/ui/useable-components/upload/upload-image';

// Constants and Utils
import {
  MAX_LANSDCAPE_FILE_SIZE,
  MAX_SQUARE_FILE_SIZE,
  RestaurantErrors,
  SHOP_TYPE,
} from '@/lib/utils/constants';
import { onErrorMessageMatcher } from '@/lib/utils/methods/error';
import { toTextCase } from '@/lib/utils/methods';

// Schemas and GraphQL
import { RestaurantSchema } from '@/lib/utils/schema/restaurant';
import {
  CREATE_RESTAURANT,
  GET_CUISINES,
  GET_RESTAURANTS_BY_OWNER,
} from '@/lib/api/graphql';

// Contexts
import { ToastContext } from '@/lib/context/global/toast.context';
import { VendorLayoutRestaurantContext } from '@/lib/context/vendor/restaurant.context';

// Hooks
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import { useTranslations } from 'next-intl';
import CustomPhoneTextField from '@/lib/ui/useable-components/phone-input-field';
import { useLangTranslation } from '@/lib/context/global/language.context';
import { get } from 'lodash';

const initialValues: IRestaurantForm = {
  name: '',
  username: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  address: '',
  deliveryTime: 1,
  minOrder: 1,
  salesTax: 0.0,
  shopType: null,
  cuisines: [],
  image:
    'https://t4.ftcdn.net/jpg/04/76/57/27/240_F_476572792_zMwqHpmGal1fzh0tDJ3onkLo88IjgNbL.jpg',
  logo: 'https://res.cloudinary.com/dc6xw0lzg/image/upload/v1735894342/dvi5fjbsgdlrzwip0whg.jpg',
};

export default function RestaurantDetails({
  stepperProps,
}: IAddRestaurantComponentProps) {
  const { onStepChange, order } = stepperProps ?? {
    onStepChange: () => {},
    type: '',
    order: -1,
  };

  // Hooks
  const t = useTranslations();
  const { getTranslation, selectedLanguage } = useLangTranslation();

  // Context
  const { showToast } = useContext(ToastContext);
  const { vendorId, onSetRestaurantContextData } = useContext(
    VendorLayoutRestaurantContext
  );

  // Mutation
  const [createRestaurant] = useMutation(CREATE_RESTAURANT, {
    onError,
    onCompleted: ({
      createRestaurant,
    }: {
      createRestaurant?: ICreateRestaurant;
    }) => {
      showToast({
        type: 'success',
        title: getTranslation('new_store'),
        message: getTranslation(`store_has_been_added_successfully`),
        duration: 3000,
      });

      onSetRestaurantContextData({
        id: createRestaurant?._id ?? '',
      });

      onStepChange(order + 1);
    },
    update: update,
  });

  const cuisineResponse = useQueryGQL(GET_CUISINES, {
    debounceMs: 300,
  }) as IQueryResult<IGetCuisinesData | undefined, undefined>;
  cuisineResponse.data?.cuisines;

  // Memoized Constants
  const cuisinesDropdown = useMemo(
    () =>
      cuisineResponse.data?.cuisines?.map((cuisin: ICuisine) => {
        return {
          label: toTextCase(
            typeof cuisin.name === 'object'
              ? cuisin.name[selectedLanguage]
              : cuisin.name,
            'title'
          ),
          code: cuisin.name,
        };
      }),
    [cuisineResponse.data?.cuisines]
  );

  // Handlers
  const onCreateRestaurant = async (data: IRestaurantForm) => {
    try {
      if (!vendorId) {
        showToast({
          type: 'error',
          title: `${vendorId ? getTranslation('edit') : getTranslation('create')} ${getTranslation('vendor')}`,
          message: `${getTranslation('store_creation_failed_please_select_a_vendor')}.`,
          duration: 2500,
        });
        return;
      }

      console.log(
        data.cuisines
          .map((cuisin: IDropdownSelectItem) => cuisin.code)
          .map((cuisine) =>
            typeof cuisine === 'object' ? cuisine[selectedLanguage] : cuisine
          )
      );

      await createRestaurant({
        variables: {
          owner: vendorId,
          restaurant: {
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
            cuisines: data.cuisines
              .map((cuisin: IDropdownSelectItem) => cuisin.code)
              .map((cuisine) =>
                typeof cuisine === 'object'
                  ? cuisine[selectedLanguage]
                  : cuisine
              ),
          },
        },
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: `${vendorId ? getTranslation('edit') : getTranslation('create')} ${getTranslation('vendor')}`,
        message: getTranslation(`store_create_failed`),
        duration: 2500,
      });
    }
  };

  function onError({ graphQLErrors, networkError }: ApolloError) {
    showToast({
      type: 'error',
      title: getTranslation('create_store'),
      message:
        graphQLErrors[0]?.message ??
        networkError?.message ??
        getTranslation(`store_create_failed`),
      duration: 2500,
    });
  }
  function update(
    cache: ApolloCache<unknown>,
    data: ICreateRestaurantResponse
  ): void {
    if (!data) return;

    const cachedData: IRestaurantsByOwnerResponseGraphQL | null =
      cache.readQuery({
        query: GET_RESTAURANTS_BY_OWNER,
        variables: { id: vendorId },
      });

    const cachedRestaurants = cachedData?.restaurantByOwner?.restaurants ?? [];

    cache.writeQuery({
      query: GET_RESTAURANTS_BY_OWNER,
      variables: { id: vendorId },
      data: {
        restaurantByOwner: {
          ...cachedData?.restaurantByOwner,
          restaurants: [...(cachedRestaurants ?? []), createRestaurant],
        },
      },
    });
  }

  return (
    <div className="flex h-full w-full items-center justify-start">
      <div className="h-full w-full">
        <div className="flex flex-col gap-2">
          <div className="mb-2 flex flex-col">
            <span className="text-lg">{getTranslation('add_store')}</span>
          </div>

          <div>
            <Formik
              initialValues={initialValues}
              validationSchema={RestaurantSchema}
              onSubmit={async (values) => {
                await onCreateRestaurant(values);
              }}
              validateOnChange={false}
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
                    <div className="mb-2 space-y-3">
                      <div>
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
                              RestaurantErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>

                      <div>
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
                              RestaurantErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>

                      <div>
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
                              RestaurantErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>

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
                              RestaurantErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
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

                      <div>
                        <CustomTextField
                          placeholder={getTranslation('address')}
                          name="address"
                          type="text"
                          maxLength={100}
                          showLabel={true}
                          value={values.address ?? ''}
                          onChange={handleChange}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'address',
                              errors?.address,
                              RestaurantErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>

                      <div>
                        <CustomNumberField
                          suffix="m"
                          min={1}
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
                              RestaurantErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>

                      <div>
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
                              RestaurantErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
                      <div>
                        <CustomNumberField
                          prefix="%"
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
                              RestaurantErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
                      <div>
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
                              RestaurantErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>

                      <div>
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
                              RestaurantErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 p-4">
                        <CustomUploadImageComponent
                          key="logo"
                          name="logo"
                          title={getTranslation('upload_profile_image')}
                          onSetImageUrl={setFieldValue}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'logo',
                              errors?.logo as string,
                              RestaurantErrors
                            )
                              ? 'red'
                              : '',
                          }}
                          fileTypes={['image/webp', 'image/jpg', 'image/jpeg']}
                          maxFileHeight={1080}
                          maxFileWidth={1080}
                          maxFileSize={MAX_SQUARE_FILE_SIZE}
                          orientation="SQUARE"
                          existingImageUrl={values.logo}
                          showExistingImage={true}
                        />
                        <CustomUploadImageComponent
                          key={'image'}
                          name="image"
                          title={getTranslation('upload_image')}
                          onSetImageUrl={setFieldValue}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'image',
                              errors?.image as string,
                              RestaurantErrors
                            )
                              ? 'red'
                              : '',
                          }}
                          fileTypes={['image/webp', 'image/jpg', 'image/jpeg']}
                          maxFileHeight={841}
                          maxFileWidth={1980}
                          maxFileSize={MAX_LANSDCAPE_FILE_SIZE}
                          orientation="LANDSCAPE"
                          existingImageUrl={values.image}
                          showExistingImage={true}
                        />
                      </div>

                      <div className="mt-4 flex justify-end">
                        <CustomButton
                          className="h-10 w-fit border-gray-300 bg-black px-8 text-white"
                          label={getTranslation('add')}
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
    </div>
  );
}
