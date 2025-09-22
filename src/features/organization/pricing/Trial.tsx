import {
  useGetAllPricingsQuery,
  useSubscribeToTrialMutation,
} from '@/app/api/slices/org-api-slice';
import LoadingButton from '@/components/buttons/LoadingButton';
import { Card, Spinner, Typography } from '@material-tailwind/react';
import { FaCheck } from 'react-icons/fa6';

const TrialCard = () => {
  const [subscribeToTrial, { isLoading }] = useSubscribeToTrialMutation();
  const {
    data: pricingData,
    isLoading: loadingTrial,
    error,
  } = useGetAllPricingsQuery();

  const handleSubscribe = async () => {
    try {
      await subscribeToTrial().unwrap();
    } catch (error) {
      ('Failed to initiate trial subscription. Please try again.');
    }
  };

  const pricing = pricingData?.data?.[0];

  if (loadingTrial) {
    return (
      <div className='mx-auto my-auto'>
        <Spinner className='h-10 w-10' color='amber' />
      </div>
    );
  }
  if (error) {
    return <p className='text-red-500'>Error loading pricing data</p>;
  }
  if (!pricing) {
    return <p>No pricing data available</p>;
  }

  return (
    <Card
      style={{ backgroundColor: 'transparent', boxShadow: 'none' }}
      className='p-4 w-full max-w-sm font-poppins'
    >
      <div className='flex flex-col justify-center items-center'>
        <Typography variant='h5' className='text-xl font-bold mb-2'>
          Trial
        </Typography>
      </div>

      <LoadingButton
        onClick={handleSubscribe}
        loading={isLoading}
        disabled={isLoading}
        className='w-full bg-primary text-white py-2 rounded hover:bg-lighterPrimary transition my-8'
      >
        {isLoading ? '' : 'Get Started'}
      </LoadingButton>

      <div className='flex flex-col items-start'>
        <ul className='mb-4'>
          {pricing.featureAccess &&
            Object.entries(pricing.featureAccess)
              .filter(([_, feature]: any) => feature.access) // Filter features with access: true
              .map(([key, feature]: any) => (
                <li key={key} className='flex items-center mb-2 text-sm'>
                  <FaCheck
                    className='mx-2 text-bgPrimary text-base flex-shrink-0'
                    style={{ minWidth: '16px', minHeight: '16px' }}
                  />
                  <span>
                    {feature.description || 'Feature description missing'}
                  </span>
                </li>
              ))}
        </ul>
      </div>
    </Card>
  );
};

export default TrialCard;
