import { useEditReviewMutation } from '@/app/api/slices/volunteer-api-slice';
import { EditReviewData } from '@/app/api/types';
import LoadingButton from '@/components/buttons/LoadingButton';
import { useAvatarImage } from '@/hook';
import {
  Textarea,
  Dialog,
  IconButton,
  Typography,
  Avatar,
  ListItem,
  Button,
} from '@material-tailwind/react';
import { useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import { Rating } from 'react-simple-star-rating';
import { toast } from 'react-toastify';

export const EditReviewPopup = ({
  handleOpenPopup,
  recipientName,
  reviewerName,
  reviewerProfilePicUrl,
  reviewId,
  oldReview,
  oldRating,
  refetchReviews,
}: {
  handleOpenPopup: () => void;
  recipientName: string;
  reviewerName: string;
  reviewerProfilePicUrl: string;
  reviewId: string;
  oldReview: string;
  oldRating: number;

  refetchReviews?: () => void;
}) => {
  const [review, setReview] = useState(oldReview);
  const [rating, setRating] = useState(oldRating);
  const [loading, setLoading] = useState(false);
  const getAvatar = useAvatarImage();
  const [editReview] = useEditReviewMutation();

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleSubmitReview = async () => {
    setLoading(true);

    const reviewData: EditReviewData = {
      rating: rating,
      comment: review,
    };

    // Call the mutation function to update the profile
    await editReview({ id: reviewId, data: reviewData })
      .unwrap()
      .then(async () => {
        handleOpenPopup();
        toast.success('Review Updated Successfully', {
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
    <Dialog className='w-[30%] rounded-3xl' open={true} handler={() => {}}>
      <div className='container my-auto flex flex-col justify-center px-10 py-5'>
        <div className='flex flex-col pb-4 '>
          <div className='flex justify-end'>
            <IconButton
              className='rounded-full mr-1'
              variant='outlined'
              size='sm'
              onClick={handleOpenPopup}
            >
              <IoIosClose size='lg' />
            </IconButton>
          </div>
          <Typography className='font-epilogue text-md font-semibold text-gray-800'>
            Reviewing - {recipientName}
          </Typography>

          <ListItem
            className={`opacity-100

          }`}
            disabled
          >
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
          </ListItem>
        </div>
        <div>
          <form className='space-y-4'>
            <div className='flex flex-col items-center gap-4'>
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
                className=' !border-t-blue-gray-200 focus:!border-t-primary focus:border-primary rounded-lg '
                labelProps={{
                  className: 'hidden',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onChange={(e) => setReview(e.target.value)}
              />
            </div>
            <div className='flex justify-end mt-4 space-x-2'>
              <Button
                variant='text'
                onClick={handleOpenPopup}
                className='flex items-center justify-center  w-1/5 text-[rgba(45,41,142)] py-2 px-6 text-sm rounded-full font-semibold  '
              >
                Cancel
              </Button>
              <LoadingButton
                loading={loading}
                onClick={handleSubmitReview}
                className='flex items-center justify-center bg-[rgba(45,41,142)] w-1/5  text-white  px-6 py-2 text-sm rounded-full font-semibold font-poppins'
              >
                Send
              </LoadingButton>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};
