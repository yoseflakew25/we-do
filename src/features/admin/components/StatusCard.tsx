import { DatePickerWithRange } from './DatePickerWithRange';
import { GraphData } from '@/app/api/types';
import { Card, Progress, Typography, Spinner } from '@material-tailwind/react';
import * as React from 'react';

interface StatusCardProps {
  applicationData?: GraphData;
  loading: boolean;
  onDateRangeChange: (_startDate: Date, _endDate: Date) => void;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  applicationData,
  loading,
  onDateRangeChange,
}) => {
  const statusCounts = applicationData?.data || [];
  const totalCount = statusCounts.reduce((acc, count) => acc + count, 0);

  const getStatusCount = (status: string) => {
    const index = applicationData?.labels.indexOf(status);
    return index !== undefined && index !== -1 ? statusCounts[index] : 0;
  };

  const inReviewCount = getStatusCount('in-review');
  const hiredCount = getStatusCount('hired');
  const certifiedCount = getStatusCount('certified');
  return (
    <Card className='p-4 flex-2 mb-5'>
      <div className='flex flex-col gap-2'>
        <div className='flex justify-between flex-wrap'>
          <Typography
            color='gray'
            className='p-2 font-bold text-xl whitespace-nowrap'
          >
            Applicants Status
          </Typography>
          <div className='flex '>
            <DatePickerWithRange onDateRangeChange={onDateRangeChange} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className='flex justify-center items-center'>
          <Spinner color='amber' className='h-10 w-10' />
        </div>
      ) : (
        <div className='flex flex-col space-y-4 p-4'>
          <div className='flex space-x-2 w-full items-center justify-center'>
            <Typography
              variant='small'
              color='gray'
              className='font-normal capitalize'
            >
              Hired
            </Typography>
            <>
              <Progress value={(hiredCount / totalCount) * 100} color='teal' />
              <Typography>{hiredCount}</Typography>
            </>
          </div>
          <div className='flex space-x-2 w-full items-center justify-center'>
            <Typography
              variant='small'
              color='gray'
              className='font-normal capitalize whitespace-nowrap'
            >
              In Review
            </Typography>
            <>
              <Progress
                value={(inReviewCount / totalCount) * 100}
                color='purple'
              />
              <Typography>{inReviewCount}</Typography>
            </>
          </div>
          <div className='flex space-x-2 w-full justify-between items-center justify-center'>
            <>
              <Typography
                variant='small'
                color='gray'
                className='font-normal capitalize whitespace-nowrap'
              >
                In progess
              </Typography>
            </>
          
          </div>
          <div className='flex space-x-2 w-full  items-center justify-center'>
            <Typography
              variant='small'
              color='gray'
              className='font-normal capitalize'
            >
              Rejected
            </Typography>

          </div>
          <div className='flex space-x-2 w-full  items-center justify-center'>
            <Typography
              variant='small'
              color='gray'
              className='font-normal capitalize'
            >
              Certified
            </Typography>
            <Progress
              value={(certifiedCount / totalCount) * 100}
              color='amber'
            />
            <Typography>{certifiedCount}</Typography>
          </div>{' '}
          <div className='flex space-x-2 w-full  items-center justify-center'>
            <Typography
              variant='small'
              color='gray'
              className='font-normal capitalize'
            >
              Certified
            </Typography>
            <Progress
              value={(certifiedCount / totalCount) * 100}
              color='pink'
            />
            <Typography>{certifiedCount}</Typography>
          </div>
        </div>
      )}
    </Card>
  );
};
