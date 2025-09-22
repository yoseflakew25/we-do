import { useDeleteReviewMutation } from '@/app/api/slices/api-slice';
import ConfirmDialog, { DialogData } from '@/components/ConfirmDialog';
import { EditReviewPopup } from '@/features/volunteer/components/EditReviewPopup';
import { Avatar, Button, Card, Typography } from '@material-tailwind/react';
import dateFormat from 'dateformat';
import { useState } from 'react';
import { LuDot } from 'react-icons/lu';
import { Rating } from 'react-simple-star-rating';
import { toast } from 'react-toastify';

interface OrgReviewCardProps {
  logoUrl: string;
  orgName: string;
  rating?: number;
  review?: string;
  reviewId?: string;
  applicantName: string;
  startDate?: string;
  endDate?: string;
  title: string;
  refetchExeperiences: () => void;
}

const OrgReviewCard: React.FC<OrgReviewCardProps> = ({
  logoUrl,
  orgName,
  rating,
  review,
  reviewId,
  applicantName,
  startDate,
  title,
  endDate,
  refetchExeperiences,
}) => {
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
        await deleteReview({ id: reviewId || '' })
          .unwrap()
          .then(() => {
            toast.success('Review deleted successfully!', {
              theme: 'light',
            });
            // refetchReviews();
          })
          .catch(
            (errorResponse: { data: { message: string }; status: number }) => {
              toast.error(errorResponse.data.message, {
                autoClose: false,
                theme: 'light',
              });
            }
          );
        // router.refresh();
      },
      color: 'pink',
      actionName: 'Delete',
    });
  };
  return (
    <>
      <Card className='flex-col gap-y-2 border-b-2  rounded-none py-6 shadow-none'>
        <div className='flex gap-3 items-center '>
          <Avatar
            size='sm'
            variant='circular'
            alt='Logo'
            className='border-2 border-white'
            src={logoUrl}
          />
          <div>
            <Typography variant='h5' className='text-neutrals100'>
              {title}
            </Typography>
            <Typography variant='paragraph' className='text-neutrals60'>
              {orgName}
            </Typography>
          </div>
        </div>

        <div className='flex items-center gap-x-1'>
          {review && (
            <div className='flex items-center gap-x-1'>
              <Rating
                initialValue={rating}
                readonly
                allowFraction
                SVGstyle={{ display: 'inline' }}
                size={20}
              />
              <LuDot className='text-neutrals60' size={20} />
            </div>
          )}
          <p className='text-neutrals80 capitalize '>
            {startDate && dateFormat(startDate, 'mmm dS, yyyy')} -{' '}
            {endDate && dateFormat(endDate, 'mmm dS, yyyy')}
            {!endDate && 'present'}
          </p>
        </div>
        <Typography variant='paragraph' className=' text-neutrals60'>
          {review ? review : 'No feedback given '}
        </Typography>

        {review && (
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
      </Card>

      {isEditReviewPopupOpen && (
        <EditReviewPopup
          handleOpenPopup={() => {
            setIsEditReviewPopupOpen((prev) => !prev);
          }}
          recipientName={applicantName}
          reviewerName={orgName}
          reviewerProfilePicUrl={logoUrl || ''}
          refetchReviews={refetchExeperiences}
          reviewId={reviewId || ''}
          oldReview={review || ''}
          oldRating={rating || 0}
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
