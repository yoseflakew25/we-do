import IconInCircle from '../../components/IconInCircle';
import { Button } from '@material-tailwind/react';

interface AllApplicantsInfoProps {
  total: Number;
  inReview: Number;
  hired: Number;
  declined: Number;
}

const AllApplicantsInfo: React.FC<AllApplicantsInfoProps> = ({
  total,
  inReview,
  hired,
  declined,
}) => {
  return (
    <div>
      <p className='text-neutrals100'>{'' + total} Applicants</p>
      <div className='flex'>
        <div className='grid grid-rows-3'>
          {/* row 1 */}
          <div className='flex gap-2 items-center'>
            <div className='flex gap-2 items-center justify-between'>
              <div className='bg-yellowAccent  rounded-full w-3 h-3'></div>
              <p className='text-neutrals100'> In Review </p>
            </div>
            <IconInCircle
              icon={<p className='text-xs text-neutrals100'>{'' + inReview}</p>}
              bgColor='bg-tertiary'
            />
          </div>
          {/* row 2 */}
          <div className='flex  gap-2 items-center justify-between'>
            <div className='flex gap-2 items-center'>
              <div className='bg-greenAccent  rounded-full w-3 h-3'></div>
              <p className='text-neutrals100'> Hired </p>
            </div>
            <IconInCircle
              icon={<p className='text-xs text-neutrals100'>{'' + hired}</p>}
              bgColor='bg-tertiary'
            />
          </div>
          {/* row 3 */}
          <div className='flex  gap-2 items-center justify-between'>
            <div className='flex gap-2 items-center'>
              <div className='bg-redAccent  rounded-full w-3 h-3'></div>
              <p className='text-neutrals100'> Declined </p>
            </div>
            <IconInCircle
              icon={<p className='text-xs text-neutrals100'>{'' + declined}</p>}
              bgColor='bg-tertiary'
            />
          </div>
        </div>
      </div>

      <Button
        color='amber'
        className='text-bgPrimary capitalize'
        variant='text'
      >
        View all applicants
      </Button>
    </div>
  );
};

export default AllApplicantsInfo;
