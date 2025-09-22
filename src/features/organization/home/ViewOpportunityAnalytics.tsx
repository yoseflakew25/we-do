import { CardHeader } from '@material-tailwind/react';
import ApplicantAnaliticsGraph from './DailyApplicantsAnalyticsGraph';
import ApplicationStatus from './ApplicationStatusGraph';
import OpportunityReviewCard from './OpportunityReviewCard';
import { CardTitle } from '@/components/ui/Card';
import { useTranslations } from 'next-intl';

const OrganizationsViewAnalytics: React.FC = () => {
  const t = useTranslations('organizationDashboard')

  return (
    <section className='mt-12 px-8'>
      <CardHeader style={{ padding: 0, margin: 0 }} className='shadow-none space-y-2'>
        <CardTitle style = {{padding: 0}} className='text-2xl sm:text-3xl font-normal text-neutrals100 font-poppins'>{t('title')}</CardTitle>
        <p className='ml-0 text-neutrals60'>{t('description')}</p>
      </CardHeader>
      <section className='grid gird-col-1 lg:grid lg:grid-cols-3 gap-4 py-3 mt-4'>
      <div className='flex flex-col gap-5 lg:col-span-2 space-y-4'>
        <div>
          <OpportunityReviewCard />
        </div>

        <div>
          <ApplicantAnaliticsGraph />
        </div>
      </div>

      <ApplicationStatus />
      </section>
    </section>
  );
};

export default OrganizationsViewAnalytics;