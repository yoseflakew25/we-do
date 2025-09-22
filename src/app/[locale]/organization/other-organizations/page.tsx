'use client';

import { useGetOrgProfileQuery } from '@/app/api/slices/org-api-slice';
import ErrorPage from '@/components/ErrorPage';
import LoadingPage from '@/components/LoadingPage';
import Header from '@/features/organization/components/Header';
import OtherOrganizationsHome from '@/features/organization/other-organizations/OtherOrganizationsHome';
import { useOrgLogo } from '@/hook';
import React from 'react';

function OtherOrganizationsPage() {
  const getOrgLogo = useOrgLogo();

  const {
    data: orgDetail,
    isFetching: isFetchingOrgProfile,
    isError,
  } = useGetOrgProfileQuery();

  if (isFetchingOrgProfile) {
    return <LoadingPage />;
  }

  if (isError || !orgDetail) {
    return <ErrorPage imageName='404.svg' title='Opportunity not found' />;
  }
  return (
    <>
      <Header
        logoUrl={getOrgLogo(orgDetail?.data.LogoUrl)}
        title={orgDetail?.data.orgName}
      />
      <OtherOrganizationsHome />
    </>
  );
}

export default OtherOrganizationsPage;
