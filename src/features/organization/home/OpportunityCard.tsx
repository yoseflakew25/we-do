import { IconType } from 'react-icons/lib';

interface OpportunityCardProps {
  title: string;
  value: number;
  icon: IconType;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  title,
  value,
  icon: Icon,
}) => {
  return (
    <div className='flex flex-col items-start flex-wrap p-4 md:p-6 lg:py-4 space-y-4 border border-boundery rounded-xl w-full'>
      <div className='flex justify-between items-center w-full'>
        <h3 className=' text-neutrals60 text-base md:text-sm lg:text-md'>
          {title}
        </h3>
        <div className='rounded-full lg:block bg-primary sm:ml-8 md:ml-2 ml-12 lg:p-2 mr-2'>
          <Icon style={{ color: 'white', fontSize: '24px' }} />
        </div>
      </div>
      <div>
        <p className='text-lg md:text-2xl lg:text-3xl font-base text-gray-900'>
          {value}
        </p>
      </div>
    </div>
  );
};

export default OpportunityCard;
