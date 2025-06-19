/* eslint-disable @typescript-eslint/no-explicit-any */

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Hooks
import { useContext, useState } from 'react';
import { ApolloError, useMutation } from '@apollo/client';

// Interface
import { ILanguageCardProps, ILanguageReponse } from '@/lib/utils/interfaces';

// Methods
import { onUseLocalStorage } from '@/lib/utils/methods';

// Icons
import { faRemove, faStar } from '@fortawesome/free-solid-svg-icons';

// GraphQL
import { DELETE_LANGUAGE, GET_LANGUAGES } from '@/lib/api/graphql';

// Components
import CustomDialog from '../delete-dialog';
import TextComponent from '../text-field';

// Contexts
import { ToastContext } from '@/lib/context/global/toast.context';
import { LanguageManagementContext } from '@/lib/context/super-admin/language-management.context';

// Utils & Constants
import { useTranslations } from 'next-intl';
import { Chip } from 'primereact/chip';
import { Tag } from 'primereact/tag';

export default function LanguageCard({ lng }: ILanguageCardProps) {
  // Props
  const { _id, label, code, isDefault, processed, processedAt } = lng;

  // Hooks
  const t = useTranslations();

  // Context
  const { language, onSetLanguage, languageResponse } = useContext(
    LanguageManagementContext
  );
  const { showToast } = useContext(ToastContext);
  // const { ISPAID_VERSION } = useConfiguration();
  const { ISPAID_VERSION } = { ISPAID_VERSION: true };

  // States
  const [isPopupOpen, setPopupOpen] = useState<boolean>(false);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState<boolean>(false);

  // API
  const [deleteLanguage, { loading }] = useMutation(DELETE_LANGUAGE, {
    refetchQueries: [{ query: GET_LANGUAGES }],
    onCompleted: () => {
      showToast({
        type: 'success',
        title: 'Language Delete',
        message: 'Language has been deleted successfully.',
      });

      // onResetVendor(true); // so after refetching is vendor can be selected.
      languageResponse.refetch();
    },
    onError: ({ networkError, graphQLErrors }: ApolloError) => {
      showToast({
        type: 'error',
        title: 'Language Delete',
        message:
          graphQLErrors[0]?.message ??
          networkError?.message ??
          'Language delete failed',
        duration: 2500,
      });
    },
  });

  // Handlers
  const onLanguageCardClicked = (_language: ILanguageReponse) => {
    onSetLanguage(_language);
    onUseLocalStorage('save', 'language', JSON.stringify(_language));
  };

  // API Hanlders
  const onHandleConfirmDeleteLanguage = async () => {
    try {
      if (ISPAID_VERSION) {
        await deleteLanguage({ variables: { id: _id } });
        setDeletePopupOpen(false);
      } else {
        setDeletePopupOpen(false);
        showToast({
          type: 'error',
          title: t('You are using free version'),
          message: t('This Feature is only Available in Paid Version'),
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Language Delete',
        message: 'Language failed to delete',
      });
    }
  };

  const onHandleHideDeleteLanguage = () => {
    setDeletePopupOpen(false);
  };

  const onHandlerDelete = () => {
    setDeletePopupOpen(true);
  };

  return (
    <div
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if (!(e.target as HTMLElement).closest('.three-dots')) {
          onLanguageCardClicked(lng);
        }
        setPopupOpen(false);
      }}
      className="w-full relative border-b-[1px]"
    >
      <div
        className={`flex items-center bg-${language?.code === code ? 'black' : 'white'} cursor-pointer p-2 px-3`}
      >
        <div className="flex flex-1 flex-col">
          <div className="w-fit flex gap-x-2">
            <TextComponent
              className={`text-card-h3 flex flex-1 text-xs text-${language?.code === code ? 'white' : 'black'}`}
              text={label}
            />

            <TextComponent
              className={`text-card-h3 flex flex-1 text-[10px] text-${language?.code === code ? 'white' : 'black'}`}
              text={`(${code ?? ''})`}
            />

            {isDefault && (
              <FontAwesomeIcon
                icon={faStar}
                scale={2}
                className="ml-2 text-[14px] text-yellow-500 cursor-pointer hover:scale-105"
              />
            )}
          </div>

          {processedAt && (
            <TextComponent
              className={`m-0 flex flex-1 text-[9px] text-gray-400`}
              text={new Date(processedAt).toUTCString()}
            />
          )}

          <Tag
            value={processed ? 'Processed' : 'Processing'}
            severity={processed ? 'success' : 'info'}
            className="w-fit h-fit mt-2 text-[8px] pl-2 pr-2"
          />
        </div>

        <div className="three-dots relative">
          {language?.code === code && (!isDefault) && (
            <FontAwesomeIcon
              icon={faRemove}
              className={`p-1 ${
                isPopupOpen ? 'text-gray-400' : 'text-white'
              } cursor-pointer hover:scale-105`}
              onClick={onHandlerDelete}
            />
          )}
        </div>
      </div>

      <CustomDialog
        loading={loading}
        visible={isDeletePopupOpen}
        onHide={onHandleHideDeleteLanguage}
        onConfirm={onHandleConfirmDeleteLanguage}
      />
    </div>
  );
}
