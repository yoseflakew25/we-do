import { useAvatarImage } from '@/hook';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Typography,
} from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import { Rating } from 'react-simple-star-rating';

export interface OrgCardProps {
  name: string;
  description: string;
  opportunities: number;
  logoUrl: string;
  tags?: string[];
  startDate: number;
  size?: 'sm' | 'md';
  viewCounts: number;
  total_reviews: number;
  average_rating: number;
  orgType?: string;
  // eslint-disable-next-line unused-imports/no-unused-vars
  onCategoryClick?: (category: string) => void;
  // eslint-disable-next-line unused-imports/no-unused-vars
  onOrganizationTypeClick?: (org: string) => void;
}

export function formatMonthYear(dateString: string): string {
  const date = new Date(dateString);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${month}, ${year}`;
}
type ChipColor = 'orange' | 'amber' | 'gray' | 'teal' | 'cyan' | 'light-blue';

const OrganizationCard: React.FC<OrgCardProps> = ({
  name,
  description,
  opportunities,
  logoUrl,
  tags,
  orgType,
  // startDate,
  average_rating,
  total_reviews,
  onCategoryClick,
  onOrganizationTypeClick,
}) => {
  const getAvatar = useAvatarImage();
  const t = useTranslations('browseOrganizations');

  const tagColors: ChipColor[] = [
    'orange',
    'amber',
    'gray',
    'teal',
    'cyan',
    'light-blue',
  ];

  return (
    <div>
      <Card
        color='white'
        className='rounded-2xl border border-gray-300 shadow-md'
      >
        <CardHeader
          color='white'
          floated={false}
          shadow={false}
          className='mb-1 '
        >
          <div className='grid grid-cols-5 justify between'>
            <div className='col-span-3'>
              <Avatar
                size='lg'
                variant='circular'
                src={getAvatar(name || '', logoUrl)}
              />
            </div>
            <div className='col-span-2'>
              <Chip
                variant='ghost'
                color='deep-purple'
                size='sm'
                className='text-xs font-inherit rounded-full md:text-sm capitalize font-bold text-center'
                value={
                  opportunities
                    ? opportunities > 1
                      ? opportunities + ` ${t('opportunities')}`
                      : opportunities + ` ${t('opportunity')}`
                    : ` ${t('noOpportunities')}`
                }
              />
            </div>
          </div>

          <Typography className='font-poppins text-[#25324B] text-base font-bold md:text-xl px-2 py-1 truncate'>
            {name}
          </Typography>
        </CardHeader>
        <CardBody className='flex flex-col my-0 py-0 px-5'>
          <div className=' flex flex-row overflow-x-auto gap-1 pb-1'>
            {tags?.map((item, index) => {
              const currentColor = tagColors[index % tagColors.length];
              return (
                <div
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the card click
                    onCategoryClick && onCategoryClick(item); // Call the function passed from OrganizationsList
                  }}
                >
                  <Chip
                    variant='outlined'
                    color={currentColor}
                    value={item}
                    className='font-inherit rounded-full capitalize'
                    size='sm'
                  />
                </div>
              );
            })}
          </div>

          <Typography className='text-[#515B6F] text-xs sm:text-sm overflow-hidden font-poppins text-ellipsis text-justify pb-1'>
            {description.length > 150
              ? description.substring(0, 150) + '...'
              : description}
          </Typography>
        </CardBody>

        <CardFooter className='pt-2 pb-4'>
          <div className='flex gap-4'>
            <Button
              className={`
                ${
                  orgType === 'Non-Profit'
                    ? 'bg-[#CCEAE7] text-[#004D40]'
                    : 'bg-[#FFEACC] text-[#E65100]'
                }
                   rounded-full py-1 px-2 capitalize hover:text-opacity-70 font-inherit                  `}
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the card click
                onOrganizationTypeClick &&
                  onOrganizationTypeClick(orgType || ''); // Call the function passed from OpportunitiesList
              }}
            >
              {orgType}
            </Button>

            <div className='flex items-center gap-1'>
              <Rating
                initialValue={
                  Math.round((average_rating + Number.EPSILON) * 100) / 100
                }
                readonly
                allowFraction
                SVGstyle={{ display: 'inline' }}
                size={15}
              />
              <div className='flex items-center gap-1 mt-1'>
                <span className='font-inherit w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400'></span>
                <a
                  href='#'
                  className='font-inherit text-sm font-medium text-gray-900  hover:no-underline dark:text-white capitalize'
                >
                  {total_reviews} {total_reviews < 2 ? 'review' : 'reviews'}
                </a>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrganizationCard;
