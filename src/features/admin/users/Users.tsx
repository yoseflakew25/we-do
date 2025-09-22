'use client';

import ViewUsersTable from './ViewUsersTable';
import { useGetAllOpportunitiesQuery } from '@/app/api/slices/opportunity-api-slice';
import { useGetAllOrganizationsQuery } from '@/app/api/slices/org-api-slice';
import { OpportunityFilters } from '@/app/api/types';
import { SelectOption } from '@/select-options';
import React, { useState } from 'react';

const Users: React.FC = () => {
  const { data: orgListResponse, isFetching: isFetchingOrganizations } =
    useGetAllOrganizationsQuery({ page: 1, pageSize: 1000 });

  const [opportunityFilters, setOpportunityFilters] =
    useState<OpportunityFilters>({ page: 1, pageSize: 1000, orgID: undefined });

  const { data: opportunities, isFetching: isFetchingOpportunities } =
    useGetAllOpportunitiesQuery(opportunityFilters, {
      refetchOnMountOrArgChange: 15 * 60,
    });

  const orgListSelectOptions: SelectOption[] = [
    { label: 'Any', value: 'any' },
    ...(orgListResponse?.data.map(({ id: orgID, orgName }) => ({
      label: orgName,
      value: orgID,
    })) || []),
  ];

  const opportunityListSelectOptions: SelectOption[] = [
    { label: 'Any', value: 'any' },
    ...(opportunities?.data.map(({ id, title }) => ({
      label: title,
      value: id,
    })) || []),
  ];

  const refetchOpportunitiesForOrg = async (orgID: string) => {
    setOpportunityFilters({ ...opportunityFilters, orgID });
  };

  return (
    <ViewUsersTable
      orgOptions={orgListSelectOptions}
      opportunityOptions={opportunityListSelectOptions}
      refetchOpportunities={refetchOpportunitiesForOrg}
      isFetchingOpportunities={isFetchingOpportunities}
      isFetchingOrganizations={isFetchingOrganizations}
    />
  );
};

export default Users;
