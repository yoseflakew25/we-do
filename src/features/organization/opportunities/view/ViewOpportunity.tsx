'use client';

import { setOpportunity } from '../../opportunity-detail-slice';
import { setQuestions } from '../../org-side-custom-questions-slice';
import OppotunityInfo from './opportunity-info/OpportunityInfo';
import { useGetOrgOpportunityByIdQuery } from '@/app/api/slices/opportunity-api-slice';
import ErrorPage from '@/components/ErrorPage';
import { Footer } from '@/components/Footer';
import LoadingPage from '@/components/LoadingPage';
import { useAppDispatch } from '@/hook';
import { useEffect } from 'react';

function ViewOpportunity({ id, viewOnly }: { id: string; viewOnly?: boolean }) {
  const dispatch = useAppDispatch();

  const {
    data: opportunityResponse,
    isFetching,
    isError,
    refetch,
  } = useGetOrgOpportunityByIdQuery(id);

  //The use for the following two lines is not clear, but have to be inside the useEffect
  useEffect(() => {
    if (opportunityResponse?.data) {
      dispatch(setOpportunity(opportunityResponse.data));
      dispatch(setQuestions(opportunityResponse.data.questions || []));
    }
  }, [opportunityResponse]);

  if (isFetching) {
    return <LoadingPage />;
  }

  if (isError || !opportunityResponse) {
    return <ErrorPage imageName='404.svg' title='Opportunity not found' />;
  }

  return (
    <div>
      <OppotunityInfo
        formData={opportunityResponse.data}
        mode={viewOnly ? 'view-only' : 'view'}
        refetch={refetch}
      />
      {viewOnly && <Footer />}
    </div>
  );
}
export default ViewOpportunity;
