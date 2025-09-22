import OpportunityCard from '../components/OpportunityCard';
import { useGetAllOpportunitiesByOrgIdQuery } from '@/app/api/slices/volunteer-api-slice';
import ErrorPage from '@/components/ErrorPage';
import NoResultFoundPage from '@/components/NoResultFoundPage';
import ThreeDotsLoading from '@/components/ThreeDotsLoading';
import { locales } from '@/config';
import { Button, Typography } from '@material-tailwind/react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export interface OrgDetailOpportunitySectionProps {
  orgId: string;
  status?: string;
}

const OrgDetailOpportunitySection: React.FC<
  OrgDetailOpportunitySectionProps
> = ({ orgId }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState('open');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const foundLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}`) || pathname === `/${locale}`
  );

  const currentLocale = foundLocale;

  const {
    data: organizationOpportunityList,
    isFetching,
    isError,
    // refetch,
  } = useGetAllOpportunitiesByOrgIdQuery(
    { orgID: orgId, status, page, pageSize },
    {
      refetchOnMountOrArgChange: 60,
    }
  );

  if (isFetching || !organizationOpportunityList) {
    return (
      <div className='flex justify-center items-center h-40'>
        <ThreeDotsLoading />
      </div>
    );
  }

  if (isError) {
    return <ErrorPage />;
  }

  if (organizationOpportunityList?.data.length === 0) {
    return <NoResultFoundPage text='No opportunities found' />;
  }

  const pagesCount = Math.ceil(
    (organizationOpportunityList?.count || 1) / pageSize
  );

  return (
    <>
      <div className='relative h-10 w-48 min-w-[200px] ml-auto'>
        <div className='relative'>
          <span className='absolute -top-2 left-2 bg-white px-1 text-sm font-normal text-blue-gray-700'>
            Sort By
          </span>
          <select
            className='peer rounded-[7px] border border-blue-gray-200 bg-transparent pr-16 px-1 py-2 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value='open'>Open</option>
            <option value='closed'>Closed</option>
          </select>
        </div>
      </div>
      {organizationOpportunityList?.data.map(
        (
          {
            title,
            description,
            opType,
            location,
            logoUrl,
            orgName,
            status,
            categories,
            viewsCount,
            applicantsCount,
            datePosted,
            id,
            isBookmarked,
            average_rating,
            total_reviews,
          },
          index
        ) => (
          <div
            key={index}
            className='my-2 cursor-pointer '
            onClick={() => {
              // this is to handle if org user is seeing other orgs opportunity
              if (pathname.startsWith(`/${currentLocale}/organization`)) {
                router.push(
                  `/organization/other-organizations/opportunities/${id}`
                );
              } else {
                router.push(`/talent/opportunities/${id}`);
              }
            }}
          >
            <OpportunityCard
              opportunityTitle={title}
              opportunityDescription={description}
              opportunityType={opType == 'inPerson' ? 'In Person' : 'Remote'}
              location={location}
              logoUrl={logoUrl}
              orgName={orgName}
              status={status}
              tags={categories}
              isBookmark={isBookmarked}
              viewsCount={viewsCount || 0}
              applicantsCount={applicantsCount || 0}
              datePosted={datePosted}
              id={id}
              average_rating={average_rating}
              total_reviews={total_reviews}
            />
          </div>
        )
      )}
      <div className='flex flex-row justify-center items-center gap-8 mb-4 mt-2'>
        <Button
          variant='outlined'
          size='sm'
          disabled={isFetching || page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <Typography variant='h6' color='blue-gray' className='font-normal'>
          Page <strong className='text-gray-900'>{page}</strong> of{' '}
          <strong className='text-gray-900'>{pagesCount}</strong>
        </Typography>
        <Button
          variant='outlined'
          size='sm'
          disabled={isFetching || page >= pagesCount}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default OrgDetailOpportunitySection;
