import OrgReviewCard from '../components/OrgReviewCard';
import { RateAndReviewPopup } from '../components/RateAndReviewPopup';
import {
  useGetOrgReviewsQuery,
  useCanReviewOrganizationQuery,
} from '@/app/api/slices/org-api-slice';
import ErrorPage from '@/components/ErrorPage';
import ThreeDotsLoading from '@/components/ThreeDotsLoading';
import {
  Button,
  Card,
  CardBody,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from '@material-tailwind/react';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { BiPlus } from 'react-icons/bi';

export interface OrgDetailReviewsListSectionProps {
  orgName: string;
  orgId: string;
}

const OrgDetailReviewsListSection: React.FC<
  OrgDetailReviewsListSectionProps
> = ({ orgName, orgId }) => {
  const { data: user } = useSession();
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
  const [isNotEligiblePopupOpen, setIsNotEligiblePopupOpen] = useState(false);
  const { data: eligible, isLoading: isCheckingEligibility } =
    useCanReviewOrganizationQuery(orgId);

  const {
    data: orgReviews,
    isFetching: isFetchingReviews,
    refetch: refetchOrgReviews,
    isError,
  } = useGetOrgReviewsQuery(orgId || '');

  if (isFetchingReviews || isCheckingEligibility) {
    return (
      <div className='flex justify-center items-center h-40'>
        <ThreeDotsLoading />
      </div>
    );
  }
  if (isError) {
    return <ErrorPage />;
  }

  const handleOpenPopup = () => {
    if (!eligible) {
      setIsNotEligiblePopupOpen(true);
    } else {
      setIsReviewPopupOpen((prev) => !prev);
    }
  };

  const handleCloseNotEligiblePopup = () => {
    setIsNotEligiblePopupOpen(false);
  };

  return (
    <div>
      {!orgReviews || !orgReviews.data.length ? (
        <div className='p-2 mx-auto my-auto'>
          <Typography
            variant='lead'
            color='blue-gray'
            className='font-normal text-center text-gray-500'
          >
            No reviews yet.
          </Typography>
        </div>
      ) : (
        orgReviews?.data.map(
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
              recipientName={orgName}
              recipientId={orgId}
              refetchReviews={refetchOrgReviews}
            />
          )
        )
      )}
      {user && user.user.role === 'user' && (
        <>
          <Card className='mb-4 cursor-pointer' onClick={handleOpenPopup}>
            <CardBody className='items-center flex flex-col gap-2'>
              <BiPlus size={50} className='text-bgPrimary' />
              <Typography variant='h6' className='text-bgPrimary'>
                Add your review
              </Typography>
            </CardBody>
          </Card>
        </>
      )}

      {isReviewPopupOpen && (
        <RateAndReviewPopup
          reviewerId={user?.user?.id || ''}
          handleOpenPopup={handleOpenPopup}
          recipientName={orgName}
          recipientId={orgId}
          reviewerName={user?.user?.name || ''}
          reviewerProfilePicUrl={user?.user?.profilePicUrl || ''}
          refetchReviews={refetchOrgReviews}
        />
      )}

      {/* Not Eligible Popup */}
      <Dialog
        size='sm'
        open={isNotEligiblePopupOpen}
        handler={handleCloseNotEligiblePopup}
      >
        <DialogHeader className=' text-black capitalize'>
          Can't leave a review
        </DialogHeader>
        <DialogBody className='-my-4'>
          You’re unable to leave a review for this organization because it looks
          like you haven’t volunteered, worked, or interned with them yet.
        </DialogBody>
        <DialogFooter>
          <Button
            variant='gradient'
            color='amber'
            onClick={handleCloseNotEligiblePopup}
            className='border-none'
          >
            Okay
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default OrgDetailReviewsListSection;
