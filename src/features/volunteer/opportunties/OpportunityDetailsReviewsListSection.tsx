import OrgReviewCard from '../components/OrgReviewCard';
import { useGetAllReviewsQuery } from '@/app/api/slices/opportunity-api-slice';
import ErrorPage from '@/components/ErrorPage';
import { Spinner, Typography } from '@material-tailwind/react';
import { useSession } from 'next-auth/react';
import React from 'react';

export type HandleOpenEditReviewPopup = (
  _review: string,
  _rating: number,
  _reviewId: string
) => void;

export interface OpportunityDetailReviewsListSectionProps {
  opportunityTitle: string;
  opportunityId: string;
}

const OpportunityDetailReviewsListSection: React.FC<
  OpportunityDetailReviewsListSectionProps
> = ({ opportunityTitle, opportunityId }) => {
  const { data: user } = useSession();
  const {
    data: opportunityReviews,
    isFetching: isFetchingReviews,
    refetch: refetchOpportunityReviews,
    isError,
  } = useGetAllReviewsQuery(opportunityId || '');
  if (isFetchingReviews) {
    return <Spinner color='amber' className='flex mx-auto h-80' />;
  }
  if (isError || !opportunityReviews) {
    return <ErrorPage />;
  }

  if (!opportunityReviews.data.length) {
    return (
      <div className='p-2 mx-auto my-auto'>
        <Typography
          variant='lead'
          color='blue-gray'
          className='font-normal text-center text-gray-500'
        >
          No reviews yet
        </Typography>
      </div>
    );
  }

  return (
    <div>
      {opportunityReviews?.data.map(
        ({ id, comment, rating, reviewer, createdAt }, index) => (
          <OrgReviewCard
            key={index}
            reviewerId={user?.user?.id || ''}
            reviewerName={reviewer.FullName}
            rating={rating}
            review={comment}
            submitDate={createdAt}
            reviewerProfilePic={reviewer.ProfilePicUrl}
            reviewId={id || ''}
            canEdit={(user && user.user.id == reviewer.ID) || false}
            recipientName={opportunityTitle}
            recipientId={opportunityId}
            refetchReviews={refetchOpportunityReviews}
          />
        )
      )}
    </div>
  );
};

export default OpportunityDetailReviewsListSection;
