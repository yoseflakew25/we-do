'use client';

import { useGetOrgDetailByIDQuery } from '@/app/api/slices/org-api-slice';
import ErrorPage from '@/components/ErrorPage';
import LoadingPage from '@/components/LoadingPage';
import Header from '@/features/organization/components/Header';
import OrganizationDetailsForVolunteers from '@/features/volunteer/ngos/OrganizationDetails';
import { useOrgLogo } from '@/hook';
import React from 'react';

function OtherOrgDetailPage({ params }: { params: { id: string } }) {
  const getOrgLogo = useOrgLogo();
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

  return (
    <>
      <Header
        logoUrl={getOrgLogo(orgDetail.data.LogoUrl)}
        title={orgDetail.data.orgName}
      />
      <OrganizationDetailsForVolunteers formData={orgDetail.data} />
    </>
  );
}

export default OtherOrgDetailPage;
