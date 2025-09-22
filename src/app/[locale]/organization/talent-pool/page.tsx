'use client';

import { useGetOrgProfileQuery } from '@/app/api/slices/org-api-slice';
import ErrorPage from '@/components/ErrorPage';
import LoadingPage from '@/components/LoadingPage';
import Header from '@/features/organization/components/Header';
import ViewVolunteerPoolTable from '@/features/organization/volunteer-pool/ViewVolunteerPoolTable';
import { useOrgLogo } from '@/hook';
import React from 'react';

function VolunteerPoolPage() {
  const getOrgLogo = useOrgLogo();
  const { data, isFetching, isError } = useGetOrgProfileQuery();

  if (isFetching) {
    return <LoadingPage />;
  }

  if (isError || !data) {
    return <ErrorPage />;
  }

  const orgDetail = data.data;
  return (
    <>
      <Header
        logoUrl={getOrgLogo(orgDetail.LogoUrl)}
        title={orgDetail.orgName}
      />
      <ViewVolunteerPoolTable />
    </>
  );
}

export default VolunteerPoolPage;
