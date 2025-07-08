// Core
import { Form, Formik } from 'formik';

// Prime React
import { Sidebar } from 'primereact/sidebar';

// Interface, Types & Schema
import { ICategoryForm } from '@/lib/utils/interfaces/forms';
import {
  ICategoryAddFormComponentProps,
} from '@/lib/utils/interfaces';
import { CategorySchema } from '@/lib/utils/schema';

// Components
import CustomButton from '@/lib/ui/useable-components/button';
import CustomTextField from '@/lib/ui/useable-components/input-field';

// Utilities and Constants
import { CategoryErrors } from '@/lib/utils/constants';
import { onErrorMessageMatcher } from '@/lib/utils/methods/error';

//Toast
import useToast from '@/lib/hooks/useToast';

//GraphQL
import {
  CREATE_CATEGORY,
  EDIT_CATEGORY,
  GET_CATEGORIES
} from '@/lib/api/graphql';

// Hooks
import { useMutation } from '@apollo/client';
import { useTranslations } from 'next-intl';
import CustomInputSwitch from '@/lib/ui/useable-components/custom-input-switch';

export default function CategoryAddForm({
  onHide,
  category,
  position = 'right',
  isAddCategoryVisible,
}: ICategoryAddFormComponentProps) {
  // Hooks
  const t = useTranslations();

  // StateS
  const initialValues: ICategoryForm = {
    title: category?.title ?? '',
    isActive : category?.isActive ?? true
  };

  // Hooks
  const { showToast } = useToast();



  // Mutations


  const [createCategory, { loading: mutationLoading }] = useMutation(
    category ? EDIT_CATEGORY : CREATE_CATEGORY,
    {
      refetchQueries: [
        {
          query: GET_CATEGORIES,
        }
      ],
      onCompleted: () => {
        showToast({
          type: 'success',
          title: t('New Category'),
          message: `${t('Category has been')} ${category ? t('edited') : t('added')} ${t('successfully')}.`,
          duration: 3000,
        });
        onHide();
      },
      onError: (error) => {
        let message = '';
        try {
          message = error.graphQLErrors[0]?.message;
        } catch (err) {
          message = t('ActionFailedTryAgain');
        }
        showToast({
          type: 'error',
          title: t('New Category'),
          message,
          duration: 3000,
        });
      },
    }
  );

  // Form Submission
  const handleSubmit = async (values: ICategoryForm) => {
    try {
      const body : ICategoryForm = {
        title: values.title,
        isActive: values?.isActive 
      }

      if(category) {
        body._id = category._id;
      }

      await createCategory({
        variables: {
          category: body,
        },
      });
    } catch (error) {
      console.error({ error });
      showToast({
        type: 'error',
        title: `${category ? t('Edit') : t('Create')} Category`,
        message: `${t('Failed to create Category, please try again later')}.`,
      });
    }
  };


  return (
    <Sidebar
      visible={isAddCategoryVisible}
      position={position}
      onHide={onHide}
      className="w-full sm:w-[450px]"
    >
      <div className="flex h-full w-full items-center justify-start">
        <div className="h-full w-full">
          <div className="flex flex-col gap-2">
            <div className="mb-2 flex flex-col">
              <span className="text-lg">
                {category ? t('Edit') : t('Add')} {t('Category')}
              </span>
            </div>
            <div>
              <Formik
                initialValues={initialValues}
                validationSchema={CategorySchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({
                  values,
                  errors,
                  handleChange,
                  handleSubmit,
                  setFieldValue,
                }) => {
                  return (
                    <Form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <div>
                          <CustomTextField
                            type="text"
                            name="title"
                            placeholder={t('Title')}
                            maxLength={30}
                            value={values.title}
                            onChange={handleChange}
                            showLabel={true}
                            style={{
                              borderColor: onErrorMessageMatcher(
                                'title',
                                errors?.title,
                                CategoryErrors
                              )
                                ? 'red'
                                : '',
                            }}
                          />
                        </div>
                        {
                          category && (
                            <div>
                              <CustomInputSwitch
                                label="Active"
                                onChange={(e) => setFieldValue('isActive' , e.target.checked ? true : false)}
                                isActive={typeof values.isActive === 'boolean' && values.isActive}
                                loading={false}
    
                              />
                            </div>
                          )
                        }

                        <div className="mt-4 flex justify-end">
                          <CustomButton
                            className="h-10 w-fit border-gray-300 bg-black px-8 text-white"
                            label={category ? t('Update') : t('Add')}
                            type="submit"
                            loading={mutationLoading}
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
    </Sidebar>
  );
}
