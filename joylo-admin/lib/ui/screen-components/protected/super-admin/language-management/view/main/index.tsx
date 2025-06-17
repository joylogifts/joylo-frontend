/* eslint-disable @typescript-eslint/no-explicit-any */



// Core
import { useContext, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Chip } from 'primereact/chip';
import ReactJson from 'react18-json-view';
import { ApolloError, useMutation } from '@apollo/client';
import 'react18-json-view/src/style.css';

// UI Components
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';
import NoData from '@/lib/ui/useable-components/no-data';
import HeaderText from '@/lib/ui/useable-components/header-text';
import { ProgressSpinner } from 'primereact/progressspinner';
import LanguageCard from '@/lib/ui/useable-components/language-card';

import { faAdd } from '@fortawesome/free-solid-svg-icons';
// Icons

// Context
import { LanguageManagementContext } from '@/lib/context/super-admin/language-management.context';

// Interface
import {
  ILanguageManagementMainComponentsProps,
  IQueryResult,
  ITranslationResponseGraphQL,
} from '@/lib/utils/interfaces';

// Constants
import { SELECTED_VENDOR_EMAIL } from '@/lib/utils/constants';

// Methods
import { onUseLocalStorage } from '@/lib/utils/methods';
import CustomLanguageSkeleton from '@/lib/ui/useable-components/custom-skeletons/language.skeleton';
import {
  GET_TRANSLATIONS_BY_LANGUAGE_CODE,
  MODIFY_TRANSLATIONS,
} from '@/lib/api/graphql';

// Hooks
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import useToast from '@/lib/hooks/useToast';

export default function LanguageManagementMain({
  activeTab,
}: ILanguageManagementMainComponentsProps) {
  // Hooks
  const t = useTranslations();
  const { showToast } = useToast();

  // Context
  const { language, languageResponse } = useContext(LanguageManagementContext);

  
  // States
  const [data, setData] = useState({});
  const [addedOrUpdated, setAddedOrUpdated] = useState<Record<string, string>>(
    {}
  );
  const [removedKeys, setRemovedKeys] = useState<string[]>([]);

  // API
  const translationsResponse = useQueryGQL(
    GET_TRANSLATIONS_BY_LANGUAGE_CODE,
    {
      languageCode: language?.code ?? 'en',
    },
    {
      debounceMs: 300,
      fetchPolicy: "network-only"
    }
  ) as IQueryResult<ITranslationResponseGraphQL | undefined, undefined>;

  // Mutation
  const [modifyTranslations, { loading }] = useMutation(MODIFY_TRANSLATIONS, {
    onCompleted: () => {
      showToast({
        type: 'success',
        title: 'Translation Update',
        message: 'Translations has been updated successfully.',
      });

      // onResetVendor(true); // so after refetching is vendor can be selected.
      languageResponse.refetch();
    },
    onError: ({ networkError, graphQLErrors }: ApolloError) => {
      showToast({
        type: 'error',
        title: 'Translation Update',
        message:
          graphQLErrors[0]?.message ??
          networkError?.message ??
          'Translations update failed',
        duration: 2500,
      });
    },
  });

  // Handlers
  const getKey = (e: any) => e.indexOrName;

  const handleAddOrEdit = (e: any) => {
    const key = getKey(e);

    // Remove from deleted if re-added
    setRemovedKeys((prev) => prev.filter((k) => k !== key));

    // Track as added or updated
    setAddedOrUpdated((prev) => ({
      ...prev,
      [key]: e.newValue,
    }));

    setData(e.src);
  };

  const handleDelete = (e: any) => {
    console.log(e);
    const key = getKey(e);

    // Block deletion of the entire root object
    const isRootDelete =
      (!e.indexOrName || e.indexOrName === undefined) && e.depth === 1;

    if (isRootDelete) {
      showToast({
        type: 'error',
        title: 'Translation Delete',
        message: 'Root object cannot be deleted.',
        duration: 2500,
      });

      // Prevent deletion by returning the current state
      setData(e.src);
      return;
    }

    // Proceed with key deletion
    if (!key) return;

    // Add to deleted
    setRemovedKeys((prev) => [...new Set([...prev, key])]);

    // Remove from added/updated
    setAddedOrUpdated((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleSubmit = () => {
    console.log('Removed Keys:', removedKeys);
    console.log('Added/Updated:', addedOrUpdated);
 
    modifyTranslations({
      variables: {
        keys: removedKeys,
        inputs: Object.entries(addedOrUpdated).map(([key, value]) => ({
          key,
          value,
        })),
      },
    });
  };

  // Use Effects
  useEffect(() => {
    if (!translationsResponse?.data?.translations?.translations) return;
    setData(
      JSON.parse(
        JSON.stringify(translationsResponse?.data?.translations?.translations)
      )
    );
  }, [translationsResponse?.data?.translations?.translations]);

  return (
    <div className="flex flex-grow flex-col overflow-hidden sm:flex-row">
      <div
        className={`w-full overflow-y-auto border-gray-200 bg-white sm:w-1/6 ${
          activeTab === 'language' ? '' : 'hidden sm:block'
        }`}
      >
        {/* Mobile-only header for Vendors section */}
        <div className="mt-3  border-b p-3 sm:hidden">
          <div className="mb-4 flex items-center justify-between">
            <HeaderText text={t('Vendors')} />
            <TextIconClickable
              className="rounded border-gray-300 bg-black text-white sm:w-auto"
              icon={faAdd}
              iconStyles={{ color: 'white' }}
              title={t('Add Vendor')}
              onClick={() => {}}
            />
          </div>
        </div>

        {/* Vendors content */}
        <div className="pb-16">
          {languageResponse?.loading ? (
            new Array(10)
              .fill(0)
              .map((_, i: number) => <CustomLanguageSkeleton key={i} />)
          ) : (languageResponse?.data?.languages?.length ?? 0) > 0 ? (
            languageResponse?.data?.languages?.map((lang, index) => (
              <LanguageCard
                key={lang._id}
                lng={lang}
                isLast={
                  languageResponse?.data?.languages?.length! - 1 === index
                }
              />
            ))
          ) : (
            <NoData />
          )}
        </div>
      </div>

      <div
        className={`flex-1 overflow-y-auto border-l border-gray-200 px-2 ${
          activeTab === 'translations' ? '' : 'hidden sm:block'
        }`}
      >
        {/* Header for Restaurants section */}
        <div className="border-b  pt-3">
          <div className="mb-4 flex items-center justify-between">
            <div className="hidden sm:block">
              <HeaderText text="Translations" />
            </div>
            <div className="flex flex-col sm:hidden">
              <HeaderText text="Translations" />

              <Chip
                label={`${(onUseLocalStorage('get', SELECTED_VENDOR_EMAIL) ?? '').slice(0, 20)}`}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <ReactJson
          src={data}
          displaySize
          onAdd={handleAddOrEdit}
          onEdit={handleAddOrEdit}
          onDelete={handleDelete}
          editable={language?.isDefault ? {add: true, edit: true, delete: true }: undefined}
          collapsed={false}
        />
        <button
          className="float-end my-2 block"
          onClick={handleSubmit}
          style={{
            marginTop: 20,
            padding: '10px 20px',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          {loading ? (
            <ProgressSpinner
              className="m-0 h-6 w-6 items-center self-center p-0"
              strokeWidth="5"
              style={{ fill: 'white', accentColor: 'white' }}
              color="white"
            />
          ) : (
            'Update'
          )}
        </button>
      </div>
    </div>
  );
}
