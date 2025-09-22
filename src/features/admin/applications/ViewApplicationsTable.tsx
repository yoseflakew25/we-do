'use client';

import {
  useDeleteApplicationMutation,
  useGetAllApplicationsAdminQuery,
} from '@/app/api/slices/volunteer-api-slice';
import { ApplicationFilters } from '@/app/api/types';
import ConfirmDialog, { DialogData } from '@/components/ConfirmDialog';
import { REACT_SELECT_CUSTOM_STYLE } from '@/components/forms/ValidatedInputs';
import {
  TableFilters,
  TableRow,
  TableWithFilters,
} from '@/features/organization/components/TableWithFilters';
import { useAvatarImage } from '@/hook';
import { SelectOption } from '@/select-options';
import { color } from '@material-tailwind/react/types/components/alert';
import dateFormat from 'dateformat';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { MdOutlineDeleteForever } from 'react-icons/md';
import ReactSelect from 'react-select';
import { toast } from 'react-toastify';

type ViewApplicationsProps = {
  orgOptions?: SelectOption[];
  opportunityOptions?: SelectOption[];
  refetchOpportunities?: (_orgID: string) => Promise<void>;
  isFetchingOpportunities?: boolean;
  isFetchingOrganizations?: boolean;
};
function ViewApplicationsTable({
  orgOptions,
  opportunityOptions,
  refetchOpportunities,
  isFetchingOpportunities,
  isFetchingOrganizations,
}: ViewApplicationsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const getAvatar = useAvatarImage();
  const [showDialog, setShowDialog] = useState(true);
  const [dialogData, setDialogData] = useState<DialogData>();
  const [deleteApplication] = useDeleteApplicationMutation();
  const buildApplicationFilters = (
    tableFilters: TableFilters,
    orgID?: string,
    opportunityID?: string
  ) => {
    const applicationFilters: ApplicationFilters = {
      sortKey: tableFilters.sort?.key,
      sortDesc: tableFilters.sort?.desc,
      page: tableFilters.page.number,
      pageSize: tableFilters.page.size,
      keyword: tableFilters.keyword,
    };
    if (tableFilters.filterValue) {
      applicationFilters.status = tableFilters.filterValue;
    }

    if (orgID) {
      applicationFilters.orgID = orgID === 'any' ? undefined : orgID;
    }
    if (opportunityID) {
      applicationFilters.opportunityID =
        opportunityID === 'any' ? undefined : opportunityID;
    }

    return applicationFilters;
  };

  const [tableFilters, setTableFilters] = useState<TableFilters>({
    sort: {
      key: searchParams.get('sortKey') || 'dateApplied',
      desc: searchParams.get('sortDesc')
        ? searchParams.get('sortDesc') === 'true'
        : true,
    },

    page: {
      number: Number(searchParams.get('page')) || 1,
      size: Number(searchParams.get('pageSize')) || 10,
    },
    filterValue: searchParams.get('status') || undefined,
    keyword: searchParams.get('keyword') || undefined,
  });

  const tableFilterOptions = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'In Review', value: 'in-review' },
    { label: 'Interview', value: 'interview' },
    { label: 'Offer Extended', value: 'offer-extended' },
    { label: 'Hired', value: 'hired' },
    { label: 'Declined', value: 'declined' },
    { label: 'Certified', value: 'certified' },
  ];
  const [applicationFilters, setApplicationFilters] =
    useState<ApplicationFilters>({
      ...buildApplicationFilters(tableFilters),
      orgID: searchParams.get('orgID') || undefined,
      opportunityID: searchParams.get('opportunityID') || undefined,
    });

  const {
    data: applicationData,
    refetch,
    isFetching: isFetchingApplicants,
  } = useGetAllApplicationsAdminQuery(applicationFilters, {
    refetchOnMountOrArgChange: 60,
  });

  const statusColors: { [key: string]: color | undefined } = {
    pending: 'lime',
    'in-review': 'blue',
    interview: 'purple',
    'offer-extended': 'teal',
    hired: 'green',
    declined: 'pink',
    certified: 'gray',
  };

  const parsedTableData: TableRow[] =
    applicationData?.data?.map((application) => {
      return {
        id: application.id,
        cells: {
          applicant: {
            type: 'listItem',
            listItem: {
              title: application.name,
              subtitle: application.email,
            },
          },
          organization: {
            type: 'listItem',
            listItem: {
              title: application.orgName,
              subtitle: application.title,
              avatarUrl: getAvatar(application.logoUrl, undefined),
            },
          },

          status: {
            type: 'chips',
            chips: [
              {
                text: application.status || 'Not Set',
                color: statusColors[application.status || 'none'],
              },
            ],
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
                    title: 'Are you sure you wish to delete this Application?',
                    description: 'This is an irreversable action.',
                    action: async () => {
                      await deleteApplication({ ids: [application.id] })
                        .unwrap()
                        .then(() => {
                          toast.success('Appplication deleted successfully!', {
                            theme: 'light',
                          });
                          refetch();
                        })
                        .catch(
                          (errorResponse: {
                            data: { message: string };
                            status: number;
                          }) => {
                            toast.error(errorResponse.data.message, {
                              autoClose: false,
                              theme: 'light',
                            });
                          }
                        );
                    },
                    color: 'pink' as color,
                    actionName: 'Delete',
                  });
                },
                color: 'pink' as color,
              },
            ],
          },
          dateApplied: {
            type: 'text',
            text: dateFormat(application.dateApplied, 'ddd, mmm dd, yyyy'),
          },
        },
      };
    }) || [];

  const updatePath = (filterData: ApplicationFilters) => {
    const paramString = Object.entries(filterData)
      .map(([key, value]) => (value != null ? `${key}=${value}` : undefined))
      .filter((item) => item != null)
      .join('&');

    router.replace(`${pathname}?${paramString}`, { scroll: false });
  };

  const handleTableUpdate = async (filters: TableFilters) => {
    setTableFilters(filters);

    const filterData = buildApplicationFilters(filters);

    updatePath(filterData);
    setApplicationFilters(filterData);
  };
  const tableHeaders: SelectOption[] = [
    { label: 'Applicant', value: 'Name' },
    { label: 'Organization', value: 'orgName' },
    { label: 'Status', value: 'status' },
    { label: 'Actions', value: 'actions' },
    { label: 'Date Applied', value: 'dateApplied' },
  ];

  const bulkActions = [
    {
      icon: <MdOutlineDeleteForever size={18} />,
      title: 'Delete Selected',
      color: 'red' as color,
      action: (_ids?: string[]) => {
        setShowDialog(true);
        setDialogData({
          title: `Are you sure you wish to delete these Applicaitons? (${_ids?.length} selected)`,
          description: 'This move cannot be reversed.',
          action: async () => {
            await deleteApplication({ ids: _ids || [] })
              .unwrap()
              .then((response) => {
                toast.success(response.message, {
                  theme: 'light',
                });
                refetch();
              })
              .catch(
                (errorResponse: {
                  data: { message: string };
                  status: number;
                }) => {
                  toast.error(errorResponse.data.message, {
                    autoClose: false,
                    theme: 'light',
                  });
                }
              );
          },
          color: 'red',
          actionName: 'Delete Selected',
        });
      },
    },
  ];

  return (
    <>
      <div className='container mx-auto flex flex-wrap py-4 md:flex-nowrap justify-center sm:justify-between '>
        <h1 className='font-poppins font-black text-2xl sm:text-3xl  text-neutrals100'>
          Applications
        </h1>
        <div className='flex gap-3 flex-wrap justify-center'>
          {orgOptions && refetchOpportunities && (
            <div className='w-80'>
              <label
                className='block text-neutrals80 text-base font-semibold mb-1'
                htmlFor='email'
              >
                Organization
              </label>
              <ReactSelect
                isLoading={isFetchingOrganizations}
                isDisabled={isFetchingOrganizations}
                styles={REACT_SELECT_CUSTOM_STYLE}
                menuPortalTarget={document.body}
                options={orgOptions}
                value={orgOptions.find(
                  ({ value }) => value === applicationFilters.orgID
                )}
                // @ts-ignore This gives out the wrong type for some reason
                onChange={async (newValue: SelectOption) => {
                  setApplicationFilters({
                    ...applicationFilters,
                    orgID: newValue.value,
                    opportunityID: undefined,
                  });
                  updatePath({
                    ...applicationFilters,
                    orgID: newValue.value,
                    opportunityID: undefined,
                  });
                  await refetchOpportunities(newValue.value);
                }}
              />
            </div>
          )}

          {opportunityOptions && opportunityOptions.length && (
            <div className='w-80'>
              <label
                className='block text-neutrals80 text-base font-semibold mb-1 text-[#515B6F]'
                htmlFor='email'
              >
                Opportunity
              </label>
              <ReactSelect
                isLoading={isFetchingOpportunities}
                isDisabled={
                  isFetchingOpportunities ||
                  applicationFilters.orgID == null ||
                  applicationFilters.orgID == 'any'
                }
                styles={REACT_SELECT_CUSTOM_STYLE}
                menuPortalTarget={document.body}
                options={opportunityOptions}
                value={opportunityOptions.find(
                  ({ value }) => value === applicationFilters.opportunityID
                )}
                // @ts-ignore This gives out the wrong type for some reason
                onChange={(newValue: SelectOption) => {
                  setApplicationFilters({
                    ...applicationFilters,
                    opportunityID: newValue.value,
                  });
                  updatePath({
                    ...applicationFilters,
                    opportunityID: newValue.value,
                  });
                }}
              />
            </div>
          )}
        </div>
      </div>
      <div className='container px-4 sm:px-6 lg:px-8'>
        <div className='mt-8 flow-root'>
          <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
            <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
              <TableWithFilters
                dataType='Applications'
                tableData={parsedTableData}
                headers={tableHeaders}
                refreshTable={handleTableUpdate}
                loading={isFetchingApplicants}
                filterOptions={tableFilterOptions}
                filters={tableFilters}
                // onRowClick={handleRowClick}
                bulkActions={bulkActions}
                totalCount={applicationData?.count}
                titleMessage=''
                // useStickyHeader={isSidebarOpen}
              />
            </div>
          </div>
        </div>

        {/* {isSidebarOpen && (
          <ViewUserDetail
            roleIsUser={selectedUserRole === 'user'}
            userId={selectedUserId}
            onClose={closeSidebar}
            onDeleteSuccess={onDeleteSuccess}
          />
        )} */}
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
}

export default ViewApplicationsTable;
