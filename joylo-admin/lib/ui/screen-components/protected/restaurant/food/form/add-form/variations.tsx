// Core
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FieldArray, Form, Formik, FormikErrors, FormikProps } from 'formik';
import { Fieldset } from 'primereact/fieldset';
import React, { useContext } from 'react';

// Context
import { FoodsContext } from '@/lib/context/restaurant/foods.context';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';

// Interface and Types
import {
  IFoodNew,
  IFoodVariationsAddRestaurantComponentProps,
  IVariationForm,
} from '@/lib/utils/interfaces';

// Constants and Methods
import { MAX_PRICE, MIN_PRICE, VariationErrors } from '@/lib/utils/constants';
import { onErrorMessageMatcher } from '@/lib/utils/methods';
import { VariationSchema } from '@/lib/utils/schema';

// Components
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';
import CustomButton from '@/lib/ui/useable-components/button';

// Context
import { ToastContext } from '@/lib/context/global/toast.context';

// API
import {
  CREATE_FOOD,
  EDIT_FOOD,
  GET_PENDING_PRODUCTS,
} from '@/lib/api/graphql';

// Icons
import { faAdd, faTimes } from '@fortawesome/free-solid-svg-icons';

// Apollo
import { useMutation } from '@apollo/client';
import { useSearchParams } from 'next/navigation';

import { useLangTranslation } from '@/lib/context/global/language.context';

const initialFormValuesTemplate: IVariationForm = {
  title: '',
  price: 0,
  discounted: 0,
  isOutOfStock: false,
};

export default function VariationAddForm({
  stepperProps,
}: IFoodVariationsAddRestaurantComponentProps) {
  // Props
  const { onStepChange, order } = stepperProps ?? {
    onStepChange: () => { },
    type: '',
    order: -1,
  };
  // Hooks

  const searchParams = useSearchParams();
  const activeTab = searchParams.get('activeTab') || 'approved';

  const { getTranslation, selectedLanguage } = useLangTranslation();

  // Context
  const { showToast } = useContext(ToastContext);
  const { onSetFoodContextData, foodContextData, onClearFoodData } =
    useContext(FoodsContext);
  const {
    restaurantLayoutContextData: { restaurantId },
  } = useContext(RestaurantLayoutContext);

  // Constants
  const initialValues = {
    variations:
      foodContextData?.isEditing ||
        (foodContextData?.food?.variations ?? [])?.length > 0
        ? (foodContextData?.food?.variations ?? [])
        : [
          {
            ...initialFormValuesTemplate,
          },
        ],
  };

  // Query
/*   const { data, loading } = useQueryGQL(
    GET_ADDONS_BY_RESTAURANT_ID,
    { id: restaurantId },
    {
      fetchPolicy: 'network-only',
      enabled: !!restaurantId,
      onCompleted: onFetchAddonsByRestaurantCompleted,
      onError: onErrorFetchAddonsByRestaurant,
    }
  ) as IQueryResult<IAddonByRestaurantResponse | undefined, undefined>; */

  const [createFood] = useMutation(
    foodContextData?.isEditing ? EDIT_FOOD : CREATE_FOOD,
    {
      refetchQueries: [
        {
          query: GET_PENDING_PRODUCTS,
          variables: { 
            filter : { 
              storeId : restaurantId , status : activeTab 
            } , 
            pagination : { pageNo : 1 , pageSize : 10 } },
        },
      ],
      onCompleted: () => {
        showToast({
          type: 'success',
          title: `${foodContextData?.isEditing ? getTranslation('edit') : getTranslation('new')} ${getTranslation('food')}`,
          message: `${getTranslation('food_has_been')} ${foodContextData?.isEditing ? getTranslation('edited') : getTranslation('added')} ${getTranslation('successfully')}.`,
        });

        onClearFoodData();
      },
      onError: (error) => {
        let message = '';
        try {
          message = error.graphQLErrors[0]?.message;
        } catch (err) {
          message = getTranslation('something_went_wrong');
        }
        showToast({
          type: 'error',
          title: getTranslation('new_food'),
          message,
        });
      },
    }
  );

  // Memoized Data
/*   const addonsDropdown = useMemo(
    () =>
      data?.restaurant?.addons.map((addon: IAddon) => {
        return {
          label:
            typeof addon.title === 'object'
              ? addon.title[selectedLanguage] || ''
              : addon.title || '',
          code: addon._id,
        };
      }),
    [data?.restaurant?.addons]
  ); */

  // API Handlers
  // function onFetchAddonsByRestaurantCompleted() {}
  // function onErrorFetchAddonsByRestaurant() {
  //   showToast({
  //     type: 'error',
  //     title: t('Addons Fetch'),
  //     message: t('Addons fetch failed'),
  //     duration: 2500,
  //   });
  // }

  // Handlers
  const onHandleSubmit = async ({
    variations,
  }: {
    variations: IVariationForm[];
  }) => {
    
    try {
      const _variations = variations.map(
        ({ discounted, ...item }: IVariationForm) => {
          delete item.__typename;
         
          return {
            ...item,
            title:
              typeof item.title === 'object'
                ? item.title[selectedLanguage]
                : item.title,
            discounted: discounted,
            // addons: item?.addons?.map((item: IDropdownSelectItem) => item.code),
          };
        }
      );
      const foodInput = {
        _id: foodContextData?.food?._id ?? '',
        restaurant: restaurantId,
        ...foodContextData?.food?.data,
        category: foodContextData?.food?.data.category?.code,
        subCategory: foodContextData?.food?.data.subCategory?.code,
        variations: _variations,
        isReturnAble: foodContextData?.food?.data.isReturnAble
      };
      delete foodInput.__typename;
      await createFood({
        variables: {
          foodInput: foodInput,
        },
      });
      onSetFoodContextData({
        food: {
          data: {} as IFoodNew,
          _id: '',
          variations: [] as IVariationForm[],
        },
      });
    } catch (err) {
      console.log(err)
      showToast({
        type: 'error',
        title: `${foodContextData?.isEditing ? getTranslation('edit') : getTranslation('new')} ${getTranslation('food')}`,
        message: `${getTranslation('food')} ${foodContextData?.isEditing ? getTranslation('edit') : getTranslation('creation')} ${getTranslation('failed')}`,
        duration: 2500,
      });
    }
  };
  const onBackClickHandler = ({
    variations,
  }: {
    variations: IVariationForm[];
  }) => {
    onSetFoodContextData({
      food: {
        _id: foodContextData?.food?._id ?? '',
        data: foodContextData?.food?.data ?? ({} as IFoodNew),
        variations: variations,
      },
    });
    onStepChange(order - 1);
  };

  return (
    <div className="flex h-full w-full items-center justify-start">
      <div className="h-full w-full">
        <div className="flex flex-col gap-2">
          <div className="mb-2 flex flex-col">
            <span className="text-lg">{getTranslation('add_variation')}</span>
          </div>

          <div className="mb-2">
            <Formik
              initialValues={initialValues}
              validationSchema={VariationSchema}
              onSubmit={onHandleSubmit}
              enableReinitialize
            >
              {({
                values,
                errors,
                isSubmitting,
                setFieldValue,
                handleSubmit,
              }: FormikProps<{ variations: IVariationForm[] }>) => {
                const _errors: FormikErrors<IVariationForm>[] =
                  (errors?.variations as FormikErrors<IVariationForm>[]) ?? [];
                return (
                  <Form onSubmit={handleSubmit}>
                    <div>
                      <FieldArray name="variations">
                        {({ remove, push }) => (
                          <div>
                            {values.variations.length > 0 &&
                              values.variations.map(
                                (value: IVariationForm, index: number) => {
                                  return (
                                    <div
                                      className="mb-2"
                                      key={`variations-${index}`}
                                    >
                                      <div className="relative">
                                        {(foodContextData?.isEditing ||
                                          !!index) && (
                                            <button
                                              className="absolute -right-1 top-2"
                                              onClick={() => remove(index)}
                                              type="button"
                                            >
                                              <FontAwesomeIcon
                                                icon={faTimes}
                                                size="lg"
                                                color="#FF6347"
                                              />
                                            </button>
                                          )}
                                        <Fieldset
                                          legend={`${getTranslation('variation')} ${index + 1} ${typeof value.title === 'object' ? `(${value.title[selectedLanguage]})` || '' : `(${value.title})` || ''}`}
                                          toggleable
                                        >
                                          <div className="grid grid-cols-12 gap-4">
                                            <div className="col-span-12 sm:col-span-12">
                                              <CustomTextField
                                                type="text"
                                                name={`variations[${index}].title`}
                                                placeholder={getTranslation(
                                                  'title'
                                                )}
                                                maxLength={35}
                                                value={
                                                  typeof value.title ===
                                                    'object'
                                                    ? value.title[
                                                    selectedLanguage
                                                    ] || ''
                                                    : value.title || ''
                                                }
                                                onChange={(e) =>
                                                  setFieldValue(
                                                    `variations[${index}].title`,
                                                    e.target.value
                                                  )
                                                }
                                                showLabel={true}
                                                style={{
                                                  borderColor:
                                                    onErrorMessageMatcher(
                                                      'title',
                                                      _errors[index]?.title,
                                                      VariationErrors
                                                    )
                                                      ? 'red'
                                                      : '',
                                                }}
                                              />
                                            </div>

                                            <div className="relative col-span-6 sm:col-span-6">
                                              <CustomNumberField
                                                name={`variations[${index}].price`}
                                                min={MIN_PRICE}
                                                max={MAX_PRICE}
                                                minFractionDigits={0}
                                                maxFractionDigits={2}
                                                placeholder={getTranslation(
                                                  'price'
                                                )}
                                                showLabel={true}
                                                value={value.price}
                                                onChangeFieldValue={
                                                  setFieldValue
                                                }
                                                style={{
                                                  borderColor:
                                                    onErrorMessageMatcher(
                                                      'price',
                                                      _errors[index]?.price,
                                                      VariationErrors
                                                    )
                                                      ? 'red'
                                                      : '',
                                                }}
                                              />
                                              {value.discounted > 0 && (
                                                <div className="absolute bottom-[-15px] left-[2px] font-semibold text-[10px] flex gap-2">
                                                  <p>
                                                    {getTranslation(
                                                      'actual_price'
                                                    )}
                                                    &nbsp;: &nbsp;
                                                    <span className="line-through">
                                                      {value.price +
                                                        value.discounted}
                                                    </span>
                                                  </p>
                                                  ,
                                                  <p>
                                                    {getTranslation(
                                                      'discounted_price'
                                                    )}
                                                    &nbsp;: &nbsp;
                                                    <span>{value.price}</span>
                                                  </p>
                                                </div>
                                              )}
                                            </div>

                                            <div className="col-span-6 sm:col-span-6">
                                              <CustomNumberField
                                                name={`variations[${index}].discounted`}
                                                min={0}
                                                placeholder={getTranslation(
                                                  'discounted_price'
                                                )}
                                                showLabel={true}
                                                value={value.discounted}
                                                onChangeFieldValue={
                                                  setFieldValue
                                                }
                                                style={{
                                                  borderColor:
                                                    onErrorMessageMatcher(
                                                      'discounted',
                                                      _errors[index]
                                                        ?.discounted,
                                                      VariationErrors
                                                    )
                                                      ? 'red'
                                                      : '',
                                                }}
                                              />
                                            </div>

                                          {/*   <div className="col-span-12 sm:col-span-12">
                                              <CustomMultiSelectComponent
                                                name={`variations[${index}].addons`}
                                                placeholder={getTranslation(
                                                  'addons'
                                                )}
                                                options={addonsDropdown ?? []}
                                                selectedItems={
                                                  value.addons ?? [
                                                    { code: '', label: '' },
                                                  ]
                                                }
                                                setSelectedItems={setFieldValue}
                                                showLabel={true}
                                                extraFooterButton={{
                                                  title:
                                                    getTranslation(
                                                      'add_new_addon'
                                                    ),
                                                  onChange: () =>
                                                    setIsAddAddonVisible(true),
                                                }}
                                                isLoading={loading}
                                                style={{
                                                  borderColor:
                                                    onErrorMessageMatcher(
                                                      'addons',
                                                      _errors[index]
                                                        ?.addons as string,
                                                      VariationErrors
                                                    )
                                                      ? 'red'
                                                      : '',
                                                }}
                                              />

                                              <div className="col-span-12 mt-4 flex justify-end sm:col-span-12">
                                                <CustomInputSwitch
                                                  label={getTranslation(
                                                    'out_of_stock'
                                                  )}
                                                  loading={false}
                                                  isActive={value.isOutOfStock}
                                                  onChange={() => {
                                                    setFieldValue(
                                                      `variations[${index}].isOutOfStock`,
                                                      !value.isOutOfStock
                                                    );
                                                  }}
                                                />
                                              </div>
                                            </div> */}
                                          </div>
                                        </Fieldset>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            <div className="mt-4 flex justify-end">
                              <TextIconClickable
                                className="w-full rounded border border-black bg-transparent text-black"
                                icon={faAdd}
                                iconStyles={{ color: 'black' }}
                                title={getTranslation('add_new_variation')}
                                onClick={() => push(initialFormValuesTemplate)}
                              />
                            </div>
                          </div>
                        )}
                      </FieldArray>

                      <div className="mt-4 flex justify-between">
                        <CustomButton
                          className="h-10 w-fit border-gray-300 bg-black px-8 text-white"
                          label={getTranslation('back')}
                          type="button"
                          onClick={() => {
                            onBackClickHandler(values);
                          }}
                        />
                        <CustomButton
                          className="h-10 w-fit border-gray-300 bg-black px-8 text-white"
                          label={
                            foodContextData?.isEditing
                              ? getTranslation('update')
                              : getTranslation('add')
                          }
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
      <div>
      </div>
    </div>
  );
}
