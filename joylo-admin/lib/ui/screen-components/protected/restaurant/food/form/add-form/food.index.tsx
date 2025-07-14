'use client';

// Core
import { Form, Formik } from 'formik';
import { useContext, useEffect, useMemo, useState } from 'react';

// Context
import { FoodsContext } from '@/lib/context/restaurant/foods.context';

// Hooks
import { useQueryGQL } from '@/lib/hooks/useQueryQL';


// Interface and Types
import {
  ICategoriesResponse,
  ICategory,
  IDropdownSelectItem,
  IFoodDetailsComponentProps,
  IFoodNew,
  IQueryResult,
} from '@/lib/utils/interfaces';
import { IFoodDetailsForm } from '@/lib/utils/interfaces/forms/food.form.interface';

// Constants and Methods
import { FoodErrors, MAX_LANSDCAPE_FILE_SIZE } from '@/lib/utils/constants';
import { onErrorMessageMatcher } from '@/lib/utils/methods/error';

// Components
import CategoryAddForm from '../../../category/add-form';
import CustomButton from '@/lib/ui/useable-components/button';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomTextAreaField from '@/lib/ui/useable-components/custom-text-area-field';
import CustomUploadImageComponent from '@/lib/ui/useable-components/upload/upload-image';

// API
import { GET_CATEGORIES } from '@/lib/api/graphql';

// Schema
import { FoodSchema } from '@/lib/utils/schema';

// Prime React
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

import CustomInputSwitch from '@/lib/ui/useable-components/custom-input-switch';

// Components
import { useLangTranslation } from '@/lib/context/global/language.context';

const initialValues: IFoodDetailsForm = {
  _id: null,
  title: '',
  description: '',
  image: '',
  category: null,
  isReturnAble: false 
};
export default function FoodDetails({
  stepperProps,
}: IFoodDetailsComponentProps) {
  // Hooks

  const { getTranslation, selectedLanguage } = useLangTranslation();

  // Props
  const { onStepChange, order } = stepperProps ?? {
    onStepChange: () => { },
    type: '',
    order: -1,
  };

  // Context
  const { onSetFoodContextData, foodContextData } = useContext(FoodsContext);


  const [categoryDropDown, setCategoryDropDown] =
    useState<IDropdownSelectItem>();
  const [foodInitialValues, setFoodInitialValues] = useState(
    foodContextData?.isEditing || foodContextData?.food?.data?.title
      ? { ...initialValues, ...foodContextData?.food?.data }
      : { ...initialValues }
  );

  // Queries
  const {
    data,
    loading: categoriesLoading,
    refetch: refetchCategories,
  } = useQueryGQL(
    GET_CATEGORIES,
    {},
    {
      fetchPolicy: 'no-cache',
    }
  ) as IQueryResult<ICategoriesResponse | undefined, undefined>;


  // Memoized Data
  const categoriesDropdown = useMemo(
    () =>
      data?.categories.map((category: ICategory) => {
        return {
          label:
            typeof category.title === 'object'
              ? category.title[selectedLanguage]
              : category.title,
          code: category._id,
        };
      }),
    [data?.categories]
  );


  // Handlers
  const onFoodSubmitHandler = (values: IFoodDetailsForm) => {
    console.log('onFoodSubmitHandler', values);
    const foodData: IFoodNew = {
      _id: foodContextData?.food?.data?._id ?? '',
      title:
        typeof values.title === 'object'
          ? values.title[selectedLanguage] || ''
          : values.title || '',
      description:
        typeof values.description === 'object'
          ? values.description[selectedLanguage] || ''
          : values.description || '',

      category: values.category,
      subCategory: null,
      image: values.image,
      isOutOfStock: false,
      isActive: true,
      __typename: foodContextData?.food?.data?.__typename ?? 'Food',
      variations:
        (foodContextData?.food?.variations ?? []).length > 0
          ? (foodContextData?.food?.variations ?? [])
          : [],
      isReturnAble: values.isReturnAble
    };

    console.log('foodData on submit', foodData);

    onSetFoodContextData({
      food: {
        _id: '',
        data: foodData,
        variations:
          (foodContextData?.food?.variations ?? []).length > 0
            ? (foodContextData?.food?.variations ?? [])
            : [],
      },
    });
    onStepChange(order + 1);
  };

  useEffect(() => {
    refetchCategories();
  }, [
    categoryDropDown
  ]);

  // UseEffects
  useEffect(() => {
    if (foodContextData?.isEditing) {
      const editing_category = categoriesDropdown?.find(
        (_category) =>
          _category.code === foodContextData?.food?.data.category?.code
      );


      setFoodInitialValues({
        ...JSON.parse(JSON.stringify(foodInitialValues)),
        category: editing_category,
      });
      setCategoryDropDown(editing_category ?? ({} as IDropdownSelectItem));
    }
  }, [categoriesDropdown]);

  return (
    <div className="w-full h-full flex items-center justify-start">
      <div className="h-full w-full">
        <div className="flex flex-col gap-2">
          <div>
            <Formik
              initialValues={foodInitialValues}
              validationSchema={FoodSchema}
              enableReinitialize={true}
              onSubmit={async (values) => {
                console.log('onSubmit values', values);
                onFoodSubmitHandler(values);
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
                    <div className="space-y-3">
                      <div>
                        <label
                          htmlFor="category"
                          className="text-sm font-[500]"
                        >
                          {getTranslation('category')}
                        </label>
                        <Dropdown
                          name="category"
                          value={values.category}
                          placeholder={getTranslation('select_category')}
                          className="md:w-20rem p-dropdown-no-box-shadow m-0 h-10 w-full border border-gray-300 p-0 align-middle text-sm focus:shadow-none focus:outline-none"
                          panelClassName="border-gray-200 border-2"
                          onChange={(e: DropdownChangeEvent) => {
                            handleChange(e);
                            setCategoryDropDown(e.value);
                          }}
                          options={categoriesDropdown ?? []}
                          loading={categoriesLoading}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'category',
                              errors?.category,
                              FoodErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>

                      <div>
                        <CustomTextField
                          type="text"
                          name="title"
                          placeholder={getTranslation('title')}
                          maxLength={35}
                          value={
                            typeof values.title === 'object'
                              ? values.title[selectedLanguage] || ''
                              : values.title || ''
                          }
                          onChange={handleChange}
                          showLabel={true}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'title',
                              errors?.title,
                              FoodErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
                      <div>
                        <CustomTextAreaField
                          name="description"
                          label={getTranslation('description')}
                          placeholder={getTranslation('description')}
                          value={
                            typeof values.description === 'object'
                              ? values?.description?.[selectedLanguage] || ''
                              : values?.description || ''
                          }
                          onChange={handleChange}
                          showLabel={true}
                          className={''}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'description',
                              errors.description,
                              FoodErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>

                      <div>
                        <CustomInputSwitch
                        label='Return Able'
                        isActive={values.isReturnAble}
                        loading={false}
                        onChange={(e) => {
                          setFieldValue('isReturnAble' , e.target.checked)
                        }}
                        />
                      </div>

                      <div>
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
                          showExistingImage={
                            foodContextData?.isEditing ? true : false
                          }
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'image',
                              errors?.image as string,
                              FoodErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <CustomButton
                        className="w-fit h-10 bg-black text-white border-gray-300 px-8"
                        label={getTranslation('next')}
                        type="submit"
                        loading={isSubmitting}
                      />
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>

      <CategoryAddForm
        // category={category}
        // onHide={() => {
        //   setIsAddCategoryVisible(false);
        //   setCategory(null);
        // }}
        // isAddCategoryVisible={isAddCategoryVisible}
        // subCategories={subCategories}
      />
    </div>
  );
}
