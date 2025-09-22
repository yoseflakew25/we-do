import { Card, Avatar, Chip } from '@material-tailwind/react';

interface RecentOpportunityCardProps {
  src: string;
  title: string;
  rate: number;
  orgName: string;
  description: string;
  views?: number;
  type: string;
  status: string;
}
const RecentOpportunityCard: React.FC<RecentOpportunityCardProps> = ({
  src,
  title,
  orgName,
  description,
  views,
  type,
  status,
}) => {
  return (
    <Card className='p-4 my-6 w-72 sm:w-[30rem] shadow-sm rounded-xl  bg-[#FAFAFA]'>
      <div className=' lg:p-3 p-2 h-full w-full flex gap-3 items-center'>
        <Avatar
          size='md'
          variant='circular'
          src={src}
          alt={title}
          className='bg-red-300'
        />
        <div className='flex w-full flex-col'>
          <h2 className='truncate ... overflow-hidden font-normal text-base mr-10'>
            {title}
          </h2>
          <p className='text-sm text-grey'>{orgName}</p>
        </div>
      </div>
      <p className='line-clamp-2 text-sm text-grey'>{description}</p>
      <div className='flex justify-between mt-2'>
        <div className='flex gap-2'>
          <Chip
            variant='ghost'
            size='sm'
            value={status}
            className='rounded-full text-green capitalize font-poppins font-normal'
          />
          <Chip
            variant='ghost'
            size='sm'
            value={type}
            className='rounded-full capitalize font-poppins font-normal'
          />
        </div>
        <p className='text-grey text-xs font-light self-center'>
          {views} views
        </p>
      </div>

      {/* <div className='flex space-x-2'>
          <Typography className='font-poppins font-normal text-[#71717A] text-base leading-[27px] '>
            {rate}
          </Typography>
          <Rating
            initialValue={rate}
            readonly
            allowFraction
            SVGstyle={{ display: 'inline' }}
            size={20}
          />
        </div> */}
    </Card>
  );
};
export default RecentOpportunityCard;
