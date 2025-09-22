'use client';

import {
  useDeleteOpportunityAsAdminMutation,
  useGetAllOpportunitiesQuery,
  useGetOrgOpportunitiesQuery,
} from '@/app/api/slices/opportunity-api-slice';
import { OpportunityDetail, OpportunityFilters } from '@/app/api/types';
import ConfirmDialog, { DialogData } from '@/components/ConfirmDialog';
import ErrorPage from '@/components/ErrorPage';
import { REACT_SELECT_CUSTOM_STYLE } from '@/components/forms/ValidatedInputs';
import {
  TableFilters,
  TableRow,
  TableWithFilters,
} from '@/features/organization/components/TableWithFilters';
import { useOrgLogo } from '@/hook';
import {
  SelectOption,
  OP_STATUS_OPTIONS,
  OP_TYPE_OPTIONS,
} from '@/select-options';
import { colors } from '@material-tailwind/react/types/generic';
import dateFormat from 'dateformat';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  MdOutlineDeleteForever,
  MdOutlineEdit,
  MdOutlineFormatListBulleted,
} from 'react-icons/md';
import ReactSelect from 'react-select';
import { toast } from 'react-toastify';

const chipColors: { [key: string]: colors } = {
  open: 'teal',
  closed: 'pink',
  inPerson: 'blue',
  virtual: 'purple',
};

interface ViewOpportunitiesTableProps {
  orgOptions?: SelectOption[];
}

const ViewOpportunitiesTable: React.FC<ViewOpportunitiesTableProps> = ({
  orgOptions,
}) => {
  const getOrgLogo = useOrgLogo();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const isSuperAdmin = session?.user.role === 'superadmin';
  const [showDialog, setShowDialog] = useState(true);
  const [dialogData, setDialogData] = useState<DialogData>();
  const t = useTranslations('orgOpportunities');

  const [tableFilters, setTableFilters] = useState<TableFilters>({
    sort: {
      key: searchParams.get('sortKey') || 'datePosted',
      desc: searchParams.get('sortDesc')
        ? searchParams.get('sortDesc') === 'true'
        : true,
    },
    page: {
      number: Number(searchParams.get('page')) || 1,
      size: Number(searchParams.get('pageSize')) || 10,
    },
    filterValue: searchParams.get('status') || 'open',
    keyword: searchParams.get('keyword') || undefined,
  });

  const buildOpportunityFilters = (
    tableFilters: TableFilters,
    orgID?: string
  ) => {
    const opportunityFilters: OpportunityFilters = {
      sortKey: tableFilters.sort?.key,
      sortDesc: tableFilters.sort?.desc,
      page: tableFilters.page.number,
      pageSize: tableFilters.page.size,
      keyword: tableFilters.keyword,
    };
    if (tableFilters.filterValue) {
      opportunityFilters.status = tableFilters.filterValue;
    }
    if (orgID) {
      opportunityFilters.orgID = orgID === 'any' ? undefined : orgID;
    }

    return opportunityFilters;
  };

  const [opportunityFilters, setOpportunityFilters] =
    useState<OpportunityFilters>({
      ...buildOpportunityFilters(tableFilters),
      orgID: searchParams.get('orgID') || undefined,
    });

  const {
    data: orgOpportunityData,
    refetch: refetchOrgOpportunities,
    isFetching: isFetchingOrgOpportunities,
    isError: isOrgOpportunityError,
  } = useGetOrgOpportunitiesQuery(opportunityFilters, {
    refetchOnMountOrArgChange: 60,
  });

  const {
    data: allOpportunityData,
    refetch: refetchAllOpportunities,
    isFetching: isFetchingAllOpportunities,
    isError: isAllOpportunityError,
  } = useGetAllOpportunitiesQuery(
    { ...opportunityFilters },
    {
      refetchOnMountOrArgChange: 60,
    }
  );

  const [deleteOpportunity] = useDeleteOpportunityAsAdminMutation();

  const [opportunityData, refetch, isFetchingOpportunities, isError] =
    isSuperAdmin
      ? [
          allOpportunityData,
          refetchAllOpportunities,
          isFetchingAllOpportunities,
          isAllOpportunityError,
        ]
      : [
          orgOpportunityData,
          refetchOrgOpportunities,
          isFetchingOrgOpportunities,
          isOrgOpportunityError,
        ];

  const getAdminColumns = (opportunity: OpportunityDetail) =>
    isSuperAdmin
      ? ({
          postedBy: {
            type: 'listItem',
            listItem: {
              title: opportunity.orgName,
              subtitle: opportunity.orgEmail,
              avatarUrl: getOrgLogo(opportunity.logoUrl),
              square: true,
            },
          },
          actions: {
            type: 'actions',
            actions: [
              {
                children: <MdOutlineDeleteForever size={18} />,
                title: 'Delete',
                onClick: () => {
                  setShowDialog(true);
                  setDialogData({
                    title: 'Are you sure you wish to delete?',
                    description: 'This is an irreversable action.',
                    action: async () => {
                      await deleteOpportunity(opportunity.id)
                        .unwrap()
                        .then(() => {
                          toast.success('Opportuninity deleted successfully!', {
                            theme: 'light',
                          });
                          refetch();
                        })
                        .catch(
                          (errorResponse: {
                            data: { message: string };
                            status: number;
                          }) => {
                            toast.error(errorResponse.data?.message, {
                              autoClose: false,
                              theme: 'light',
                            });
                          }
                        );
                    },
                    color: 'pink',
                    actionName: 'Delete',
                  });
                },
                color: 'pink',
              },
              {
                children: <MdOutlineEdit size={18} />,
                title: 'Edit',
                onClick: () => {
                  router.push(`${pathname}/${opportunity.id}/edit`);
                },
                color: 'purple',
              },
              {
                children: <MdOutlineFormatListBulleted size={18} />,
                title: 'View Applicants',
                onClick: () => {
                  router.push(
                    `/admin/volunteers?orgID=${opportunity.orgID}&opportunityID=${opportunity.id}`
                  );
                },
                color: 'blue',
              },
            ],
          },
        } as TableRow['cells'])
      : {};

  const parsedTableData: TableRow[] =
    opportunityData?.data?.map((opportunity) => {
      return {
        id: opportunity.id,
        cells: {
          role: { type: 'text', text: opportunity.title },
          ...getAdminColumns(opportunity),
          status: {
            type: 'chips',
            chips: [
              {
                text:
                  OP_STATUS_OPTIONS.find(
                    ({ value }) => value == opportunity.status
                  )?.label || '',
                color: chipColors[opportunity.status],
              },
            ],
          },
          opportunityType: {
            type: 'chips',
            chips: [
              {
                text:
                  OP_TYPE_OPTIONS.find(
                    ({ value }) => value == opportunity.opType
                  )?.label || '',
                color: chipColors[opportunity.opType],
              },
            ],
          },
          applicants: {
            type: 'text',
            text: opportunity.applicantsCount.toString(),
          },

          deadline: opportunity.isRolling
            ? {
                type: 'chips',
                chips: [{ text: 'Rolling', color: 'teal' }], // Render "Rolling" as a chip
              }
            : {
                type: 'text',
                text: dateFormat(opportunity.deadline!, 'ddd, mmm dd, yyyy'), // Render the regular deadline without a chip
              },
          datePosted: {
            type: 'text',
            text: dateFormat(opportunity.datePosted, 'ddd, mmm dd, yyyy'),
          },
        },
      };
    }) || [];

  const updatePath = (filterData: OpportunityFilters) => {
    const paramString = Object.entries(filterData)
      .map(([key, value]) => (value != null ? `${key}=${value}` : undefined))
      .filter((item) => item != null)
      .join('&');

    router.replace(`${pathname}?${paramString}`, { scroll: false });
  };

  const handleTableUpdate = async (filters: TableFilters) => {
    setTableFilters(filters);

    const filterData = buildOpportunityFilters(
      filters,
      opportunityFilters.orgID
    );
    updatePath(filterData);
    setOpportunityFilters(filterData);
  };

  const handleRowClick = (id: string) => {
    router.push(`${pathname}/${id}`);
  };

  const tableFilterOptions = [
    ...OP_STATUS_OPTIONS,
    { label: 'All', value: '' },
  ];

  const getAdminHeaders = () =>
    isSuperAdmin
      ? [
          { label: 'Posting Organization', value: 'orgName' },
          { label: 'Actions', value: 'actions' },
        ]
      : [];

  const tableHeaders: SelectOption[] = [
    { label: `${t('tableHeaders.role')}`, value: 'title' },
    ...getAdminHeaders(),
    { label: `${t('tableHeaders.status')}`, value: 'status' },
    { label: `${t('tableHeaders.opportunityType')}`, value: 'opType' },
    { label: `${t('tableHeaders.applicants')}`, value: 'applicantsCount' },
    { label: `${t('tableHeaders.deadline')}`, value: 'deadline' },
    { label: `${t('tableHeaders.datePosted')}`, value: 'datePosted' },
  ];

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <>
      <div className='container mx-auto mt-12 flex flex-wrap py-4 md:flex-nowrap justify-center sm:justify-between '>
        <h1 className='font-poppins text-2xl sm:text-3xl text-neutrals100'>
          {t('pageTitle')}
        </h1>
        <div className='flex gap-3 flex-wrap justify-center'>
          {orgOptions && (
            <div className='w-80'>
              <label
                className='block text-neutrals80 text-base font-semibold mb-1'
                htmlFor='email'
              >
                Posting Organization
              </label>
              <ReactSelect
                styles={REACT_SELECT_CUSTOM_STYLE}
                menuPortalTarget={document.body}
                options={orgOptions}
                value={orgOptions.find(
                  ({ value }) => value === (opportunityFilters.orgID || 'any')
                )}
                // @ts-ignore This gives out the wrong type for some reason
                onChange={(newValue: SelectOption) => {
                  const newOrgId =
                    newValue.value !== 'any' ? newValue.value : undefined;
                  setOpportunityFilters({
                    ...opportunityFilters,
                    orgID: newOrgId,
                  });
                  updatePath({
                    ...opportunityFilters,
                    orgID: newOrgId,
                  });
                }}
              />
            </div>
          )}
        </div>
      </div>
      <div className='container mx-auto items-center px-7 sm:px-6 lg:px-8 '>
        <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='min-w-full py-2 align-middle sm:px-6 lg:px-8'>
            <TableWithFilters
              dataType={t('tableHeaders.title')}
              tableData={parsedTableData}
              headers={tableHeaders}
              refreshTable={handleTableUpdate}
              loading={isFetchingOpportunities}
              filterOptions={tableFilterOptions}
              filters={tableFilters}
              onRowClick={handleRowClick}
              totalCount={opportunityData?.count || parsedTableData.length} // this will need to be fetched from the backend.
              titleMessage={t('tableHeaders.subTitle')}
            />
          </div>
        </div>
      </div>

      {dialogData && (
        <ConfirmDialog
          {...dialogData}
          isOpen={showDialog}
          dialogHandler={setShowDialog}
        />
      )}
    </>
  );
};

export default ViewOpportunitiesTable;
