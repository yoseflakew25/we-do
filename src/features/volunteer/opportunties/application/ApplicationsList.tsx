'use client';

import ApplicationCard from '../../components/ApplicationCard';
import { RateAndReviewPopup } from '../../components/RateAndReviewPopup';
import { useGetApplicationsQuery } from '@/app/api/slices/volunteer-api-slice';
import { ApplicationFilters } from '@/app/api/types';
import { SelectOption } from '@/select-options';
import { Button, Spinner, Typography } from '@material-tailwind/react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

// Extended type for filter options with buttonColor
type FilterOption = SelectOption & {
  buttonColor: string;
};

const filterOptions: FilterOption[] = [
  { label: 'All', value: 'all', buttonColor: 'gray' },
  { label: 'Pending', value: 'pending', buttonColor: 'lime' },
  { label: 'In Review', value: 'in-review', buttonColor: 'blue' },
  { label: 'Interview', value: 'interview', buttonColor: 'purple' },
  { label: 'Offer Extended', value: 'offer-extended', buttonColor: 'teal' },
  { label: 'Hired', value: 'hired', buttonColor: 'green' },
  { label: 'Declined', value: 'declined', buttonColor: 'pink' },
  { label: 'Certified', value: 'certified', buttonColor: 'gray' },
];

export type HandleOpenPopup = (
  _orgId: string,
  _eventName: string,
  _eventId: string
) => void;

const ApplicationsList: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
  const [selectedApplicationOrgId, setSelectedApplicationOrgId] = useState('');
  const [selectedApplicationEventName, setSelectedApplicationEventName] = useState('');
  const [selectedApplicationEventId, setSelectedApplicationEventId] = useState('');

  const { data: user } = useSession();

  const [applicationFilters, setApplicationFilters] = useState<ApplicationFilters>({
    page: Number(searchParams.get('page')) || 1,
    pageSize: Number(searchParams.get('pageSize')) || 10,
    sortKey: searchParams.get('sortKey') || undefined,
    sortDesc: searchParams.get('sortDesc') === 'true',
    keyword: searchParams.get('keyword') || undefined,
    status: searchParams.get('status') || undefined,
  });

  const updatePath = useCallback((filterData: ApplicationFilters) => {
    const paramString = Object.entries(filterData)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    router.replace(`${pathname}?${paramString}`, { scroll: false });
  }, [pathname, router]);

  useEffect(() => {
    updatePath(applicationFilters);
  }, [applicationFilters, updatePath]);

  const handleApplicationsListUpdate = (filters: ApplicationFilters) => {
    setApplicationFilters(filters);
    updatePath(filters);
  };

  const handleOpenPopup: HandleOpenPopup = (orgId, eventName, eventId) => {
    setSelectedApplicationOrgId(orgId);
    setSelectedApplicationEventName(eventName);
    setSelectedApplicationEventId(eventId);
    setIsReviewPopupOpen(true);
  };

  const {
    data: applicationsList,
    isFetching: isFetchingApplications,
    refetch: refetchApplications,
  } = useGetApplicationsQuery(applicationFilters, {
    refetchOnMountOrArgChange: 60,
  });

  const pagesCount = Math.ceil(
    (applicationsList?.count || 1) / applicationFilters.pageSize
  );

  return (
    <div className='w-screen bg-white'>
      {/* Hero section */}
      <div className='w-full px-2'>
        <div
          className='bg-cover text-center py-9 flex flex-col justify-center items-center gap-6'
          style={{
            backgroundImage: "url('/assets/background.png')",
          }}
        >
          <h1 className='font-poppins py-3 font-black text-2xl md:text-4xl text-[#25324B] text-left pb-4'>
            My Applications
          </h1>
        </div>
      </div>

      <div className='container flex flex-col flex-wrap px-2 items-center'>
        <div className='block md:w-[75%]'>
          <div className='flex justify-between items-center'>
            <div className='flex-col'>
              <h5 className='font-poppins py-3 font-black text-xl md:text-2xl text-neutrals80 text-left pb-4'>
                {applicationsList?.data.length || 0} Applications
              </h5>
            </div>
            <div className='relative h-10 w-24 min-w-[200px]'>
              <select
                className='peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
                onChange={(e) => {
                  const selectedOption = filterOptions.find(
                    (option) => option.value === e.target.value
                  );
                  handleApplicationsListUpdate({
                    ...applicationFilters,
                    status: selectedOption?.value === 'all' ? undefined : selectedOption?.value,
                  });
                }}
                value={applicationFilters.status || 'all'}
              >
                {filterOptions.map(({ label, value }, index) => (
                  <option key={index} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Filter By Status
              </label>
            </div>
          </div>

          <div className='flex flex-col justify-between gap-2 md:gap-4 flex-wrap'>
            <TableContent
              applicationsList={applicationsList?.data || []}
              loading={isFetchingApplications}
              handleOpenPopup={handleOpenPopup}
            />
          </div>

          <div className='flex flex-row justify-center items-center gap-8 mb-4 mt-2'>
            <Button
              variant='outlined'
              size='sm'
              disabled={isFetchingApplications || applicationFilters.page <= 1}
              onClick={() =>
                handleApplicationsListUpdate({
                  ...applicationFilters,
                  page: applicationFilters.page - 1,
                })
              }
            >
              Previous
            </Button>
            <Typography variant='h6' color='blue-gray' className='font-normal'>
              Page{' '}
              <strong className='text-gray-900'>
                {applicationFilters.page}
              </strong>{' '}
              of <strong className='text-gray-900'>{pagesCount}</strong>
            </Typography>

            <Button
              variant='outlined'
              size='sm'
              disabled={
                isFetchingApplications || applicationFilters.page >= pagesCount
              }
              onClick={() =>
                handleApplicationsListUpdate({
                  ...applicationFilters,
                  page: applicationFilters.page + 1,
                })
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      {isReviewPopupOpen && (
        <RateAndReviewPopup
          reviewerId={user?.user?.id || ''}
          handleOpenPopup={() => setIsReviewPopupOpen(false)}
          recipientName={selectedApplicationEventName}
          recipientId={selectedApplicationOrgId}
          reviewerName={user?.user?.name || ''}
          reviewerProfilePicUrl={user?.user?.profilePicUrl || ''}
          eventId={selectedApplicationEventId}
          refetchReviews={refetchApplications}
        />
      )}
    </div>
  );
};

interface TableContentProps {
  loading?: boolean;
  applicationsList: any[];
  handleOpenPopup: HandleOpenPopup;
}

const TableContent: React.FC<TableContentProps> = ({
  loading,
  applicationsList,
  handleOpenPopup,
}) => {
  const router = useRouter();

  if (loading) {
    return (
      <div className='mx-auto my-auto'>
        <Spinner className='h-8 w-8 mx-auto opacity-50' />
      </div>
    );
  }

  if (!applicationsList.length) {
    return (
      <div className='mx-auto my-auto'>
        <Typography
          variant='h3'
          color='blue-gray'
          className='font-normal text-center text-gray-500'
        >
          No Applications Yet
        </Typography>
      </div>
    );
  }

  return (
    <>
      {applicationsList.map(
        (
          {
            title,
            opType,
            orgName,
            dateApplied,
            status,
            logoURL,
            datePosted,
            deadline,
            orgID,
            eventID,
          },
          index
        ) => (
          <div
            key={index}
            className='my-2 cursor-pointer'
            onClick={() => {
              router.push(`/talent/opportunities/${eventID}`);
            }}
          >
            <ApplicationCard
              eventTitle={title}
              opType={opType === 'inPerson' ? 'In Person' : 'Remote'}
              orgName={orgName}
              dateApplied={dateApplied}
              status={status}
              orgLogoURL={logoURL}
              datePosted={datePosted}
              deadline={deadline}
              orgId={orgID}
              eventId={eventID}
              handleOpenPopup={handleOpenPopup}
            />
          </div>
        )
      )}
    </>
  );
};

export default ApplicationsList;