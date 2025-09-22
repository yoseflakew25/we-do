'use client';

import { OpportunitySelectOption } from '../components/MultiSelectDropdown';
import VolunteerDetail from './VolunteerDetail';
import { useGetOrgOpportunitiesQuery } from '@/app/api/slices/opportunity-api-slice';
import {
  useInviteFromFileMutation,
  useInviteFromVolunteerPoolMutation,
  useGetMyOpportunitySeekersQuery,
} from '@/app/api/slices/org-api-slice';
import {
  useBulkAddToOrgPoolMutation,
  useBulkRemoveFromOrgPoolMutation,
  useGetSavedVolunteersQuery,
} from '@/app/api/slices/org-pool-slice';
import { useGetVisibleVolunteersQuery } from '@/app/api/slices/volunteer-api-slice';
import {
  BulkAddToOrgPoolPayload,
  VolunteerPoolFilters,
  BulkRemoveFromOrgPoolRequest,
} from '@/app/api/types';
import ConfirmDialog, { DialogData } from '@/components/ConfirmDialog';
import { REACT_SELECT_CUSTOM_STYLE } from '@/components/forms/ValidatedInputs';
import {
  TableFilters,
  TableRow,
  TableWithFilters,
} from '@/features/organization/components/TableWithFilters';
import { useAvatarImage } from '@/hook';
import { SelectOption, VOL_POOL_OPTIONS } from '@/select-options';
import { color } from '@material-tailwind/react/types/components/alert';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BsBookmarkFill, BsEnvelopeArrowUpFill } from 'react-icons/bs';
import { LuUpload } from 'react-icons/lu';
import ReactSelect from 'react-select';
import { toast } from 'react-toastify';

const chipColors: { [key: string]: color } = {
  private: 'teal',
  public: 'blue',
};

interface ViewUsersTableProps {
  userOptions?: SelectOption[];
}

const ViewUsersTable: React.FC<ViewUsersTableProps> = ({ userOptions }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const getAvatar = useAvatarImage();
  const [showDialog, setShowDialog] = useState(true);
  const [dialogData, setDialogData] = useState<DialogData>();
  const [inviteFromVolunteerPool] = useInviteFromVolunteerPoolMutation();
  const [inviteFromFile] = useInviteFromFileMutation();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { data: myPool } = useGetMyOpportunitySeekersQuery({});
  const t = useTranslations('volunteerPool');

  const [tableFilters, setTableFilters] = useState<TableFilters>({
    sort: {
      key: searchParams.get('sortKey') || undefined,
      desc: searchParams.get('sortDesc') == 'true',
    },
    page: {
      number: Number(searchParams.get('page')) || 1,
      size: Number(searchParams.get('pageSize')) || 10,
    },
    filterValue: searchParams.get('value') || undefined,
    keyword: searchParams.get('keyword') || undefined,
  });

  const buildApplicantFilters = (
    tableFilters: TableFilters,
    isInterested: boolean,
    visibility?: string
  ) => {
    const volunteerPoolFilters: VolunteerPoolFilters = {
      sortKey: tableFilters.sort?.key,
      sortDesc: tableFilters.sort?.desc,
      page: tableFilters.page.number,
      pageSize: tableFilters.page.size,
      keyword: tableFilters.keyword,
      visibility: visibility,
      isInterested: isInterested,
    };
    if (tableFilters.filterValue) {
      volunteerPoolFilters.visibility = tableFilters.filterValue;
    }

    if (visibility) {
      volunteerPoolFilters.visibility =
        visibility === 'any' ? undefined : visibility;
    }

    return volunteerPoolFilters;
  };

  const tableFilterOptions = [
    { label: `${t('tableFilters.all')}`, value: '' },
    { value: 'protected', label: `${t('tableFilters.interested')}` },
    { value: 'saved', label: `${t('tableFilters.saved')}` },
    /// To be added after the filter on the backend it fixed
    { value: 'myPool', label: `${t('tableFilters.myPool')}` },
  ];
  const isInterestedQueryParam = searchParams.get('isInterested');
  const isInterested = isInterestedQueryParam === 'true';
  const [userFilters, setVolunteerPoolFilters] = useState<VolunteerPoolFilters>(
    {
      ...buildApplicantFilters(tableFilters, isInterested),
      visibility: searchParams.get('visibility') || undefined,
      isInterested: isInterestedQueryParam ? isInterested : true,
    }
  );

  const { data: userData, isFetching: isFetchingApplicants } =
    useGetVisibleVolunteersQuery(userFilters, {
      refetchOnMountOrArgChange: 60,
    });

  const { data: opportunities } = useGetOrgOpportunitiesQuery(undefined);

  const [bulkAddToOrgPool] = useBulkAddToOrgPoolMutation();
  const [bulkRemoveFromOrgPool] = useBulkRemoveFromOrgPoolMutation();

  const { data: savedVolunteerResponse } = useGetSavedVolunteersQuery();

  const opportunityListSelectOptions: OpportunitySelectOption[] = [
    ...(opportunities?.data
      .filter(({ status }) => status === 'open') // Filter for opportunities with status 'open'
      .map(({ id, title, orgName }) => ({
        title: title,
        id: id,
        orgName: orgName,
      })) || []),
  ];

  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedUserRole, setSelectedUserRole] = useState<string>('');

  const handleRowClick = (id: string) => {
    setSelectedUserId(id);
    setSelectedUserRole('user');
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSelectedUserId('');
    setSidebarOpen(false);
  };

  const genderColors: { [key: string]: color | undefined } = {
    male: 'blue',
    female: 'pink',
  };
  // const [parsedTableData, setParsedTableData] = useState<TableRow[]>([]);

  const updatePath = (filterData: VolunteerPoolFilters) => {
    const paramString = Object.entries(filterData)
      .map(([key, value]) => (value != null ? `${key}=${value}` : undefined))
      .filter((item) => item != null)
      .join('&');
    router.replace(`${pathname}?${paramString}`, { scroll: false });
  };
  const handleTableUpdate = async (filters: TableFilters) => {
    setTableFilters(filters);
    const filterData = buildApplicantFilters(filters, true);
    updatePath(filterData);
    setVolunteerPoolFilters(filterData);
    // setParsedTableData(parsedTableData);
  };

  // useEffect(() => {
  //   handleTableUpdate({
  //     ...tableFilters,
  //     filterValue: '' || tableFilters.filterValue,
  //   });
  // }, [tableFilters]);

  // Parse the data for the table, based on the filter value selected
  let parsedTableData: TableRow[] = [];
  if (tableFilters.filterValue === 'saved' && savedVolunteerResponse?.data) {
    parsedTableData = savedVolunteerResponse.data.map((user) => ({
      id: user.userID,
      cells: {
        user: {
          type: 'listItem',
          listItem: {
            title: user.name,
            subtitle: user.email,
            avatarUrl: getAvatar(user.name, undefined),
          },
        },
        skills: {
          type: 'chips',
          chips: user.skills
            ? user.skills.map((skill) => ({
                text: skill,
                color: 'amber',
              }))
            : [{ text: 'No Skills Set' }],
        },
        interested: {
          type: 'chips',
          chips: [{ text: 'Saved', color: chipColors['private'] }],
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
      },
    }));
  } else if (tableFilters.filterValue === 'protected') {
    parsedTableData =
      userData?.data
        ?.filter((user) => user.is_interested === true)
        .map((user) => ({
          id: user.userID,
          cells: {
            user: {
              type: 'listItem',
              listItem: {
                title: user.name,
                subtitle: user.email,
                avatarUrl: getAvatar(user.name, undefined),
              },
            },
            skills: {
              type: 'chips',
              chips: user.skills
                ? user.skills.map((skill) => ({
                    text: skill,
                    color: 'amber',
                  }))
                : [{ text: 'No Skills Set' }],
            },
            interested: {
              type: 'chips',
              chips: [{ text: 'Interested', color: chipColors['private'] }],
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
          },
        })) || [];
  } else if (tableFilters.filterValue === 'myPool') {
    parsedTableData =
      myPool?.data?.map((user) => {
        return {
          id: user.userID,
          cells: {
            user: {
              type: 'listItem',
              listItem: {
                title: user.name
                  ? user.name
                  : user.first_name + ' ' + user.last_name,
                subtitle: user.email,
                avatarUrl: getAvatar(
                  user.name ? user.name : user.first_name,
                  undefined
                ),
              },
            },
            invitedBy: {
              type: 'text',
              text: user.invitedBy,
            },
            status: {
              type: 'chips',
              chips: [
                {
                  text: user.status,
                  color: user.status === 'pending' ? 'yellow' : 'blue',
                },
              ],
            },
            invitedOn: {
              type: 'text',
              text: new Date(user.createdAt).toDateString(),
            },
          },
        };
      }) || [];
  } else {
    parsedTableData =
      userData?.data?.map((user) => {
        let interestedChips = [];
        if (user.visibility === 'public' && user.is_interested) {
          interestedChips.push({
            text: 'Publicly Visible',
            color: chipColors['public'],
          });
          interestedChips.push({
            text: 'Interested',
            color: chipColors['private'], // Assuming private color for interested
          });
        } else {
          interestedChips.push({
            text:
              VOL_POOL_OPTIONS.find(({ value }) => value == user.visibility)
                ?.label || '',
            color: chipColors[user.visibility],
          });
        }
        return {
          id: user.userID,
          cells: {
            user: {
              type: 'listItem',
              listItem: {
                title: user.name,
                subtitle: user.email,
                avatarUrl: getAvatar(user.name, undefined),
              },
            },
            skills: {
              type: 'chips',
              chips: user.skills
                ? user.skills.map((skill) => ({
                    text: skill,
                    color: 'amber',
                  }))
                : [{ text: 'No Skills Set' }],
            },
            interested: {
              type: 'chips',
              chips: interestedChips,
              // chips: [
              //   {
              //     text:
              //       VOL_POOL_OPTIONS.find(({ value }) => value == user.visibility)
              //         ?.label || '',
              //     color: chipColors[user.visibility],
              //   },
              // ],
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
          },
        };
      }) || [];
  }
  // The table header data based on the filter value selected
  const tableHeaders =
    tableFilters.filterValue === 'myPool'
      ? [
          { label: `${t('tableHeaders.user')}`, value: 'user' },
          { label: `${t('tableHeaders.invitedBy')}`, value: 'invitedBy' },
          { label: `${t('tableHeaders.status')}`, value: 'status' },
          { label: `${t('tableHeaders.invitedOn')}`, value: 'invitedOn' },
        ]
      : [
          { label: `${t('tableHeaders.user')}`, value: 'name' },
          { label: `${t('tableHeaders.skills')}`, value: 'skills' },
          {
            label: `${t('tableHeaders.interestInYourCompany')}`,
            value: 'visibility',
          },
          { label: `${t('tableHeaders.gender')}`, value: 'gender' },
        ];

  //Dialog data when no file is uploaded
  const dialogState1: DialogData = {
    title: 'Upload Members',
    description: (
      <div>
        <p>
          To add new members, upload an Excel or CSV file. Ensure the file
          contains their names in the first column and emails in the second
          column as the example below. We’ll process the file and send invites
          to the listed members.
        </p>
        <Image
          src={'/assets/member-upload-example.png'}
          width={400}
          height={250}
          className='mx-auto w-96 my-4'
          alt='example of a member upload file'
        />
        <div className='border-dashed border-2 border-gray-300 p-4 rounded-lg'>
          <label
            htmlFor='file-upload'
            className='cursor-pointer flex flex-col items-center gap-2 text-amber-500'
          >
            <LuUpload size={20} />
            <span>Click to upload your file</span>
          </label>
          <input
            id='file-upload'
            type='file'
            accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
            className='hidden'
            onChange={(e) => handleFileUpload(e)}
          />
          <p className='text-sm text-gray-500 mt-2'>
            Supported file types: .csv, .xlsx
          </p>
        </div>
      </div>
    ),
    action: async () => {
      toast.error('Please upload a file before proceeding.', {
        theme: 'light',
      });
      return;
    },
    actionName: 'Upload File',
    color: 'amber',
  };

  //Dialog data when a file is uploaded
  const dialogState2: DialogData = {
    title: 'Upload Members', // Ensure the title is not undefined
    description: (
      <div>
        <p>
          To add new members, upload an Excel or CSV file. Ensure the file
          contains their names in the first column and emails in the second
          column as the example below. We’ll process the file and send invites
          to the listed members.
        </p>
        <Image
          src={'/assets/member-upload-example.png'}
          width={400}
          height={250}
          className='mx-auto w-96 my-4'
          alt='example of a member upload file'
        />
        <div className='flex flex-col items-center gap-4'>
          <div className='p-4 border border-gray-300 rounded-lg bg-gray-50 flex items-center gap-4'>
            <LuUpload size={24} className='text-amber-500' />
            <span className='text-gray-700'>{uploadedFile?.name}</span>
          </div>
          <button
            className='text-sm text-red-500 hover:underline'
            onClick={() => {
              setUploadedFile(null);
              setDialogData(dialogState1);
            }}
          >
            Remove file
          </button>
        </div>
      </div>
    ),
    action: async () => {
      if (!uploadedFile) {
        toast.error('Please upload a file before proceeding.', {
          theme: 'light',
        });
        return;
      }

      try {
        const formData = new FormData();
        formData.append('file', uploadedFile);

        const response = await inviteFromFile(formData);
        //@ts-ignore
        if (response.success) {
          toast.success('File uploaded successfully!', {
            theme: 'light',
          });
        } else {
          toast.error(
            'Invalid file format. Please ensure the file has names in the first column and emails in the second.',
            {
              theme: 'light',
            }
          );
        }
      } catch (error) {
        toast.error('An error occurred during the upload. Please try again.', {
          theme: 'light',
        });
      }
    },
    actionName: 'Upload File',
    color: 'amber',
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setDialogData(dialogState2);
    }
  };

  //update the dialog data when a file is uploaded
  useEffect(() => {
    if (uploadedFile) setDialogData(dialogState2);
  }, [uploadedFile]);

  const getBulkActions = (tab: string) => {
    const commonActions = [
      {
        icon: <BsEnvelopeArrowUpFill size={16} />,
        title: 'Invite Selected',
        color: 'amber' as color,
        action: (_ids?: string[]) => {
          // Invite selected logic
          setShowDialog(true);
          setDialogData({
            title: `Are you sure you wish to invite these user profiles? (${_ids?.length} selected)`,
            selectOptions: opportunityListSelectOptions,
            action: async (selectedOptions?: OpportunitySelectOption[]) => {
              const selectedVolunteers = [
                ...(userData?.data
                  .filter(({ userID }) => _ids?.includes(userID))
                  .map(({ userID, name, email }) => ({
                    userID,
                    name,
                    email,
                  })) || []),
              ];
              await inviteFromVolunteerPool({
                profiles: selectedVolunteers,
                events: selectedOptions || [],
              })
                .unwrap()
                .then((response) => {
                  toast.success(response.message, { theme: 'light' });
                })
                .catch((errorResponse) => {
                  toast.error(
                    errorResponse.data?.message ||
                      'An unexpected error occurred. Please try again later.',
                    { autoClose: false, theme: 'light' }
                  );
                });
            },
            color: 'amber',
            actionName: 'Send Invitation',
          });
        },
      },
      {
        icon: <LuUpload size={16} />,
        title: 'Upload Members',
        color: 'amber' as color,
        action: () => {
          setDialogData(dialogState1);
        },
      },
    ];

    // Conditional "Save for Later" or "Unsave Selected" action
    const conditionalAction =
      tab === 'saved'
        ? {
            icon: <BsBookmarkFill size={15} />,
            title: 'Unsave Selected',
            color: 'red' as color,
            action: async (_ids?: string[]) => {
              const selectedUserIDs =
                savedVolunteerResponse?.data
                  .filter(({ userID }) => _ids?.includes(userID))
                  .map(({ userID }) => userID) || [];

              if (selectedUserIDs.length === 0) {
                toast.error('No valid applicants selected to unsave.', {
                  theme: 'light',
                });
                return;
              }

              try {
                const payload: BulkRemoveFromOrgPoolRequest = {
                  userIDs: selectedUserIDs,
                };
                await bulkRemoveFromOrgPool(payload).unwrap();
                toast.success('Selected applicants have been unsaved.');
              } catch (error) {
                toast.error(
                  'Failed to unsave applicants. Please try again later.',
                  {
                    autoClose: false,
                    theme: 'light',
                  }
                );
              }
            },
          }
        : {
            icon: <BsBookmarkFill size={15} />,
            title: 'Save for Later',
            color: 'teal' as color,
            action: async (_ids?: string[]) => {
              const selectedUserIDs =
                userData?.data
                  .filter(({ userID }) => _ids?.includes(userID))
                  .map(({ userID }) => userID) || [];

              if (selectedUserIDs.length === 0) {
                toast.error('No applicants selected to save.', {
                  theme: 'light',
                });
                return;
              }

              try {
                const payload: BulkAddToOrgPoolPayload = {
                  userIDs: selectedUserIDs,
                };
                await bulkAddToOrgPool(payload).unwrap();
                toast.success('Selected applicants have been saved.', {
                  theme: 'light',
                });
              } catch (error) {
                toast.error(
                  'Failed to save applicants. Please try again later.',
                  {
                    autoClose: false,
                    theme: 'light',
                  }
                );
              }
            },
          };

    return [...commonActions, conditionalAction];
  };

  const bulkActions = getBulkActions(tableFilters.filterValue || '');

  return (
    <>
      <div className='container mx-auto flex flex-wrap py-4 md:flex-nowrap  '>
        {' '}
        <h1 className='font-poppins font-black text-2xl sm:text-3xl text-neutrals100'>
          {t('title')}
        </h1>
        <div className='flex gap-3 flex-wrap justify-center'>
          {userOptions && (
            <div className='w-80'>
              <label
                className='block text-neutrals80 text-base font-semibold mb-1 '
                htmlFor='email'
              >
                Skills
              </label>
              <ReactSelect
                isMulti
                isDisabled={isFetchingApplicants}
                styles={REACT_SELECT_CUSTOM_STYLE}
                menuPortalTarget={document.body}
                options={userOptions}
                // value={userFilters.visibility.map((value) => ({
                //   label: value,
                //   value,
                // }))}
                value={userOptions.find(
                  ({ value }) => value === (userFilters.visibility || 'any')
                )}
                // @ts-ignore This gives out the wrong type for some reason
                onChange={async (newValue: SelectOption) => {
                  const filters =
                    newValue.value !== 'any' ? newValue.value : undefined;
                  const isInterested = newValue.value === `true`;
                  setVolunteerPoolFilters({
                    ...userFilters,
                    visibility: filters,
                    isInterested: isInterested,
                  });
                  updatePath({
                    ...userFilters,
                    visibility: filters,
                    isInterested: isInterested,
                  });
                }}
                closeMenuOnSelect={false}
              />
            </div>
          )}
        </div>
      </div>
      <div className='container mx-auto items-center px-7 sm:px-6 lg:px-8 '>
        <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='min-w-full py-2 align-middle sm:px-6 lg:px-8'>
            <TableWithFilters
              dataType={t('details.opportunitySeekers')}
              titleMessage={t('details.subtitle')}
              tableData={parsedTableData}
              headers={tableHeaders}
              refreshTable={handleTableUpdate}
              loading={isFetchingApplicants}
              filterOptions={tableFilterOptions}
              filters={tableFilters}
              onRowClick={handleRowClick}
              bulkActions={bulkActions}
              totalCount={userData?.count || parsedTableData.length}
              useStickyHeader={isSidebarOpen}
            />
          </div>
        </div>

        {isSidebarOpen && (
          <VolunteerDetail
            roleIsUser={selectedUserRole === 'user'}
            userId={selectedUserId}
            onClose={closeSidebar}
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
};

export default ViewUsersTable;
