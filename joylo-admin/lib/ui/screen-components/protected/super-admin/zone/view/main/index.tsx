// Core
import { useMutation } from '@apollo/client';
import { useState } from 'react';

// Prime React
import { FilterMatchMode } from 'primereact/api';

// Interface and Types
import {
  IZoneResponse,
  IZonesResponse,
  IActionMenuItem,
  IQueryResult,
  IZoneMainComponentsProps,
} from '@/lib/utils/interfaces';

// Context
import { useConfiguration } from '@/lib/hooks/useConfiguration';

// UI Components
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';
import Table from '@/lib/ui/useable-components/table';
import RidersTableHeader from '../header/table-header';

// Constants and Interfaces
import { ZONE_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/zone-columns';

// Hooks
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import useToast from '@/lib/hooks/useToast';

// GraphQL and Utilities
import { DELETE_ZONE, GET_ZONES } from '@/lib/api/graphql';

// Data
import { generateDummyZones } from '@/lib/utils/dummy';
import { useTranslations } from 'next-intl';
import { useLangTranslation } from '@/lib/context/global/language.context';

export default function ZoneMain({
  setIsAddZoneVisible,
  setZone,
}: IZoneMainComponentsProps) {
  // Hooks
  const t = useTranslations();
  const { getTranslation } = useLangTranslation();
  const { showToast } = useToast();
  const { ISPAID_VERSION } = useConfiguration();
  // State - Table
  const [deleteId, setDeleteId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<IZoneResponse[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: '' as string | null, matchMode: FilterMatchMode.CONTAINS },
  });

  // Query
  const { data, loading } = useQueryGQL(GET_ZONES, {
    fetchPolicy: 'cache-and-network',
  }) as IQueryResult<IZonesResponse | undefined, undefined>;

  //Mutation
  const [mutateDelete, { loading: mutationLoading }] = useMutation(
    DELETE_ZONE,
    {
      refetchQueries: [{ query: GET_ZONES }],
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

  const menuItems: IActionMenuItem<IZoneResponse>[] = [
    {
      label: getTranslation('edit'),
      command: (data?: IZoneResponse) => {
        if (data) {
          setIsAddZoneVisible(true);
          setZone(data); // Zone here
        }
      },
    },
    {
      label: getTranslation('delete'),
      command: (data?: IZoneResponse) => {
        if (data) {
          setDeleteId(data._id);
        }
      },
    },
  ];

  const handleDeleteZone = async () => {
    if (ISPAID_VERSION) {
      await mutateDelete({
        variables: { id: deleteId },
        onCompleted: () => {
          showToast({
            type: 'success',
            title: getTranslation('delete_zone'),
            message: getTranslation('zone_has_been_deleted_successfully'),
            duration: 3000,
          });
          setDeleteId('');
        },
      });
    } else {
      showToast({
        type: 'error',
        title: getTranslation('you_are_using_free_version'),
        message: getTranslation(
          'this_feature_is_only_available_in_paid_version'
        ),
      });
      setDeleteId('');
    }
  };

  return (
    <div className="pt-5">
      <Table
        header={
          <RidersTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
          />
        }
        data={data?.zones || (loading ? generateDummyZones() : [])}
        filters={filters}
        setSelectedData={setSelectedProducts}
        selectedData={selectedProducts}
        loading={loading}
        columns={ZONE_TABLE_COLUMNS({ menuItems })}
      />
      <CustomDialog
        loading={mutationLoading}
        visible={!!deleteId}
        onHide={() => {
          setDeleteId('');
        }}
        onConfirm={() => {
          handleDeleteZone();
        }}
        message={getTranslation('are_you_sure_you_want_to_delete_this_item')}
      />
    </div>
  );
}
