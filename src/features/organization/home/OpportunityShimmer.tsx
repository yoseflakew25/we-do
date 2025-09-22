export const OpportunityReviewShimmer: React.FC = () => {
  return (
    <div className='flex flex-col space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Shimmer for the first card */}

        <div className='flex flex-col p-4 md:p-6 lg:py-4 space-y-4 border border-boundery rounded-xl w-full animate-pulse'>
          <div className='flex justify-between items-center w-full'>
            <div className='h-4 w-32 bg-gray-200 rounded-md' />

            <div className='h-8 w-8 bg-gray-200 rounded-full' />
          </div>

          <div className='h-6 w-20 bg-gray-200 rounded-md' />
        </div>

        {/* Shimmer for the second card */}

        <div className='flex flex-col p-4 md:p-6 lg:py-4 space-y-4 border border-boundery rounded-xl w-full animate-pulse'>
          <div className='flex justify-between items-center w-full'>
            <div className='h-4 w-32 bg-gray-200 rounded-md' />

            <div className='h-8 w-8 bg-gray-200 rounded-full' />
          </div>

          <div className='h-6 w-20 bg-gray-200 rounded-md' />
        </div>

        {/* Shimmer for the third card */}

        <div className='flex flex-col p-4 md:p-6 lg:py-4 space-y-4 border border-boundery rounded-xl w-full animate-pulse'>
          <div className='flex justify-between items-center w-full'>
            <div className='h-4 w-32 bg-gray-200 rounded-md' />

            <div className='h-8 w-8 bg-gray-200 rounded-full' />
          </div>

          <div className='h-6 w-20 bg-gray-200 rounded-md' />
        </div>
      </div>
    </div>
  );
};