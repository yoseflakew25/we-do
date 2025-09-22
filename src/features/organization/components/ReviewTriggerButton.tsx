import { useIsReviewedQuery } from '@/app/api/slices/api-slice';
import { Button } from '@material-tailwind/react';
import React from 'react';
import { HiOutlineStar } from 'react-icons/hi';

interface ReviewTriggerButtonProps {
  applicantDetail: any;
  opportunityData: any;
  handleOpenReviewPopup: () => void;
}

const ReviewTriggerButton: React.FC<ReviewTriggerButtonProps> = ({
  applicantDetail,
  opportunityData,
  handleOpenReviewPopup,
}) => {
  const { data } = useIsReviewedQuery({
    reviewerID: opportunityData?.orgID || '',
    recipientID: applicantDetail.volunteerID,
    eventID: opportunityData?.id || '',
  });


  if (data?.status == 200) {
    return null;
  }

  return (
    <Button
      onClick={handleOpenReviewPopup}
      className='bg-secondary rounded-full capitalize ml-4'
    >
      <div className='flex justify-center items-center font-epilogue text-neutrals100 font-semibold space-x-2 self-center cursor-pointer'>
        <p>{`Rate ${applicantDetail.name.split(' ')[0]} ?`}</p>
        <div className='hidden self-center lg:flex items-center'>
          <HiOutlineStar size={18} color='grey' />
          <HiOutlineStar size={18} color='grey' />
          <HiOutlineStar size={18} color='grey' />
          <HiOutlineStar size={18} color='grey' />
          <HiOutlineStar size={18} color='grey' />
        </div>
      </div>
    </Button>
  );
};

export default ReviewTriggerButton;
