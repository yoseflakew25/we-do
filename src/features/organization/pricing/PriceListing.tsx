import { TypewriterEffectSmooth } from '../../landing-page-v2/components/ui/TypewriterEffect';
import PricingDetailsCard from './PricingDetailCard';
import {
  useGetAllPricingsQuery,
  useGetCurrentSubscriptionQuery,
} from '@/app/api/slices/org-api-slice';
import { Spinner } from '@material-tailwind/react';
import { useState } from 'react';

const PricingList = () => {
  const [filter, setFilter] = useState<string>('Monthly');
  const { data: pricingData, isLoading, error } = useGetAllPricingsQuery();

  const { data: mySubscription, isLoading: loadingSubscription } =
    useGetCurrentSubscriptionQuery();

  const pricings = pricingData?.data || [];
  const filteredPricings = pricings.filter(
    (pricing: any) => pricing.billingCycle === filter
  );

  const subscriptionPlan = mySubscription?.data || null;


  const words = [
    {
      text: "Our",
    },
    {
      text: "Pricing Plans",
      className: 'text-[#C4897B]',
    },
  ];

  return (
    <div className='flex flex-col items-center min-h-[400px] justify-between'>
      <TypewriterEffectSmooth words={words} />
      <div className='flex bg-gray-100 mt-8 rounded-full p-2 roun space-x-4 mb-8'>
        {['Monthly', 'Half-Yearly', 'Yearly'].map((cycle) => (
          <button
            key={cycle}
            onClick={() => setFilter(cycle)}
            className={`px-4 py-2 border rounded-full  ${
              filter === cycle
                ? 'bg-white text-lighterPrimary'
                : 'text-gray-600 '
            } hover:bg-grey hover:text-white transition`}
          >
            {cycle}
          </button>
        ))}
      </div>

      {isLoading || loadingSubscription ? (
        <Spinner className='h-10 w-10' color='amber' />
      ) : error ? (
        <p>Error loading pricing data</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {filteredPricings.length > 0 ? (
            filteredPricings.map((pricing: any) => (
              <PricingDetailsCard
                key={pricing.id}
                pricing={pricing}
                currentPlan={subscriptionPlan}
              />
            ))
          ) : (
            <p className='col-span-full text-center'>
              No pricing plans available for the selected billing cycle.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PricingList;
