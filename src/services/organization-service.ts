import { apiClient } from './api-client';

export const fetchOrganizationDetails = async (orgId: string) => {
  return await apiClient(`/organizations/${orgId}`, {});
};

export const updateInterestStatus = async (
  orgId: string,
  interestStatus: string
) => {
  return await apiClient(`/organizations/${orgId}/interest`, {
    method: 'PUT',
    body: JSON.stringify({ interestStatus }),
  });
};
