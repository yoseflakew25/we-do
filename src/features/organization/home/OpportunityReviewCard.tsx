
'use client';

import OpportunityCard from './OpportunityCard';
import { useGetOpportunityCountStatusQuery } from '@/app/api/slices/opportunity-api-slice';
import { WiTime8 } from "react-icons/wi";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { TbBrandDatabricks } from "react-icons/tb";
import { OpportunityReviewShimmer} from './OpportunityShimmer';
import { useTranslations } from 'next-intl';


const OpportunityReviewCard = async () => {
  const t = useTranslations('organizationDashboard')


  const {
    data: opportunities,
    isFetching,
    error,
  } = useGetOpportunityCountStatusQuery();

  if (isFetching) {
    return <OpportunityReviewShimmer/>;
  }

  if (error) {
    return <div className="flex text-red-200 p-4">Error occurred while fetching data.</div>;
  }

  const openCount = opportunities?.data.open || 0;
  const closedCount = opportunities?.data.closed || 0;
  const totalCount = openCount + closedCount;

  return (
    <div className='flex flex-col space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <OpportunityCard
          title={t('opportunityCard.open')}
          value={openCount}
          icon = {WiTime8}
        />
        <OpportunityCard
          title={t('opportunityCard.closed')}
          value={closedCount}
          icon = {IoIosCheckmarkCircleOutline}
        />
        <OpportunityCard
          title={t('opportunityCard.all')}
          value={totalCount}
          icon = {TbBrandDatabricks}
        />
      </div>
    </div>
  );
};

export default OpportunityReviewCard;