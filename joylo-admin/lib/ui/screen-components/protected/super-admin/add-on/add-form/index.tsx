// Core
import { FieldArray, Form, Formik, FormikErrors } from 'formik';

// Prime React
import { Sidebar } from 'primereact/sidebar';

// Interface and Types
import { IAddonForm } from '@/lib/utils/interfaces/forms';

// Components
import CustomButton from '@/lib/ui/useable-components/button';
import CustomMultiSelectComponent from '@/lib/ui/useable-components/custom-multi-select';
import CustomTextAreaField from '@/lib/ui/useable-components/custom-text-area-field';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';
import OptionsAddForm from '@/lib/ui/screen-components/protected/super-admin/options/add-form';

// Utilities and Constants
import { AddonsErrors, OptionErrors } from '@/lib/utils/constants';

//Toast
import useToast from '@/lib/hooks/useToast';

//GraphQL
import {
  CREATE_ADDONS,
  EDIT_ADDON,
  GET_ADDONS,
  GET_CATEGORIES,
  GET_OPTIONS
} from '@/lib/api/graphql';
import { RestaurantLayoutContext } from '@/lib/context/super-admin/layout-restaurant.context';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import {
  IAddonAddFormComponentProps,
  ICategoriesResponse,
  ICategory,
  IDropdownSelectItem,
  IOptions,
  IOptionsResponse,
  IQueryResult,
} from '@/lib/utils/interfaces';
import {
  omitExtraAttributes,
  onErrorMessageMatcher,
  toTextCase,
} from '@/lib/utils/methods';
import { AddonSchema } from '@/lib/utils/schema';
import { useMutation } from '@apollo/client';
import { faAdd, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fieldset } from 'primereact/fieldset';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useLangTranslation } from '@/lib/context/global/language.context';

// State
const initialFormValuesTemplate: IAddonForm = {
  title: '',
  description: '',
  options: null,
  categoryIds: null
};

const initialEditFormValuesTemplate: IAddonForm = {
  _id: '',
  title: '',
  description: '',
  options: null,
  categoryIds: null
};

export default function AddonAddForm({
  onHide,
  addon,
  position = 'right',
  isAddAddonVisible,

}: IAddonAddFormComponentProps) {
  // Hooks
  const { getTranslation: t, selectedLanguage } = useLangTranslation();
  const { showToast } = useToast();
  // Context

  const {
    setIsAddOptionsVisible,
    option,
    setOption,
    isAddOptionsVisible
  } = useContext(RestaurantLayoutContext);

  const [initialValues, setInitialValues] = useState({
    addons: [
      {
        ...initialFormValuesTemplate,
      },
    ],
  });

  // Query
  const { data } = useQueryGQL(
    GET_OPTIONS,
    {},
    {
      fetchPolicy: 'network-only',
      onCompleted: onFetchAddonsByRestaurantCompleted,
      onError: onErrorFetchAddonsByRestaurant,
    }
  ) as IQueryResult<IOptionsResponse | undefined, undefined>;

  // Categories
  const { data: categoryData } = useQueryGQL(
    GET_CATEGORIES,
    {},
    {
      fetchPolicy: 'network-only',
      onError: onErrorFetchAddonsByRestaurant,
    }
  ) as IQueryResult<ICategoriesResponse | undefined, undefined>;

  const categoriesDropdown = useMemo(
    () =>
      categoryData?.categories.map((category: ICategory) => {
        return { label: toTextCase(typeof category.title == "object" ? category?.title[selectedLanguage].toString() : category.title, 'title'), code: category._id };
      }),
    [categoryData?.categories]
  );


  // Memoized Constants
  const optionsDropdown = useMemo(
    () =>
      data?.options.map((option: IOptions) => {
        return { label: toTextCase(typeof option.title == "object" ? option?.title[selectedLanguage].toString() : option.title, 'title'), code: option._id };
      }),
    [data?.options]
  );

  // Mutation
  const [createAddons, { loading: mutationLoading }] = useMutation(
    addon ? EDIT_ADDON : CREATE_ADDONS,
    {
      refetchQueries: [
        {
          query: GET_ADDONS,
          variables: {},
        },
      ],
      onCompleted: () => {
        showToast({
          type: 'success',
          title: t('New Addon'),
          message: `${t('Addon have been')} ${addon ? t('edited') : t('added')} ${t('successfully')}.`,
        });

        onHide();
      },
      onError: (error) => {
        let message = '';
        try {
          message = error.graphQLErrors[0]?.message;
        } catch (err) {
          message = `${t('Something went wrong')}.`;
        }
        showToast({
          type: 'error',
          title: t('New Addon'),
          message,
        });
      },
    }
  );

  // Handlers
  // Complete and Error
  function onFetchAddonsByRestaurantCompleted() { }
  function onErrorFetchAddonsByRestaurant() {
    showToast({
      type: 'error',
      title: t('Addons Fetch'),
      message: t('Addons fetch failed'),
      duration: 2500,
    });
  }

  function mapOptions(addons: IAddonForm[]) {
    return addons.map((addon) => ({
      ...addon,
      options: addon?.options?.map(
        (option: IDropdownSelectItem) => option.code
      ),
      categoryIds: addon.categoryIds?.map((category: IDropdownSelectItem) => category.code)
    }));
  }
  // Form Submission
  const handleSubmit = ({ addons }: { addons: IAddonForm[] }) => {
    console.log({ addons, formatValues: mapOptions(addons) })
    createAddons({
      variables: {
        addonInput: addon
          ? mapOptions([
            omitExtraAttributes(addons[0], initialEditFormValuesTemplate),
          ])[0]
          : mapOptions(addons),
      },
    });
  };

  const mapOptionAndCategoryIds = (
    optionIds: string[],
    optionsData: { label: string; code: string }[],
    categoryIds: string[],
    categoriesData: { label: string; code: string }[]
  ) => {
    if (!addon) return;

    const matched_options = optionIds.map((id) => {
      const matchedOption = optionsData.find((op) => op.code === id);
      return { label: matchedOption?.label, code: matchedOption?.code };
    });

    const matched_categories = categoryIds.map((id) => {
      const matchedCategory = categoriesData.find((cat) => cat.code === id);
      return { label: matchedCategory?.label, code: matchedCategory?.code };
    });

    const updated_addon = addon
      ? JSON.parse(JSON.stringify(addon))
      : ({} as IAddonForm);
    delete updated_addon.options;
    delete updated_addon.categoryIds;

    setInitialValues({
      addons: [
        {
          ...initialFormValuesTemplate,
          ...updated_addon,
          title: typeof updated_addon?.title === "object" ? updated_addon?.title[selectedLanguage] : updated_addon?.title ?? '',
          description: typeof updated_addon?.description === "object" ? updated_addon?.description?.[selectedLanguage] : updated_addon?.description ?? '',
          options: matched_options,
          categoryIds: matched_categories,
        },
      ],
    });
  };

  // UseEffects
  useEffect(() => {
    mapOptionAndCategoryIds(
      (addon?.options as string[]) ?? [],
      optionsDropdown ?? [],
      (addon?.categoryIds as string[]) ?? [],
      categoriesDropdown ?? []
    );
  }, [addon, optionsDropdown, categoriesDropdown]);

  return (
    <Sidebar
      visible={isAddAddonVisible}
      position={position}
      onHide={onHide}
      className="w-full sm:w-[500px]"
    >
      <div className="flex h-full w-full items-center justify-start">
        <div className="h-full w-full">
          <div className="flex flex-col gap-2">
            <div className="mb-2 flex flex-col">
              <span className="text-lg">
                {addon ? t('Edit') : t('Add')} {t('Addons')}
              </span>
            </div>

            <div className="mb-2">
              <Formik
                initialValues={initialValues}
                validationSchema={AddonSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({
                  values,
                  errors,
                  handleChange,
                  setFieldValue
                }) => {
                  const _errors: FormikErrors<IAddonForm>[] =
                    (errors?.addons as FormikErrors<IAddonForm>[]) ?? [];

                  return (
                    <Form>
                      <div>
                        <FieldArray name="addons">
                          {({ remove, push }) => (
                            <div>
                              {values.addons.length > 0 &&
                                values.addons.map(
                                  (value: IAddonForm, index: number) => {
                                    return (
                                      <div
                                        className="mb-2"
                                        key={`addon-${index}`}
                                      >
                                        <div className="relative">
                                          {!!index && (
                                            <button
                                              className="absolute -right-1 top-2"
                                              onClick={() => remove(index)}
                                            >
                                              <FontAwesomeIcon
                                                icon={faTimes}
                                                size="lg"
                                                color="#FF6347"
                                              />
                                            </button>
                                          )}
                                          <Fieldset
                                            legend={`${t('Addons')} ${index + 1} ${value.title ? `(${value.title})` : ''}`}
                                            toggleable
                                          >
                                            <div className="grid grid-cols-12 gap-4">
                                              <div className="col-span-12 sm:col-span-12">
                                                <CustomTextField
                                                  type="text"
                                                  name={`addons[${index}].title`}
                                                  placeholder={t('Title')}
                                                  maxLength={35}
                                                  value={value.title}
                                                  onChange={(e) =>
                                                    setFieldValue(
                                                      `addons[${index}].title`,
                                                      e.target.value
                                                    )
                                                  }
                                                  showLabel={true}
                                                  style={{
                                                    borderColor:
                                                      onErrorMessageMatcher(
                                                        'title',
                                                        _errors[index]?.title,
                                                        AddonsErrors
                                                      )
                                                        ? 'red'
                                                        : '',
                                                  }}
                                                />
                                              </div>

                                              <div className="col-span-12 sm:col-span-12">
                                                <CustomTextAreaField
                                                  name={`addons[${index}].description`}
                                                  placeholder={t('Description')}
                                                  value={value.description}
                                                  onChange={handleChange}
                                                  showLabel={true}
                                                  maxLength={40}
                                                  style={{
                                                    borderColor:
                                                      onErrorMessageMatcher(
                                                        'description',
                                                        _errors[index]
                                                          ?.description,
                                                        OptionErrors
                                                      )
                                                        ? 'red'
                                                        : '',
                                                  }}
                                                />
                                              </div>

                                              <div className="col-span-12 sm:col-span-12">
                                                <CustomMultiSelectComponent
                                                  name={`addons[${index}].options`}
                                                  placeholder={t('Options')}
                                                  options={
                                                    optionsDropdown ?? []
                                                  }
                                                  selectedItems={value.options}
                                                  setSelectedItems={
                                                    setFieldValue
                                                  }
                                                  extraFooterButton={{
                                                    onChange: () => {
                                                      setIsAddOptionsVisible(
                                                        true
                                                      );
                                                    },
                                                    title: 'Add Options',
                                                  }}
                                                  showLabel={true}
                                                  style={{
                                                    borderColor:
                                                      onErrorMessageMatcher(
                                                        'options',
                                                        _errors[index]
                                                          ?.options as string,
                                                        AddonsErrors
                                                      )
                                                        ? 'red'
                                                        : '',
                                                  }}
                                                />
                                              </div>

                                              {/* CATEGORIES */}
                                              <div className="col-span-12 sm:col-span-12">
                                                <CustomMultiSelectComponent
                                                  name={`addons[${index}].categoryIds`}
                                                  placeholder={t('Categories')}
                                                  options={
                                                    categoriesDropdown ?? []
                                                  }
                                                  selectedItems={value.categoryIds}
                                                  setSelectedItems={
                                                    setFieldValue
                                                  }
                                                  showLabel={true}
                                                  style={{
                                                    borderColor:
                                                      onErrorMessageMatcher(
                                                        'options',
                                                        _errors[index]
                                                          ?.options as string,
                                                        AddonsErrors
                                                      )
                                                        ? 'red'
                                                        : '',
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          </Fieldset>
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              {!addon && (
                                <div className="mt-4 flex justify-end">
                                  <TextIconClickable
                                    className="w-full rounded border border-black bg-transparent text-black"
                                    icon={faAdd}
                                    iconStyles={{ color: 'black' }}
                                    title={t('Add New Addon')}
                                    onClick={() =>
                                      push(initialFormValuesTemplate)
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </FieldArray>

                        <div className="mt-4 flex justify-end">
                          <CustomButton
                            className="h-10 w-fit border-gray-300 bg-black px-8 text-white"
                            label={addon ? t('Edit') : t('Add')}
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
      <OptionsAddForm
        option={option}
        onHide={() => {
          setIsAddOptionsVisible(false);
          setOption(null);
        }}
        isAddOptionsVisible={isAddOptionsVisible}
      />
    </Sidebar>
  );
}
