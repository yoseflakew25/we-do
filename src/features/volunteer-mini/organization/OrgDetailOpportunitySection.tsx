import OpportunityCard from '../components/OpportunityCard';
import { useGetAllOpportunitiesByOrgIdQuery } from '@/app/api/slices/volunteer-api-slice';
import ErrorPage from '@/components/ErrorPage';
import LoadingPage from '@/components/LoadingPage';
import NoResultFoundPage from '@/components/NoResultFoundPage';
import { useRouter } from 'next/navigation';

export interface OrgDetailOpportunitySectionProps {
  orgId: string;
  status?: string;
}

const OrgDetailOpportunitySection: React.FC<
  OrgDetailOpportunitySectionProps
> = ({ orgId }) => {
  const router = useRouter();
  const status = 'open';
  const page = 1;
  const pageSize = 10;
  const {
    data: organizationOpportunityList,
    isFetching,
    isError,
  } = useGetAllOpportunitiesByOrgIdQuery(
    { orgID: orgId, status, page, pageSize },
    {
      refetchOnMountOrArgChange: 60,
    }
  );

  if (isFetching) {
    return <LoadingPage />;
  }

  if (isError || !organizationOpportunityList) {
    return <ErrorPage />;
  }

  if (!organizationOpportunityList.data.length) {
    return <NoResultFoundPage text='No Opportunties Posted Yet!' />;
  }

  return (
    <div className=' container'>
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
            datePosted,
            id,
          },
          index
        ) => (
          <div
            key={index}
            className='my-2 cursor-pointer '
            onClick={() => router.push(`/volunteer-mini/home/${id}`)}
          >
            <OpportunityCard
              id={id}
              title={title}
              opportunityDescription={description}
              opType={opType == 'inPerson' ? 'In Person' : 'Remote'}
              location={location}
              logoUrl={logoUrl}
              orgName={orgName}
              status={status}
              categories={categories}
              isBookmark={false}
              viewCount={viewsCount || 0}
              postedDate={datePosted}
            />
          </div>
        )
      )}
    </div>
  );
};

export default OrgDetailOpportunitySection;
