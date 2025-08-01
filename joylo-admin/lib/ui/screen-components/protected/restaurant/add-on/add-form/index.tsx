// /* eslint-disable @typescript-eslint/no-explicit-any */

// // Core
// import { FieldArray, Form, Formik, FormikErrors, FormikProps } from 'formik';

// // Prime React
// import { Sidebar } from 'primereact/sidebar';

// // Interface and Types
// import { IAddonForm } from '@/lib/utils/interfaces/forms';

// // Components
// import CustomButton from '@/lib/ui/useable-components/button';
// import CustomMultiSelectComponent from '@/lib/ui/useable-components/custom-multi-select';
// import CustomTextAreaField from '@/lib/ui/useable-components/custom-text-area-field';
// import CustomTextField from '@/lib/ui/useable-components/input-field';
// import CustomNumberField from '@/lib/ui/useable-components/number-input-field';
// import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';
// import OptionsAddForm from '@/lib/ui/screen-components/protected/restaurant/options/add-form';

// // Utilities and Constants
// import { AddonsErrors, OptionErrors } from '@/lib/utils/constants';

// //Toast
// import useToast from '@/lib/hooks/useToast';

// //GraphQL
// import {
//   CREATE_ADDONS,
//   EDIT_ADDON,
//   GET_ADDONS_BY_RESTAURANT_ID,
//   GET_CATEGORY_BY_RESTAURANT_ID,
//   GET_OPTIONS_BY_RESTAURANT_ID,
// } from '@/lib/api/graphql';
// import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
// import { useQueryGQL } from '@/lib/hooks/useQueryQL';
// import {
//   IAddonAddFormComponentProps,
//   ICategory,
//   ICategoryByRestaurantResponse,
//   IDropdownSelectItem,
//   IOptions,
//   IOptionsByRestaurantResponse,
//   IQueryResult,
//   ISubCategory,
//   ISubCategoryByParentIdResponse,
// } from '@/lib/utils/interfaces';
// import {
//   omitExtraAttributes,
//   onErrorMessageMatcher,
//   toTextCase,
// } from '@/lib/utils/methods';
// import { AddonSchema } from '@/lib/utils/schema';
// import { useMutation } from '@apollo/client';
// import { faAdd, faTimes } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { Fieldset } from 'primereact/fieldset';
// import { useContext, useEffect, useMemo, useRef, useState } from 'react';
// import { useTranslations } from 'next-intl';
// import { GET_SUBCATEGORIES_BY_PARENT_ID } from '@/lib/api/graphql/queries/sub-categories';
// import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
// import InputSkeleton from '@/lib/ui/useable-components/custom-skeletons/inputfield.skeleton';
// import CustomDropdownComponent from '@/lib/ui/useable-components/custom-dropdown';

// // State
// const initialFormValuesTemplate: IAddonForm = {
//   title: '',
//   description: '',
//   options: null,
//   categoryId: null,
//   subCategoryId: null,
// };
// const initialEditFormValuesTemplate: IAddonForm = {
//   _id: '',
//   title: '',
//   description: '',
//   options: null,
//   categoryId: null,
//   subCategoryId: null,
// };

// export default function AddonAddForm({
//   onHide,
//   addon,
//   position = 'right',
//   isAddAddonVisible,
// }: IAddonAddFormComponentProps) {
//   // Hooks
//   const t = useTranslations();
//   const { showToast } = useToast();
//   // Context

//   const {
//     restaurantLayoutContextData,
//     setIsAddOptionsVisible,
//     option,
//     setOption,
//     isAddOptionsVisible,
//   } = useContext(RestaurantLayoutContext);
//   const restaurantId = restaurantLayoutContextData?.restaurantId || '';
//   const shopType = restaurantLayoutContextData?.shopType || '';

//   const formikRef = useRef<FormikProps<any>>(null);

//   // States
//   const [initialValues, setInitialValues] = useState({
//     addons: [
//       {
//         ...initialFormValuesTemplate,
//       },
//     ],
//   });
//   const [categoryDropDown, setCategoryDropDown] =
//     useState<IDropdownSelectItem>();

//   // Query
//   const { data } = useQueryGQL(
//     GET_OPTIONS_BY_RESTAURANT_ID,
//     { id: restaurantId },
//     {
//       fetchPolicy: 'network-only',
//       enabled: !!restaurantId,
//       onCompleted: onFetchAddonsByRestaurantCompleted,
//       onError: onErrorFetchAddonsByRestaurant,
//     }
//   ) as IQueryResult<IOptionsByRestaurantResponse | undefined, undefined>;

//   // Queries
//   const {
//     data: categoriesData,
//     loading: categoriesLoading
//   } = useQueryGQL(
//     GET_CATEGORY_BY_RESTAURANT_ID,
//     { id: restaurantId ?? '' },
//     {
//       fetchPolicy: 'no-cache',
//       enabled: !!restaurantId,
//     }
//   ) as IQueryResult<ICategoryByRestaurantResponse | undefined, undefined>;

//   const {
//     data: subCategoriesData,
//     loading: subCategoriesLoading,
//   } = useQueryGQL(
//     GET_SUBCATEGORIES_BY_PARENT_ID,
//     {
//       parentCategoryId: categoryDropDown?.code,
//     },
//     {
//       enabled: !!categoryDropDown?.code,
//       fetchPolicy: 'cache-and-network',
//     }
//   ) as IQueryResult<
//     ISubCategoryByParentIdResponse | undefined,
//     { parentCategoryId: string }
//   >;

//   // Memoized Data
//   const categoriesDropdown = useMemo(
//     () =>
//       categoriesData?.restaurant?.categories.map((category: ICategory) => {
//         return { label: category.title, code: category._id };
//       }),
//     [categoriesData?.restaurant?.categories]
//   );

//   const subCategoriesDropdown = useMemo(
//     () =>
//       subCategoriesData?.subCategoriesByParentId.map(
//         (sub_category: ISubCategory) => {
//           return { label: sub_category.title, code: sub_category._id };
//         }
//       ),
//     [categoryDropDown?.code, subCategoriesData]
//   );

//   // Memoized Constants
//   const optionsDropdown = useMemo(
//     () =>
//       data?.restaurant?.options.map((option: IOptions) => {
//         return { label: toTextCase(option.title, 'title'), code: option._id };
//       }),
//     [data?.restaurant?.options]
//   );

//   // Mutation
//   const [createAddons, { loading: mutationLoading }] = useMutation(
//     addon ? EDIT_ADDON : CREATE_ADDONS,
//     {
//       refetchQueries: [
//         {
//           query: GET_ADDONS_BY_RESTAURANT_ID,
//           variables: { id: restaurantId },
//         },
//       ],
//       onCompleted: () => {
//         showToast({
//           type: 'success',
//           title: t('New Addon'),
//           message: `${t('Addon have been')} ${addon ? t('edited') : t('added')} ${t('successfully')}.`,
//         });

//         onHide();
//       },
//       onError: (error) => {
//         let message = '';
//         try {
//           message = error.graphQLErrors[0]?.message;
//         } catch (err) {
//           message = `${t('Something went wrong')}.`;
//         }
//         showToast({
//           type: 'error',
//           title: t('New Addon'),
//           message,
//         });
//       },
//     }
//   );

//   // Handlers
//   // Complete and Error
//   function onFetchAddonsByRestaurantCompleted() {}
//   function onErrorFetchAddonsByRestaurant() {
//     showToast({
//       type: 'error',
//       title: t('Addons Fetch'),
//       message: t('Addons fetch failed'),
//       duration: 2500,
//     });
//   }

//   function mapOptions(addons: IAddonForm[]) {
//     return addons.map((addon) => ({
//       ...addon,
//       categoryId: addon.categoryId?.code,
//       subCategoryId: addon.subCategoryId?.code,
//       options: addon?.options?.map(
//         (option: IDropdownSelectItem) => option.code
//       ),
//     }));
//   }
//   // Form Submission
//   const handleSubmit = ({ addons }: { addons: IAddonForm[] }) => {
//     createAddons({
//       variables: {
//         addonInput: {
//           restaurant: restaurantId,
//           addons: addon
//             ? mapOptions([
//                 omitExtraAttributes(addons[0], initialEditFormValuesTemplate),
//               ])[0]
//             : mapOptions(addons),
//         },
//       },
//     });
//   };

//   const mapOptionIds = (
//     optionIds: string[],
//     optionsData: { label: string; code: string }[]
//   ) => {
//     if (!addon) return;

//     const matched_options = optionIds.map((id) => {
//       const matchedOption = optionsData.find((op) => op.code === id);
//       return { label: matchedOption?.label, code: matchedOption?.code };
//     });

//     const updated_addon = addon
//       ? JSON.parse(JSON.stringify(addon))
//       : ({} as IAddonForm);
//     delete updated_addon.options;

//     // Categories/Sub-Catgories
//     const editing_category = categoriesDropdown?.find(
//       (_category) => _category.code === addon.categoryId?._id
//     );
//     setCategoryDropDown(editing_category);
//     const editing_subCategory = subCategoriesDropdown?.find(
//       (_category) => _category.code === addon.subCategoryId?._id
//     );

//     setInitialValues({
//       addons: [
//         {
//           ...initialFormValuesTemplate,
//           ...updated_addon,
//           categoryId: editing_category,
//           subCategoryId: editing_subCategory,
//           options: matched_options,
//         },
//       ],
//     });
//   };

//   // UseEffects
//   useEffect(() => {
//     mapOptionIds((addon?.options as string[]) ?? [], optionsDropdown ?? []);
//   }, [addon, optionsDropdown]);

//   return (
//     <Sidebar
//       visible={isAddAddonVisible}
//       position={position}
//       onHide={onHide}
//       className="w-full sm:w-[500px]"
//     >
//       <div className="flex h-full w-full items-center justify-start">
//         <div className="h-full w-full">
//           <div className="flex flex-col gap-2">
//             <div className="mb-2 flex flex-col">
//               <span className="text-lg">
//                 {addon ? t('Edit') : t('Add')} {t('Addons')}
//               </span>
//             </div>

//             <div className="mb-2">
//               <Formik
//                 innerRef={formikRef}
//                 initialValues={initialValues}
//                 validationSchema={AddonSchema}
//                 onSubmit={handleSubmit}
//                 enableReinitialize
//               >
//                 {({
//                   values,
//                   errors,
//                   handleChange,
//                   setFieldValue,
//                   handleSubmit,
//                 }) => {
//                   const _errors: FormikErrors<IAddonForm>[] =
//                     (errors?.addons as FormikErrors<IAddonForm>[]) ?? [];

//                   return (
//                     <Form onSubmit={handleSubmit}>
//                       <div>
//                         <FieldArray name="addons">
//                           {({ remove, push }) => (
//                             <div>
//                               {values.addons.length > 0 &&
//                                 values.addons.map(
//                                   (value: IAddonForm, index: number) => {
//                                     return (
//                                       <div
//                                         className="mb-2"
//                                         key={`addon-${index}`}
//                                       >
//                                         <div className="relative">
//                                           {!!index && (
//                                             <button
//                                               className="absolute -right-1 top-2"
//                                               onClick={() => remove(index)}
//                                             >
//                                               <FontAwesomeIcon
//                                                 icon={faTimes}
//                                                 size="lg"
//                                                 color="#FF6347"
//                                               />
//                                             </button>
//                                           )}
//                                           <Fieldset
//                                             legend={`${t('Addons')} ${index + 1} ${value.title ? `(${value.title})` : ''}`}
//                                             toggleable
//                                           >
//                                             <div className="grid grid-cols-12 gap-4">
//                                               <div className="col-span-12 sm:col-span-12">
//                                                 <CustomTextField
//                                                   type="text"
//                                                   name={`addons[${index}].title`}
//                                                   placeholder={t('Title')}
//                                                   maxLength={35}
//                                                   value={value.title}
//                                                   onChange={(e) =>
//                                                     setFieldValue(
//                                                       `addons[${index}].title`,
//                                                       e.target.value
//                                                     )
//                                                   }
//                                                   showLabel={true}
//                                                   style={{
//                                                     borderColor:
//                                                       onErrorMessageMatcher(
//                                                         'title',
//                                                         _errors[index]?.title,
//                                                         AddonsErrors
//                                                       )
//                                                         ? 'red'
//                                                         : '',
//                                                   }}
//                                                 />
//                                               </div>

//                                               <div className="col-span-12 sm:col-span-12">
//                                                 <label
//                                                   htmlFor="category"
//                                                   className="text-sm font-[500]"
//                                                 >
//                                                   {t('Category')}
//                                                 </label>
//                                                 <Dropdown
//                                                   name={`addons[${index}].categoryId`}
//                                                   value={value.categoryId}
//                                                   placeholder={t(
//                                                     'Select Category'
//                                                   )}
//                                                   className="md:w-20rem p-dropdown-no-box-shadow m-0 h-10 w-full border border-gray-300 p-0 align-middle text-sm focus:shadow-none focus:outline-none"
//                                                   panelClassName="border-gray-200 border-2"
//                                                   onChange={(
//                                                     e: DropdownChangeEvent
//                                                   ) => {
//                                                     handleChange(e);
//                                                     setCategoryDropDown(
//                                                       e.value
//                                                     );
//                                                   }}
//                                                   options={
//                                                     categoriesDropdown ?? []
//                                                   }
//                                                   loading={categoriesLoading}
//                                                   style={{
//                                                     borderColor:
//                                                       onErrorMessageMatcher(
//                                                         'categoryId',
//                                                         _errors[index]
//                                                           ?.categoryId,
//                                                         AddonsErrors
//                                                       )
//                                                         ? 'red'
//                                                         : '',
//                                                   }}
//                                                 />
//                                               </div>

//                                               {shopType == 'grocery' && (
//                                                 <div className="col-span-12 sm:col-span-12">
//                                                   {!subCategoriesLoading ? (
//                                                     <CustomDropdownComponent
//                                                       name={`addons[${index}].subCategoryId`}
//                                                       placeholder={t(
//                                                         'Select Sub-Category'
//                                                       )}
//                                                       showLabel={true}
//                                                       selectedItem={
//                                                         value.subCategoryId ??
//                                                         null
//                                                       }
//                                                       setSelectedItem={
//                                                         setFieldValue
//                                                       }
//                                                       options={
//                                                         subCategoriesDropdown ??
//                                                         []
//                                                       }
//                                                       isLoading={
//                                                         subCategoriesLoading
//                                                       }
//                                                       style={{
//                                                         borderColor:
//                                                           onErrorMessageMatcher(
//                                                             'subCategoryId',
//                                                             _errors[index]
//                                                               ?.subCategoryId
//                                                               ? _errors[index]
//                                                                   ?.subCategoryId
//                                                               : [],
//                                                             AddonsErrors
//                                                           )
//                                                             ? 'red'
//                                                             : '',
//                                                       }}
//                                                     />
//                                                   ) : (
//                                                     <InputSkeleton />
//                                                   )}
//                                                 </div>
//                                               )}

//                                               <div className="col-span-6 sm:col-span-6">
//                                                 <CustomNumberField
//                                                   name={`addons[${index}].quantityMinimum`}
//                                                   min={1}
//                                                   max={99999}
//                                                   minFractionDigits={0}
//                                                   maxFractionDigits={0}
//                                                   placeholder={t(
//                                                     'Minimum Quantity'
//                                                   )}
//                                                   showLabel={true}
//                                                   value={value.quantityMinimum}
//                                                   onChangeFieldValue={
//                                                     setFieldValue
//                                                   }
//                                                   style={{
//                                                     borderColor:
//                                                       onErrorMessageMatcher(
//                                                         'quantityMinimum',
//                                                         _errors[index]
//                                                           ?.quantityMinimum,
//                                                         AddonsErrors
//                                                       )
//                                                         ? 'red'
//                                                         : '',
//                                                   }}
//                                                 />
//                                               </div>
//                                               <div className="col-span-6 sm:col-span-6">
//                                                 <CustomNumberField
//                                                   name={`addons[${index}].quantityMaximum`}
//                                                   min={1}
//                                                   max={99999}
//                                                   minFractionDigits={0}
//                                                   maxFractionDigits={0}
//                                                   placeholder={t(
//                                                     'Maximum Quantity'
//                                                   )}
//                                                   showLabel={true}
//                                                   value={value.quantityMaximum}
//                                                   onChangeFieldValue={
//                                                     setFieldValue
//                                                   }
//                                                   style={{
//                                                     borderColor:
//                                                       onErrorMessageMatcher(
//                                                         'quantityMaximum',
//                                                         _errors[index]
//                                                           ?.quantityMaximum,
//                                                         AddonsErrors
//                                                       )
//                                                         ? 'red'
//                                                         : '',
//                                                   }}
//                                                 />
//                                               </div>

//                                               <div className="col-span-12 sm:col-span-12">
//                                                 <CustomTextAreaField
//                                                   name={`addons[${index}].description`}
//                                                   placeholder={t('Description')}
//                                                   value={value.description}
//                                                   onChange={handleChange}
//                                                   showLabel={true}
//                                                   maxLength={40}
//                                                   style={{
//                                                     borderColor:
//                                                       onErrorMessageMatcher(
//                                                         'description',
//                                                         _errors[index]
//                                                           ?.description,
//                                                         OptionErrors
//                                                       )
//                                                         ? 'red'
//                                                         : '',
//                                                   }}
//                                                 />
//                                               </div>

//                                               <div className="col-span-12 sm:col-span-12">
//                                                 <CustomMultiSelectComponent
//                                                   name={`addons[${index}].options`}
//                                                   placeholder={t('Options')}
//                                                   options={
//                                                     optionsDropdown ?? []
//                                                   }
//                                                   selectedItems={value.options}
//                                                   setSelectedItems={
//                                                     setFieldValue
//                                                   }
//                                                   extraFooterButton={{
//                                                     onChange: () => {
//                                                       setIsAddOptionsVisible(
//                                                         true
//                                                       );
//                                                     },
//                                                     title: 'Add Options',
//                                                   }}
//                                                   showLabel={true}
//                                                   style={{
//                                                     borderColor:
//                                                       onErrorMessageMatcher(
//                                                         'options',
//                                                         _errors[index]
//                                                           ?.options as string,
//                                                         AddonsErrors
//                                                       )
//                                                         ? 'red'
//                                                         : '',
//                                                   }}
//                                                 />
//                                               </div>
//                                             </div>
//                                           </Fieldset>
//                                         </div>
//                                       </div>
//                                     );
//                                   }
//                                 )}
//                               {!addon && (
//                                 <div className="mt-4 flex justify-end">
//                                   <TextIconClickable
//                                     className="w-full rounded border border-black bg-transparent text-black"
//                                     icon={faAdd}
//                                     iconStyles={{ color: 'black' }}
//                                     title={t('Add New Addon')}
//                                     onClick={() =>
//                                       push(initialFormValuesTemplate)
//                                     }
//                                   />
//                                 </div>
//                               )}
//                             </div>
//                           )}
//                         </FieldArray>

//                         <div className="mt-4 flex justify-end">
//                           <CustomButton
//                             className="h-10 w-fit border-gray-300 bg-black px-8 text-white"
//                             label={addon ? t('Edit') : t('Add')}
//                             type="submit"
//                             loading={mutationLoading}
//                           />
//                         </div>
//                       </div>
//                     </Form>
//                   );
//                 }}
//               </Formik>
//             </div>
//           </div>
//         </div>
//       </div>
//       <OptionsAddForm
//         option={option}
//         onHide={() => {
//           setIsAddOptionsVisible(false);
//           setOption(null);
//         }}
//         isAddOptionsVisible={isAddOptionsVisible}
//       />
//     </Sidebar>
//   );
// }

export default function AddonAddForm () {
  return <div></div>
}
