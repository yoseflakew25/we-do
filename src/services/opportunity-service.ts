import { apiClient } from './api-client';

export const fetchOpportunityDetails = async (orgId: string) => {
  return await apiClient(`/opportunities/${orgId}`, {});
};
