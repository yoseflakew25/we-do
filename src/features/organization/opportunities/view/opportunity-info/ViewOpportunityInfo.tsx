import OpportunityInfoOtherDetails from '../OpportunityInfoOtherDetails';
import OpportunityTop from '../OpportunityTopSection';
import ViewApplicantsTable from '../ViewApplicantsTable';
import { useUpdateOpportunityStatusMutation } from '@/app/api/slices/opportunity-api-slice';
import {
  useGetOrgCertificateDetailsQuery,
  useGetOrgDetailByIDQuery,
  useUpdateOrgCertificateDetailsMutation,
} from '@/app/api/slices/org-api-slice';
import { useGetApplicantsQuery } from '@/app/api/slices/volunteer-api-slice';
import { OpportunityDetail } from '@/app/api/types';
import ErrorPage from '@/components/ErrorPage';
import LoadingPage from '@/components/LoadingPage';
import SocialShareButtons from '@/components/SocialShareButtons';
import Certificate from '@/components/certificate/Certificate';
import EditCertificate from '@/components/certificate/EditCertificate';
import { OpportunityStatusChangePopup } from '@/components/popups/OpportunityStatusChangePopup';
import Header from '@/features/organization/components/Header';
import { UnderlineTabs } from '@/features/organization/components/UnderlineTabs';
import { useOrgLogo } from '@/hook';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  IconButton,
  Popover,
  PopoverContent,
  PopoverHandler,
  Tooltip,
} from '@material-tailwind/react';
import dateFormat from 'dateformat';
import { Edit } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-nprogress-bar';
import { usePathname } from 'next/navigation';
import { useState, ComponentProps } from 'react';
import { AiOutlineShareAlt } from 'react-icons/ai';

const ActionButton = ({ children, ...props }: ComponentProps<typeof Button>) => (
  <Button
    variant='text'
    className='flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all hover:shadow-md'
    {...props}
  >
    {children}
  </Button>
);

const ShareMenu = ({ socials, sharableUrl }: { socials: any[]; sharableUrl: string }) => (
  <Popover placement='bottom-end'>
    <PopoverHandler>
      <ActionButton className='text-gray-700 hover:bg-gray-100'>
        <AiOutlineShareAlt className='h-5 w-5' />
        <span className='hidden sm:inline'>Share</span>
      </ActionButton>
    </PopoverHandler>
    <PopoverContent className='flex w-max flex-wrap gap-2 p-3'>
      {socials.map(({ name, renderButton, renderIcon }) => (
        <Tooltip key={name} content={`Share on ${name}`} placement='bottom'>
          <div className='transform transition-transform hover:scale-110'>
            {renderButton({
              url: sharableUrl,
              children: (
                <IconButton
                  variant='text'
                  className='h-10 w-10 rounded-full bg-gray-50 hover:bg-gray-100'
                  size='md'
                >
                  {renderIcon({ size: 20 })}
                </IconButton>
              ),
            })}
          </div>
        </Tooltip>
      ))}
    </PopoverContent>
  </Popover>
);

const ViewOppotunityInfo: React.FC<{
  formData: OpportunityDetail;
  refetch: () => void;
}> = ({ formData: opportunityResponse, refetch }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showConfirmClosePopup, setShowConfirmClosePopup] = useState(false);
  const [showConfirmReopenPopup, setShowConfirmReopenPopup] = useState(false);
  const [editCertificate, setEditCertificate] = useState(false);
  const { data: certificateDetails, refetch: certificateDetailsRefetch } =
    useGetOrgCertificateDetailsQuery();
  const { data: applicantsData } = useGetApplicantsQuery(
    opportunityResponse.id
  );
  const {
    data: orgProfileData,
    isFetching,
    isError,
  } = useGetOrgDetailByIDQuery(opportunityResponse.orgID);
  const [updateCertificateDetails] = useUpdateOrgCertificateDetailsMutation();
  const [updateOpportunityStatus] = useUpdateOpportunityStatusMutation();

  const getOrgLogo = useOrgLogo();
  const t = useTranslations('ViewOpportunityInfoPage');
  const sharableUrl =
    typeof window !== 'undefined'
      ? window.location.href
          .replace(/\/(admin|organization)/, '/talent')
          .split('?')[0]
      : '';
  const socials = SocialShareButtons({ sharableUrl });

  function handleOnEdit(): void {
    router.push(`${pathname}/edit`);
  }

  if (isFetching) {
    return <LoadingPage />;
  }

  if (isError || !orgProfileData) {
    return <ErrorPage />;
  }

  const orgDetail = orgProfileData.data;
  const tabsData = [
    {
      label: `Opportunity Details`,
      value: 'details',
      desc: <OpportunityInfoOtherDetails formData={opportunityResponse} />,
    },
    {
      label: `Applicants`,
      value: 'applicants',
      desc: <ViewApplicantsTable id={opportunityResponse.id} />,
      loading: !applicantsData,
    },
    {
      label: `Certificate`,
      value: 'certificate',
      desc: (
        <div className='p-6'>
          <div className='mb-6 flex items-center justify-between'>
            <h3 className='text-lg font-medium text-gray-900'>Certificate Settings</h3>
            {!editCertificate && (
              <Button
                variant='outlined'
                size='sm'
                color='amber'
                className='flex items-center gap-2'
                onClick={() => setEditCertificate(true)}
              >
                <Edit className='h-4 w-4' />
                Edit Certificate
              </Button>
            )}
          </div>

          {editCertificate ? (
            <EditCertificate
              opportunityTitle={opportunityResponse.title}
              description={certificateDetails?.data.description || ''}
              orgLogo={certificateDetails?.data.orgLogoURl}
              orgRepresentativeName={
                certificateDetails?.data.orgRepresentativeName
              }
              orgRepresentativeTitle={
                certificateDetails?.data.orgRepresentativeTitle || ''
              }
              title={certificateDetails?.data.title || ''}
              subtitle={certificateDetails?.data.subtitle || ''}
              setFlag={setEditCertificate}
              volunteerName='{Volunteer Name}'
              onSave={updateCertificateDetails}
              refetch={certificateDetailsRefetch}
            />
          ) : (
            <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
              <Certificate
                volunteerName='{Volunteer Name}'
                opportunityTitle={opportunityResponse.title}
                description={certificateDetails?.data.description}
                orgLogo={certificateDetails?.data.orgLogoURl}
                orgRepresentativeName={
                  certificateDetails?.data.orgRepresentativeName
                }
                orgRepresentativeTitle={
                  certificateDetails?.data.orgRepresentativeTitle
                }
                title={certificateDetails?.data.title}
                subtitle={certificateDetails?.data.subtitle}
              />
            </div>
          )}
        </div>
      ),
    },
  ];

  const handleClose = () => {
    setShowConfirmClosePopup(!showConfirmClosePopup);
  };

  const handleReopen = () => {
    setShowConfirmReopenPopup(!showConfirmReopenPopup);
  };

  const handleRepost = () => {
    router.push(`${pathname}/repost`);
  };

  const countApplicantStatus = (targetStatus: string): number => {
    return (
      applicantsData?.data?.filter((item) => item.status === targetStatus)
        ?.length ?? 0
    );
  };
  const handleClosePost = async () => {
    try {
      await updateOpportunityStatus({
        id: opportunityResponse.id,
        data: { status: 'closed' },
      })
        .unwrap()
        .then(() => {
          refetch();
        });
    } catch (error) {
      console.error('Error: on close opportunity', error);
    }
  };
  //Todo backend
  // const handleDeletePost = async () => {
  //   try {
  //     await updateOpportunityStatus({
  //       id: opportunityResponse.id,
  //       data: { status: 'delete' },
  //     }).unwrap();
  //   } catch (error) {
  //     console.error('Error: on delete opportunity', error);
  //   }
  // };
  const handleReopenPost = async () => {
    try {
      await updateOpportunityStatus({
        id: opportunityResponse.id,
        data: { status: 'open' },
      })
        .unwrap()
        .then(() => {
          refetch();
        });
    } catch (error) {
      console.error('Error: on open opportunity', error);
    }
  };

  const adminActions: { [key: string]: ComponentProps<typeof Button>[] } = {
    open: [
      {
        children: <ShareMenu socials={socials} sharableUrl={sharableUrl} />,
        className: '!shadow-none !p-0',
      },
      {
        children: t('closeOpportunity.buttonText'),
        className: 'text-red-600 hover:bg-red-50',
        color: 'red',
        variant: 'text',
        onClick: handleClose,
      },
    ],
    closed: [
      {
        children: t('openOpportunity.buttonText'),
        className: 'text-green-600 hover:bg-green-50',
        color: 'green',
        variant: 'text',
        onClick: handleReopen,
      },
      {
        children: t('repostOpportunity.buttonText'),
        className: 'text-amber-600 hover:bg-amber-50',
        color: 'amber',
        variant: 'text',
        onClick: handleRepost,
      },
    ],
  };

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='bg-white shadow-sm'>
        <div className='container mx-auto'>
          <Header
            logoUrl={getOrgLogo(orgDetail.LogoUrl)}
            title={orgDetail.orgName}
            rightComponent={
              <div className='flex items-center gap-3'>
                {adminActions[opportunityResponse.status]?.map((action, index) => (
                  <ActionButton
                    key={index}
                    color={action.color as any}
                    onClick={action.onClick}
                    className={`${action.className} ${action.color === 'pink' ? 'text-red-600 hover:bg-red-50' : ''}`}
                  >
                    {action.children}
                  </ActionButton>
                ))}
                <ActionButton
                  variant='outlined'
                  color='amber'
                  className='border-amber-500 text-amber-600 hover:bg-amber-50'
                  onClick={handleOnEdit}
                >
                  <FontAwesomeIcon icon={faEdit} className='h-4 w-4' />
                  <span className='ml-1 hidden sm:inline'>Edit</span>
                </ActionButton>
              </div>
            }
          />
        </div>
      </div>

      <div className='container mx-auto px-4 py-6 sm:px-6 lg:px-8'>
        <OpportunityTop
          opportunityResponse={opportunityResponse}
          refetch={refetch}
          orgDetail={orgDetail}
          actions={[]} // Moved actions to the header
          handleOnEdit={handleOnEdit}
        />

        <div className='mt-8 overflow-hidden rounded-xl bg-white shadow-sm'>
          <UnderlineTabs data={tabsData} />
        </div>
      </div>

      {/* Confirmation Dialogs */}
      {showConfirmClosePopup && (
        <OpportunityStatusChangePopup
          title={t('closeOpportunity.confirmationPopup.title')}
          onConfirm={handleClosePost}
          onCancel={handleClose}
          subTitle={t('closeOpportunity.confirmationPopup.subTitle')}
          buttonText={t('closeOpportunity.buttonText')}
          accepted={countApplicantStatus('hired').toString()}
          applicants={(applicantsData?.data?.length ?? 0).toString()}
          declined={countApplicantStatus('declined').toString()}
          inReview={countApplicantStatus('pending').toString()}
          deadline={dateFormat(opportunityResponse.deadline!, 'mmm dd, yyyy')}
        />
      )}

      {showConfirmReopenPopup && (
        <OpportunityStatusChangePopup
          title={t('openOpportunity.confirmationPopup.title')}
          onConfirm={handleReopenPost}
          onCancel={handleReopen}
          subTitle={t('openOpportunity.confirmationPopup.subTitle')}
          buttonText={t('openOpportunity.buttonText')}
          accepted={countApplicantStatus('hired').toString()}
          applicants={(applicantsData?.data?.length ?? 0).toString()}
          declined={countApplicantStatus('declined').toString()}
          inReview={countApplicantStatus('pending').toString()}
          deadline={dateFormat(opportunityResponse.deadline!, 'mmm dd, yyyy')}
        />
      )}
    </div>
  );
};

export default ViewOppotunityInfo;
