'use client';

import {
  useCreateBookMarkedOpportunitiesMutation,
  useDeleteBookMarkedOpportunitiesMutation,
} from '@/app/api/slices/opportunity-api-slice';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Button,
  Tooltip,
} from '@material-tailwind/react';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { FaEye, FaUserFriends } from 'react-icons/fa';
import { ReactElement } from 'react-markdown/lib/react-markdown';
// import { GoBookmark, GoBookmarkFill } from 'react-icons/go';
import { Rating } from 'react-simple-star-rating';
import { toast } from 'react-toastify';

type ChipColor = 'orange' | 'amber' | 'gray' | 'teal' | 'cyan' | 'light-blue';
export const tagColors: ChipColor[] = [
  'orange',
  'amber',
  'gray',
  'teal',
  'cyan',
  'light-blue',
];

export interface OpportunityCardProps {
  opportunityTitle: string;
  opportunityDescription: string | ReactElement;
  opportunityType: string;
  orgName: string;
  logoUrl: string;
  tags?: string[];
  status?: string;
  isBookmark: boolean;
  location: string[];
  viewsCount: number;
  applicantsCount: number;
  datePosted: string;
  id: string;
  average_rating: number;
  total_reviews: number;
  // eslint-disable-next-line unused-imports/no-unused-vars
  onCategoryClick?: (category: string) => void;
  // eslint-disable-next-line unused-imports/no-unused-vars
  onEmploymentTypeClick?: (empType: string) => void;
  isPaid?: boolean;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunityTitle,
  id,
  orgName,
  opportunityDescription,
  opportunityType,
  logoUrl,
  tags,
  isBookmark,
  location,
  viewsCount,
  applicantsCount,
  average_rating,
  total_reviews,
  onCategoryClick,
  onEmploymentTypeClick,
  isPaid,
}) => {
  // IDs for testing
  const opportunityCardTestId = `opportunity-card-${id}`;
  const opportunityTitleTestId = `opportunity-title-${id}`;
  const orgNameTestId = `org-name-${id}`;
  const opportunityTypeTestId = `opportunity-type-${id}`;

  const { data: user } = useSession();
  const [createBookmark] = useCreateBookMarkedOpportunitiesMutation();
  const [deleteBookmark] = useDeleteBookMarkedOpportunitiesMutation();
  const [isBookmarked, setIsBookmark] = useState(isBookmark);
  const toggleBookmark = async (opportunityId: string) => {
    // Optimistically update the UI
    setIsBookmark(!isBookmarked);

    try {
      if (!isBookmarked) {
        await createBookmark(opportunityId).unwrap();
        toast.success('Opportunity added to bookmarks successfully', {
          theme: 'light',
        });
      } else {
        await deleteBookmark(opportunityId).unwrap();
        toast.success('Opportunity removed from bookmarks successfully', {
          theme: 'light',
        });
      }
    } catch (error) {
      // Revert the UI update in case of an error
      setIsBookmark(isBookmarked);

      toast.error('Failed to update bookmark status', {
        theme: 'light',
      });
    }
  };

  return (
    <Card
      className='relative w-full border rounded-2xl border-gray-300 shadow-md  hover:bg-gray-50'
      data-testid={opportunityCardTestId}
    >
      {user && user.user.role == 'user' && (
        <Tooltip
          className='border border-blue-gray-50 text-[#7C8493] bg-white px-4 shadow-black/10'
          placement='top'
          content={
            isBookmarked
              ? 'Remove opportunity from bookmarks'
              : 'Add opportunity to bookmarks'
          }
        >
          <div className='absolute z-10 right-4 -top-1'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='30'
              height='30'
              viewBox='0 0 24 24'
              fill={isBookmarked ? '#000000' : 'none'}
              stroke='#7C8493'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              onClick={(event) => {
                event.stopPropagation();
                toggleBookmark(id);
              }}
            >
              <path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'></path>
            </svg>
          </div>
        </Tooltip>
      )}
      <CardHeader
        floated={false}
        shadow={false}
        className='flex items-center gap-4 mb-2 bg-inherit'
      >
        <Avatar
          size='lg'
          variant='circular'
          src={logoUrl || '/assets/organization-default.png'}
          alt={opportunityTitle}
        />
        <div className='w-full flex flex-row items-center justify-between '>
          <div className='font-inherit text-base font-semibold sm:text-xl w-full'>
            <div className=' flex gap-3  justify-between'>
              <div className='flex gap-1' data-testid={opportunityTitleTestId}>
                {opportunityTitle}
              </div>
            </div>

            <div className='font-inherit text-xs sm:text-base text-[#7C8493] flex lg:flex-row flex-col justify-between w-full'>
              <span data-testid={orgNameTestId}>{orgName}</span>
              <div className='flex flex-row flex-wrap gap-1 mt-2 sm:mt-0'>
                {location?.map((loc, index) => (
                  <button
                    key={index}
                    type='button'
                    onClick={() => {}}
                    className='rounded-full px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 mx-1'
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardBody className='sm:ml-16 mt-0 pt-0'>
        <div className='flex flex-row  divide-x divide-gray-400 gap-2 '>
          <div
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the card click
              onEmploymentTypeClick &&
                onEmploymentTypeClick(
                  opportunityType === 'In Person'
                    ? 'inPerson'
                    : opportunityType === 'Remote'
                    ? 'virtual'
                    : opportunityType.toLowerCase()
                ); // Call the function passed from OpportunitiesList
            }}
          >
            <Button
              className={` ${
                opportunityType === 'Remote'
                  ? ' bg-[#E1D8F1]  text-[#311b92] '
                  : opportunityType === 'hybrid'
                  ? 'bg-[#E8F3DB] text-[#33691E]'
                  : 'bg-[#CDEEFD] text-[#01579B]'
              }
                 rounded-full py-1 px-2 capitalize hover:text-opacity-7 flex gap-1 w-max h-7 items-center font-inherit
          
                `}
              data-testid={opportunityTypeTestId}
            >
              {opportunityType}
            </Button>
          </div>

          <div className='flex flex-row overflow-x-auto no-scrollbar gap-2 pl-2'>
            {tags?.map((item, index) => {
              const currentColor = tagColors[index % tagColors.length];
              return (
                <div
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the card click
                    onCategoryClick && onCategoryClick(item); // Call the function passed from OpportunitiesList
                  }}
                >
                  <Button
                    variant='outlined'
                    onClick={() => {}}
                    className={`px-1 flex gap-1 rounded-full font-inherit capitalize py-3 border-2 w-max h-5 items-center`}
                    color={currentColor}
                    size='sm'
                  >
                    {item}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        <Typography className='text-justify font-inherit text-sm sm:text-base py-3 text-[#7C8493]'>
          {opportunityDescription}
        </Typography>

        <div className='pt-0 flex justify-between items-center gap-4 mt-2 '>
          <div className=' flex gap-4 items-center'>
            {isPaid && (
              <Chip
                variant='ghost'
                value={'Salary / Compensation'}
                className='rounded-full capitalize'
                color='teal'
              />
            )}

            <div className='flex gap-x-2 items-center'>
              <FaEye size={16} className='text-bgPrimary' />
              <Typography className='text-sm text-neutrals80'>
                {viewsCount}
              </Typography>
            </div>
            <div className='flex gap-x-2 items-center group'>
              <FaUserFriends size={16} className='text-bgPrimary' />
              <Typography className='text-md text-neutrals80 flex gap-2'>
                <span>{applicantsCount}</span> <span className='group-hover:block hidden transition-all duration-300 ease-in-out'>{applicantsCount === 1 ? 'Applicant' : 'Applicants'}</span>
              </Typography>
            </div>
          </div>

          <div className='flex items-center justify-center '>
            <Rating
              initialValue={average_rating}
              readonly
              allowFraction
              SVGstyle={{ display: 'inline' }}
              size={15}
              className='mb-1'
            />
            <span className='w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400'></span>
            <a
              href='#'
              className='text-sm font-medium text-gray-900  hover:no-underline dark:text-white capitalize'
            >
              {total_reviews} {total_reviews < 2 ? 'review' : 'reviews'}
            </a>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default OpportunityCard;
