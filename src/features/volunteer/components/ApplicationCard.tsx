'use client';

import { HandleOpenPopup } from '../opportunties/application/ApplicationsList';
import { useIsReviewedQuery } from '@/app/api/slices/api-slice';
import { useAvatarImage } from '@/hook';
import {
  Card,
  Typography,
  Avatar,
  Chip,
  Button,
} from '@material-tailwind/react';
import { color } from '@material-tailwind/react/types/components/chip';
import dateFormat from 'dateformat';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { FaChevronRight } from 'react-icons/fa6';
import { TiTick } from 'react-icons/ti';

type StatusColorMap = {
  [key: string]: color;
};

const statusColorMap: StatusColorMap = {
  pending: 'lime',
  'in-review': 'blue',
  interview: 'purple',
  'offer-extended': 'teal',
  hired: 'green',
  declined: 'pink',
  certified: 'gray',
};

export interface ApplicationCardProps {
  eventTitle: string;
  opType: string;
  orgName: string;
  dateApplied: string;
  status: string;
  orgLogoURL: string;
  datePosted: string;
  deadline: string;
  orgId: string;
  eventId: string;
  handleOpenPopup: HandleOpenPopup;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  eventTitle,
  opType,
  orgName,
  dateApplied,
  status,
  orgLogoURL,
  orgId,
  eventId,
  handleOpenPopup,
}) => {
  const getAvatar = useAvatarImage();
  const { data: user } = useSession();
  const { data: isReviewed, refetch } = useIsReviewedQuery({
    reviewerID: user?.user.id || '',
    recipientID: orgId,
    eventID: eventId,
  });

  useEffect(() => {
    if (user?.user.id && orgId && eventId) {
      refetch(); // Manually trigger a refetch if needed
    }
  }, [user?.user.id, orgId, eventId, refetch]);
  return (
    <Card
      color='white'
      className='w-full border rounded-2xl border-gray-300 shadow-lg p-4 relative'
    >
      <div className='flex'>
        <Avatar
          size='lg'
          variant='rounded'
          src={getAvatar(orgName || '', orgLogoURL)}
          className='mr-4'
        />
        <div className='flex flex-col justify-between w-full'>
          <div className='flex flex-col gap-2'>
            <div className='flex justify-between'>
              <Typography
                variant='h5'
                color='blue-gray'
                className='font-epilogue font-bold'
              >
                <div className='flex gap-1'>{eventTitle}</div>
                <Typography color='gray' className='font-epilogue' variant='h6'>
                  {orgName}
                </Typography>
              </Typography>
              <Chip
                variant='ghost'
                value={status}
                color={statusColorMap[status]}
                className={`rounded-full capitalize w-fit h-8 `}
              />
            </div>
            <Typography color='gray' className='font-epilogue'>
              Applied on: {dateFormat(dateApplied, 'mmm dd, yyyy')}
            </Typography>

            <Chip
              variant='outlined'
              value={opType}
              color={opType === 'Remote' ? 'deep-purple' : 'light-blue'}
              className='rounded-2xl capitalize p-2 w-fit ml-2'
            />
          </div>
          {(status == 'hired' || status == 'certified') &&
            (isReviewed?.status == 204 ? (
              <div className='flex justify-end p-0 m-0'>
                <Button
                  variant='text'
                  color='blue'
                  className='text-sm text-bgPrimary'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenPopup(orgId, eventTitle, eventId);
                  }}
                >
                  <span className='flex items-center'>
                    Add Review{' '}
                    <FaChevronRight className='ml-1 text-bgPrimary' size={20} />
                  </span>
                </Button>
              </div>
            ) : (
              <div className='flex justify-end p-0 m-0'>
                <Typography
                  variant='small'
                  color='teal'
                  className='flex items-center font-medium'
                >
                  <TiTick className='h-4 w-4 mr-1' />
                  Review Submitted
                </Typography>
              </div>
            ))}
        </div>
      </div>
    </Card>
  );
};

export default ApplicationCard;
