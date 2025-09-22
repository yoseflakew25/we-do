import { APIResponse, SignupFormData, ForgotPasswordFormData, ResetPasswordRequest, UpdateEmailFormData, VerifyUpdatedEmailFormData, EditProfileForOrgUserData } from '../types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';


const addTokenToRequest = async (headers: Headers) => {
  const session = await getSession();
  if (session?.user?.accessToken) {
    headers.set('Authorization', `Bearer ${session.user.accessToken}`);
  } else {
    const guestUser = localStorage.getItem('guestUser');
    if (guestUser) {
      const gUser = JSON.parse(guestUser);
      headers.set('Authorization', `Bearer ${gUser.accessToken}`);
    } else {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL ||
          'https://akil-backend-ij7jnmwh2q-zf.a.run.app'
        }` + '/guest-token',
        {
          method: 'GET',
        }
      ).then((res) => res.json());
      headers.set('Authorization', `Bearer ${response.data.accessToken}`);
      localStorage.setItem('guestUser', JSON.stringify(response.data));
    }
  }
  return headers;
};

export const apiSlice = createApi({
  reducerPath: 'apiSlice',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_API_URL ||
      'https://akil-backend-ij7jnmwh2q-zf.a.run.app',
    prepareHeaders: (headers) => {
      return addTokenToRequest(headers);
    },
  }),
  tagTypes: [
    'Opportunities',
    'OwnOrganization',
    'Organizations',
    'Applicants',
    'Applications',
    'Users',
    'OrganizationReviews',
    'OpportunityReviews',
    'BookmarkedOpportunities',
    'Pricings',
    'OrgPool',
    'Notes',
  ],
  endpoints: (builder) => ({
    signupUser: builder.mutation<
      APIResponse<undefined>,
      Omit<SignupFormData, 'confirmPassword'>
    >({
      query: (body) => ({
        url: '/signup',
        method: 'POST',
        body,
      }),
    }),
    resendOTP: builder.mutation<APIResponse<undefined>, ForgotPasswordFormData>(
      {
        query: (body) => ({
          url: '/resend-otp',
          method: 'POST',
          body,
        }),
      }
    ),
    forgotPassword: builder.mutation<
      APIResponse<undefined>,
      ForgotPasswordFormData
    >({
      query: (body) => ({
        url: '/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<
      APIResponse<undefined>,
      ResetPasswordRequest
    >({
      query: (body) => ({
        url: '/change-password',
        method: 'POST',
        body,
      }),
    }),
    verifyEmail: builder.mutation<
      APIResponse<undefined>,
      Omit<ResetPasswordRequest, 'password'>
    >({
      query: (body) => ({
        url: '/verify-email',
        method: 'POST',
        body,
      }),
    }),
    setRole: builder.mutation<APIResponse<undefined>, { role: string }>({
      query: (data) => {
        return {
          url: `/set-role`,
          method: 'POST',
          body: data,
        };
      },
    }),

    updateEmailForOrgUser: builder.mutation<
      APIResponse<undefined>,
      UpdateEmailFormData
    >({
      query: (body) => ({
        url: '/update-email',
        method: 'PATCH',
        body,
      }),
    }),

    verifyUpdatedEmailForOrgUser: builder.mutation<
      APIResponse<undefined>,
      VerifyUpdatedEmailFormData & {
        email: string;
      }
    >({
      query: (body) => ({
        url: '/verify-update-email',
        method: 'POST',
        body,
      }),
    }),

    editProfileForOrgUser: builder.mutation<
      APIResponse<undefined>,
      EditProfileForOrgUserData
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
          formData: true,
        };
      },
    }),

    editNameForOrgUser: builder.mutation<
      APIResponse<undefined>,
      EditProfileForOrgUserData
    >({
      query: (data) => {
        const formData = new FormData();
        // to convert the object to formData
        for (const [key, value] of Object.entries(data)) {
          formData.append(key, value);
        }

        formData.append(
          'Content-Type',
          'multipart/form-data; boundary=---------------'
        );

        return {
          url: '/update-name',
          method: 'PATCH',
          body: formData,
          formData: true,
        };
      },
    }),

    deleteReview: builder.mutation<APIResponse<undefined>, { id: string }>({
      query: ({ id }) => {
        return {
          url: `/reviews/${id}`,
          method: 'DELETE',
        };
      },
    }),

    isReviewed: builder.query<
      { status: number },
      { reviewerID: string; recipientID: string; eventID?: string }
    >({
      query: (requestParams) => ({
        url: `/is-reviewed`,
        method: 'HEAD',
        params: requestParams,
      }),
      transformResponse(baseQueryReturnValue, meta) {
        return { status: meta?.response?.status || 0 };
      },
    }),
  }),
});

export const {
  useSignupUserMutation,
  useVerifyEmailMutation,
  useResendOTPMutation,
  useResetPasswordMutation,
  useForgotPasswordMutation,
  useUpdateEmailForOrgUserMutation,
  useVerifyUpdatedEmailForOrgUserMutation,
  useEditProfileForOrgUserMutation,
  useSetRoleMutation,
  useDeleteReviewMutation,
  useIsReviewedQuery,
  useEditNameForOrgUserMutation,
} = apiSlice;