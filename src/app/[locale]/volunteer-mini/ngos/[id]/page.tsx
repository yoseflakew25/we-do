'use client';

import { useGetOrgDetailByIDQuery } from '@/app/api/slices/org-api-slice';
import ErrorPage from '@/components/ErrorPage';
import LoadingPage from '@/components/LoadingPage';
import OrganizationDetails from '@/features/volunteer-mini/organization/OrganizationDetails';
import React from 'react';

function NgoDetailPage({ params }: { params: { id: string } }) {
  const {
    data: orgDetail,
    isFetching,
    isError,
  } = useGetOrgDetailByIDQuery(params.id);

  if (isFetching) {
    return <LoadingPage />;
  }

  if (isError || !orgDetail?.data) {
    return <ErrorPage />;
  }

  return <OrganizationDetails id={params.id} orgDetail={orgDetail.data} />;
}

export default NgoDetailPage;
