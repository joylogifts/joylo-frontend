import { ApolloError, useMutation } from '@apollo/client';
import { Form, Formik } from 'formik';
import { useContext } from 'react';

// API

import { CREATE_LANGUAGE } from '@/lib/api/graphql';

// Context
import { ToastContext } from '@/lib/context/global/toast.context';
import { LanguageManagementContext } from '@/lib/context/super-admin/language-management.context';

// UI
import CustomButton from '@/lib/ui/useable-components/button';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import { Sidebar } from 'primereact/sidebar';
import CustomUploadImageComponent from '@/lib/ui/useable-components/upload/upload-image';

// Interface
import { ILanguageForm } from '@/lib/utils/interfaces';

// Schema
import { LanguageSchema } from '@/lib/utils/schema';
import { useLangTranslation } from '@/lib/context/global/language.context';
import { MAX_LANSDCAPE_FILE_SIZE } from '@/lib/utils/constants';


const initialValues: ILanguageForm = {
  label: '',
  code: '',
  flag: '',
};

export default function VendorAddForm() {
  // Hooks

  const { getTranslation } = useLangTranslation();

  // Context
  const { isLangFormVisible, onToggleLangFormVisibility, languageResponse } =
    useContext(LanguageManagementContext);
  const { showToast } = useContext(ToastContext);

  // Mutations
  const [createLanguage] = useMutation(CREATE_LANGUAGE, {
    //  refetchQueries: [{ query: GET_VENDORS, fetchPolicy: 'network-only' }],
    onError,
    onCompleted: () => {
      showToast({
        type: 'success',
        title: getTranslation('new_vendor'),
        message: `${getTranslation('Language has been')} ${getTranslation('added')} ${getTranslation('successfully')}`,
        duration: 3000,
      });

      onToggleLangFormVisibility(false);
      languageResponse.refetch();
    },
  });

  // Handlers
  const onLanguageCreate = async (data: ILanguageForm) => {
    try {
      await createLanguage({
        variables: {
          input: {
            label: data.label,
            code: data.code,
            flag: data?.flag ?? '',
          },
        },
      });
    } catch (error) {
      console.log('error during add vendor ==> ', error);
      showToast({
        type: 'error',
        title: `${getTranslation('create')} Language`,
        message: `Language ${getTranslation('create')} ${getTranslation('failed')}`,
        duration: 2500,
      });
    }
  };

  function onError({ graphQLErrors, networkError }: ApolloError) {
    showToast({
      type: 'error',
      title: `${getTranslation('create')} Language`,
      message:
        graphQLErrors[0]?.message ??
        networkError?.message ??
        `Language ${getTranslation('create')} ${getTranslation('failed')}`,
      duration: 2500,
    });
  }

  return (
    <Sidebar
      visible={isLangFormVisible}
      position="right"
      onHide={() => onToggleLangFormVisibility(false)}
      className="w-full sm:w-[450px]"
    >
      <div className="flex h-full w-full items-center justify-start">
        <div className="h-full w-full">
          <div className="flex flex-col gap-2">
            <div className="mb-2 flex flex-col">
              <span className="text-lg">
                {getTranslation('add')} {getTranslation('language')}
              </span>
            </div>

            <div>
              <Formik
                initialValues={initialValues}
                validationSchema={LanguageSchema}
                validateOnChange={false}
                onSubmit={async (values) => {
                  await onLanguageCreate(values);
                }}
              >
                {({
                  values,
                  setFieldValue,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                }) => {
                  return (
                    <Form onSubmit={handleSubmit}>
                      <div className="space-y-3">
                        <CustomTextField
                          type="text"
                          name="label"
                          placeholder="Label"
                          maxLength={35}
                          value={values.label}
                          onChange={handleChange}
                          showLabel={true}
                        />
                        <CustomTextField
                          type="text"
                          name="code"
                          placeholder="Code"
                          maxLength={35}
                          value={values.code}
                          onChange={handleChange}
                          showLabel={true}
                        />

                        <CustomUploadImageComponent
                          key="flag"
                          name="flag"
                          title={getTranslation('upload_image')}
                          fileTypes={['image/jpg', 'image/webp', 'image/jpeg']}
                          maxFileHeight={841}
                          maxFileWidth={1980}
                          maxFileSize={MAX_LANSDCAPE_FILE_SIZE}
                          orientation="LANDSCAPE"
                          onSetImageUrl={setFieldValue}
                          existingImageUrl={values.flag}
                        />

                        <CustomButton
                          className="h-10 w-fit border-gray-300 bg-black px-8 text-white"
                          label="Add"
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
      </div>
    </Sidebar>
  );
}
