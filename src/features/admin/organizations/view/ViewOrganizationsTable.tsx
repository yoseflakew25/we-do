'use client';

import {
  useDeleteOrganizationsAsAdminMutation,
  useGetAllOrganizationsQuery,
  useUpdateOrgProfileStatusesMutation,
} from '@/app/api/slices/org-api-slice';
import { AdminOrganizationProfile, PaginationFilters } from '@/app/api/types';
import ConfirmDialog, { DialogData } from '@/components/ConfirmDialog';
import ErrorPage from '@/components/ErrorPage';
import {
  TableFilters,
  TableRow,
  TableWithFilters,
} from '@/features/organization/components/TableWithFilters';
import { useAvatarImage, useOrgLogo } from '@/hook';
import { ORG_STATUS_OPTIONS, SelectOption } from '@/select-options';
import { color } from '@material-tailwind/react/types/components/alert';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  MdCheck,
  MdClose,
  MdOutlineDeleteForever,
  MdOutlineEdit,
  MdOutlineFormatListBulleted,
} from 'react-icons/md';
import { toast } from 'react-toastify';

const ViewOrganizationsTable: React.FC = () => {
  const getOrgLogo = useOrgLogo();
  const getAvatar = useAvatarImage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showDialog, setShowDialog] = useState(true);
  const [dialogData, setDialogData] = useState<DialogData>();

  const [deleteOrganization] = useDeleteOrganizationsAsAdminMutation();
  const [updateOrgProfileStatuses] = useUpdateOrgProfileStatusesMutation();

  const [tableFilters, setTableFilters] = useState<TableFilters>({
    sort: {
      key: searchParams.get('sortKey') || undefined,
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

  const profileStatusColors: { [key: string]: color } = {
    incomplete: 'amber',
    complete: 'blue',
    verified: 'teal',
    rejected: 'red',
    disabled: 'pink',
  };

  const buildOrganizationFilters = (tableFilters: TableFilters) => {
    const organizationFilters: PaginationFilters = {
      sortKey: tableFilters.sort?.key,
      sortDesc: tableFilters.sort?.desc,
      page: tableFilters.page.number,
      pageSize: tableFilters.page.size,
      keyword: tableFilters.keyword,
    };
    if (tableFilters.filterValue) {
      organizationFilters.status = tableFilters.filterValue;
    }

    return organizationFilters;
  };

  const [organizationFilters, setOrganizationFilters] =
    useState<PaginationFilters>(buildOrganizationFilters(tableFilters));

  const {
    data: orgListResponse,
    isFetching: isFetchingOrganizations,
    isError,
    refetch,
  } = useGetAllOrganizationsQuery(organizationFilters);

  const getProfileStatusButtons = (organization: AdminOrganizationProfile) => {
    const verifyButton = {
      children: <MdCheck size={18} />,
      title: 'Verify',
      onClick: () => {
        setShowDialog(true);
        setDialogData({
          title: 'Are you sure you wish to Verify?',
          description: 'This move can be reversed later on.',
          action: async () => {
            await updateOrgProfileStatuses({
              newStatus: 'verified',
              comment: 'Account has been found to be valid',
              ids: [organization.id],
            })
              .unwrap()
              .then(() => {
                toast.success(
                  'Organization profile account verified successfully!',
                  {
                    theme: 'light',
                  }
                );
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
          color: 'teal' as color,
          actionName: 'Verify',
        });
      },
      color: 'teal' as color,
    };

    const rejectButton = {
      children: <MdClose size={18} />,
      title: 'Reject',
      onClick: () => {
        setShowDialog(true);
        setDialogData({
          title: 'Are you sure you wish to Reject this account verification?',
          description: 'This move can be reversed later on.',
          action: async () => {
            await updateOrgProfileStatuses({
              newStatus: 'rejected',
              comment: 'Account has been found to be invalid',
              ids: [organization.id],
            })
              .unwrap()
              .then(() => {
                toast.success(
                  'Organization profile account verification Rejected!',
                  {
                    theme: 'light',
                  }
                );
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
          color: 'amber' as color,
          actionName: 'Reject',
        });
      },
      color: 'amber' as color,
    };

    switch (organization.userProfileStatus?.toLowerCase()) {
      case 'unverified':
        return [verifyButton, rejectButton];
      case 'verified':
        return [rejectButton];
      case 'rejected':
        return [verifyButton];
    }
    return [];
  };

  const parsedTableData: TableRow[] =
    orgListResponse?.data.map((organization) => {
      return {
        id: organization.id,
        cells: {
          organization: {
            type: 'listItem',
            listItem: {
              title: organization.orgName,
              subtitle: organization.orgEmail,
              avatarUrl: getOrgLogo(organization.orgLogoUrl),
              square: true,
            },
          },
          orgRepresentative: {
            type: 'listItem',
            listItem: {
              title: organization.userName,
              subtitle: organization.userEmail,
              avatarUrl: getAvatar(
                organization.userName,
                organization.profilePicUrl
              ),
            },
          },
          status: {
            type: 'chips',
            chips: [
              {
                text: organization.userProfileStatus || 'UNKNOWN',
                color:
                  profileStatusColors[
                    organization.userProfileStatus?.toLowerCase() || 'UNKNOWN'
                  ],
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
                    title:
                      'Are you sure you wish to delete this organization profile?',
                    description: 'This move cannot be reversed.',
                    action: async () => {
                      await deleteOrganization({ ids: [organization.id] })
                        .unwrap()
                        .then(() => {
                          toast.success(
                            'Organization profile account deleted successfully!',
                            {
                              theme: 'light',
                            }
                          );
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
                  router.push(`/admin/organizations/${organization.id}/edit`);
                },
                color: 'purple',
              },
              ...getProfileStatusButtons(organization),
              {
                children: <MdOutlineFormatListBulleted size={18} />,
                title: 'View Opportunities',
                onClick: () => {
                  router.push(`/admin/opportunities?orgID=${organization.id}`);
                },
                color: 'blue',
              },
            ],
          },
          opportunities: {
            type: 'chips',
            chips: [
              // TODO: fit in the proper numbers from backend
              {
                text: `${organization.activeOpportunities} Active`,
                color: 'teal',
              },
              {
                text: `${
                  organization.totalOpportunities -
                  organization.activeOpportunities
                } Closed`,
                color: 'amber',
              },
            ],
          },
          successfulConnects: {
            type: 'text',
            text: organization.successfulConnections.toString(),
          },
        },
      };
    }) || [];

  const handleTableUpdate = async (filters: TableFilters) => {
    setTableFilters(filters);
    const filterData = buildOrganizationFilters(filters);
    const paramString = Object.entries(filterData)
      .map(([key, value]) => (value != null ? `${key}=${value}` : undefined))
      .filter((item) => item != null)
      .join('&');
    router.replace(`${pathname}?${paramString}`, { scroll: false });
    setOrganizationFilters(filterData);
  };

  const handleRowClick = (id: string) => {
    router.push(`${pathname}/${id}`);
  };

  const tableFilterOptions = [
    { label: 'All', value: '' },
    ...ORG_STATUS_OPTIONS,
  ];

  const tableHeaders: SelectOption[] = [
    { label: 'Organization', value: 'orgName' },
    { label: 'Representative', value: 'userName' },
    { label: 'Status', value: 'userProfileStatus' },
    { label: 'Actions', value: 'actions' },
    { label: 'Opportunities', value: 'totalOpportunities' },
    { label: 'Successful Connects', value: 'successfulConnects' },
  ];

  if (isError) {
    return <ErrorPage />;
  }

  const bulkActions = [
    {
      icon: <MdOutlineDeleteForever size={18} />,
      title: 'Delete Selected',
      color: 'red' as color,
      action: (_ids?: string[]) => {
        setShowDialog(true);
        setDialogData({
          title: `Are you sure you wish to delete these organization profiles? (${_ids?.length} selected)`,
          description: 'This move cannot be reversed.',
          action: async () => {
            await deleteOrganization({ ids: _ids || [] })
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
      <div className='container mx-auto items-center p-4 sm:px-6 lg:px-8 m-1'>
        <h1 className='font-poppins font-black text-2xl sm:text-3xl  text-neutrals100'>
          Organizations Listing
        </h1>
        <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='min-w-full py-2 align-middle sm:px-6 lg:px-8'>
            <TableWithFilters
              dataType='Organizations'
              tableData={parsedTableData}
              headers={tableHeaders}
              refreshTable={handleTableUpdate}
              loading={isFetchingOrganizations}
              filterOptions={tableFilterOptions}
              filters={tableFilters}
              onRowClick={handleRowClick}
              bulkActions={bulkActions}
              totalCount={orgListResponse?.count}
              titleMessage='Information about organizations'
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
export default ViewOrganizationsTable;
