'use client';

import OrgHeader from '../components/OrgHeader';
import { OpportunityDetail } from '@/app/api/types';
import { Typography, Chip, Button } from '@material-tailwind/react';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaRegCalendarCheck } from 'react-icons/fa';
import { FaRegCalendarXmark } from 'react-icons/fa6';
import { FiClock } from 'react-icons/fi';
import { IoMdAlarm } from 'react-icons/io';
import { IoLocationOutline } from 'react-icons/io5';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';

type ChipColor = 'orange' | 'amber' | 'gray' | 'teal' | 'cyan' | 'light-blue';
export const tagColors: ChipColor[] = [
  'orange',
  'amber',
  'gray',
  'teal',
  'cyan',
  'light-blue',
];

export interface DetailPageProps {
  opportunityData: OpportunityDetail;
}
const BulletPoint = ({ description }: { description: string }) => {
  return (
    <Typography className=' font-poppins text-sm text-neutrals60'>
      <MdKeyboardDoubleArrowRight color='amber' className='inline' />
      {description}
    </Typography>
  );
};
export function formatMonthYear(dateString: any): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

const DeatilPage: React.FC<DetailPageProps> = ({ opportunityData }) => {
  const router = useRouter();
  // Split the responsibilities string into an array of sentences
  const responsibilitiesArray = opportunityData.responsibilities.split('\n');
  // Filter out empty strings (in case there are consecutive line breaks)
  const filteredResponsibilities = responsibilitiesArray.filter(
    (sentence) => sentence.trim() !== ''
  );
  const idealCandidiateArray = opportunityData.idealCandidate.split('\n');
  // Filter out empty strings (in case there are consecutive line breaks)
  const filteredidealCandidiate = idealCandidiateArray.filter(
    (sentence) => sentence.trim() !== ''
  );
  const goBack = () => {
    router.back();
  };
  return (
    <>
      <BackButton onClick={goBack} />

      <div className='w-full max-w-[26rem] p-4 pb-20 bg-white'>
        <OrgHeader
          name={opportunityData.title}
          details={
            <div className='flex gap-2'>
              {opportunityData.location}
              <span
                className={`${
                  opportunityData.opType === 'inPerson'
                    ? ' text-blueAccent'
                    : 'text-purple'
                }`}
              >
                {opportunityData.opType == 'inPerson' ? 'In Person' : 'Remote'}
              </span>
            </div>
          }
          logoUrl={opportunityData.logoUrl}
        />
        <div className='flex flex-col gap-2'>
          <Typography variant='h5' className=' font-poppins  text-black'>
            Description
          </Typography>
          <Typography
            color='gray'
            className=' text-neutrals60 font-poppins text-sm'
          >
            {opportunityData.description}
          </Typography>

          <Typography variant='h5' className=' font-poppins  text-black'>
            Responsibilities
          </Typography>
          {filteredResponsibilities?.map((item, index) => {
            return <BulletPoint key={index} description={item} />;
          })}

          <Typography variant='h5' className=' font-poppins  text-black'>
            Requirements
          </Typography>
          {opportunityData.requiredSkills?.map((item, index) => {
            return <BulletPoint key={index} description={item} />;
          })}
          <Typography variant='h5' className=' font-poppins  text-black'>
            Ideal Candidate
          </Typography>
          {filteredidealCandidiate?.map((item, index) => {
            return (
              <div key={index}>
                <BulletPoint description={item} />
                {index !== filteredidealCandidiate.length - 1 && <br />}
              </div>
            );
          })}

          {!opportunityData.perksAndBenefits ||
            (opportunityData.perksAndBenefits?.length != 0 && (
              <>
                <Typography variant='h5' className=' font-poppins  text-black'>
                  Perks and Benefits
                </Typography>
                {opportunityData.perksAndBenefits?.map((item, index) => {
                  return <BulletPoint key={index} description={item} />;
                })}
              </>
            ))}

          <Typography variant='h5' className=' font-poppins  text-black'>
            Required Skills
          </Typography>
          <div className='flex flex-wrap gap-2'>
            {opportunityData.requiredSkills?.map((item, index) => {
              return (
                <Chip
                  variant='outlined'
                  key={index}
                  value={item}
                  className='rounded-full capitalize  '
                  color='blue'
                />
              );
            })}
          </div>

          <Typography variant='h5' className=' font-poppins  text-black'>
            Categories
          </Typography>
          <div className='flex flex-wrap gap-2'>
            {opportunityData.categories?.map((item, index) => {
              const currentColor = tagColors[index % tagColors.length];
              return (
                <Chip
                  variant='ghost'
                  key={index}
                  value={item.split(' ')[0]}
                  className='rounded-full capitalize'
                  color={currentColor}
                />
              );
            })}{' '}
          </div>

          <div>
            <Typography variant='h5' className=' font-poppins  text-black'>
              Important Dates
            </Typography>
            <div className='flex justify-between'>
              <div className='flex-col'>
                <div className='flex items-center'>
                  <FiClock
                    className='mr-3'
                    style={{ color: '#007FFF', fontSize: '1.25rem' }}
                  />
                  <div className='flex-col'>
                    <Typography color='gray' className='font-poppins text-sm'>
                      Posted on
                    </Typography>
                    <Typography className='font-poppins text-sm font-medium'>
                      {formatMonthYear(opportunityData.datePosted)}
                    </Typography>
                  </div>
                </div>
                <div className='flex items-center'>
                  <FaRegCalendarCheck
                    className='mr-3'
                    style={{ color: '#007FFF', fontSize: '1.25rem' }}
                  />

                  <div className='flex-col'>
                    <Typography color='gray' className='font-poppins text-sm'>
                      Start Date
                    </Typography>
                    <Typography className='font-poppins text-sm font-medium'>
                      {formatMonthYear(opportunityData.startDate)}
                    </Typography>
                  </div>
                </div>
              </div>

              <div className='flex-col'>
                <div className='flex items-center'>
                  <IoMdAlarm
                    className='mr-3'
                    style={{ color: '#007FFF', fontSize: '1.25rem' }}
                  />
                  <div className='flex-col'>
                    <Typography color='gray' className='font-poppins text-sm'>
                      Deadline
                    </Typography>
                    <Typography className='font-poppins text-sm font-medium'>
                      {formatMonthYear(opportunityData.deadline)}
                    </Typography>
                  </div>
                </div>

                <div className='flex items-center'>
                  <FaRegCalendarXmark
                    className='mr-3'
                    style={{ color: '#007FFF', fontSize: '1.25rem' }}
                  />
                  <div className='flex-col'>
                    <Typography color='gray' className='font-poppins text-sm'>
                      End Date
                    </Typography>
                    <Typography className='font-poppins text-sm font-medium'>
                      {formatMonthYear(opportunityData.endDate)}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Typography variant='h5' className=' font-poppins  text-black'>
            Location
          </Typography>
          <div className='flex items-center'>
            <IoLocationOutline
              className='mr-3'
              style={{ color: '#007FFF', fontSize: '1.25rem' }}
            />
            <Typography color='gray' className='font-poppins text-sm'>
              {opportunityData.location}
            </Typography>
          </div>

          <Typography variant='h5' className=' font-poppins  text-black'>
            Organization
          </Typography>
          <Button
            fullWidth
            variant='text'
            className=' capitalize text-neutrals60 font-poppins font-normal text-sm p-0 rounded-0'
            onClick={() =>
              router.push(`/volunteer-mini/ngos/${opportunityData.orgID}`)
            }
          >
            {opportunityData.orgName}
          </Button>
        </div>
      </div>
    </>
  );
};

export default DeatilPage;
