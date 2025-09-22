'use client';

import { useGetAllOpportunitiesQuery } from '@/app/api/slices/opportunity-api-slice';
import { useGetAllOrgsQuery } from '@/app/api/slices/org-api-slice';
import ErrorPage from '@/components/ErrorPage';
import LoadingPage from '@/components/LoadingPage';
import EmptyDashboard from '@/features/organization/opportunities/post/EmptyDashboard';
import ViewOpportunitiesTable from '@/features/organization/opportunities/view/ViewOpportunitiesTable';
import { SelectOption } from '@/select-options';
import React from 'react';

const AdminOpportunities: React.FC = () => {
  const {
    data: opportunities,
    isFetching: isFetchingOpportunities,
    isError: isOpportunityError,
  } = useGetAllOpportunitiesQuery(undefined);

  const {
    data: orgListResponse,
    isFetching: isFetchingOrganizations,
    isError: isOrgError,
  } = useGetAllOrgsQuery({ page: 1, pageSize: 1000 }); //useGetAllOrganizationsQuery

  if (isFetchingOpportunities || isFetchingOrganizations) {
    return <LoadingPage />;
  }

  if (isOpportunityError || isOrgError) {
    return <ErrorPage />;
  }

  if (opportunities?.data?.length) {
    const orgListSelectOptions: SelectOption[] = [
      { label: 'Any', value: 'any' },
      ...(orgListResponse?.data.map(({ id: orgID, orgName }) => ({
        label: orgName,
        value: orgID,
      })) || []),
    ];

    return <ViewOpportunitiesTable orgOptions={orgListSelectOptions} />;
  }
  return <EmptyDashboard />;
};

export default AdminOpportunities;
