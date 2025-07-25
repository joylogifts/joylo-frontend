'use client';
import { ChangeEvent, useContext } from 'react';

import { useMutation } from '@apollo/client';
// GraphQL
import {
  CREATE_SHOP_TYPE,
  GET_SHOP_TYPES,
  UPDATE_SHOP_TYPE,
} from '@/lib/api/graphql';

// Contexts
import { ToastContext } from '@/lib/context/global/toast.context';

// Components
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomUploadImageComponent from '@/lib/ui/useable-components/upload/upload-image';
import CustomInputSwitch from '@/lib/ui/useable-components/custom-input-switch';

// Interfaces
import { IAddShopTypeProps } from '@/lib/utils/interfaces';

// Schema
import { ShopTypeFormSchema } from '@/lib/utils/schema';

// Formik
import { Form, Formik } from 'formik';

// Prime react
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';

// Methods
import { onErrorMessageMatcher } from '@/lib/utils/methods';

// Constants
import { MAX_SQUARE_FILE_SIZE, ShopTypeErrors } from '@/lib/utils/constants';
import { useLangTranslation } from '@/lib/context/global/language.context';

export default function ShopTypesForm({
  setVisible,
  isEditing,
  visible,
  setIsEditing,
}: IAddShopTypeProps) {
  // Hooks
  const { showToast } = useContext(ToastContext);

  const { getTranslation } = useLangTranslation();

  // Initial values
  const initialValues = {
    _id: isEditing.bool ? isEditing?.data?._id : '',
    title: isEditing.bool ? isEditing?.data?.title : '',
    image: isEditing.bool ? isEditing?.data?.image : '',
    isActive: isEditing.bool ? isEditing?.data?.isActive : true,
  };

  // Mutations
  const [createShopType, { loading: createShopTypeLoading }] = useMutation(
    CREATE_SHOP_TYPE,
    {
      refetchQueries: [{ query: GET_SHOP_TYPES }],
      onCompleted: () => {
        showToast({
          title: `${isEditing.bool ? getTranslation('edit') : getTranslation('new')} ${getTranslation('shop_type')}`,
          type: 'success',
          message: getTranslation('shop_type_has_been_added_successfully'),
          duration: 2000,
        });
        setIsEditing({
          bool: false,
          data: {
            __typename: '',
            _id: '',
            isActive: false,
            image: '',
            title: '',
          },
        });
      },
      onError: (err) => {
        showToast({
          title: `${isEditing.bool ? getTranslation('edit') : getTranslation('new')} ${getTranslation('shop_type')}`,
          type: 'error',
          message:
            err.message ||
            `${getTranslation('shop_type')} ${isEditing.bool ? getTranslation('edition') : getTranslation('creation')} ${getTranslation('failed')}`,
          duration: 2000,
        });
        setIsEditing({
          bool: false,
          data: {
            __typename: '',
            _id: '',
            isActive: false,
            image: '',
            title: '',
          },
        });
      },
    }
  );
  const [updateShopType, { loading: editShopTypeLoading }] = useMutation(
    UPDATE_SHOP_TYPE,
    {
      refetchQueries: [{ query: GET_SHOP_TYPES }],
      onCompleted: () => {
        showToast({
          title: `${isEditing.bool ? getTranslation('edit') : getTranslation('new')} ${getTranslation('shop_type')}`,
          type: 'success',
          message: `${getTranslation('shop_type_has_been')} ${isEditing.bool ? getTranslation('edited') : getTranslation('added')}  ${getTranslation('successfully')}`,
          duration: 2000,
        });
        setIsEditing({
          bool: false,
          data: {
            __typename: '',
            _id: '',
            isActive: false,
            image: '',
            title: '',
          },
        });
      },
      onError: (err) => {
        showToast({
          title: `${isEditing.bool ? getTranslation('edit') : getTranslation('new')} ${getTranslation('shop_type')}`,
          type: 'error',
          message:
            err.message ||
            `${getTranslation('shop_type')} ${isEditing.bool ? getTranslation('edition') : getTranslation('creation')} ${getTranslation('failed')}`,
          duration: 2000,
        });
        setIsEditing({
          bool: false,
          data: {
            __typename: '',
            _id: '',
            isActive: false,
            image: '',
            title: '',
          },
        });
      },
    }
  );

  return (
    <Sidebar
      visible={visible}
      onHide={() => {
        setVisible(false);
      }}
      position="right"
      className="w-full sm:w-[450px]"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={ShopTypeFormSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          let formData;
          if (!isEditing.bool) {
            formData = {
              title: values.title,
              image: values.image || 'https://placehold.co/600x400',
            };
          } else {
            formData = {
              _id: values._id,
              title: values.title,
              image: values.image || 'https://placehold.co/600x400',
              isActive: values.isActive || false,
            };
          }

          if (!isEditing.bool) {
            await createShopType({
              variables: {
                dto: formData,
              },
            });
          } else {
            await updateShopType({
              variables: {
                dto: formData,
              },
            });
          }
          setIsEditing({
            bool: false,
            data: {
              __typename: '',
              _id: '',
              image: '',
              isActive: true,
              title: '',
            },
          });
          setVisible(false);

          setSubmitting(false);
        }}
        validateOnChange={true}
      >
        {({ errors, handleSubmit, values, isSubmitting, setFieldValue }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <h2 className='className="mb-3 text-xl font-bold'>
                    {isEditing.bool
                      ? getTranslation('edit')
                      : getTranslation('add')}{' '}
                    {getTranslation('shop_type')}
                  </h2>
                  <div className="flex items-center gap-x-1">
                    {values.isActive
                      ? getTranslation('enabled')
                      : getTranslation('disabled')}
                    <CustomInputSwitch
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setFieldValue('isActive', e.target.checked)
                      }
                      isActive={values.isActive}
                      className={values.isActive ? 'p-inputswitch-checked' : ''}
                    />
                  </div>
                </div>

                <CustomUploadImageComponent
                  key="image"
                  name="image"
                  title={getTranslation('upload_profile_image')}
                  fileTypes={['image/jpg', 'image/webp', 'image/jpeg']}
                  maxFileHeight={1080}
                  maxFileWidth={1080}
                  maxFileSize={MAX_SQUARE_FILE_SIZE}
                  orientation="SQUARE"
                  onSetImageUrl={setFieldValue}
                  existingImageUrl={values.image || ''}
                  showExistingImage={true}
                  style={{
                    borderColor: onErrorMessageMatcher(
                      'image',
                      errors?.image as string,
                      ShopTypeErrors
                    )
                      ? 'red'
                      : '',
                  }}
                />
                <CustomTextField
                  value={values.title}
                  name="title"
                  showLabel={true}
                  placeholder={getTranslation('title')}
                  type="text"
                  onChange={(e) => setFieldValue('title', e.target.value)}
                  style={{
                    borderColor: onErrorMessageMatcher(
                      'title',
                      errors?.title,
                      ShopTypeErrors
                    )
                      ? 'red'
                      : '',
                  }}
                />

                <button
                  className="float-end h-10 w-fit rounded-md border-gray-300 bg-black px-8 text-white"
                  disabled={
                    isSubmitting || editShopTypeLoading || createShopTypeLoading
                  }
                  type="submit"
                >
                  {isSubmitting ||
                    editShopTypeLoading ||
                    createShopTypeLoading ? (
                    <ProgressSpinner
                      className="m-0 h-6 w-6 items-center self-center p-0"
                      strokeWidth="5"
                      style={{ fill: 'white', accentColor: 'white' }}
                      color="white"
                    />
                  ) : isEditing.bool ? (
                    getTranslation('update')
                  ) : (
                    getTranslation('add')
                  )}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Sidebar>
  );
}
