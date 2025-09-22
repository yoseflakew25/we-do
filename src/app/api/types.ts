import { NGO_TYPE_OPTIONS, ORGANIZATION_TYPE_OPTIONS } from '@/select-options';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { z } from 'zod';


// Signup Form Schema
export const SignupFormSchema = z
  .object({
    name: z.string().nonempty('Full name is required').min(2),
    email: z
      .string()
      .nonempty('Email is required')
      .email()
      .trim()
      .toLowerCase(),
    password: z.string().nonempty({ message: 'Password is required' }).min(6),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
export type SignupFormData = z.infer<typeof SignupFormSchema> & {
  role: string;
};

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'Email is required' })
    .email()
    .trim()
    .toLowerCase(),
});
export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

// Signin Form Schema
export const LoginFormSchema = ForgotPasswordSchema.merge(
  z.object({
    password: z.string().nonempty({ message: 'Password is required' }).min(6),
  })
);
export type LoginFormData = z.infer<typeof LoginFormSchema>;

export const ResetPasswordSchema = z
  .object({
    password: z.string().nonempty('Password is required').min(6),
    confirmPassword: z.string(),
    otp: z
      .string()
      .nonempty('OTP is required')
      .length(4, { message: 'OTP must be 4 characters long' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

export type ResetPasswordRequest = Omit<
  ResetPasswordFormData,
  'confirmPassword'
> & {
  email: string;
};

// This converts strings to date before checking the validity of date inputs
const DateSchema = z.preprocess(
  (arg) => (typeof arg === 'string' ? new Date(arg) : arg),
  z.date().or(z.null())
);

// const MAX_FILE_SIZE = 5000000;
// const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const GeoLocationSchema = z
  .union([
    z.object({
      latitude: z.number(),
      longitude: z.number(),
    }),
    z.object({}).transform(() => null),
  ])
  .nullable()
  .optional();

export const OrgDetailFormSchema = z.object({
  orgName: z.string().nonempty('Organization name cannot be empty'),
  logo: z.object({}).optional(), // Allow empty object
  shortHandName: z.string(),
  oldName: z.string(),
  location: z.string().nonempty('Location cannot be empty'),
  geoLocation: GeoLocationSchema,
  ngoType: z.enum(
    NGO_TYPE_OPTIONS.map((y) => y.value) as [string, ...string[]],
    {
      errorMap: () => {
        return { message: 'Organization Type needs to be a valid option' };
      },
    }
  ),
  orgType: z.enum(
    ORGANIZATION_TYPE_OPTIONS.map((y) => y.value) as [string, ...string[]],
    {
      errorMap: () => {
        return { message: 'Organization Type needs to be a valid option' };
      },
    }
  ),
  year: z.coerce
    .number()
    .int()
    .refine((value) => value > 1800 && value <= new Date().getFullYear(), {
      message: 'Year must be an integer between 1800 and the current year',
    }),
  orgArea: z
    .array(z.string())
    .nonempty('You need to select at least one operational area'),
  primaryPhone: z
    .string()
    .nonempty('Primary phone number is required')
    .refine((value) => /^(\+\d{1,3}[- ]?)?\d{10}$/.test(value), {
      message: 'Primary phone number is not valid',
    }),
  secondaryPhone: z
    .string()
    .refine(
      (value) => value === undefined || /^(\+\d{1,3}[- ]?)?\d{10}$/.test(value),
      {
        message: 'Secondary phone number is not valid',
      }
    )
    .optional()
    .or(z.literal('')),
  email: z.string().email(),
  file: z.any().optional(),
  donateWebsite: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  bankInfo: z.array(z.record(z.string(), z.any().optional())),
});

export const AboutOrgFormSchema = z.object({
  id: z.string().optional(),
  description: z.string().nonempty('Description cannot be empty').max(650),
  vission: z.string().nonempty('Vision cannot be empty').max(650),
  mission: z.string().nonempty('Mission cannot be empty').max(650),
  futurePlan: z.string().nonempty('Future Plans cannot be empty').max(650),
  website: z.string().url().optional().or(z.literal('')),
  linkedIn: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  facebook: z.string().url().optional().or(z.literal('')),
  telegram: z.string().url().optional().or(z.literal('')),
  whatsapp: z.string().url().optional().or(z.literal('')),
  LogoUrl: z.string(),
  fileUrl: z.string().optional(),
});

export const CombinedOrgFormSchema =
  OrgDetailFormSchema.merge(AboutOrgFormSchema);

export type OrgFormData = Omit<
  z.infer<typeof CombinedOrgFormSchema>,
  'orgArea'
> & {
  orgArea: string[];
  files: File[];
  average_response_time: number;
  credentials: Credentials;
  orgType: string;
  interestStatus: string;
  bankInfo: {
    bankName: string;
    bankAccount: string;
  }[];
};
interface Credential {
  fileName: string;
  fileSize: number;
  fileURL: string;
}

type Credentials = Record<string, Credential>;
export interface OrganizationProfile extends Omit<OrgFormData, 'file'> {
  id: string;
  LogoUrl: string;
  oppCount: number;
  viewsCount: number;
  total_reviews: number;
  average_rating: number;
  orgType: string;
}

export interface AdminOrganizationProfile {
  id: string;
  orgName: string;
  orgEmail: string;
  orgLogoUrl: string;
  profilePicUrl: string;
  successfulConnections: number;
  activeOpportunities: number;
  totalOpportunities: number;
  userEmail: string;
  userName: string;
  userProfileStatus?: 'INCOMPLETE' | 'COMPLETE' | 'VERIFIED' | 'DISABLED';
}

export const OpportunityDescriptionFormSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').max(100),
  description: z.string().min(1, 'Description cannot be empty').max(5000),
  responsibilities: z
    .string()
    .min(1, 'Responsibilities cannot be empty')
    .max(5000),
  requirements: z.string().min(1, 'Requirements cannot be empty').max(5000),
  idealCandidate: z.string().max(650),
  visibility: z.enum(['public', 'private']),
  allowedEmails: z.preprocess((value) => {
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email.length > 0);
  }
  // fallback for public visibility (or form's default)
  return [];
}, z.array(z.string().email('Please enter valid email addresses.'))),
  categories: z
    .array(z.string())
    .min(1, 'You need to select at least one Category'),
  geoLocation: GeoLocationSchema,
});


export const OpportunityInformationFormSchema = z.object({
  opType: z.string().min(1, 'Work Location cannot be empty'),
  engagementType: z.string().min(1, 'You need to select an Opportunity Type'),
  startDate: DateSchema.nullable(),
  endDate: DateSchema.nullable(),
  deadline: DateSchema.nullable(),
  isPaid: z.boolean(),
  paymentOption: z
    .object({
      min: z.string().or(z.number()).optional(), // Optional min value
      max: z.string().or(z.number()).optional(), // Optional max value
      amount: z.string().or(z.number()).optional(), // Optional fixed amount
      currency: z.string().optional(), // Currency required
      paymentType: z.string().optional(), // Payment type required
      rangePayment: z.string().optional(), // Optional for range-based payments
    })
    .optional(),
  location: z
    .array(z.string())
    .nonempty('You need to select at least one City'),
  requiredSkills: z.array(z.string()),
  perksAndBenefits: z.array(z.string()).max(500),
  whenAndWhere: z.string(),
  isRolling: z.boolean().or(z.literal('')),
});

export const CombinedOpportunityFormSchema =
  OpportunityDescriptionFormSchema.merge(OpportunityInformationFormSchema);

export type OpportunityFormData = Omit<
  z.infer<typeof CombinedOpportunityFormSchema>,
  'categories' | 'location'
> & {
  categories: string[];
  location: string[];
  questions: QuestionInterface[];
};

export const RepostOpportunityFormSchema = z.object({
  startDate: DateSchema,
  endDate: DateSchema,
  deadline: DateSchema,
  isRolling: z.boolean().or(z.literal('')),
});

export type RepostOpportunityFormData = z.infer<
  typeof RepostOpportunityFormSchema
>;

export interface QuestionInterface {
  question: string;
  questionType:
    | 'short-answer'
    | 'paragraph'
    | 'checkboxes'
    | 'multiple-choice'
    | 'file-upload'
    | 'dropdown'
    | 'date-select'
    | 'link-upload';
  choices?: string[];

  allowedFileTypes?: string[]; // For file upload
  maxFiles?: number; // For file upload
  maxFileSize?: number; // For file upload, in MB

  questionNumber: number;
  isRequired: boolean;
  hint?: string;
}
export type Response = {
  Response?: string;
  CheckboxResponse?: number[];
  MultiSelectResponse?: number;
  fileResponse?: {
    filePath: string;
    fileSize: number;
    fileURL: string;
  }[];
};

export const UpdateEmailSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'Email is required' })
    .email()
    .trim()
    .toLowerCase(),
});
export type UpdateEmailFormData = z.infer<typeof UpdateEmailSchema>;

export const VerifyUpdatedEmailSchema = z.object({
  otp: z
    .string()
    .nonempty('OTP is required')
    .length(4, { message: 'OTP must be 4 characters long' }),
});

export type VerifyUpdatedEmailFormData = z.infer<
  typeof VerifyUpdatedEmailSchema
>;

//  Form Schema
export const ContactUsFormSchema = z.object({
  name: z.string().nonempty({ message: 'Name is required message' }),
  email: z
    .string()
    .nonempty({ message: 'Email is required' })
    .email()
    .trim()
    .toLowerCase(),
  message: z.string().nonempty({ message: 'Please leave a message' }),
});
export type ContactUsFormData = z.infer<typeof ContactUsFormSchema>;

export interface OpportunityDetail
  extends Omit<OpportunityFormData, 'dateRange'> {
  id: string;
  datePosted: string;
  status: string;
  applicantsCount: number;
  orgID: string;
  orgName: string;
  orgEmail: string;
  logoUrl: string;
  viewsCount?: number;
  isBookmarked: boolean;
  total_reviews: number;
  average_rating: number;
}

export interface VolunteerReviewResponse {
  id: string;
  rating: number;
  comment: string;
  reviewerID: string;
  recipientID: string;
  event: {
    id: string;
    title: string;
    status: string;
  };

  reviewer: {
    id: string;
    email: string;
    logo_url: string;
    orgName: string;
    average_rating: number;
    total_reviews: number;
  };
  createdAt: string;
  updatedAt: string;
}
export interface BookmarkedDetail {
  eventID: string;
  title: string;
  opType: string;
  orgName: string;
  dateApplied: string;
  status: string;
  logoUrl: string;
  datePosted: string;
  isBookmarked?: string;
  dateBookmarked: string;
}

export interface APIResponse<DataType> {
  profile: any;
  applicationsCount: any;
  data: DataType;
  success: boolean;
  message: string;
  count?: number;
  errors?: any;
}

export type PaginationFilters = {
  page: number;
  pageSize: number;
  sortKey?: string;
  sortDesc?: boolean;
  keyword?: string;
  status?: string;
};

export type OpportunityFilters = PaginationFilters & {
  orgID?: string;
};

export type UserFilters = Omit<PaginationFilters, 'status'> & {
  orgID?: string;
  opportunityID?: string;
  role?: string;
};
export type ApplicationFilters = Omit<PaginationFilters, 'status'> & {
  orgID?: string;
  opportunityID?: string;
  status?: string;
};
export type VolunteerPoolFilters = PaginationFilters & {
  isInterested: boolean;
  visibility?: string;
};

export type VolunteerOpportuntiesFilters = Omit<PaginationFilters, 'status'> & {
  location?: string[];
  engagementType?: string;
  organizationType?: string;
  categories?: string[];
  orgId?: string;
  status?: string;
  orgType?: string;
  opportunityType?: string;
};

export type ApplicationListFilters = PaginationFilters & {};

export type OrganizationFilters = Omit<PaginationFilters, 'status'> & {
  location?: string[];
  organizationType?: string;
  ngoType?: string;
  orgArea?: string[];
  status?: string;
  orgType?: string;
};

interface ResumeFile {
  filePath: string;
  fileSize: number;
  fileURL: string;
}

interface ResumeScore {
  explanation: string;
  score: string;
}
export interface AppicantDetail {
  ID: string;
  dateApplied: string;
  responses?: {};
  status: string;
  resume_url: string;
  resumeFile: ResumeFile;
  resumeScore: ResumeScore;
  email: string;
  name: string;
  phone: string;
  location: string;
  linkedIn: string;
  currentPos: string;
  skills?: string[];
  categories?: string[];
  opType: string;
  dob: string;
  gender: string;
  whatsapp: string;
  telegram: string;
  eventTitle: string;
  orgID: string;
  logoURL: string;
  volunteerID: string;
  profileSkills: string[];
  profileLinkedIn: string;
  profileWebsite: string;
  profileResumeFile: ResumeFile;
  aboutMe: string;
  certificateID: string;
}

export interface ApplicationDetail {
  title: string;
  opType: string;
  orgName: string;
  dateApplied: string;
  status: string;
  logoURL: string;
  datePosted: string;
  deadline: string;
  orgID: string;
  eventID: string;
}

export interface VolunteerDetail
  extends Pick<AppicantDetail, 'name' | 'email'> {
  userID: string;
  aboutMe?: string;
  skills?: string[];
  languages?: string[];
  phone?: string;
  address: string;
  linkedIn?: string;
  twitter?: string;
  website?: string;
  resumeURL?: string;
  gender?: string;
  birthYear: Date;
  is_interested: boolean;
  visibility: string;
  is_connected: boolean;
  createdAt: Date;
}

export interface UserDetail {
  id: string;
  email: string;
  name: string;
  gender?: string;
  applicationCount: number;
  acceptedCount: number;
  createdAt?: Date;
  role: string;
}

export interface AdminApplicationDetail {
  id: string;
  email: string;
  name: string;
  phone: string;
  linkedin: string;
  currentPos: string;
  title: string;
  opType: string;
  orgName: string;
  dateApplied: string;
  status: string;
  logoUrl: string;
}

export interface UserProfileDetail {
  profile: {
    name: string;
    email: string;
    phone: string;
    address: string;
    gender: string;
    birthYear: string;
    resumeURL: string;
    linkedIn: string;
    skills?: string[];
    aboutMe: string;
    profilePicUrl: string;
    profile_status: string;
    is_interested: boolean;
    visibility: string;
    is_connected: boolean;
    currentPosition: string;
    twitter: string;
    website: string;
  };

  applicationsCount: {
    total: number;
    accepted: number;
    declined: number;
    pending: number;
  };
}

export interface GraphData {
  labels: string[];
  data: number[];
}

export interface DailyActiveUsersGraphData {
  org: GraphData;
  superadmin: GraphData;
  user: GraphData;
}

export interface UsersCountByAgeData {
  male: number;
  female: number;
}

export interface EditProfileForOrgUserData {
  photo: File;
  name: string;
}

export interface CertifyVolunteerData {
  file: Blob | null;
  photo: Blob | null;
  orgID: string;
  applicationID: string;
  eventName: string;
  dateOfIssue: string;
}

export const ApplicationFormSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long') // Ensure at least 3 characters
    .refine((value) => /^[A-Za-z\s]+$/.test(value), {
      message: 'Name must contain only letters and spaces',
    }),
  email: z.string().nonempty('Email is required').email().trim().toLowerCase(),
  phone: z
    .string()
    .nonempty('Phone number is required')
    .refine(
      (value) => {
        const phoneNumber = parsePhoneNumberFromString(value || '');
        return phoneNumber && phoneNumber.isValid();
      },
      {
        message: 'Invalid phone number',
      }
    ),

  // currentPos: z.string().min(1, 'Current Profession is required'),
  linkedIn: z.string().url().optional().or(z.literal('')),
  currentPosition: z
    .string()
    .min(1, { message: 'current profession is required' }),

  // file is resume
  file: z.any().optional(),

  // response for additonal questions
  responses: z.record(z.string(), z.any()).optional(),

  // this is just to collect inputs of file upload custom questions
  fileUploads: z.any().optional(),

  skills: z.array(z.string()).refine((skills) => skills.length > 0, {
    message: 'You need to select at least one skill',
  }),
  languages: z.array(z.string()).refine((languages) => languages.length > 0, {
    message: 'You need to select at least one language',
  }),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: 'You must consent to the privacy policy.',
  }),
  resumeUrl: z.string().optional(),
  resumeFile: z.object({}).optional(),
});

export type ApplicationFormData = z.infer<typeof ApplicationFormSchema>;

export interface VolunteerProfileData {
  userID?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  gender?: string;
  birthYear?: string;
  resumeURL?: string;
  linkedIn?: string;
  skills?: string[];
  aboutMe?: string;
  profilePicUrl?: string;
  profile_status?: string;
  is_interested?: boolean;
  visibility?: string;
  is_connected?: boolean;
  currentPosition?: string;
  twitter?: string;
  website?: string;
  photo?: File;
  file?: File;
  resumeFile?: {
    filePath: string;
    fileSize: number;
    fileURL: string;
  };
  languages?: string[];
  privacyConsent?: boolean;
  profileCompletePercentage?: number;
}

export interface GetCertificatesData {
  orgID: string;
  applicationID: string;
  eventName: string;
  dateOfIssue: string;
  certificateURL: string;
  certificateImageURL: string;
  orgName: string;
  logoURL: string;
  id: string;
}

export type PastExperiencesFilters = PaginationFilters & {};

export interface PastExperience {
  id: string;
  rating: number;
  comment: string;
  reviewID: string;
  reviewerID: string;
  recipientID: string;
  event: Event;
  reviewer: Reviewer;
  startedAt: string;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface Reviewer {
  id: string;
  email: string;
  logo_url: string;
  orgName: string;
  average_rating: number;
  total_reviews: number;
}
interface Event {
  id: string;
  title: string;
  status: string;
}

export interface ReviewData {
  id?: string;
  rating: number;
  comment: string;
  reviewerID: string;
  recipientID: string;
  EventID?: string;
}

export interface EditReviewData {
  rating: number;
  comment: string;
}

export interface ReviewerDetails {
  ID: string;
  FullName: string;
  Email: string;
  AverageRating: number;
  TotalReviews: number;
  ProfilePicUrl?: string;
  CurrentPosition?: string;
}

export interface ReviewResponseData extends ReviewData {
  reviewer: ReviewerDetails;
  createdAt: string;
}

export interface OrgRepresentativeDetails {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  title: string;
  opportunities_count: number;
  status: string;
  createdAt?: Date;
}

export interface SocialImpactFigures {
  applications: number;
  opportunities: number;
  organizations: number;
  users: number;
}
export interface CertificateData {
  title: string;
  subtitle: string;
  description: string;
  volunteerName: string;
  opportunityTitle: string;
  orgLogoURl: string;
  orgRepresentativeName: string;
  orgRepresentativeTitle: string;
  date: Date;
}

export const CertificateDataSchema = z.object({
  title: z
    .string()
    .min(1, 'Certificate title is required')
    .max(30, 'Title should be less than 30 characters'),
  subtitle: z.string().optional(),
  description: z
    .string()
    .min(1, 'Certificate description is required')
    .max(250, 'Description should be less than 250 characters'),
  volunteerName: z
    .string()
    .min(1, 'Volunteer name is required')
    .max(20, 'Volunteer name should be less than 20 characters'),
  opportunityTitle: z.string().min(1, 'Opportunity title is required'),
  orgLogo: z.any().optional(),
  orgRepresentativeName: z
    .string()
    .min(1, 'Organization representative name is required')
    .max(
      20,
      'Organization representative name should be less than 20 characters'
    ),
  orgRepresentativeTitle: z
    .string()
    .max(
      20,
      'Oraganization representative title should be less thann 20 characters'
    )
    .optional(),
  date: z.date().optional(),
});
export interface chatMessage {
  id: string;
  senderID: string;
  receiverID: string;
  content: string;
  timestamp: string;
  messageType: string;
  link?: string;
  page?: number;
}

export interface User {
  accessToken: string;
  email?: string;
  exp?: number;
  iat?: number;
  id?: string;
  jti?: string;
  name?: string;
  profileComplete?: boolean;
  profilePicUrl?: string;
  profileStatus?: string;
  refreshToken?: string;
  role?: string;
  sub?: string;
}

export interface Pricing {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
  featureAccess: {
    [key: string]: {
      access: boolean;
      description: string;
      limit: number;
      isLimited?: boolean;
    };
  };
}

export interface PricingResponse {
  count: number;
  data: Pricing[];
  errors: string | null;
  message: string;
  success: boolean;
}
export interface SubscriptionResponse {
  data: {
    checkout_url: string;
  };
}

export interface PricingFeatureAccess {
  [key: string]: unknown;
}

export interface MyPlan {
  success: boolean;
  message: string;
  errors: any | null;
  count: number;
  data: {
    id: string;
    orgID: string;
    orgName: string;
    paidAmount: number;
    paymentID: string;
    pricingBillingCycle: string;
    pricingId: string;
    pricingName: string;
    startDate: string;
    endDate: string;
    status: string;
    updatedAt: string;
    createdAt: string;
    featureAccess: {
      [key: string]: {
        access: boolean;
        description?: string;
        limit?: number;
        isLimited?: boolean;
      };
    };
  };
}

export interface MySubscriptionPlan {
  id: string;
  paidAmount: number;
  pricingBillingCycle: string;
  pricingName: string;
  endDate: string;
  status: string;
  featureAccess: {
    [key: string]: {
      access: boolean;
      description: string;
      limit: number;
      isLimited?: boolean;
    };
  };
}

export interface SubscribeRequest {
  pricingID: string;
}

export interface OrgResponse<T> {
  data: T;
  message: string;
}

export interface VolunteerDetailResponse extends APIResponse<VolunteerDetail> {}
export interface VolunteerDetailListResponse
  extends APIResponse<VolunteerDetail[]> {}

export interface OrgResponse<T> {
  data: T;
  message: string;
}

export interface VolunteerDetailResponse extends APIResponse<VolunteerDetail> {}
export interface VolunteerDetailListResponse
  extends APIResponse<VolunteerDetail[]> {}
export interface VolunteerPool {
  id: string;
  userID: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  createdAt: string;
  opportunities_count: number;
  invitedBy: string;
}

export interface Pricing {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
  featureAccess: {
    [key: string]: {
      access: boolean;
      description: string;
      limit: number;
      isLimited?: boolean;
    };
  };
}

export interface PricingResponse {
  count: number;
  data: Pricing[];
  errors: string | null;
  message: string;
  success: boolean;
}
export interface SubscriptionResponse {
  data: {
    checkout_url: string;
  };
}

export interface MyPlan {
  success: boolean;
  message: string;
  errors: any | null;
  count: number;
  data: {
    id: string;
    orgID: string;
    orgName: string;
    paidAmount: number;
    paymentID: string;
    pricingBillingCycle: string;
    pricingId: string;
    pricingName: string;
    startDate: string;
    endDate: string;
    status: string;
    updatedAt: string;
    createdAt: string;
    featureAccess: {
      [key: string]: {
        access: boolean;
        description?: string;
        limit?: number;
        isLimited?: boolean;
      };
    };
  };
}

export interface MySubscriptionPlan {
  paidAmount: number;
  pricingBillingCycle: string;
  pricingName: string;
  endDate: string;
  status: string;
  featureAccess: {
    [key: string]: {
      access: boolean;
      description: string;
      limit: number;
      isLimited?: boolean;
    };
  };
}

export interface SubscribeRequest {
  pricingID: string;
}

export interface OrgResponse<T> {
  data: T;
  message: string;
}

export interface VolunteerDetailResponse extends APIResponse<VolunteerDetail> {}
export interface VolunteerDetailListResponse
  extends APIResponse<VolunteerDetail[]> {}
export type BulkAddToOrgPoolPayload = {
  userIDs: string[];
};

export interface OrgResponse<T> {
  data: T;
  message: string;
}

export type AddToOrgPoolPayload = string;

export interface BulkRemoveFromOrgPoolRequest {
  userIDs: string[];
}

export interface VolunteerDetailResponse extends APIResponse<VolunteerDetail> {}
export interface VolunteerDetailListResponse
  extends APIResponse<VolunteerDetail[]> {}

export interface SearchAlertRequest {
  filter: {
    params: {
      keyword: string;
    };
  };
}

export interface ApplicationStatusGraphResponse {
  success: boolean;
  message: string;
  data: {
    labels: string[];
    data: number[];
  };
  errors: null | string;
  count: number;
}

export type OpportunityCountStatusResponse = {
  success: boolean;
  message: string;
  data: {
    closed: number;
    open: number;
  };
  errors: null | string[];
};

export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  applicationId: string;
  userId: string;
  orgId: string;
  date_added: string;
}

export interface NotesResponse {
  success: boolean;
  message: string;
  data: Note[];
  errors: null | string;
  count: number;
}
