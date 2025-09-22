'use client';

import { ApplicantStatusGraph } from '../components/ApplicantStatusGraph';
import { useGetApplicationSatusQuery } from '@/app/api/slices/chart-api-slice';
import DatePickerWithRange from '@/components/date/DateRangePicker';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { MdRectangle } from 'react-icons/md';

// Define a color palette
const COLORS = [
  '#4caf50', // Green
  '#2196f3', // Blue
  '#ff9800', // Orange
  '#9c27b0', // Purple
  '#f44336', // Red
];

type Filters = {
  startDate: Date;
  endDate: Date;
  role: 'user';
};

const ShimmerSkeleton = () => {
  return (
    <div className='animate-pulse space-y-4 p-4 h-full border-boundery rounded-lg'>
      {/* Graph Skeleton */}
      <div className='w-full h-[250px] bg-gray-200 rounded-lg'></div>
      {/* Label Skeleton */}
      <div className='space-y-2'>
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <div key={index} className='flex items-center space-x-4'>
              <div className='h-6 w-6 bg-gray-200 rounded-full'></div>
              <div className='flex-1 h-4 w-1/2 bg-gray-200 rounded-md'></div>
              <div className='w-8 h-4 bg-gray-200 rounded-md'></div>
            </div>
          ))}
      </div>
    </div>
  );
};

const ApplicationStatus = () => {
  const [applicationStatus, setApplicationStatus] = useState<Filters>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    endDate: new Date(Date.now()),
    role: 'user' as 'user',
  });

  const t = useTranslations('organizationDashboard')

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setApplicationStatus((prev) => ({
      ...prev,
      startDate,
      endDate,
    }));
  };

  const {
    data: ApplicationStatusData,
    isLoading,
    error,
  } = useGetApplicationSatusQuery(applicationStatus);

  if (isLoading) {
    return <ShimmerSkeleton />;
  }
  if (error) {
    return (
      <div className='flex text-red-200 p-4'>
        Error Fetching Applicant Status
      </div>
    );
  }

  const ApplicationStatus = ApplicationStatusData?.data || {
    labels: [],
    data: [],
  };

  return (
    <div className='grid grid-cols-1 md:grid md:grid-cols-2 lg:grid lg:grid-cols-1 px-4 rounded-lg border h-full border-boundery'>
      <div>
        <div className='flex space-y-4 justify-between items-center mt-2 mb-2'>
          <div className='font-normal text-sm md:text-md lg:text-lg'>
            {t('Applicants Review')}
          </div>
          <DatePickerWithRange onDateRangeChange={handleDateRangeChange} />
        </div>

        <div>
          {/* Pass colors explicitly to the graph */}
          <ApplicantStatusGraph
            statusData={ApplicationStatus}
            colors={COLORS}
          />
        </div>
      </div>

      {/* Applicant status section */}
      <div className='flex-col items-center sm:mt-12 sm:items-center sm:mx-auto md:mt-4  md:items-start md:mr-auto'>
        {ApplicationStatus.labels.map((label: string, index: number) => {
          const color = COLORS[index % COLORS.length];
          const capitalizedLabel =
            label.charAt(0).toUpperCase() + label.slice(1);
          return (
            <div key={label} className='flex p-2'>
              <div className='flex items-end justify-end space-x-2'>
                <MdRectangle style={{ color, borderRadius: '0.5rem' }} />
                <h1 className='text-neutrals60 font-poppins sm:text-sm lg:text-md'>
                  {capitalizedLabel} :{' '}
                </h1>
              </div>
              <h1 className='pl-4'>{ApplicationStatus.data[index]}</h1>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationStatus;