import { useReviewOrganizationMutation } from '@/app/api/slices/volunteer-api-slice';
import { ReviewData } from '@/app/api/types';
import LoadingButton from '@/components/buttons/LoadingButton';
import { useAvatarImage } from '@/hook';
import {
  Textarea,
  Dialog,
  Typography,
  Avatar,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@material-tailwind/react';
import { useState } from 'react';
import { Rating } from 'react-simple-star-rating';
import { toast } from 'react-toastify';

export const RateAndReviewPopup = ({
  reviewerId,
  recipientId,
  handleOpenPopup,
  recipientName,
  reviewerName,
  reviewerProfilePicUrl,
  eventId,
  refetchReviews,
}: {
  reviewerId: string;
  handleOpenPopup: () => void;
  recipientName: string;
  recipientId: string;
  reviewerName: string;
  reviewerProfilePicUrl: string;
  eventId?: string;

  refetchReviews?: () => void;
}) => {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const getAvatar = useAvatarImage();
  const [reviewOrganization] = useReviewOrganizationMutation();

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleSubmitReview = async () => {
    setLoading(true);

    const reviewData: ReviewData = {
      comment: review,
      rating: rating,
      reviewerID: reviewerId,
      recipientID: recipientId,
      ...(eventId && { eventID: eventId }),
    };

    // Call the mutation function to update the profile
    await reviewOrganization(reviewData)
      .unwrap()
      .then(async () => {
        handleOpenPopup();
        toast.success('Review Submitted Successfully', {
          theme: 'light',
        });
        if (refetchReviews) {
          refetchReviews();
        }
      })
      .catch((errorResponse: { data: { message: string }; status: number }) => {
        if (errorResponse.data) {
          handleOpenPopup();
          toast.error(errorResponse.data.message, {
            theme: 'light',
          });
        } else {
          handleOpenPopup();
          toast.error('An unknown error occurred', {
            theme: 'light',
          });
        }
        setLoading(false);
      });
    setLoading(false);
  };
  return (
    <Dialog
      className='w-[30%] rounded-xl px-3'
      open={true}
      handler={handleOpenPopup}
    >
      <DialogHeader>Reviewing - {recipientName}</DialogHeader>
      <DialogBody className='flex flex-col space-y-3'>
        <div className='flex justify-items-center'>
          <Avatar
            src={getAvatar(reviewerName, reviewerProfilePicUrl)}
            alt='avatar'
            variant='circular'
            withBorder
            className='p-0.5 border-primary shadow-sm opacity-90'
            size='md'
          />

          <div className='mx-3'>
            <Typography variant='h5' color='blue-gray'>
              {reviewerName}
            </Typography>
            <Typography
              variant='paragraph'
              color='gray'
              className='font-epilogue'
            >
              Posting Publicly
            </Typography>
          </div>
        </div>
        <form className='space-y-4 w-full items-center flex flex-col'>
          <Rating
            initialValue={rating}
            allowFraction
            transition
            SVGstyle={{ display: 'inline' }}
            onClick={handleRating}
          />

          <Textarea
            value={review}
            rows={4}
            placeholder='
                    We value your feedback! Could you please take a moment to leave us a review?'
            className=' !border-t-blue-gray-200 focus:!border-t-primary focus:border-primary rounded-lg'
            labelProps={{
              className: 'hidden',
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onChange={(e) => setReview(e.target.value)}
          />
        </form>
      </DialogBody>
      <DialogFooter className='flex justify-end space-x-2'>
        <LoadingButton color='amber' variant='text' onClick={handleOpenPopup}>
          Cancel
        </LoadingButton>
        <LoadingButton
          color='amber'
          loading={loading}
          onClick={handleSubmitReview}
        >
          Send
        </LoadingButton>
      </DialogFooter>
    </Dialog>
  );
};
