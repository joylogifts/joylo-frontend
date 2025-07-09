// Hooks
import useToast from '@/lib/hooks/useToast';
import { useMutation } from '@apollo/client';
import { useContext } from 'react';

// Components
import CustomButton from '@/lib/ui/useable-components/button';
import CustomLoader from '@/lib/ui/useable-components/custom-progress-indicator';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';

// Interfaces
import {
  ISubCategoriesAddFormProps,
  ISubCategory,
} from '@/lib/utils/interfaces';

// Schema
import { SubCategoriesSchema } from '@/lib/utils/schema/sub-categories';
import { faAdd, faTrash } from '@fortawesome/free-solid-svg-icons';

// Formik
import { FieldArray, Form, Formik, FormikHelpers } from 'formik';

// Prime React
import { Sidebar } from 'primereact/sidebar';

// GraphQL
import {
  GET_CATEGORY_BY_RESTAURANT_ID,
  GET_RESTAURANTS,
} from '@/lib/api/graphql';
import { Fieldset } from 'primereact/fieldset';
import {
  GET_SUBCATEGORIES,
  GET_SUBCATEGORIES_BY_PARENT_ID,
} from '@/lib/api/graphql/queries/sub-categories';
import { CREATE_SUB_CATEGORIES } from '@/lib/api/graphql/mutations/sub-category';

// Contexts
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import { useTranslations } from 'next-intl';
import { useLangTranslation } from '@/lib/context/global/language.context';

export default function SubCategoriesAddForm({
  onHide,
  isAddSubCategoriesVisible,
}: ISubCategoriesAddFormProps) {
  // Hooks
  const t = useTranslations();
  const { getTranslation } = useLangTranslation();

  // Context
  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const restaurantId = restaurantLayoutContextData?.restaurantId || '';

  // Toast
  const { showToast } = useToast();

  // Initial Values
  const initialValues: { subCategories: ISubCategory[] } = {
    subCategories: [
      {
        parentCategoryId: isAddSubCategoriesVisible.parentCategoryId,
        title: '',
      },
    ],
  };

  // Mutations
  const [
    createSubCategories,
    { loading: subCategoriesLoading, error: subCategoriesError },
  ] = useMutation(CREATE_SUB_CATEGORIES, {
    refetchQueries: [
      {
        query: GET_CATEGORY_BY_RESTAURANT_ID,
        variables: { id: restaurantId },
      },
      {
        query: GET_SUBCATEGORIES,
      },
      {
        query: GET_SUBCATEGORIES_BY_PARENT_ID,
        variables: {
          parentCategoryId: isAddSubCategoriesVisible.parentCategoryId,
        },
      },
    ],
    onError: (error) => {
      return showToast({
        type: 'error',
        title: getTranslation('create_sub_categories'),
        message:
          error?.clientErrors[0].message ||
          subCategoriesError?.clientErrors[0].message ||
          error?.networkError?.message ||
          subCategoriesError?.networkError?.message ||
          error?.graphQLErrors[0]?.message ||
          subCategoriesError?.graphQLErrors[0]?.message ||
          error?.cause?.message ||
          subCategoriesError?.cause?.message ||
          getTranslation(
            'an_error_occured_while_adding_the_new_sub_categories'
          ),
      });
    },
  });

  // Handlers
  async function handleFormSubmit(
    values: ISubCategory[],
    formikHelpers: FormikHelpers<{ subCategories: ISubCategory[] }>
  ) {
    try {
      if (values.filter((subCategory) => !subCategory.title).length > 0) {
        return showToast({
          type: 'warn',
          title: getTranslation('create_sub_categories'),
          message: getTranslation(
            'title_for_each_sub_category_is_a_required_field'
          ),
        });
      }
      const response = await createSubCategories({
        variables: {
          subCategories: values,
        },
        refetchQueries: [
          { query: GET_RESTAURANTS },
          {
            query: GET_SUBCATEGORIES_BY_PARENT_ID,
            variables: {
              parentCategoryId: isAddSubCategoriesVisible.parentCategoryId,
            },
          },
        ],
      });
      const errMsg = response?.errors?.map((e) => {
        return JSON.stringify(e.message);
      });
      showToast({
        title: getTranslation('create_sub_categories'),
        type: response.errors?.length ? 'error' : 'success',
        message: response.errors?.length
          ? JSON.stringify(errMsg)
          : getTranslation(`created_sub_category_successfully`),
      });
      formikHelpers.resetForm();
      isAddSubCategoriesVisible.bool = false;
    } catch (error) {
      return showToast({
        type: 'error',
        title: getTranslation('create_sub_categories'),
        message:
          subCategoriesError?.cause?.message ||
          subCategoriesError?.graphQLErrors[0]?.message ||
          subCategoriesError?.clientErrors[0].message ||
          subCategoriesError?.networkError?.message ||
          getTranslation(
            'an_error_occured_while_adding_the_new_sub_categories'
          ),
      });
    }
  }
  return (
    <Sidebar
      onHide={onHide}
      visible={isAddSubCategoriesVisible.bool}
      position="right"
    >
      <Formik
        initialValues={initialValues}
        onSubmit={(values, formikHelpers) =>
          handleFormSubmit(values.subCategories, formikHelpers)
        }
        validationSchema={SubCategoriesSchema}
      >
        {({ handleChange, values, handleSubmit }) => (
          <Form>
            <FieldArray name="subCategories">
              {({ remove, push }) => (
                <div>
                  {values?.subCategories?.map((value: ISubCategory, index) => {
                    value.parentCategoryId =
                      isAddSubCategoriesVisible.parentCategoryId;
                    return (
                      <div key={index} className=" rounded-lg shadow-sm">
                        <Fieldset
                          legend={`${getTranslation('sub_category')} #${index + 1} ${value.title ? `(${value.title})` : ''}`}
                          toggleable
                          className="my-1"
                        >
                          {/* Sub-Category Field and Remove Button */}
                          <div className="flex-col justify-center items-center">
                            <TextIconClickable
                              icon={faTrash}
                              iconStyles={{ color: 'red' }}
                              className="text-red-500 hover:text-red-700 transition-colors justify-self-end"
                              title=""
                              onClick={() => {
                                if (index > 0) {
                                  remove(index);
                                } else {
                                  showToast({
                                    type: 'warn',
                                    title: getTranslation(
                                      'remove_sub_category'
                                    ),
                                    message: `${getTranslation('at_least_one_sub_category_is_required')}.`,
                                  });
                                }
                              }}
                            />
                            <CustomTextField
                              name={`subCategories[${index}].title`}
                              value={value.title}
                              maxLength={15}
                              onChange={handleChange}
                              placeholder={getTranslation('title')}
                              showLabel={true}
                              type="text"
                            />
                          </div>
                        </Fieldset>
                        {/* Add More Button */}
                        {index === values.subCategories.length - 1 && (
                          <div className="mt-4">
                            <TextIconClickable
                              icon={faAdd}
                              title={getTranslation('add_more')}
                              onClick={() =>
                                push({
                                  title: '',
                                  parentCategoryId: '',
                                })
                              }
                              className="w-full flex justify-center items-center py-2 border border-dashed border-gray-400 rounded-md text-gray-600 hover:text-black hover:border-black transition-all"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </FieldArray>
            {subCategoriesLoading ? (
              <CustomLoader />
            ) : (
              <CustomButton
                label={getTranslation('submit')}
                className="h-10 w-fit border-gray-300 bg-black px-8 text-white block m-auto my-2"
                onClick={() => handleSubmit()}
                type="submit"
              />
            )}
          </Form>
        )}
      </Formik>
    </Sidebar>
  );
}
