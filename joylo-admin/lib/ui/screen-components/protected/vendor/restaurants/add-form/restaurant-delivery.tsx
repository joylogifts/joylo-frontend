// Core
import { Form, Formik } from 'formik';
import { useContext } from 'react';

// Interface and Types
import {
  ICreateRestaurantResponse,
  IRestaurantDeliveryForm,
  IRestaurantsByOwnerResponseGraphQL,
  IRestaurantsRestaurantDeliveryComponentProps,
} from '@/lib/utils/interfaces';

// Core
import { VendorLayoutRestaurantContext } from '@/lib/context/vendor/restaurant.context';
import { VendorLayoutContext } from '@/lib/context/vendor/layout-vendor.context';

// Component
import CustomButton from '@/lib/ui/useable-components/button';
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';

// Constants
import { RestaurantDeliveryErrors } from '@/lib/utils/constants';

// Context
import { ToastContext } from '@/lib/context/global/toast.context';

// Schema
import { DeliverySchema } from '@/lib/utils/schema/delivery';

// Methods
import { onErrorMessageMatcher } from '@/lib/utils/methods/error';

// GraphQL
import {
  GET_RESTAURANTS_BY_OWNER,
  UPDATE_RESTAURANT_DELIVERY,
} from '@/lib/api/graphql';
import { ApolloCache, ApolloError, useMutation } from '@apollo/client';
import CustomGoogleMapsLocationBoundsVendorLayoutRestaurant from '@/lib/ui/useable-components/google-maps/location-bounds-restaurant(vendor-layout)';
import { GoogleMapsContext } from '@/lib/context/global/google-maps.context';

import { useLangTranslation } from '@/lib/context/global/language.context';

const initialValues: IRestaurantDeliveryForm = {
  minDeliveryFee: null,
  deliveryDistance: null,
  deliveryFee: null,
};

export default function RestaurantDelivery({
  stepperProps,
}: IRestaurantsRestaurantDeliveryComponentProps) {
  const { onStepChange, order } = stepperProps ?? {
    onStepChange: () => { },
    type: '',
    order: -1,
  };

  // Hooks

  const { getTranslation } = useLangTranslation();

  // Context
  const { isLoaded } = useContext(GoogleMapsContext);
  const { showToast } = useContext(ToastContext);
  const { vendorLayoutContextData } = useContext(VendorLayoutContext);
  let vendorId = vendorLayoutContextData.vendorId;
  const { restaurantContextData } = useContext(VendorLayoutRestaurantContext);
  const restaurantId = restaurantContextData?.id || '';

  // API
  // Mutation
  const [createRestaurant] = useMutation(UPDATE_RESTAURANT_DELIVERY, {
    onError,
    onCompleted: () => {
      showToast({
        type: 'success',
        title: getTranslation('store_delivery_info'),
        message: getTranslation(
          `store_delivery_info_has_been_updated_successfull`
        ),
        duration: 3000,
      });

      onStepChange(order + 1);
    },
    update: update,
  });

  // Handlers
  const onCreateDelivery = async (data: IRestaurantDeliveryForm) => {
    try {
      await createRestaurant({
        variables: {
          id: restaurantId,
          minDeliveryFee: data.minDeliveryFee,
          deliveryDistance: data.deliveryDistance,
          deliveryFee: data.deliveryFee,
        },
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: getTranslation(`failed_to_add_store_delivery_info`),
        message: getTranslation(`store_create_failed`),
        duration: 2500,
      });
    }
  };

  function onError({ graphQLErrors, networkError }: ApolloError) {
    showToast({
      type: 'error',
      title: getTranslation('store_delivery_info'),
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
            <span className="text-lg">{getTranslation('store_delivery')}</span>
          </div>

          <div>
            <Formik
              initialValues={initialValues}
              validationSchema={DeliverySchema}
              onSubmit={async (values) => {
                await onCreateDelivery(values);
              }}
              validateOnChange={false}
            >
              {({
                values,
                errors,
                handleSubmit,
                isSubmitting,
                setFieldValue,
              }) => {
                return (
                  <Form onSubmit={handleSubmit}>
                    <div className="mb-2 space-y-3">
                      <div>
                        <CustomNumberField
                          min={1}
                          max={99999}
                          placeholder={getTranslation('min_delivery_fee')}
                          name="minDeliveryFee"
                          useGrouping={false}
                          showLabel={true}
                          value={values.minDeliveryFee}
                          onChange={setFieldValue}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'minDeliveryFee',
                              errors?.minDeliveryFee,
                              RestaurantDeliveryErrors
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
                          placeholder={getTranslation(
                            'delivery_distance_in_kms'
                          )}
                          name="deliveryDistance"
                          showLabel={true}
                          useGrouping={false}
                          value={values.deliveryDistance}
                          onChange={setFieldValue}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'deliveryDistance',
                              errors?.deliveryDistance,
                              RestaurantDeliveryErrors
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
                          placeholder={getTranslation(
                            'delivery_fee_per_kms_when_delivery_distance_exceeded'
                          )}
                          name="deliveryFee"
                          showLabel={true}
                          value={values.deliveryFee}
                          useGrouping={false}
                          onChange={setFieldValue}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'deliveryFee',
                              errors?.deliveryFee,
                              RestaurantDeliveryErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>

                      <div className="mt-3">
                        {isLoaded && (
                          <CustomGoogleMapsLocationBoundsVendorLayoutRestaurant
                            hideControls
                            height="400px"
                          />
                        )}
                      </div>

                      <div className="flex justify-end">
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
