import {
  TableFilters,
  TableRow,
  TableWithFilters,
} from '../components/TableWithFilters';
import InviteModal from './InviteRepresentativesModal';
import NoRepresentatives from './NoRepresentatives';
import {
  useGetOrgRepresentativesQuery,
  useRemoveOrgRepresentativesMutation,
} from '@/app/api/slices/org-api-slice';
import { useGetOrgProfileQuery } from '@/app/api/slices/org-api-slice';
import { PaginationFilters } from '@/app/api/types';
import ConfirmDialog, { DialogData } from '@/components/ConfirmDialog';
import ErrorPage from '@/components/ErrorPage';
import LoadingPage from '@/components/LoadingPage';
import Header from '@/features/organization/components/Header';
import { useAvatarImage, useOrgLogo } from '@/hook';
import { SelectOption } from '@/select-options';
import { faEnvelopesBulk } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@material-tailwind/react';
import { color } from '@material-tailwind/react/types/components/alert';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { MdOutlineDeleteForever } from 'react-icons/md';
import { toast } from 'react-toastify';
import { FiUsers } from 'react-icons/fi';

const Representatives: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const getOrgLogo = useOrgLogo();
  const getAvatar = useAvatarImage();
  const [showDialog, setShowDialog] = useState(true);
  const [dialogData, setDialogData] = useState<DialogData>();

  const [removeRepresentative] = useRemoveOrgRepresentativesMutation();

  const [tableFilters, setTableFilters] = useState<TableFilters>({
    sort: {
      key: searchParams.get('sortKey') || undefined,
      desc: searchParams.get('sortDesc') == 'true',
    },
    page: {
      number: Number(searchParams.get('page')) || 1,
      size: Number(searchParams.get('pageSize')) || 10,
    },
    keyword: searchParams.get('keyword') || undefined,
  });

  const buildRepresentativesFilters = (tableFilters: TableFilters) => {
    const representativesFilter: PaginationFilters = {
      sortKey: tableFilters.sort?.key,
      sortDesc: tableFilters.sort?.desc,
      page: tableFilters.page.number,
      pageSize: tableFilters.page.size,
      keyword: tableFilters.keyword,
    };
    if (tableFilters.filterValue) {
      representativesFilter.status = tableFilters.filterValue;
    }

    return representativesFilter;
  };

  const [representativesFilters, setRepresentativesFilters] =
    useState<PaginationFilters>(buildRepresentativesFilters(tableFilters));

  const {
    data,
    isFetching: isFetchingOrgProfile,
    isError: isOrgProfileError,
  } = useGetOrgProfileQuery();
  const {
    data: orgRepresentatives,
    isFetching: isFetchingRepresentativs,
    isError: isRepresentativesError,
    isLoading: isOrgRepresentativesLoading,
    refetch,
  } = useGetOrgRepresentativesQuery(representativesFilters, {
    refetchOnMountOrArgChange: 60,
  });

  const isInitialLoading = isFetchingOrgProfile || isOrgRepresentativesLoading;
  const isError = isOrgProfileError || isRepresentativesError;

  if (isInitialLoading) {
    return <LoadingPage />;
  }

  if (isError || !data) {
    return <ErrorPage />;
  }

  const isOrgRepresentativesEmpty =
    !orgRepresentatives?.data || orgRepresentatives.data.length === 0;
  const isSearchActive =
    !!tableFilters.keyword ||
    tableFilters?.sort?.key ||
    tableFilters.page.number !== 1 ||
    tableFilters.page.size !== 10;

  const orgDetail = data.data;

  const handleTableUpdate = async (filters: TableFilters) => {
    setTableFilters(filters);
    const filterData = buildRepresentativesFilters(filters);
    const paramString = Object.entries(filterData)
      .map(([key, value]) => (value != null ? `${key}=${value}` : undefined))
      .filter((item) => item != null)
      .join('&');
    router.replace(`${pathname}?${paramString}`, { scroll: false });
    setRepresentativesFilters(filterData);
  };

  const statusColors: { [key: string]: color } = {
    hired: 'green',
    pending: 'amber',
  };

  const parsedTableData: TableRow[] =
    orgRepresentatives?.data?.map((user) => {
      return {
        id: user.id,
        cells: {
          user: {
            type: 'listItem',
            listItem: {
              title: `${user.first_name} ${user.last_name}`,
              subtitle: user.email,
              avatarUrl: getAvatar(user.first_name + user.last_name, undefined),
              avatarFallback: `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`,
            },
          },
          role: {
            type: 'text',
            text: user.title,
          },
          totalPost: {
            type: 'text',
            text: user.opportunities_count.toString(),
          },
          status: {
            type: 'chips',
            chips: [
              {
                text: user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Not Set',
                color: statusColors[user.status?.toLowerCase() || 'none'],
              },
            ],
          },
          actions: {
            type: 'actions',
            actions: [
              {
                children: <MdOutlineDeleteForever size={18} />,
                title: 'Delete',
                tooltip: 'Remove representative',
                onClick: () => {
                  setShowDialog(true);
                  setDialogData({
                    title: 'Remove Representative',
                    description: 'Are you sure you want to revoke access from this user? This action cannot be undone.',
                    action: async () => {
                      await removeRepresentative({ id: user.id })
                        .unwrap()
                        .then(() => {
                          toast.success('Access revoked successfully', {
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
                    color: 'red' as color,
                    actionName: 'Revoke Access',
                  });
                },
                color: 'red' as color,
                className: 'hover:bg-red-50',
              },
            ],
          },
        },
      };
    }) || [];

  const tableHeaders: SelectOption[] = [
    { label: 'Name', value: 'first_name' },
    { label: 'Role', value: 'title' },
    { label: 'Total Posts', value: 'opportunities_count' },
    { label: 'Status', value: 'status' },
    { label: 'Actions', value: 'actions' },
  ];

  const tableFilterOptions = [
    { label: 'All Representatives', value: '' },
    { label: 'Active', value: 'hired' },
    { label: 'Pending', value: 'pending' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-8">
      <Header
        logoUrl={getOrgLogo(orgDetail.LogoUrl)}
        title={orgDetail.orgName}
        rightComponent={
          <Button
            color="amber"
            className="flex items-center gap-2 py-3 px-8 rounded-3xl text-sm font-semibold text-white whitespace-nowrap hover:bg-primary/80 transition-all bg-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <FontAwesomeIcon icon={faEnvelopesBulk} className="w-4 h-4" />
            Invite Representatives
          </Button>
        }
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <FiUsers className="w-6 h-6 text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-800">
              Organization Representatives
            </h1>
           
          </div>
          
          
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isOrgRepresentativesEmpty && !isSearchActive ? (
            <NoRepresentatives setIsModalOpen={setIsModalOpen} />
          ) : (
            <TableWithFilters
              dataType="Representatives"
              titleMessage=""
              tableData={parsedTableData}
              headers={tableHeaders}
              refreshTable={handleTableUpdate}
              loading={isFetchingRepresentativs}
              filterOptions={tableFilterOptions}
              filters={tableFilters}
              totalCount={parsedTableData.length}
            />
          )}
        </div>
      </div>

      {isModalOpen && (
        <InviteModal
          isOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          refetch={refetch}
        />
      )}

      {dialogData && (
        <ConfirmDialog
          {...dialogData}
          isOpen={showDialog}
          dialogHandler={setShowDialog}
        />
      )}
    </div>
  );
};

export default Representatives;