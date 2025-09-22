import { APIResponse, AdminApplicationDetail, AppicantDetail, ApplicationDetail, ApplicationFilters, ApplicationFormData, ApplicationListFilters, CertifyVolunteerData, GetCertificatesData, OpportunityDetail, PaginationFilters, ReviewData, PastExperience, UserDetail, UserFilters, UserProfileDetail, VolunteerDetail, VolunteerPoolFilters, VolunteerProfileData, VolunteerReviewResponse, EditReviewData, SearchAlertRequest } from '../types';
import { apiSlice } from './api-slice';
import { base64ToBinary } from '@/features/volunteer/components/ApplicationsWithCustomQuestions';


const volunteerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOpportunityApplicants: builder.query<
      APIResponse<AppicantDetail[]>,
      { id: string; filters: PaginationFilters }
    >({
      query: ({ id, filters }) => ({
        url: `/opportunities/${id}/applications`,
        method: 'GET',
        params: filters,
      }),
      providesTags: ['Applicants'],
    }),

    createApplication: builder.mutation<
      APIResponse<undefined>,
      { id: string; data: ApplicationFormData }
    >({
      query: ({ id, data }) => {
        const formData = new FormData();
        // to convert the object to formData

        for (const [key, value] of Object.entries(data)) {
          // To add resume if file is uploaded 
          if (key === 'file') {
            const files = Array.isArray(value) ? value : [value];
            files.forEach((file) => {
              const base64Data = file.content;
              const base64String = base64Data.includes(',')
                ? base64Data.split(',')[1]
                : base64Data;
              const binaryData = base64ToBinary(base64String);
              const newBlob = new Blob([binaryData], { type: file.type });
              formData.append('file', newBlob, file.name);
            });
          }
          // Process other general questions
          else if (Array.isArray(value)) {
            value.forEach((item) => {
              formData.append(key, item);
            });
          }
          // Process additional responses 
          else if (key === 'responses') {
            formData.append('responses', JSON.stringify(value));
          }
          // Process fileUploads for additional responses
          else if (key === 'fileUploads') {
            for (const uploadKey in value) {
              const fileArray = value[uploadKey];
              if (Array.isArray(fileArray) && fileArray.length) {
                const file = fileArray[0];
                const base64Data = file.content;
                const base64String = base64Data.includes(',')
                  ? base64Data.split(',')[1]
                  : base64Data;
                const binaryData = base64ToBinary(base64String);
                const newBlob = new Blob([binaryData], { type: file.type });
                formData.append(`file-${uploadKey}`, newBlob, file.name);
              }
            }
          } else {
            // For any other key, append its value directly
            formData.append(key, value);
          }
        }

        return {
          url: `/opportunities/${id}/applications`,
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
    }),

    getApplications: builder.query<
      APIResponse<ApplicationDetail[]>,
      ApplicationListFilters | undefined
    >({
      query: (filters) => ({
        url: `/applications`,
        method: 'GET',
        params: filters,
      }),
      providesTags: ['Applications'],
    }),

    getApplicantDetail: builder.query<APIResponse<AppicantDetail>, string>({
      query: (id: string) => ({
        url: `/applications/${id}`,
        method: 'GET',
      }),
    }),

    updateApplicantStatus: builder.mutation<
      APIResponse<AppicantDetail>,
      { id: string; data: { status: string } }
    >({
      query: ({ id, data }) => {
        return {
          url: `/applications/${id}`,
          method: 'PATCH',
          body: data,
        };
      },
    }),

    updateVolunteerPool: builder.mutation<
      APIResponse<VolunteerDetail>,
      { userID: string; connectionStatus: string }
    >({
      query: (data) => {
        return {
          url: `/connects`,
          method: 'POST',
          body: data,
        };
      },
    }),

    getApplicants: builder.query<APIResponse<AppicantDetail[]>, string>({
      query: (opportunity_id: string) => ({
        url: `/opportunities/${opportunity_id}/applications`,
        method: 'GET',
      }),
      providesTags: ['Applicants'],
    }),
    getAllApplicationsAdmin: builder.query<
      APIResponse<AdminApplicationDetail[]>,
      ApplicationFilters
    >({
      query: (filters) => ({
        url: `/admin/applications`,
        method: 'GET',
        params: filters,
      }),
    }),

    getVisibleVolunteers: builder.query<
      APIResponse<VolunteerDetail[]>,
      VolunteerPoolFilters
    >({
      query: (filters) => ({
        url: `/volunteers`,
        method: 'GET',
        params: filters,
      }),
      providesTags: ['Users'],
    }),

    getAllUsers: builder.query<APIResponse<UserDetail[]>, UserFilters>({
      query: (filters) => ({
        url: `/admin/volunteers/search`,
        method: 'GET',
        params: filters,
      }),
      providesTags: ['Users'],
    }),

    getUserDetail: builder.query<APIResponse<UserProfileDetail>, string>({
      query: (userId: string) => ({
        url: `/admin/volunteers/${userId}`,
        method: 'GET',
      }),
    }),

    getVolunteerDetail: builder.query<APIResponse<VolunteerDetail>, string>({
      query: (userId: string) => ({
        url: `/volunteers/${userId}`,
        method: 'GET',
      }),
    }),

    deleteUser: builder.mutation<APIResponse<undefined>, { ids: string[] }>({
      query: (data) => {
        return {
          url: `/admin/volunteers`,
          method: 'DELETE',
          body: data,
        };
      },
    }),
    deleteApplication: builder.mutation<
      APIResponse<undefined>,
      { ids: string[] }
    >({
      query: (data) => {
        return {
          url: `/admin/applications`,
          method: 'DELETE',
          body: data,
        };
      },
    }),
    changeUserRole: builder.mutation<
      APIResponse<undefined>,
      { ids: string[]; newRole: string }
    >({
      query: (data) => {
        return {
          url: `/admin/volunteers/update-role`,
          method: 'PATCH',
          body: data,
        };
      },
    }),

    certifyVolunteer: builder.mutation<
      APIResponse<undefined>,
      CertifyVolunteerData
    >({
      query: (data) => {
        const formData = new FormData();
        // to convert the object to formData
        for (const [key, value] of Object.entries(data)) {
          formData.append(key, value);
        }

        formData.append(
          'Content-Type',
          'multipart/form-data; boundary=---------------' + Date.now()
        );
        return {
          url: '/applications/certificates',
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
    }),

    getPastExperiences: builder.query<
      APIResponse<PastExperience[]>,
      { userId: string; status?: string }
    >({
      query: ({ userId, status }) => ({
        url: `/experiences/${userId}`,
        method: 'GET',
        params: { status },
      }),
    }),

    // volunteer side api calls
    getAllVolunteerOpportunities: builder.query<
      APIResponse<OpportunityDetail[]>,
      string
    >({
      query: (filters) => ({
        url: `opportunities/search?${filters}`,
        method: 'GET',
      }),
      // providesTags: ['Opportunities'],
    }),

    getAllOpportunitiesByOrgId: builder.query<
      APIResponse<OpportunityDetail[]>,
      { orgID: string; status: string; page: number; pageSize: number }
    >({
      query: (filters) => ({
        url: '/opportunities/search',
        method: 'GET',
        params: filters,
      }),
    }),

    getProfile: builder.query<APIResponse<VolunteerProfileData>, void>({
      query: () => ({
        url: `/profile`,
        method: 'GET',
      }),
    }),

    getCertificates: builder.query<APIResponse<GetCertificatesData[]>, void>({
      query: () => ({
        url: `/applications/certificates`,
        method: 'GET',
      }),
    }),
    getCertificateById: builder.query<APIResponse<GetCertificatesData>, string>(
      {
        query: (id) => ({
          url: `/certificate/${id}`,
          method: 'GET',
        }),
      }
    ),
    editProfileForUser: builder.mutation<
      APIResponse<undefined>,
      VolunteerProfileData
    >({
      query: (data) => {
        return {
          url: '/profile',
          method: 'PUT',
          body: data,
        };
      },
    }),
    editProfilePictureForUser: builder.mutation<
      APIResponse<any>,
      VolunteerProfileData
    >({
      query: (data) => {
        const formData = new FormData();
        // to convert the object to formData
        for (const [key, value] of Object.entries(data)) {
          formData.append(key, value);
        }

        formData.append(
          'Content-Type',
          'multipart/form-data; boundary=---------------' + Date.now()
        );

        return {
          url: '/update-user-profile',
          method: 'PATCH',
          body: formData,
        };
      },
    }),
    deleteProfilePictureForUser: builder.mutation<APIResponse<undefined>, void>(
      {
        query: () => {
          return {
            url: '/profile/delete-profile-picture',
            method: 'DELETE',
          };
        },
      }
    ),
    editResumeForUser: builder.mutation<
      APIResponse<VolunteerProfileData>,
      VolunteerProfileData
    >({
      query: (data) => {
        const formData = new FormData();
        formData.append(
          'Content-Type',
          'multipart/form-data; boundary=---------------' + Date.now()
        );

        if (data.file) {
          formData.append('file', data.file);
        }

        return {
          url: '/update-resume',
          method: 'PATCH',
          body: formData,
        };
      },
    }),

    reviewOrganization: builder.mutation<APIResponse<undefined>, ReviewData>({
      query: (data) => {
        return {
          url: `/reviews`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: [
        'OrganizationReviews',
        'OpportunityReviews',
        'Applications',
      ],
    }),

    editReview: builder.mutation<
      APIResponse<undefined>,
      { id: string; data: EditReviewData }
    >({
      query: ({ id, data }) => {
        return {
          url: `/reviews/${id}`,
          method: 'PATCH',
          body: data,
        };
      },
      invalidatesTags: [
        'OrganizationReviews',
        'OpportunityReviews',
        'Applications',
      ],
    }),

    updateUserInterest: builder.mutation<
      APIResponse<VolunteerProfileData>,
      { orgID: string; interestStatus: string }
    >({
      query: (data) => ({
        url: `/interests`,
        method: 'POST',
        body: data,
      }),
    }),

    deleteResumeForUser: builder.mutation<APIResponse<undefined>, void>({
      query: () => {
        return {
          url: '/profile/delete-resume',
          method: 'DELETE',
        };
      },
    }),
    getAllReviewById: builder.query<
      APIResponse<VolunteerReviewResponse[]>,
      string
    >({
      query: (userId: string) => ({
        url: `reviews/volunteers/${userId}`,
        method: 'GET',
      }),
    }),
    createSearchAlert: builder.mutation<void, SearchAlertRequest>({
      query: (body) => ({
        url: `/search-alert`,
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetVisibleVolunteersQuery,
  useGetAllUsersQuery,
  useGetOpportunityApplicantsQuery,
  useGetApplicantDetailQuery,
  useUpdateApplicantStatusMutation,
  useUpdateVolunteerPoolMutation,
  useGetApplicantsQuery,
  useDeleteUserMutation,
  useGetUserDetailQuery,
  useGetVolunteerDetailQuery,
  useChangeUserRoleMutation,
  useCertifyVolunteerMutation,
  useGetAllVolunteerOpportunitiesQuery,
  useGetAllOpportunitiesByOrgIdQuery,
  useCreateApplicationMutation,
  useGetApplicationsQuery,
  useGetProfileQuery,
  useGetAllApplicationsAdminQuery,
  useGetCertificatesQuery,
  useDeleteApplicationMutation,
  useGetPastExperiencesQuery,
  useEditProfileForUserMutation,
  useEditProfilePictureForUserMutation,
  useEditResumeForUserMutation,
  useReviewOrganizationMutation,
  useGetAllReviewByIdQuery,
  useDeleteResumeForUserMutation,
  useEditReviewMutation,
  useGetCertificateByIdQuery,
  useUpdateUserInterestMutation,
  useDeleteProfilePictureForUserMutation,
  useCreateSearchAlertMutation,
} = volunteerApiSlice;