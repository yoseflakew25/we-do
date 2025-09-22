'use client';

import {
  Card,
  CardBody,
  Typography,
  Avatar,
  Chip,
} from '@material-tailwind/react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { IoEye } from 'react-icons/io5';

type ChipColor = 'orange' | 'amber' | 'gray' | 'teal' | 'cyan' | 'light-blue';
const tagColors: ChipColor[] = [
  'orange',
  'amber',
  'gray',
  'teal',
  'cyan',
  'light-blue',
];

export interface OpportunityCardProps {
  id: string;
  orgName: string;
  opportunityDescription: string;
  title: string;
  logoUrl: string;
  categories: string[];
  status: string;
  isBookmark: boolean;
  location: string[];
  postedDate: string;
  viewCount: number | undefined;
  opType: string;
}
function calculateDaysBetweenDates(givenDateString: string) {
  // Parse the given date string
  const givenDate = new Date(givenDateString);

  // Get today's date
  const today = new Date();

  // Calculate the time difference in milliseconds
  const timeDifferenceMs = today.valueOf() - givenDate.valueOf();

  // Convert milliseconds to days
  const daysDifference = Math.round(timeDifferenceMs / (1000 * 60 * 60 * 24));
  if (daysDifference < 14) {
    return `${daysDifference} days ago`;
  } else if (daysDifference >= 365) {
    const yearsDifference = Math.floor(daysDifference / 365);
    return `${yearsDifference} year ago`;
  } else {
    const weeksDifference = Math.floor(daysDifference / 7);
    if (weeksDifference === 2) {
      return '2 weeks ago';
    } else if (weeksDifference === 3) {
      return '3 weeks ago';
    }
    const monthsDifference = Math.floor(daysDifference / 30);
    return `${monthsDifference} month ago`;
  }
}
const formatViewCount = (totalCount: string) => {
  const count = parseFloat(totalCount);
  if (count >= 1000) {
    // Divide by 1000 and display as '1k', '2.5k', etc.
    const formattedCount = (count / 1000).toFixed(1);
    return `${formattedCount}k`;
  }
  // Display the original count for values less than 1000
  return count.toString();
};
const OpportunityCard: React.FC<OpportunityCardProps> = ({
  id,
  orgName,
  title,
  opportunityDescription,
  logoUrl,
  categories,
  status,
  isBookmark,
  location,
  postedDate,
  viewCount,
  opType,
}) => {
  const { data: session } = useSession();

  const remainingDays = calculateDaysBetweenDates(postedDate);
  const [isBookmarked, setIsBookmark] = useState(isBookmark);
  const toggleBookmark = () => {
    setIsBookmark((prevState) => !prevState);
  };
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Card
      onClick={() => {
        router.push(`${pathname}/${id}`);
      }}
      color='white'
      className='border w-[21rem] border-gray-300 shadow-lg mx-auto p-2'
    >
      <div className=''>
        <div className=' flex items-center gap-2'>
          <Avatar
            size='sm'
            variant='circular'
            src={logoUrl}
            alt={orgName}
            height={16}
            width={16}
          />
          <div className='flex flex-col'>
            <Typography
              variant='h5'
              color='blue-gray'
              className='font-epilogue text-sm w-52 whitespace-wrap'
            >
              {title}
            </Typography>
            <div className='flex gap-[0.1] '>
              <Typography
                color='gray'
                className='font-epilogue text-xs w-1/2 overflow-hidden overflow-ellipsis whitespace-nowrap'
              >
                {orgName}
              </Typography>
              <Typography
                color='gray'
                className='font-epilogue text-xs w-1/2 overflow-hidden overflow-ellipsis whitespace-nowrap'
              >
                | {location}
              </Typography>
            </div>
          </div>
          {session ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill={isBookmarked ? '#000000' : 'none'}
              stroke='#000000'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='ml-auto'
              onClick={toggleBookmark}
            >
              <path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'></path>
            </svg>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className='flex  mt-1 gap-2'>
        <Chip
          variant='ghost'
          value={opType}
          className='rounded-full capitalize'
          color={opType.toLowerCase() === 'inperson' ? 'cyan' : 'amber'}
        />
        <h1 className='bg-gray px-1 text-neutrals60'>|</h1>
        <div className='flex gap-2 overflow-x-auto w-64'>
          {categories?.map((item, index) => {
            const currentColor = tagColors[index % tagColors.length];
            return (
              <Chip
                variant='outlined'
                key={index}
                value={item.split(' ')[0] + '...'}
                className='rounded-full capitalize'
                color={currentColor}
              />
            );
          })}
        </div>
      </div>

      <CardBody className=' p-2'>
        <Typography className='font-Poppins text-neutrals60 text-sm'>
          {opportunityDescription}
        </Typography>
        <div className='flex justify-between pt-2'>
          <div className='flex'>
            <Chip
              variant='ghost'
              value={status}
              className='rounded-full mr-2 capitalize '
              color='teal'
            />
            {viewCount !== undefined && (
              <div className='flex gap-2 items-center'>
                <IoEye style={{ color: '#007FFF' }} />
                <Typography>{formatViewCount(viewCount.toString())}</Typography>
              </div>
            )}
          </div>
          <Typography className='font-Poppins text-1xl'>
            {remainingDays}
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
};

export default OpportunityCard;
