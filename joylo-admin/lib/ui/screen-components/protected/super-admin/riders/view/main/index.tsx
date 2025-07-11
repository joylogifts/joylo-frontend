'use client';

// Core
import { useMutation } from '@apollo/client';
import { useState } from 'react';

// Prime React
import { FilterMatchMode } from 'primereact/api';

// Interface and Types
import {
  IRiderResponse,
  IRidersDataResponse,
  IRidersMainComponentsProps,
} from '@/lib/utils/interfaces/rider.interface';

// UI Components
import RidersTableHeader from '../header/table-header';
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';
import Table from '@/lib/ui/useable-components/table';
import { RIDER_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/rider-columns';

// Utilities and Data
import { IActionMenuItem } from '@/lib/utils/interfaces/action-menu.interface';

// Hooks
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import useToast from '@/lib/hooks/useToast';

// GraphQL and Utilities
import { DELETE_RIDER, GET_RIDERS } from '@/lib/api/graphql';
import { IQueryResult } from '@/lib/utils/interfaces';

// Data
import { generateDummyRiders } from '@/lib/utils/dummy';

import { useRouter } from 'next/navigation';
import { useLangTranslation } from '@/lib/context/global/language.context';

export default function RidersMain({
  setIsAddRiderVisible,
  setRider,
}: IRidersMainComponentsProps) {
  // Hooks

  const { getTranslation } = useLangTranslation();
  const { showToast } = useToast();
  const router = useRouter();

  // State - Table
  const [deleteId, setDeleteId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<IRiderResponse[]>(
    []
  );
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: '' as string | null, matchMode: FilterMatchMode.CONTAINS },
  });

  // Query
  const { data, loading } = useQueryGQL(GET_RIDERS, {}) as IQueryResult<
    IRidersDataResponse | undefined,
    undefined
  >;

  //Mutation
  const [mutateDelete, { loading: mutationLoading }] = useMutation(
    DELETE_RIDER,
    {
      refetchQueries: [{ query: GET_RIDERS }],
    }
  );

  // For global search
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const menuItems: IActionMenuItem<IRiderResponse>[] = [
    {
      label: getTranslation('view'),
      command: (data?: IRiderResponse) => {
        if (data) {
          router.push(`/general/riders/${data._id}`);
        }
      },
    },
    {
      label: getTranslation('edit'),
      command: (data?: IRiderResponse) => {
        if (data) {
          setIsAddRiderVisible(true);
          setRider(data);
        }
      },
    },
    {
      label: getTranslation('delete'),
      command: (data?: IRiderResponse) => {
        if (data) {
          setDeleteId(data._id);
        }
      },
    },
  ];

  return (
    <div className="p-3">
      <Table
        header={
          <RidersTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
          />
        }
        data={data?.riders || (loading ? generateDummyRiders() : [])}
        filters={filters}
        setSelectedData={setSelectedProducts}
        selectedData={selectedProducts}
        loading={loading}
        columns={RIDER_TABLE_COLUMNS({ menuItems })}
      />
      <CustomDialog
        loading={mutationLoading}
        visible={!!deleteId}
        onHide={() => {
          setDeleteId('');
        }}
        onConfirm={() => {
          mutateDelete({
            variables: { id: deleteId },
            onCompleted: () => {
              showToast({
                type: 'success',
                title: getTranslation('success'),
                message: getTranslation('rider_deleted'),
                duration: 3000,
              });
              setDeleteId('');
            },
          });
        }}
        message={getTranslation('are_you_sure_you_want_to_delete_this_item')}
      />
    </div>
  );
}
