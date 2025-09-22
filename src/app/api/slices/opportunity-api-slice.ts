import { APIResponse, OpportunityDetail, OpportunityFilters, OpportunityFormData, PaginationFilters, BookmarkedDetail, ReviewResponseData, RepostOpportunityFormData, OpportunityCountStatusResponse } from '../types';
import { apiSlice } from './api-slice';


const opportunityApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    postOpportunity: builder.mutation<
      APIResponse<undefined>,
      OpportunityFormData
    >({
      query: (data) => {
        return {
          url: '/opportunities',
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['Opportunities'],
    }),

    getAllOpportunities: builder.query<
      APIResponse<OpportunityDetail[]>,
      OpportunityFilters | undefined
    >({
      query: (filters) => ({
        url: '/admin/opportunities',
        method: 'GET',
        params: filters,
      }),
      providesTags: ['Opportunities'],
    }),
    getBookMarkedOpportunities: builder.query<
      APIResponse<BookmarkedDetail[]>,
      OpportunityFilters | undefined
    >({
      query: (filters) => ({
        url: '/bookmarks',
        method: 'GET',
        params: filters,
      }),
      providesTags: ['BookmarkedOpportunities'],
    }),

    createBookMarkedOpportunities: builder.mutation<
      APIResponse<BookmarkedDetail[]>,
      string
    >({
      query: (id) => ({
        url: `/bookmarks/${id}`,
        method: 'POST',
        params: { id },
      }),
      invalidatesTags: ['BookmarkedOpportunities'],
    }),
    deleteBookMarkedOpportunities: builder.mutation<
      APIResponse<BookmarkedDetail[]>,
      string
    >({
      query: (id) => ({
        url: `/bookmarks/${id}`,
        method: 'DELETE',
        params: { id },
      }),
      invalidatesTags: ['BookmarkedOpportunities'],
    }),

    getOrgOpportunities: builder.query<
      APIResponse<OpportunityDetail[]>,
      PaginationFilters | undefined
    >({
      query: (filters) => ({
        url: '/opportunities',
        method: 'GET',
        params: filters,
      }),
      providesTags: ['Opportunities'],
    }),

    getOrgOpportunityById: builder.query<
      APIResponse<OpportunityDetail>,
      string
    >({
      query: (id: string) => ({
        url: `/opportunities/${id}`,
        method: 'GET',
      }),
    }),

    updateOpportunity: builder.mutation<
      APIResponse<OpportunityDetail>,
      { id: string; data: OpportunityFormData }
    >({
      query: ({ id, data }) => {
        return {
          url: `/opportunities/${id}`,
          method: 'PATCH',
          body: data,
        };
      },

      invalidatesTags: ['Opportunities'],
    }),

    repostOpportunity: builder.mutation<
      any,
      { id: string; data: RepostOpportunityFormData }
    >({
      query: ({ id, data }) => {
        return {
          url: `/opportunities/${id}/repost`,
          method: 'PATCH',
          body: data,
        };
      },

      invalidatesTags: ['Opportunities'],
    }),

    updateOpportunityStatus: builder.mutation<
      APIResponse<OpportunityDetail>,
      { id: string; data: { status: string } }
    >({
      query: ({ id, data }) => {
        return {
          url: `/opportunities/${id}`,
          method: 'PATCH',
          body: data,
        };
      },

      invalidatesTags: ['Opportunities'],
    }),

    deleteOpportunityAsAdmin: builder.mutation<APIResponse<undefined>, string>({
      query: (id) => {
        return {
          url: `/admin/opportunities/${id}`,
          method: 'DELETE',
        };
      },

      invalidatesTags: ['Opportunities'],
    }),
    getAllCategoriesCount: builder.query<APIResponse<undefined>, void>({
      query: () => ({
        url: `/categories-with-count`,
        method: 'GET',
      }),
    }),

    getAllReviews: builder.query<APIResponse<ReviewResponseData[]>, string>({
      query: (id) => ({
        url: `/reviews/opportunity/${id}`,
        method: 'GET',
      }),
      providesTags: ['OpportunityReviews'],
    }),

    checkUserApplicationStatus: builder.query<APIResponse<undefined>, string>({
      query: (id) => ({
        url: `/opportunities/${id}/applications`,
        method: 'HEAD',
      }),
    }),
    getOpportunityCountStatus: builder.query<
      OpportunityCountStatusResponse,
      void
    >({
      query: () => ({
        url: '/organizations/dashboard/opportunity-count-by-status',
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useUpdateOpportunityMutation,
  useDeleteOpportunityAsAdminMutation,
  usePostOpportunityMutation,
  useGetAllOpportunitiesQuery,
  useGetOrgOpportunitiesQuery,
  useGetOrgOpportunityByIdQuery,
  useUpdateOpportunityStatusMutation,
  useRepostOpportunityMutation,
  useGetBookMarkedOpportunitiesQuery,
  useCreateBookMarkedOpportunitiesMutation,
  useDeleteBookMarkedOpportunitiesMutation,
  useGetAllCategoriesCountQuery,
  useGetAllReviewsQuery,
  useCheckUserApplicationStatusQuery,
  useGetOpportunityCountStatusQuery,
} = opportunityApiSlice;