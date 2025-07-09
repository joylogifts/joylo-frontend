// Core
import { Form, Formik, FormikHelpers } from 'formik';

// Prime React
import { Sidebar } from 'primereact/sidebar';

// Interface and Types
import {
  IDropdownSelectItem,
  IStaffAddFormComponentProps,
} from '@/lib/utils/interfaces';
import { IStaffForm } from '@/lib/utils/interfaces/forms/staff.form.interface';

// Components
import CustomButton from '@/lib/ui/useable-components/button';
import CustomMultiSelectComponent from '@/lib/ui/useable-components/custom-multi-select';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomPasswordTextField from '@/lib/ui/useable-components/password-input-field';
import Toggle from '@/lib/ui/useable-components/toggle';

// Utilities and Constants
import { PERMISSIONS, StaffErrors } from '@/lib/utils/constants';
import { onErrorMessageMatcher } from '@/lib/utils/methods/error';
import { StaffSchema } from '@/lib/utils/schema/staff';

//Toast
import useToast from '@/lib/hooks/useToast';

//GraphQL
import { CREATE_STAFF, EDIT_STAFF } from '@/lib/api/graphql/mutations/staff';
import { GET_STAFFS } from '@/lib/api/graphql/queries/staff';
import { useMutation } from '@apollo/client';
import CustomPhoneTextField from '@/lib/ui/useable-components/phone-input-field';
import { useTranslations } from 'next-intl';
import { useLangTranslation } from '@/lib/context/global/language.context';

export default function StaffAddForm({
  onHide,
  staff,
  position = 'right',
  isAddStaffVisible,
}: IStaffAddFormComponentProps) {
  // Hooks
  const t = useTranslations();
  const { getTranslation } = useLangTranslation();

  // States
  const initialValues: IStaffForm = {
    name: '',
    email: '',
    phone: String(staff?.phone) ?? '',
    isActive: true,
    ...staff,
    password: staff ? staff.plainPassword : '',
    confirmPassword: staff ? staff.plainPassword : '',
    permissions: staff
      ? staff.permissions?.map((p) => {
          return { label: p, code: p };
        })
      : [],
  };

  // Hooks
  const { showToast } = useToast();

  // Mutation
  const mutation = staff ? EDIT_STAFF : CREATE_STAFF;
  const [mutate, { loading: mutationLoading }] = useMutation(mutation, {
    refetchQueries: [{ query: GET_STAFFS }],
  });

  // Form Submission
  const handleSubmit = (
    values: IStaffForm,
    { resetForm }: FormikHelpers<IStaffForm>
  ) => {
    try {
      mutate({
        variables: {
          staffInput: {
            _id: staff ? staff._id : '',
            name: values.name,
            email: values.email,
            password: values.password,
            phone: values.phone?.toString(),
            isActive: values.isActive,
            permissions: values.permissions.map((v) => {
              return v.code;
            }),
          },
        },
        onCompleted: () => {
          showToast({
            type: 'success',
            title: getTranslation('success'),
            message: staff
              ? getTranslation('staff_updated')
              : getTranslation('staff_added'),
            duration: 3000,
          });
          resetForm();
          onHide();
        },
        onError: (error) => {
          showToast({
            type: 'error',
            title: `${getTranslation('staff')} ${staff ? getTranslation('update') : getTranslation('add')}`,
            message:
              error.graphQLErrors[0].message ??
              error.networkError?.message ??
              `${getTranslation('failed_to')} ${staff ? getTranslation('update') : getTranslation('add')} ${getTranslation('staff')}`,
            duration: 3000,
          });
        },
      });
    } catch (e) {
      showToast({
        type: 'error',
        title: `${getTranslation('staff')} ${staff ? getTranslation('update') : getTranslation('add')}`,
        message: getTranslation('something_went_wrong_please_try_again'),
      });
    }
  };

  return (
    <Sidebar
      visible={isAddStaffVisible}
      position={position}
      onHide={onHide}
      className="w-full sm:w-[450px]"
    >
      <div className="flex h-full w-full items-center justify-start">
        <div className="h-full w-full">
          <div className="flex flex-col gap-2">
            <div className="mb-2 flex flex-col">
              <span className="text-lg">
                {staff ? getTranslation('edit') : getTranslation('add')}{' '}
                {getTranslation('staff')}
              </span>
            </div>

            <div>
              <Formik
                initialValues={initialValues}
                validationSchema={StaffSchema}
                onSubmit={handleSubmit}
                enableReinitialize
                validateOnChange={false}
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
                                StaffErrors
                              )
                                ? 'red'
                                : '',
                            }}
                          />
                        </div>
                        <div>
                          <CustomTextField
                            type="text"
                            name="email"
                            placeholder={getTranslation('email')}
                            maxLength={35}
                            value={values.email}
                            onChange={handleChange}
                            showLabel={true}
                            style={{
                              borderColor: onErrorMessageMatcher(
                                'email',
                                errors?.email,
                                StaffErrors
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
                                StaffErrors
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
                                StaffErrors
                              )
                                ? 'red'
                                : '',
                            }}
                          />
                        </div>

                        <div>
                          <CustomPhoneTextField
                            mask="999-999-9999"
                            name="phone"
                            type="text"
                            placeholder={getTranslation('phone_number')}
                            showLabel={true}
                            value={values.phone?.toString()}
                            onChange={(code: string) => {
                              setFieldValue('phone', code);
                            }}
                            style={{
                              borderColor: onErrorMessageMatcher(
                                'phone',
                                errors?.phone,
                                StaffErrors
                              )
                                ? 'red'
                                : '',
                            }}
                          />
                        </div>

                        <div>
                          <CustomMultiSelectComponent
                            onChange={(selected: IDropdownSelectItem[]) => {
                              // Check if "Admin" is currently selected
                              const isAdminSelected = selected.some(
                                (perm) => perm.code === 'Admin'
                              );

                              // Check if "Admin" was previously selected
                              const wasAdminPreviouslySelected =
                                values.permissions.some(
                                  (perm: IDropdownSelectItem) =>
                                    perm.code === 'Admin'
                                );

                              // If "Admin" is selected, select all permissions
                              if (isAdminSelected) {
                                setFieldValue('permissions', PERMISSIONS); // Select all permissions
                              } else {
                                // If "Admin" is not selected
                                if (wasAdminPreviouslySelected) {
                                  // If "Admin" was previously selected, uncheck all permissions
                                  setFieldValue('permissions', []); // Uncheck all permissions
                                } else {
                                  // Keep the selected ones but remove "Admin"
                                  const newPermissions = selected.filter(
                                    (perm) => perm.code !== 'Admin'
                                  );
                                  setFieldValue('permissions', newPermissions);
                                }
                              }
                            }}
                            name="permissions"
                            placeholder={getTranslation('permissions')}
                            options={PERMISSIONS}
                            selectedItems={values.permissions}
                            setSelectedItems={setFieldValue}
                            showLabel={true}
                            style={{
                              borderColor: onErrorMessageMatcher(
                                'permissions',
                                errors?.permissions as string,
                                StaffErrors
                              )
                                ? 'red'
                                : '',
                            }}
                          />
                        </div>

                        <div>
                          <Toggle
                            checked={values.isActive}
                            onClick={() => {
                              setFieldValue('isActive', !values.isActive);
                            }}
                            showLabel
                            placeholder={getTranslation('status')}
                          />
                        </div>

                        <div className="flex justify-end py-4">
                          <CustomButton
                            className="h-10 w-fit border-gray-300 bg-black px-8 text-white"
                            label={
                              staff
                                ? getTranslation('update')
                                : getTranslation('add')
                            }
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
