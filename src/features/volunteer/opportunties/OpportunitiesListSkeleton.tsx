import {
  Card,
  CardHeader,
  Typography,
  CardBody,
} from '@material-tailwind/react';

export const OpportunitiesListSkeleton = () => {
  return (
    <div className='grid grid-cols-1 gap-4'>
      {[...Array(10)].map((_, index) => (
        <Card
          key={index}
          className='relative w-full border rounded-2xl border-gray-300 shadow-md  hover:bg-gray-50'
        >
          <CardHeader
            floated={false}
            shadow={false}
            className='flex gap-4 mb-2 bg-inherit'
          >
            <div className='grid h-14 w-14 place-items-center rounded-full bg-gray-200 animate-pulse'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1}
                stroke='currentColor'
                className='h-6 w-6 text-gray-500'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z'
                />
              </svg>
            </div>
            <div className='w-full'>
              <Typography
                as='div'
                variant='h1'
                className='h-4 w-40 mb-2 rounded-full bg-gray-200 animate-pulse'
              >
                &nbsp;
              </Typography>
              <div className='mb-4 w-full flex justify-between items-center'>
                <Typography
                  as='div'
                  variant='h1'
                  className='h-3 w-24 rounded-full bg-gray-200 animate-pulse'
                >
                  &nbsp;
                </Typography>

                <Typography
                  as='div'
                  variant='paragraph'
                  className='h-6 w-20 rounded-full bg-gray-200 animate-pulse'
                  key={index}
                >
                  &nbsp;
                </Typography>
              </div>
            </div>
          </CardHeader>
          <CardBody className='flex flex-col sm:ml-16 mt-0 pt-0 pb-2 px-5'>
            <div className='flex gap-1 mb-2'>
              {[...Array(2)].map((_, index) => (
                <Typography
                  as='div'
                  variant='paragraph'
                  className='mb-2 h-6 w-28 rounded-full bg-gray-200 animate-pulse'
                  key={index}
                >
                  &nbsp;
                </Typography>
              ))}
            </div>
            {Array.from({ length: 2 }).map((_, index) => (
              <Typography
                key={index}
                as='div'
                variant='h1'
                className='mb-4 h-2 w-full rounded-full bg-gray-200 animate-pulse'
              >
                &nbsp;
              </Typography>
            ))}
            <div className='flex justify-end mt-2 mb-4'>
              <Typography
                key={index}
                as='div'
                variant='h1'
                className='h-2 w-36 rounded-full bg-gray-200 animate-pulse'
              >
                &nbsp;
              </Typography>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
