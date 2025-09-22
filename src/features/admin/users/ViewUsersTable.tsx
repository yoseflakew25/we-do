'use client';

import ViewUserDetail from './ViewUserDetail';
import {
  useChangeUserRoleMutation,
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from '@/app/api/slices/volunteer-api-slice';
import { UserDetail, UserFilters } from '@/app/api/types';
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
import { LiaUserEditSolid } from 'react-icons/lia';
import { MdOutlineDeleteForever } from 'react-icons/md';
import { TbHomeEdit } from 'react-icons/tb';
import ReactSelect from 'react-select';
import { toast } from 'react-toastify';

type ViewUsersProps = {
  orgOptions?: SelectOption[];
  opportunityOptions?: SelectOption[];
  refetchOpportunities?: (_orgID: string) => Promise<void>;
  isFetchingOpportunities?: boolean;
  isFetchingOrganizations?: boolean;
};
function ViewUsersTable({
  orgOptions,
  opportunityOptions,
  refetchOpportunities,
  isFetchingOpportunities,
  isFetchingOrganizations,
}: ViewUsersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const getAvatar = useAvatarImage();
  const [showDialog, setShowDialog] = useState(true);
  const [dialogData, setDialogData] = useState<DialogData>();

  const buildApplicantFilters = (
    tableFilters: TableFilters,
    orgID?: string,
    opportunityID?: string
  ) => {
    const userFilters: UserFilters = {
      sortKey: tableFilters.sort?.key,
      sortDesc: tableFilters.sort?.desc,
      page: tableFilters.page.number,
      pageSize: tableFilters.page.size,
      keyword: tableFilters.keyword,
    };
    if (tableFilters.filterValue) {
      userFilters.role = tableFilters.filterValue;
    }

    if (orgID) {
      userFilters.orgID = orgID === 'any' ? undefined : orgID;
    }
    if (opportunityID) {
      userFilters.opportunityID =
        opportunityID === 'any' ? undefined : opportunityID;
    }

    return userFilters;
  };

  const [tableFilters, setTableFilters] = useState<TableFilters>({
    sort: {
      key: searchParams.get('sortKey') || 'createdAt',
      desc: searchParams.get('sortDesc')
        ? searchParams.get('sortDesc') === 'true'
        : true,
    },
    page: {
      number: Number(searchParams.get('page')) || 1,
      size: Number(searchParams.get('pageSize')) || 10,
    },
    filterValue: searchParams.get('role') || undefined,
    keyword: searchParams.get('keyword') || undefined,
  });

  const tableFilterOptions = [
    { label: 'All', value: '' },
    { label: 'Talent', value: 'user' },
    { label: `Organization Representative`, value: 'org' },
    { label: 'Super Administrator', value: 'superadmin' },
  ];
  const [userFilters, setUserFilters] = useState<UserFilters>({
    ...buildApplicantFilters(tableFilters),
    orgID: searchParams.get('orgID') || undefined,
    opportunityID: searchParams.get('opportunityID') || undefined,
  });

  const {
    data: userData,
    refetch,
    isFetching: isFetchingApplicants,
  } = useGetAllUsersQuery(userFilters, {
    refetchOnMountOrArgChange: 60,
  });

  const [deleteUser] = useDeleteUserMutation();
  const [changeRole] = useChangeUserRoleMutation();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedUserRole, setSelectedUserRole] = useState<string>('');

  const handleRowClick = (id: string) => {
    setSelectedUserId(id);
    const curUser = userData?.data.find((user) => user.id === id);
    if (curUser?.role) {
      setSelectedUserRole(curUser.role);
    }
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSelectedUserId('');
    setSidebarOpen(false);
  };

  const onDeleteSuccess = async () => {
    await refetch();
  };

  const genderColors: { [key: string]: color | undefined } = {
    male: 'blue',
    female: 'pink',
  };

  const roleColors: { [key: string]: color | undefined } = {
    user: 'teal',
    org: 'pink',
    superadmin: 'lime',
  };

  const changeUserRoleButtons = (user: UserDetail) => {
    const volunteerToOrg = {
      children: <LiaUserEditSolid size={18} />,
      title: 'Change role from Volunteer To Org',
      onClick: () => {
        setShowDialog(true);
        setDialogData({
          title:
            'Are you sure you wish to the role of this user from volunteer to org?',
          description: 'This move can be reversed later on.',
          action: async () => {
            await changeRole({
              newRole: 'org',
              ids: [user.id],
            })
              .unwrap()
              .then(() => {
                toast.success('User role updated successfully!', {
                  theme: 'light',
                });
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
          actionName: 'Change to Org',
        });
      },
      color: 'teal' as color,
    };

    const orgToVolunteer = {
      children: <TbHomeEdit size={18} />,
      title: 'Change role from Org To Volunteer',
      onClick: () => {
        setShowDialog(true);
        setDialogData({
          title:
            'Are you sure you wish to the role of this user from Org to Volunteer?',
          description: 'This move can be reversed later on.',
          action: async () => {
            await changeRole({
              newRole: 'user',
              ids: [user.id],
            })
              .unwrap()
              .then(() => {
                toast.success('User role updated successfully!', {
                  theme: 'light',
                });
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
          color: 'amber' as color,
          actionName: 'Change to Volunteer',
        });
      },
      color: 'amber' as color,
    };

    switch (user.role && user.role.toLowerCase()) {
      case 'user':
        return [volunteerToOrg];
      case 'org':
        return [orgToVolunteer];
    }
    return [];
  };

  const parsedTableData: TableRow[] =
    userData?.data?.map((user) => {
      return {
        id: user.id,
        cells: {
          user: {
            type: 'listItem',
            listItem: {
              title: user.name,
              subtitle: user.email,
              avatarUrl: getAvatar(user.name, undefined),
            },
          },
          role: {
            type: 'chips',
            chips: [
              {
                text: user.role || 'Not Set',
                color: roleColors[user.role?.toLowerCase() || 'none'],
              },
            ],
          },
          gender: {
            type: 'chips',
            chips: [
              {
                text: user.gender || 'Not Set',
                color: genderColors[user.gender?.toLowerCase() || 'none'],
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
                    title: 'Are you sure you wish to delete the user?',
                    description: 'This is an irreversable action.',
                    action: async () => {
                      await deleteUser({ ids: [user.id] })
                        .unwrap()
                        .then(() => {
                          toast.success('User account deleted successfully!', {
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
              ...changeUserRoleButtons(user),
            ],
          },
          dateJoined: {
            type: 'text',
            text: dateFormat(user.createdAt, 'ddd, mmm dd, yyyy'),
          },
        },
      };
    }) || [];

  const updatePath = (filterData: UserFilters) => {
    const paramString = Object.entries(filterData)
      .map(([key, value]) => (value != null ? `${key}=${value}` : undefined))
      .filter((item) => item != null)
      .join('&');

    router.replace(`${pathname}?${paramString}`, { scroll: false });
  };

  const handleTableUpdate = async (filters: TableFilters) => {
    setTableFilters(filters);

    const filterData = buildApplicantFilters(filters);

    updatePath(filterData);
    setUserFilters(filterData);
  };
  const tableHeaders: SelectOption[] = [
    { label: 'User', value: 'name' },
    { label: 'Role', value: 'role' },
    { label: 'Gender', value: 'status' },
    { label: 'Actions', value: 'actions' },
    { label: 'Date Joined', value: 'createdAt' },
  ];

  const bulkActions = [
    {
      icon: <MdOutlineDeleteForever size={18} />,
      title: 'Delete Selected',
      color: 'red' as color,
      action: (_ids?: string[]) => {
        setShowDialog(true);
        setDialogData({
          title: `Are you sure you wish to delete these user profiles? (${_ids?.length} selected)`,
          description: 'This move cannot be reversed.',
          action: async () => {
            await deleteUser({ ids: _ids || [] })
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
                  const errorMessage =
                    errorResponse.data?.message ||
                    'An unexpected error occurred. Please try again later.';
                  toast.error(errorMessage, {
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
          User Listing
        </h1>

        <div className='flex gap-3 flex-wrap justify-center'>
          {orgOptions && refetchOpportunities && (
            <div className='w-80'>
              <label
                className='block text-neutrals80 text-base font-semibold mb-1 text-[#515B6F]'
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
                  ({ value }) => value === userFilters.orgID
                )}
                // @ts-ignore This gives out the wrong type for some reason
                onChange={async (newValue: SelectOption) => {
                  setUserFilters({
                    ...userFilters,
                    orgID: newValue.value,
                    opportunityID: undefined,
                  });
                  updatePath({
                    ...userFilters,
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
                  userFilters.orgID == null ||
                  userFilters.orgID == 'any'
                }
                styles={REACT_SELECT_CUSTOM_STYLE}
                menuPortalTarget={document.body}
                options={opportunityOptions}
                value={opportunityOptions.find(
                  ({ value }) => value === userFilters.opportunityID
                )}
                // @ts-ignore This gives out the wrong type for some reason
                onChange={(newValue: SelectOption) => {
                  setUserFilters({
                    ...userFilters,
                    opportunityID: newValue.value,
                  });
                  updatePath({
                    ...userFilters,
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
                dataType='Users'
                tableData={parsedTableData}
                headers={tableHeaders}
                refreshTable={handleTableUpdate}
                loading={isFetchingApplicants}
                filterOptions={tableFilterOptions}
                filters={tableFilters}
                onRowClick={handleRowClick}
                bulkActions={bulkActions}
                totalCount={userData?.count}
                titleMessage=''
                useStickyHeader={isSidebarOpen}
              />
            </div>
          </div>
        </div>

        {isSidebarOpen && (
          <ViewUserDetail
            roleIsUser={selectedUserRole === 'user'}
            userId={selectedUserId}
            onClose={closeSidebar}
            onDeleteSuccess={onDeleteSuccess}
          />
        )}
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

export default ViewUsersTable;
