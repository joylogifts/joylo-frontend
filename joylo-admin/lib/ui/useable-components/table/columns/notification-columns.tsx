// Components
import { INotification } from '@/lib/utils/interfaces/notification.interface';
import CustomButton from '../../button';

// Hooks
import { useContext, useMemo } from 'react';
import { useMutation } from '@apollo/client';

// GrahpQL
import { GET_NOTIFICATIONS, SEND_NOTIFICATION_USER } from '@/lib/api/graphql';

// Contexts
import { ToastContext } from '@/lib/context/global/toast.context';
import { useTranslations } from 'next-intl';
import { useLangTranslation } from '@/lib/context/global/language.context';

export const NOTIFICATIONS_TABLE_COLUMNS = () => {
  // Hooks
  const t = useTranslations();
  const { getTranslation } = useLangTranslation();
  const { showToast } = useContext(ToastContext);

  // Mutations
  const [sendNotificationUser, { loading }] = useMutation(
    SEND_NOTIFICATION_USER,
    {
      onCompleted: () => {
        showToast({
          type: 'success',
          title: getTranslation('resend_notification'),
          message: getTranslation(
            'the_notification_has_been_resent_successfully'
          ),
        });
      },
      onError: (err) => {
        showToast({
          type: 'error',
          title: getTranslation('resend_notification'),
          message:
            err?.cause?.message ||
            getTranslation('an_error_occured_while_resending_the_notification'),
        });
      },
      refetchQueries: [{ query: GET_NOTIFICATIONS }],
    }
  );

  // Handlers
  async function handleResendNotification(rowData: INotification) {
    await sendNotificationUser({
      variables: {
        notificationTitle: rowData.title,
        notificationBody: rowData.body,
      },
    });
  }

  // Columns
  const notification_columns = useMemo(
    () => [
      {
        headerName: getTranslation('title'),
        propertyName: 'title',
      },
      {
        headerName: getTranslation('description'),
        propertyName: 'body',
      },
      {
        headerName: getTranslation('date'),
        propertyName: 'createdAt',
        body: (rowData: INotification) => {
          const seconds = parseInt(rowData.createdAt);
          const newDate = new Date(seconds).toDateString();
          return <span>{newDate}</span>;
        },
      },
      {
        headerName: getTranslation('change_status'),
        propertyName: 'status',
        body: (rowData: INotification) => (
          <CustomButton
            onClick={() => handleResendNotification(rowData)}
            label="Resend"
            loading={loading}
            type="button"
            className="block self-end"
          />
        ),
      },
    ],
    []
  );
  return notification_columns;
};
