import { APIResponse, AdminOrganizationProfile, CertificateData, MyPlan, Note, NotesResponse, OrgFormData, OrgRepresentativeDetails, OrganizationProfile, PaginationFilters, PricingResponse, ReviewResponseData, SocialImpactFigures, SubscribeRequest, SubscriptionResponse, VolunteerPool } from '../types';
import { apiSlice } from './api-slice';


const organizationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrganizations: builder.query<
      APIResponse<AdminOrganizationProfile[]>,
      PaginationFilters | undefined
    >({
      query: (filters) => ({
        url: '/admin/organizations/search',
        method: 'GET',
        params: filters,
      }),
      providesTags: ['Organizations'],
    }),
    organizationSignup: builder.mutation<APIResponse<undefined>, OrgFormData>({
      query: (data) => {
        const formData = new FormData();
        if (data.files) {
          data.files.forEach((file, index) => {
            formData.append(`file${index + 1}`, file);
          });
        }
        for (const [key, value] of Object.entries(data)) {
          if (key !== 'geoLocation' && key !== 'files' && key !== 'bankInfo') {
            if (Array.isArray(value)) {
              value.forEach((item) => {
                formData.append(key, item);
              });
            } else {
              formData.append(key, value);
            }
          }
        }

        if (data.geoLocation) {
          formData.append('geoLocation', JSON.stringify(data.geoLocation));
        }

        if (data.bankInfo) {
          //create a new object with the bank name as the key and the bank account as the value
          let bankInfoTransformed: { [key: string]: string } = {};
          for (const bank of data.bankInfo) {
            bankInfoTransformed[bank.bankName] = bank.bankAccount;
          }
          formData.append('bankInfo', JSON.stringify(bankInfoTransformed));
        }

        formData.append(
          'Content-Type',
          'multipart/form-data; boundary=---------------' + Date.now()
        );

        return {
          url: '/organizations',
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
    }),

    getOrgProfile: builder.query<APIResponse<OrganizationProfile>, void>({
      query: () => ({
        url: '/organizations',
        method: 'GET',
      }),
      providesTags: ['OwnOrganization'],
      transformResponse: (response: any) => {
        const bankInfoTransformed: {
          bankName: string;
          bankAccount: string;
        }[] = [];
        for (const [key, value] of Object.entries(response?.data?.bankInfo)) {
          bankInfoTransformed.push({
            bankName: key,
            bankAccount: value as string,
          });
        }
        return {
          ...response,
          data: {
            ...response.data,
            bankInfo: bankInfoTransformed,
          },
        };
      },
    }),

    getAllOrgs: builder.query<
      APIResponse<OrganizationProfile[]>,
      PaginationFilters | undefined
    >({
      query: (filters) => ({
        url: '/organizations/all',
        method: 'GET',
        params: filters,
      }),
    }),

    getOrgDetailByID: builder.query<APIResponse<OrganizationProfile>, string>({
      query: (id) => ({
        url: `/organizations/${id}`,
        method: 'GET',
      }),
    }),

    updateOrgProfile: builder.mutation<
      APIResponse<undefined>,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => {
        data.append(
          'Content-Type',
          'multipart/form-data; boundary=---------------' + Date.now()
        );
        return {
          url: `/organizations/${id}`,
          method: 'PATCH',
          body: data,
          formData: true,
        };
      },
      invalidatesTags: ['OwnOrganization'],
    }),

    updateOrgProfileStatuses: builder.mutation<
      APIResponse<undefined>,
      {
        newStatus: 'verified' | 'rejected' | 'disabled';
        comment: string;
        ids: string[];
      }
    >({
      query: (data) => {
        return {
          url: `/admin/organizations/update-status/`,
          method: 'PATCH',
          body: data,
        };
      },
      invalidatesTags: ['Organizations'],
    }),

    deleteOrganizationsAsAdmin: builder.mutation<
      APIResponse<undefined>,
      { ids: string[] }
    >({
      query: (data) => {
        return {
          url: `/admin/organizations/`,
          method: 'DELETE',
          body: data,
        };
      },
    }),

    getOrgDetailByUserID: builder.query<
      APIResponse<OrganizationProfile>,
      string
    >({
      query: (userId) => ({
        url: `admin/organizations/user/${userId}`,
        method: 'GET',
      }),
    }),

    getAllOrganizationsAsVolunteer: builder.query<
      APIResponse<OrganizationProfile[]>,
      string
    >({
      query: (filters) => ({
        url: `/organizations/all?${filters}`,
        method: 'GET',
      }),
      providesTags: ['Organizations'],
    }),

    getOrgReviews: builder.query<APIResponse<ReviewResponseData[]>, string>({
      query: (id) => ({
        url: `/reviews/organizations/${id}`,
        method: 'GET',
      }),
      providesTags: ['OrganizationReviews'],
    }),
    deleteOrgCredentialByID: builder.mutation<APIResponse<undefined>, string>({
      query: (id) => ({
        url: `/organizations/credentials/${id}`,
        method: 'DELETE',
      }),
    }),
    getAllOrgsWithLogo: builder.query<APIResponse<undefined>, void>({
      query: () => ({
        url: `/partners/`,
        method: 'GET',
      }),
      providesTags: ['Organizations'],
    }),

    inviteFromVolunteerPool: builder.mutation<APIResponse<undefined>, any>({
      query: (data) => ({
        url: `/invite`,
        method: 'POST',
        body: data,
      }),
    }),

    inviteOrgRepresentatives: builder.mutation<
      APIResponse<undefined>,
      { email: string; first_name: string; title: string }[]
    >({
      query: (data) => ({
        url: `/invitations/org-representative`,
        method: 'POST',
        body: data,
      }),
    }),

    getOrgRepresentatives: builder.query<
      APIResponse<OrgRepresentativeDetails[]>,
      PaginationFilters | undefined
    >({
      query: (filters) => ({
        url: `/invitations/org-representative`,
        method: 'GET',
        params: filters,
      }),
    }),

    removeOrgRepresentatives: builder.mutation<
      APIResponse<undefined>,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/invitations/revoke/${id}`,
        method: 'DELETE',
      }),
    }),

    getImpactFigures: builder.query<APIResponse<SocialImpactFigures>, void>({
      query: () => ({
        url: `/figures`,
        method: 'GET',
      }),
    }),
    getOrgCertificateDetails: builder.query<APIResponse<CertificateData>, void>(
      {
        query: () => ({
          url: '/certificate-template',
          method: 'GET',
        }),
      }
    ),
    updateOrgCertificateDetails: builder.mutation<
      APIResponse<CertificateData>,
      FormData
    >({
      query: (data) => ({
        url: '/certificate-template',
        method: 'POST',
        body: data,
      }),
    }),

    canReviewOrganization: builder.query<boolean, string>({
      query: (id) => ({
        url: `/can-review-org/${id}`,
        method: 'HEAD',
      }),
      transformResponse: (_, meta) => {
        // Check the status code and return true for 200, false for 204
        const statusCode = meta?.response?.status;
        return statusCode === 200;
      },
    }),

    getAllPricings: builder.query<PricingResponse, void>({
      query: () => ({
        url: '/pricing',
        method: 'GET',
      }),
      providesTags: ['Pricings'],
    }),

    getCurrentSubscription: builder.query<MyPlan, void>({
      query: () => ({
        url: '/my-subscription',
        method: 'GET',
      }),
      providesTags: ['Pricings'],
    }),

    subscribeToPricing: builder.mutation<
      SubscriptionResponse,
      SubscribeRequest
    >({
      query: ({ pricingID }) => ({
        url: `/chapa-subscribe/${pricingID}`,
        method: 'POST',
      }),
      invalidatesTags: ['Organizations', 'Pricings'],
    }),

    subscribeToTrial: builder.mutation<PricingResponse, void>({
      query: () => ({
        url: '/trial-subscription',
        method: 'POST',
      }),
      invalidatesTags: ['Organizations', 'Pricings'],
    }),
    inviteFromFile: builder.mutation<APIResponse<undefined>, any>({
      query: (data) => ({
        url: `/invite/from-file`,
        method: 'POST',
        body: data,
      }),
    }),
    getMyOpportunitySeekers: builder.query<APIResponse<VolunteerPool[]>, any>({
      query: () => ({
        url: `/invitations/volunteer-group`,
        method: 'GET',
      }),
    }),

    // New endpoint to fetch notes by applicant ID
    getNotesByApplicantId: builder.query<NotesResponse, string>({
      query: (applicantId) => ({
        url: `/notes/application/${applicantId}`,
        method: 'GET',
      }),
      providesTags: (result, error, applicantId) => [
        { type: 'Notes', id: applicantId },
      ],
    }),

    createNote: builder.mutation<
      APIResponse<Note>,
      { ApplicationId: string; Content: string }
    >({
      query: (body) => ({
        url: '/notes',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { ApplicationId }) => [
        { type: 'Notes', id: ApplicationId },
      ],
    }),

    updateNote: builder.mutation<
      APIResponse<Note>,
      { id: string; Content: string }
    >({
      query: ({ id, Content }) => ({
        url: `/notes/${id}`,
        method: 'PATCH',
        body: { Content },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Notes', id }],
    }),

    deleteNote: builder.mutation<APIResponse<undefined>, string>({
      query: (id) => ({
        url: `/notes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Notes', id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllOrganizationsQuery,
  useOrganizationSignupMutation,
  useGetOrgProfileQuery,
  useUpdateOrgProfileStatusesMutation,
  useUpdateOrgProfileMutation,
  useGetOrgDetailByIDQuery,
  useDeleteOrganizationsAsAdminMutation,
  useGetOrgDetailByUserIDQuery,
  useGetAllOrgsQuery,
  useGetAllOrganizationsAsVolunteerQuery,
  useGetOrgReviewsQuery,
  useDeleteOrgCredentialByIDMutation,
  useGetAllOrgsWithLogoQuery,
  useInviteFromVolunteerPoolMutation,
  useInviteOrgRepresentativesMutation,
  useGetOrgRepresentativesQuery,
  useRemoveOrgRepresentativesMutation,
  useGetOrgCertificateDetailsQuery,
  useUpdateOrgCertificateDetailsMutation,
  useGetAllPricingsQuery,
  useGetCurrentSubscriptionQuery,
  useSubscribeToPricingMutation,
  useSubscribeToTrialMutation,
  useInviteFromFileMutation,
  useGetMyOpportunitySeekersQuery,
  useCanReviewOrganizationQuery,
  useGetNotesByApplicantIdQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = organizationApiSlice;