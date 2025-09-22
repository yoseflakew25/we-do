import BookMarkedOpportunityCard from './component/BookMarkedOpportunityCard';
import { useGetBookMarkedOpportunitiesQuery } from '@/app/api/slices/opportunity-api-slice';
import {
  BookmarkedDetail,
  VolunteerOpportuntiesFilters,
} from '@/app/api/types';
import { Button, Spinner, Typography } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const BookMarkedList: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations('volunteerSide.navBar');
  const [volunteerOpportunitiesFilters, setVolunteerOpportunitiesFilters] =
    useState<VolunteerOpportuntiesFilters>({
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 10,
    });

  useEffect(() => {
    updatePath(volunteerOpportunitiesFilters);
  }, [volunteerOpportunitiesFilters]);

  const updatePath = (filterData: VolunteerOpportuntiesFilters) => {
    const paramString = Object.entries(filterData)
      .map(([key, value]) => (value != null ? `${key}=${value}` : undefined))
      .filter((item) => item != null)
      .join('&');

    router.replace(`${pathname}?${paramString}`, { scroll: false });
  };

  const handleOpportunityListUpdate = async (
    filters: VolunteerOpportuntiesFilters
  ) => {
    setVolunteerOpportunitiesFilters(filters);
    updatePath(filters);
  };

  const {
    data: volunteeringOpportunityList,
    isFetching: isFetchingOpportunities,
    refetch,
  } = useGetBookMarkedOpportunitiesQuery(volunteerOpportunitiesFilters, {
    refetchOnMountOrArgChange: 60,
  });
  useEffect(() => {
    refetch();
  }, []);
  const pagesCount = Math.ceil(
    (volunteeringOpportunityList?.count || 1) /
      volunteerOpportunitiesFilters.pageSize
  );

  return (
    <div className='w-screen' style={{ backgroundColor: 'white' }}>
      {/* Hero section */}
      <div className='w-full py-4 md:p-0 mx-auto'>
        <div
          className='bg-cover text-center py-9 flex flex-col justify-center items-center gap-6 '
          style={{
            backgroundImage: "url('/assets/background.png')",
          }}
        >
          <h1 className='font-poppins py-3 font-black text-2xl md:text-4xl text-[#25324B] text-left p-4'>
            {t('MyBookMark')}
          </h1>
        </div>
      </div>

      <div className='container flex flex-col flex-wrap px-2 items-center'>
        <div className='block md:w-[75%]'>
          <div className='flex justify-between items-center'>
            <div className='flex-col'>
              <h5
                className={`font-poppins py-3 font-black text-xl md:text-2xl text-neutrals80 text-left pb-4`}
              >
                {volunteeringOpportunityList?.data.length || 0} Bookmarks
              </h5>
            </div>
          </div>

          <div className='flex flex-col  justify-between gap-2 md:gap-4 flex-wrap   '>
            <TableContent
              volunteeringOpportunityList={
                volunteeringOpportunityList?.data || []
              }
              loading={isFetchingOpportunities}
            />
          </div>

          <div className=' flex flex-row justify-center items-center gap-8 mb-4 mt-2 '>
            <Button
              variant='outlined'
              size='sm'
              disabled={
                isFetchingOpportunities ||
                volunteerOpportunitiesFilters.page <= 1
              }
              onClick={() =>
                handleOpportunityListUpdate({
                  ...volunteerOpportunitiesFilters,
                  page: volunteerOpportunitiesFilters.page - 1,
                })
              }
            >
              Previous
            </Button>
            <Typography variant='h6' color='blue-gray' className='font-normal'>
              Page{' '}
              <strong className='text-gray-900'>
                {volunteerOpportunitiesFilters.page}
              </strong>{' '}
              of <strong className='text-gray-900'>{pagesCount}</strong>
            </Typography>

            <Button
              variant='outlined'
              size='sm'
              disabled={
                isFetchingOpportunities ||
                volunteerOpportunitiesFilters.page >= pagesCount
              }
              onClick={() =>
                handleOpportunityListUpdate({
                  ...volunteerOpportunitiesFilters,
                  page: volunteerOpportunitiesFilters.page + 1,
                })
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TableContentProps {
  loading?: boolean;
  volunteeringOpportunityList: BookmarkedDetail[];
}

const TableContent: React.FC<TableContentProps> = ({
  loading,
  volunteeringOpportunityList,
}) => {
  const router = useRouter();

  if (loading) {
    return (
      <div className='mx-auto my-auto'>
        <Spinner className='h-8 w-8 mx-auto opacity-50' />
      </div>
    );
  }

  if (!volunteeringOpportunityList.length) {
    return (
      <div className='mx-auto my-auto'>
        <Typography
          variant='h3'
          color='blue-gray'
          className='font-normal text-center text-gray-500'
        >
          No Bookmarks Yet
        </Typography>
      </div>
    );
  }

  return volunteeringOpportunityList.map(
    (
      { title, opType, orgName, logoUrl, datePosted, dateBookmarked, eventID },
      index
    ) => (
      <div
        key={index}
        className='my-2 cursor-pointer '
        onClick={() => {
          router.push(`/talent/opportunities/${eventID}`);
        }}
      >
        <BookMarkedOpportunityCard
          eventTitle={title}
          opType={opType == 'inPerson' ? 'In Person' : 'Remote'}
          orgName={orgName}
          orgLogoURL={logoUrl}
          datePosted={datePosted}
          dateBookmarked={dateBookmarked}
          eventId={eventID}
        />
      </div>
    )
  );
};

export default BookMarkedList;
