import { useSubscribeToPricingMutation } from '@/app/api/slices/org-api-slice';
import { Pricing } from '@/app/api/types';
import LoadingButton from '@/components/buttons/LoadingButton';
import { Card, Typography, Tooltip } from '@material-tailwind/react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { FaCheck, FaCrown, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { IoRocketSharp } from 'react-icons/io5';

interface PricingDetailsCardProps {
  pricing: Pricing;
  currentPlan?: any;
}

const PricingDetailsCard: React.FC<PricingDetailsCardProps> = ({
  pricing,
  currentPlan,
}) => {
  const [subscribeToPricing, { isLoading }] = useSubscribeToPricingMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isCurrentPlan =
    currentPlan?.pricingName === pricing.name &&
    currentPlan?.pricingBillingCycle === pricing.billingCycle;

  const formattedEndDate = new Date(currentPlan?.endDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const { data: session } = useSession();

  const handleSubscribe = async () => {
    try {
      const result = await subscribeToPricing({
        pricingID: pricing.id,
      }).unwrap();
      if (result.data.checkout_url) {
        window.location.href = result.data.checkout_url;
      }
    } catch (error) {
      setErrorMessage('Failed to initiate subscription. Please try again.');
    }
  };

  const accessibleFeatures = Object.keys(pricing.featureAccess)
    .filter(
      (feature) =>
        (pricing.featureAccess[feature] as { access: boolean }).access
    )
    .map((feature) => pricing.featureAccess[feature]);

  const isPopular = pricing.name === 'Standard';
  const isFree = pricing.name === 'Free';
  const isPremium = pricing.name === 'Premium';

  return (
    <motion.div 
      className={`h-full ${isPopular ? 'z-10' : 'z-0'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        className={`h-full rounded-2xl shadow-xl p-6 max-w-sm flex flex-col justify-between overflow-hidden relative transition-all duration-300 hover:shadow-2xl ${
          isPopular 
            ? 'bg-gradient-to-br from-amber-50 to-amber-50 border-2 border-amber-200' 
            : 'bg-white border border-gray-100'
        } ${isCurrentPlan ? 'ring-2 ring-amber-500 ring-opacity-50' : ''}`}
      >
        {/* Popular Ribbon */}
        {isPopular && (
          <div className="absolute top-4 -right-8 bg-[#C58B7D] text-white text-xs font-bold py-1 px-8 transform rotate-45 shadow-lg">
            POPULAR
          </div>
        )}

        {/* Crown icon for premium */}
        {isPremium && (
          <div className="absolute top-4 right-4 text-[#C58B7D]">
            <FaCrown className="text-xl" />
          </div>
        )}

        {/* Rocket icon for free */}
        {isFree && (
          <div className="absolute top-4 right-4 text-[#C58B7D]">
            <IoRocketSharp className="text-xl" />
          </div>
        )}

        <div>
          <div className='flex justify-between items-start mb-4'>
            <div>
              <Typography variant="h5" className={`font-bold ${isPopular ? 'text-[#C58B7D]' : 'text-gray-800'}`}>
                {pricing.name}
              </Typography>
             
            </div>
          </div>

          <div className='mb-4'>
            <div className='flex items-end space-x-2'>
              <Typography variant="h3" className={`font-extrabold ${isPopular ? 'text-[#C58B7D]' : 'text-gray-800'}`}>
                {pricing.price === 0 ? 'Free' : `QAR ${pricing.price}`}
              </Typography>
              {pricing.price !== 0 && (
                <Typography className='text-gray-500 text-lg font-medium pb-1'>
                  /{pricing.billingCycle}
                </Typography>
              )}
            </div>
            {pricing.price !== 0 && (
              <Typography className='text-gray-500 text-sm mt-1'>
                Billed per {pricing.billingCycle.toLowerCase()}
              </Typography>
            )}
          </div>

          {/* Features List */}
          <div className='mb-8'>
            <div className="flex items-center mb-3">
              <Typography variant="h6" className="font-semibold text-gray-700">
                What's included:
              </Typography>
              <Tooltip
                content="All features available with this plan"
                placement="top"
              >
                <span className="ml-2 text-gray-400 cursor-pointer">
                  <FaInfoCircle size={14} />
                </span>
              </Tooltip>
            </div>
            
            <ul className='space-y-3'>
              {accessibleFeatures.map((feature: any, index) => (
                <motion.li 
                  key={index} 
                  className='flex items-start'
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`flex-shrink-0 mt-1 mr-3 ${isPopular ? 'text-[#C58B7D]' : 'text-green-500'}`}>
                    <FaCheck className="text-base" />
                  </div>
                  <Typography className="text-gray-700">
                    {feature.description}
                  </Typography>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        <div className='mt-auto'>
          {/* Current Plan Indicator */}
          {isCurrentPlan ? (
            <div className='flex flex-col'>
              <div className='flex items-center justify-center w-full py-3 bg-amber-100 rounded-lg text-amber-700 font-medium mb-2'>
                <FaCheck className="mr-2" />
                Current Plan
              </div>
              <Typography className="text-center text-gray-500 text-sm">
                Renews on {formattedEndDate}
              </Typography>
            </div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LoadingButton
                onClick={() => {
                  if (session) {
                    handleSubscribe();
                  } else {
                    window.location.href = '/login';
                  }
                }}
                loading={isLoading}
                disabled={isLoading}
                className={`w-full py-3.5 rounded-lg font-bold transition-all shadow-md hover:shadow-lg ${
                  isPopular 
                    ? 'bg-[#C58B7D] hover:bg-[#d5a498] text-white' 
                    : isFree
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-gray-800 hover:bg-gray-900 text-white'
                }`}
              >
                {isLoading ? (
                  'Processing...'
                ) : session ? (
                  <span className="flex items-center justify-center">
                    {isFree ? 'Get Started Free' : 'Upgrade Now'}
                    {isPopular && <FaCrown className="ml-2" />}
                  </span>
                ) : (
                  'Sign Up Now'
                )}
              </LoadingButton>
            </motion.div>
          )}

          {errorMessage && (
            <Typography className="text-red-500 text-center mt-3 text-sm">
              {errorMessage}
            </Typography>
          )}
          
          {isFree && (
            <Typography className="text-center text-gray-500 text-xs mt-3">
              No credit card required
            </Typography>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default PricingDetailsCard;