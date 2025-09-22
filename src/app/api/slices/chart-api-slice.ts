import { APIResponse, ApplicationStatusGraphResponse, DailyActiveUsersGraphData, GraphData, UsersCountByAgeData } from '../types';
import { apiSlice } from './api-slice';
import { Session } from 'next-auth';


function withISODates<
  T extends { startDate: Date; endDate: Date } & Partial<{
    eventID: string;
  }>,
>(filters: T) {
  return {
    ...filters,
    startDate: filters.startDate.toISOString(),
    endDate: filters.endDate.toISOString(),
    ...(filters.eventID ? { eventID: filters.eventID } : {}),
  };
}

const chartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDailyActiveUsersCount: builder.query<
      APIResponse<DailyActiveUsersGraphData>,
      {
        startDate: Date;
        endDate: Date;
        role: Session['user']['role'];
      }
    >({
      query: (filters) => ({
        url: '/admin/activities/daily-active-users',
        method: 'GET',
        params: withISODates(filters),
      }),
    }),

    getRecentAggregates: builder.query<
      APIResponse<{
        newApplicaitons: number;
        newNgoRegistered: number;
        newOpportunities: number;
        newSuccessfulConnection: number;
        newVolunteers: number;
      }>,
      {
        startDate: Date;
        endDate: Date;
        role: string;
      }
    >({
      query: (filters) => ({
        url: '/admin/recent-aggregates',
        method: 'GET',
        params: withISODates(filters),
      }),
    }),

    getRecentActivities: builder.query<
      APIResponse<
        Array<{
          actorID: string;
          actorRole: Session['user']['role'];
          name: string;
          action: string;
          target: Session['user']['role'];
          timestamp: Date;
          profilePicUrl: string;
        }>
      >,
      {
        startDate: Date;
        endDate: Date;
        page: number;
        pageSize: number;
      }
    >({
      query: (filters) => ({
        url: '/admin/activities/recent',
        method: 'GET',
        params: withISODates(filters),
      }),
    }),

    getGroupedOrganizationCounts: builder.query<
      APIResponse<GraphData>,
      {
        startDate: Date;
        endDate: Date;
        groupBy: 'userProfileStatus' | 'orgType';
      }
    >({
      query: (filters) => ({
        url: '/admin/organizations/count',
        method: 'GET',
        params: withISODates(filters),
      }),
    }),

    getOrganizationTotalCountsInTime: builder.query<
      APIResponse<GraphData>,
      {
        startDate: Date;
        endDate: Date;
      }
    >({
      query: (filters) => ({
        url: '/admin/organizations/count-by-time',
        method: 'GET',
        params: withISODates(filters),
      }),
    }),
    getOrganizationSignupCountsInTime: builder.query<
      APIResponse<GraphData>,
      {
        startDate: Date;
        endDate: Date;
      }
    >({
      query: (filters) => ({
        url: '/admin/organizations/signup-by-time',
        method: 'GET',
        params: withISODates(filters),
      }),
    }),
    getOrganizationViewsInTime: builder.query<
      APIResponse<GraphData>,
      {
        startDate: Date;
        endDate: Date;
        // orgID?: string;
      }
    >({
      query: (filters) => ({
        url: '/admin/organizations/view-by-time',
        method: 'GET',
        params: withISODates(filters),
      }),
    }),
    getOrganizationViewFrequencies: builder.query<
      APIResponse<GraphData>,
      {
        startDate: Date;
        endDate: Date;
      }
    >({
      query: (filters) => ({
        url: '/admin/organizations/view-frequency',
        method: 'GET',
        params: withISODates(filters),
      }),
    }),

    getGroupedOpportunityCounts: builder.query<
      APIResponse<GraphData>,
      {
        startDate: Date;
        endDate: Date;
        groupBy: 'status' | 'category';
        orgID?: string;
      }
    >({
      query: (filters) => ({
        url: '/admin/opportunities/counts',
        method: 'GET',
        params: withISODates(filters),
      }),
    }),

    // TODO have this in the backend as well
    getOpportunityTotalCountsInTime: builder.query<
      APIResponse<GraphData>,
      {
        startDate: Date;
        endDate: Date;
        orgID?: string;
      }
    >({
      query: (filters) => ({
        url: '/admin/opportunities/count-by-time',
        method: 'GET',
        params: withISODates(filters),
      }),
    }),

    getOpportunityCountsByStatus: builder.query<
      APIResponse<GraphData>,
      {
        startDate: Date;
        endDate: Date;
        orgID?: string;
      }
    >({
      query: (filters) => ({
        url: '/admin/opportunities/count-by-status',
        method: 'GET',
        params: withISODates(filters),
      }),
    }),
    getOpportunityCreationsInTime: builder.query<
      APIResponse<GraphData>,
      {
        startDate: Date;
        endDate: Date;
        orgID?: string;
      }
    >({
      query: (filters) => ({
        url: '/admin/opportunities/creation-by-time', // creation
        method: 'GET',
        params: withISODates(filters),
      }),
    }),
    getOpportunityViewsInTime: builder.query<
      APIResponse<GraphData>,
      {
        startDate: Date;
        endDate: Date;
        orgID?: string;
      }
    >({
      query: (filters) => ({
        url: '/admin/opportunities/view-by-time',
        method: 'GET',
        params: withISODates(filters),
      }),
    }),
    getOpportunityViewFrequencies: builder.query<
      APIResponse<GraphData>,
      {
        startDate: Date;
        endDate: Date;
        orgID?: string;
      }
    >({
      query: (filters) => ({
        url: '/admin/opportunities/view-frequency',
        method: 'GET',
        params: withISODates(filters),
      }),
    }),
    getPopularOpportunities: builder.query<
      APIResponse<{
        opportunityName: string;
        organizationName: string;
        views: number;
        viewToApplicationRatio: number;
        acceptanceRate: number;
        applications: number;
      }>,
      {
        limit: number;
        startDate: Date;
        endDate: Date;
        sortBy?: string;
        orgID?: string;
      }
    >({
      query: ({ startDate, endDate, ...filters }) => ({
        url: '/admin/opportunities/popular',
        method: 'GET',
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          ...filters,
        },
      }),
    }),

    getUserSignupsInTime: builder.query<
      APIResponse<GraphData>,
      {
        startDate: Date;
        endDate: Date;
        role?: Session['user']['role'];
      }
    >({
      query: (filters) => ({
        url: '/admin/users/signup-by-time',
        method: 'GET',
        params: withISODates(filters),
      }),
    }),

    getApplicationSubmissionCount: builder.query<
      APIResponse<GraphData>,
      {
        startDate: Date;
        endDate: Date;
        role?: Session['user']['role'];
      }
    >({
      query: (filters) => ({
        url: '/admin/count-application-submission',
        method: 'GET',
        params: withISODates(filters),
      }),
    }),
    getApplicationCountByStatus: builder.query<
      APIResponse<GraphData>,
      {
        startDate: Date;
        endDate: Date;
      }
    >({
      query: (filters) => ({
        url: '/admin/applications/count-by-status',
        method: 'GET',
        params: withISODates(filters),
      }),
    }),

    getAppliedVolunteerCount: builder.query<
      APIResponse<GraphData>,
      {
        startDate: Date;
        endDate: Date;
        role?: Session['user']['role'];
      }
    >({
      query: (filters) => ({
        url: '/admin/volunteer/volunteers-with-applications-count-by-day',
        method: 'GET',
        params: withISODates(filters),
      }),
    }),

    getVolunteerCountByGender: builder.query<
      APIResponse<UsersCountByAgeData>,
      void
    >({
      query: () => ({
        url: '/admin/users/count-by-gender',
        method: 'GET',
      }),
    }),
    getDailyApplicationStatusGraph: builder.query<
      APIResponse<GraphData>,
      {
        startDate: Date;
        endDate: Date;
        eventID: string;
      }
    >({
      query: (filters) => {
        const params = withISODates(filters);
        return {
          url: '/organizations/dashboard/application-count',
          method: 'GET',
          params,
        };
      },
    }),

    getApplicationSatus: builder.query<
      ApplicationStatusGraphResponse,
      {
        startDate: Date;
        endDate: Date;
      }
    >({
      query: (filters) => ({
        url: '/organizations/dashboard/application-aggregate',
        method: 'GET',
        params: withISODates(filters),
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetDailyActiveUsersCountQuery,
  useGetRecentAggregatesQuery,
  useGetRecentActivitiesQuery,
  useGetGroupedOrganizationCountsQuery,
  useGetOrganizationTotalCountsInTimeQuery,
  useGetOrganizationSignupCountsInTimeQuery,
  useGetOrganizationViewsInTimeQuery,
  useGetOrganizationViewFrequenciesQuery, // not working starting here and below
  useGetGroupedOpportunityCountsQuery,
  useGetOpportunityTotalCountsInTimeQuery,
  useGetOpportunityCreationsInTimeQuery,
  useGetOpportunityViewsInTimeQuery,
  useGetOpportunityCountsByStatusQuery,
  useGetOpportunityViewFrequenciesQuery,
  useGetPopularOpportunitiesQuery,
  useGetUserSignupsInTimeQuery,
  useGetApplicationSubmissionCountQuery,
  useGetAppliedVolunteerCountQuery,
  useGetVolunteerCountByGenderQuery,
  useGetApplicationCountByStatusQuery,
  useGetDailyApplicationStatusGraphQuery,
  useGetApplicationSatusQuery,
} = chartApiSlice;