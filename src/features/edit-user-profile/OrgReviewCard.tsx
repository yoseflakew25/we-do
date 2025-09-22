import { useGetAllReviewByIdQuery } from '@/app/api/slices/volunteer-api-slice';
import { Avatar, Card, Typography } from '@material-tailwind/react';
import { formatDistanceToNow } from 'date-fns';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Rating } from 'react-simple-star-rating';

const OrgReviewCard: React.FC<{ id: any }> = ({ id }) => {
  const { data } = useGetAllReviewByIdQuery(id);
  const t = useTranslations('EditProfile');
  const profileData = data?.data;
  if (!profileData || profileData.length === 0) {
    return (
      <Typography className='font-poppins flex justify-center text-sm text-secondary font-normal'>
        {t('No reviews yet')}
      </Typography>
    );
  }
  return (
    <div>
      <Typography className='font-inherit font-semibold text-lg text-primary capitalize mb-2'>
        {t('Organization reviews')}
      </Typography>

      <div
        className='flex overflow-x-auto py-2 gap-6'
        style={{ scrollbarWidth: 'none' }} /* Hides scrollbar */
      >
        {profileData?.map((review, index) => (
          <div key={index} className='min-w-[260px] shrink-0'>
            <Card className='flex-col gap-y-2 shadow-none p-4'>
              <div className='flex gap-3 items-center'>
                <Avatar
                  variant='circular'
                  alt='Logo'
                  className='h-12 w-12 border border-secondary'
                  src={review.reviewer.logo_url}
                />
                <div>
                  <Typography className='font-semibold font-poppins text-base text-primary'>
                    {review.event.title}
                  </Typography>
                  <Typography className='font-poppins font-normal text-tertiary'>
                    {review.reviewer.orgName}
                  </Typography>
                </div>
              </div>
              <div className='flex items-center gap-x-1'>
                <Rating
                  initialValue={review.rating}
                  readonly
                  allowFraction
                  size={22}
                  SVGstyle={{ display: 'inline' }}
                />
                {/* 
                Duration of the application
                <p className='font-Epilogue text-sm text-[#7A7A84] capitalize '>
                  {dateFormat(Date().toString(), 'mmm dS, yyyy')}
                </p> */}
              </div>
              <Typography className='font-poppins font-normal text-sm text-tertiary'>
                {review.comment}
              </Typography>
              <div className='flex justify-end'>
                <Typography className='font-poppins text-tertiary text-xs p-2'>
                  {formatDistanceToNow(new Date(review.updatedAt))} ago
                </Typography>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
export default OrgReviewCard;
