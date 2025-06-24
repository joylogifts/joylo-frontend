// GraphQL
import { GET_NOTIFICATIONS, SEND_NOTIFICATION_USER } from '@/lib/api/graphql';
import { useLangTranslation } from '@/lib/context/global/language.context';

// Contexts
import { ToastContext } from '@/lib/context/global/toast.context';
import CustomButton from '@/lib/ui/useable-components/button';

//Components
import CustomTextAreaField from '@/lib/ui/useable-components/custom-text-area-field';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import { NotificationErrors } from '@/lib/utils/constants';

// Hooks & react interfaces
import { INotificationFormProps } from '@/lib/utils/interfaces/notification.interface';
import { onErrorMessageMatcher } from '@/lib/utils/methods';
import { NotificationSchema } from '@/lib/utils/schema/notification';
import { useMutation } from '@apollo/client';
import { Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { Sidebar } from 'primereact/sidebar';
import { ChangeEvent, useContext } from 'react';

export default function NotificationForm({
  setVisible,
  visible,
}: INotificationFormProps) {
  // Hooks
  const t = useTranslations();
  const { getTranslation } = useLangTranslation();

  //Toast
  const { showToast } = useContext(ToastContext);

  //Intial state
  const initialValues = {
    title: '',
    body: '',
  };

  //Mutation
  const [sendNotificationUser] = useMutation(SEND_NOTIFICATION_USER, {
    refetchQueries: [{ query: GET_NOTIFICATIONS }],
    onCompleted: () => {
      showToast({
        title: getTranslation('new_notification'),
        type: 'success',
        message: getTranslation('notification_has_been_sent_successfully'),
        duration: 2500,
      });
    },
    onError: (err) => {
      showToast({
        title: getTranslation('error_notification'),
        type: 'error',
        message: err.cause?.message || getTranslation('something_went_wrong'),
        duration: 2500,
      });
    },
  });

  return (
    <Sidebar
      visible={visible}
      onHide={() => setVisible(false)}
      position="right"
      className="w-full sm:w-[450px]"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={NotificationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          await sendNotificationUser({
            variables: {
              notificationTitle: values.title,
              notificationBody: values.body,
            },
          });

          setSubmitting(false);
          setVisible(false);
        }}
        validateOnChange={false}
      >
        {({ handleSubmit, setFieldValue, values, isSubmitting, errors }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <div className="mb-2 flex flex-col">
                <h2 className='className="mb-3 text-xl font-bold'>
                  {getTranslation('send_notification')}
                </h2>
              </div>
              <div className="space-y-4">
                <CustomTextField
                  value={values.title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFieldValue('title', e.target.value)
                  }
                  name="title"
                  showLabel={true}
                  placeholder={getTranslation('title')}
                  type="text"
                  className={`${
                    onErrorMessageMatcher(
                      'title',
                      errors.title,
                      NotificationErrors
                    )
                      ? 'border border-red-500'
                      : ''
                  }`}
                />
                <CustomTextAreaField
                  value={values.body}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setFieldValue('body', e.target.value)
                  }
                  showLabel={true}
                  label={getTranslation('description')}
                  name="body"
                  placeholder={getTranslation('add_description_here')}
                  className={`${
                    onErrorMessageMatcher(
                      'body',
                      errors.body,
                      NotificationErrors
                    )
                      ? 'border border-red-500'
                      : ''
                  }`}
                  rows={5}
                />

                <div className="mt-4 flex justify-end">
                  <CustomButton
                    className="h-10 w-fit border-gray-300 bg-black px-8 text-white"
                    label={getTranslation('send')}
                    type="submit"
                    loading={isSubmitting}
                  />
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Sidebar>
  );
}
