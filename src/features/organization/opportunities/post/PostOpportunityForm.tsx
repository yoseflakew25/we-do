'use client';

import Header from '../../components/Header';
import PageTitle from '../../components/PageTitle';
import { setQuestions } from '../../org-side-custom-questions-slice';
import CustomQuestionForm from '../custom-questions/CustomQuestionForm';
import { setStep } from '../opportunity-slice';
import OpportunityDescriptionForm from './OpportunityDescriptionForm';
import OpportunityInformationForm from './OpportunityInformationForm';
import OpportunityReview from './OpportunityReview';
import PostOpportunityStepper from './PostOpportuntityStepper';
import { useGetOrgProfileQuery } from '@/app/api/slices/org-api-slice';
import ErrorPage from '@/components/ErrorPage';
import LoadingPage from '@/components/LoadingPage';
import { useAppDispatch, useOrgLogo } from '@/hook';
import { useAppSelector } from '@/hook';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const PostOpportunityForm: React.FC = () => {
  const step = useAppSelector((state) => state.opportunity.step);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const getOrgLogo = useOrgLogo();
  const t = useTranslations('PostOpportunityPage');

  const { data, isFetching, isError } = useGetOrgProfileQuery();

  // this is just to reset the additional questions state and step
  useEffect(() => {
    dispatch(setStep(1));
    dispatch(setQuestions([]));
  }, [dispatch]);

  if (isFetching) {
    return <LoadingPage />;
  }

  if (isError || !data) {
    return <ErrorPage />;
  }

  const orgDetail = data.data;

  return (
    <section>
      <Header
        logoUrl={getOrgLogo(orgDetail.LogoUrl)}
        title={orgDetail.orgName}
      />

      <main className=' px-4 pt-4 sm:px-16 sm:pt-8 container'>
        <PageTitle title={t('pageTitle')} onClick={() => router.back()} />

        <PostOpportunityStepper />

        {/* form sections  */}
        <div className='  '>
          {step === 1 ? <OpportunityDescriptionForm /> : null}
          {step === 2 ? <OpportunityInformationForm /> : null}
          {step === 3 ? <CustomQuestionForm /> : null}
          {step === 4 ? <OpportunityReview /> : null}
        </div>
      </main>
    </section>
  );
};

export default PostOpportunityForm;
