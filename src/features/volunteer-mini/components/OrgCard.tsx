import { tagColors } from '../opportunities/OpportunityDetails';
import {
  Avatar,
  Card,
  CardBody,
  Chip,
  Typography,
} from '@material-tailwind/react';
import { usePathname, useRouter } from 'next/navigation';
import { IoEye } from 'react-icons/io5';

export interface OrgCardProps {
  id: string;
  name: string;
  description: string;
  opportunities: number;
  logoUrl: string;
  tags?: string[];
  startDate: number;
  size?: 'sm' | 'md';
  viewCounts: number;
}

export function formatMonthYear(dateString: string): string {
  const date = new Date(dateString);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${month}, ${year}`;
}

const OrgCard: React.FC<OrgCardProps> = ({
  id,
  name,
  description,
  opportunities,
  logoUrl,
  tags,
  startDate,
  viewCounts,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div>
      <Card
        className='border w-[21rem] border-gray-300 shadow-lg mx-auto p-2'
        onClick={() => {
          router.push(`${pathname}/${id}`);
        }}
      >
        <CardBody className='flex p-2 md:p-4 flex-col gap-2'>
          <div className='flex gap-4'>
            <Avatar
              size='sm'
              variant='rounded'
              className='border  border-blue-300 '
              src={logoUrl}
              height={16}
              width={16}
            />
            <div className=''>
              <Typography
                variant='h5'
                className='font-epilogue text-sm w-52 whitespace-wrap'
                color='blue-gray'
              >
                {name}
              </Typography>
              <div className='flex gap-2 overflow-x-auto w-64'>
                {tags && tags.length > 0 && (
                  <div className=' w-[14rem] flex gap-2'>
                    {tags.map((item, index) => {
                      const currentColor = tagColors[index % tagColors.length];
                      return (
                        <Chip
                          variant='outlined'
                          key={index}
                          value={item.split(' ')[0] + '...'}
                          className='rounded-full capitalize '
                          color={currentColor}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Typography className='  text-sm md:text-base overflow-hidden text-ellipsis'>
            {description.length > 150
              ? description.substring(0, 155) + '...'
              : description}
          </Typography>

          <div className='pt-0 flex justify-between gap-4'>
            <div className=' flex gap-3'>
              <Chip
                variant='ghost'
                color='deep-purple'
                size='sm'
                className='text-xs md:text-base capitalize'
                value={opportunities + ' Available Opportunities'}
              />
              <div className='flex gap-2 items-center'>
                <IoEye style={{ color: '#007FFF' }} />
                {viewCounts}
              </div>
            </div>

            <Typography className='text-sm md:text-base' variant='h6'>
              {'Since ' + startDate}
            </Typography>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default OrgCard;
