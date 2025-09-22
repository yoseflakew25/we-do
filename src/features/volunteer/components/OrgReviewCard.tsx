import { EditReviewPopup } from './EditReviewPopup';
import { useDeleteReviewMutation } from '@/app/api/slices/api-slice';
import ConfirmDialog, { DialogData } from '@/components/ConfirmDialog';
import { useAvatarImage } from '@/hook';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
} from '@material-tailwind/react';
import dateFormat from 'dateformat';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Rating } from 'react-simple-star-rating';
import { toast } from 'react-toastify';

interface OrgReviewCardProps {
  reviewId: string;
  reviewerProfilePic?: string;
  reviewerName: string;
  reviewerId: string;
  rating: number;
  review: string;
  recipientName: string;
  recipientId: string;
  submitDate: string;
  canEdit?: boolean;
  refetchReviews: () => void;
}
const OrgReviewCard: React.FC<OrgReviewCardProps> = ({
  reviewerProfilePic,
  reviewerName,
  rating,
  review,
  submitDate,
  reviewId,
  recipientName,
  canEdit,
  refetchReviews,
}) => {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(true);
  const [dialogData, setDialogData] = useState<DialogData>();
  const [isEditReviewPopupOpen, setIsEditReviewPopupOpen] = useState(false);
  const [deleteReview] = useDeleteReviewMutation();

  const onDeleteClick = () => {
    setShowDialog(true);
    setDialogData({
      title: 'Are you sure you wish to delete this review?',
      description: 'This is an irreversable action.',
      action: async () => {
        await deleteReview({ id: reviewId })
          .unwrap()
          .then(() => {
            toast.success('Review deleted successfully!', {
              theme: 'light',
            });
            refetchReviews();
          })
          .catch(
            (errorResponse: { data: { message: string }; status: number }) => {
              toast.error(errorResponse.data.message, {
                autoClose: false,
                theme: 'light',
              });
            }
          );
        router.refresh();
      },
      color: 'pink',
      actionName: 'Delete',
    });
  };
  const getAvatar = useAvatarImage();
  return (
    <>
      <Card className='mb-2'>
        <CardHeader
          floated={false}
          shadow={false}
          className=' flex items-center gap-4 mb-2 '
        >
          <Avatar
            size='lg'
            variant='circular'
            src={getAvatar(reviewerName || '', reviewerProfilePic)}
            alt='Logo'
            className='border-2 border-white'
          />
          <div className='flex w-full flex-col'>
            <div className='flex flex-row items-center justify-between '>
              <div className='font-epilogue text-base font-semibold sm:text-xl'>
                <span className='flex gap-1'>{reviewerName}</span>
                <Typography className='font-epilogue text-xs sm:text-base text-[#7C8493]'>
                  <Rating
                    initialValue={rating}
                    size={24}
                    readonly
                    allowFraction
                    SVGstyle={{ display: 'inline' }}
                  />
                </Typography>
              </div>

              <div>
                <p className='text-neutrals80 capitalize '>
                  {moment(dateFormat(submitDate)).fromNow()}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardBody className='items-center'>
          <div className='flex items-center gap-x-1'></div>
          <Typography variant='paragraph' className=' text-neutrals60'>
            {review}
          </Typography>

          {canEdit && (
            <div className='flex justify-end gap-2'>
              <Button
                size='sm'
                color='red'
                variant='outlined'
                onClick={onDeleteClick}
              >
                Delete
              </Button>
              <Button
                size='sm'
                color='amber'
                variant='filled'
                onClick={() => {
                  setIsEditReviewPopupOpen((prev) => !prev);
                }}
              >
                Edit
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {isEditReviewPopupOpen && (
        <EditReviewPopup
          handleOpenPopup={() => {
            setIsEditReviewPopupOpen((prev) => !prev);
          }}
          recipientName={recipientName}
          reviewerName={reviewerName}
          reviewerProfilePicUrl={reviewerProfilePic || ''}
          refetchReviews={refetchReviews}
          reviewId={reviewId}
          oldReview={review}
          oldRating={rating}
        />
      )}

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
export default OrgReviewCard;
