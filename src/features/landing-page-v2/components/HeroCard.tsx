import { Avatar, Rating } from '@material-tailwind/react';

interface HeroCardProps {
  image: string;
  title: string;
  subTitle: string;
  rating?: number;
}

const HeroCard = ({ image, title, subTitle, rating }: HeroCardProps) => {
  return (
    <div className='bg-white shadow-lg lg:p-3 p-2 rounded-2xl h-max w-max flex gap-3 items-center'>
      <Avatar
        size='lg'
        variant='circular'
        src={image}
        alt={title}
        className='bg-red-300'
      />
      <div className='flex w-full flex-col'>
        <h2 className='font-normal text-sm'>{title}</h2>
        <p className='text-xs font-extralight'>{subTitle}</p>
        {rating && (
          <span className='flex gap-2 items-center'>
            <span className='text-xs'>{rating}</span>
            <Rating
              ratedIcon={<RatedIcon />}
              unratedIcon={<UnratedIcon />}
              value={rating}
              className='cursor-none'
              readonly
            />
          </span>
        )}
      </div>
    </div>
  );
};

function RatedIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='currentColor'
      className='h-3 w-3 text-yellow-700'
    >
      <path
        fillRule='evenodd'
        d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z'
        clipRule='evenodd'
      />
    </svg>
  );
}

function UnratedIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='currentColor'
      className='h-3 w-3 text-gray-300'
    >
      <path
        fillRule='evenodd'
        d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z'
        clipRule='evenodd'
      />
    </svg>
  );
}

export default HeroCard;
