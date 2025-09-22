import { BulkAddToOrgPoolPayload, BulkRemoveFromOrgPoolRequest, VolunteerDetailListResponse, VolunteerDetailResponse } from '../types';
import { apiSlice } from './api-slice';


const orgPoolApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSavedVolunteers: builder.query<VolunteerDetailListResponse, void>({
      query: () => ({
        url: '/orgPool',
        method: 'GET',
      }),
      providesTags: ['OrgPool'],
    }),

    bulkAddToOrgPool: builder.mutation<
      VolunteerDetailListResponse,
      BulkAddToOrgPoolPayload
    >({
      query: (payload) => ({
        url: '/orgPool/bulkAdd',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['OrgPool'],
    }),

    addToOrgPool: builder.mutation<VolunteerDetailResponse, string>({
      query: (userID) => ({
        url: `/orgPool/${userID}`,
        method: 'POST',
      }),
      invalidatesTags: ['OrgPool'],
    }),

    removeFromOrgPool: builder.mutation<VolunteerDetailResponse, string>({
      query: (userID) => ({
        url: `/orgPool/${userID}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['OrgPool'],
    }),
    bulkRemoveFromOrgPool: builder.mutation<void, BulkRemoveFromOrgPoolRequest>({
      query: (userIDs) => ({
        url: '/orgPool/bulkDelete',
        method: 'POST',
        body: userIDs,
      }),
      invalidatesTags: ['OrgPool'],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetSavedVolunteersQuery,
  useBulkAddToOrgPoolMutation,
  useAddToOrgPoolMutation,
  useRemoveFromOrgPoolMutation,
  useBulkRemoveFromOrgPoolMutation,
} = orgPoolApi;