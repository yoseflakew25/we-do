'use client';

import AdditionalQuestionsResponses from '../../components/AdditionalResponse';
import Notes from '../../components/Notes';
import OrgInfoWithIcon from '../../components/OrgInfoWithIcon';
import PageTitle from '../../components/PageTitle';
import PastExperiences from '../../components/PastExeperiences';
import Tag from '../../components/Tag';
import { UnderlineTabs } from '../../components/UnderlineTabs';
import {
  useGetApplicantDetailQuery,
  useUpdateApplicantStatusMutation,
} from '@/app/api/slices/volunteer-api-slice';
import { OpportunityDetail } from '@/app/api/types';
import ErrorPage from '@/components/ErrorPage';
import LoadingPage from '@/components/LoadingPage';
import { ApplicantStatusChangePopup } from '@/components/popups/ApplicantStatusChangePopup';
import { RateAndReviewPopup } from '@/features/volunteer/components/RateAndReviewPopup';
import { bytesToMB, useAvatarImage } from '@/hook';
import {
  Button,
  Avatar,
  Select,
  Option,
  Card,
  CardBody,
  Typography,
} from '@material-tailwind/react';
import dateFormat from 'dateformat';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import {
  PiEnvelope,
  PiLinkedinLogo,
  PiPhoneLight,
  PiTelegramLogo,
  PiWhatsappLogo,
} from 'react-icons/pi';
import { SlLocationPin } from 'react-icons/sl';
import { TbPdf } from 'react-icons/tb';

export const titleStyle = 'text-neutrals100 text-xl font-semibold mb-3';

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    hired: { label: 'HIRED', color: 'bg-green-100 text-green-800' },
    declined: { label: 'DECLINED', color: 'bg-red-100 text-red-800' },
    pending: { label: 'APPLIED', color: 'bg-amber-100 text-amber-800' },
    'in-review': { label: 'IN REVIEW', color: 'bg-yellow-100 text-yellow-800' },
    interview: { label: 'INTERVIEW', color: 'bg-blue-100 text-blue-800' },
    'offer-extended': { label: 'OFFER EXTENDED', color: 'bg-purple-100 text-purple-800' },
    certified: { label: 'CERTIFIED', color: 'bg-indigo-100 text-indigo-800' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || { label: status, color: 'bg-gray-100 text-gray-800' };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

function ApplicantDetail({
  applicantion_id,
  opportunityData,
}: {
  id: string;
  applicantion_id: string;
  opportunityData?: OpportunityDetail;
}) {
  const router = useRouter();
  const { data, isFetching, isError } =
    useGetApplicantDetailQuery(applicantion_id);

  const getAvatar = useAvatarImage();
  const [applicationStatus, setApplicationStatus] = useState('');
  const [showConfirmInReviewPopup, setshowConfirmInReviewPopup] =
    useState(false);
  const [showConfirmInterviewPopup, setShowConfirmInterviewPopup] = useState(false);
  const [showConfirmOfferPopup, setShowConfirmOfferPopup] = useState(false);
  const [showConfirmHirePopup, setShowConfirmHirePopup] = useState(false);
  const [showConfirmDeclinePopup, setShowConfirmDeclinePopup] = useState(false);
  const [showConfirmCertifyPopup, setShowConfirmCertifyPopup] = useState(false);
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
  const t = useTranslations('ApplicantDetailPage');

  const [updateApplicantStatus] = useUpdateApplicantStatusMutation();

  useEffect(() => {
    if (data?.data.status) {
      setApplicationStatus(data.data.status);
    } else {
      setApplicationStatus('pending');
    }
  }, [data?.data.status]);

  if (isFetching) {
    return <LoadingPage />;
  }

  if (isError || !data) {
    return <ErrorPage imageName='404.svg' title='Applicant not found' />;
  }

  const applicantDetail = data.data;
  const resumeSizeInMB = bytesToMB(
    applicantDetail.resumeFile.fileSize ||
      applicantDetail.profileResumeFile.fileSize,
    2
  );

  const handleOpenReviewPopup = () => {
    setIsReviewPopupOpen((prev) => !prev);
  };

  const onInterviewClick = () => {
    setShowConfirmInterviewPopup(!showConfirmInterviewPopup);
  };

  const onOfferClick = () => {
    setShowConfirmOfferPopup(!showConfirmOfferPopup);
  };

  const onHireClick = () => {
    setShowConfirmHirePopup(!showConfirmHirePopup);
  };

  const onDeclineClick = () => {
    setShowConfirmDeclinePopup(!showConfirmDeclinePopup);
  };

  const onCertifyClick = () => {
    setShowConfirmCertifyPopup(!showConfirmCertifyPopup);
  };

  const onViewCertificateClick = () => {
    router.push(`/view-certificate/${applicantDetail.certificateID}`);
  };

  const onInReviewClick = () => {
    setshowConfirmInReviewPopup(!showConfirmInReviewPopup);
  };

  const handleInterview = async () => {
    try {
      await updateApplicantStatus({
        id: applicantion_id,
        data: { status: 'interview' },
      }).unwrap();
      setApplicationStatus('interview');
      onInterviewClick();
    } catch (error) {
      console.error('Error: on interview Applicant', error);
    }
  };

  const handleOffer = async () => {
    try {
      await updateApplicantStatus({
        id: applicantion_id,
        data: { status: 'offer-extended' },
      }).unwrap();
      setApplicationStatus('offer-extended');
      onOfferClick();
    } catch (error) {
      console.error('Error: on offer Applicant', error);
    }
  };

  const handleHire = async () => {
    try {
      await updateApplicantStatus({
        id: applicantion_id,
        data: { status: 'hired' },
      }).unwrap();
      setApplicationStatus('hired');
      onHireClick();
    } catch (error) {
      console.error('Error: on hire Applicant', error);
    }
    onHireClick();
  };

  const handleInReview = async () => {
    try {
      await updateApplicantStatus({
        id: applicantion_id,
        data: { status: 'in-review' },
      }).unwrap();
      setApplicationStatus('in-review');
      onInReviewClick();
    } catch (error) {
      console.error('Error: on making an applicant status in review', error);
    }
  };

  const handleDecline = async () => {
    try {
      await updateApplicantStatus({
        id: applicantion_id,
        data: { status: 'declined' },
      }).unwrap();
      setApplicationStatus('declined');
      onDeclineClick();
    } catch (error) {
      console.error('Error: on decline Applicant', error);
    }
  };

  const handleCertify = async () => {
    try {
      await updateApplicantStatus({
        id: applicantion_id,
        data: { status: 'certified' },
      }).unwrap();
      setApplicationStatus('certified');
      onCertifyClick();
    } catch (error) {
      console.error('Error: on certify Applicant', error);
    }
  };

  const handlePopup = (value: string) => {
    if (value === 'interview') {
      onInterviewClick();
    } else if (value === 'offer-extended') {
      onOfferClick();
    } else if (value === 'hired') {
      onHireClick();
    } else if (value === 'declined') {
      onDeclineClick();
    } else if (value === 'in-review') {
      onInReviewClick();
    } else if (value === 'certified') {
      onCertifyClick();
    }
  };

  const handleStatusChange = async (value: string) => {
    handlePopup(value);
  };

  const score = applicantDetail.resumeScore?.score ?? '';
  const numericScore = Number(score) || 0;
  const explanation = applicantDetail.resumeScore?.explanation ?? '';

  const NOTPROVIDED = (
    <p className='text-xs text-neutrals60'>{t('notProvided')}</p>
  );

  const contactInfoList = [
    {
      icon: <PiPhoneLight className='text-neutrals100 text-xl' />,
      title: t('personalInformation.contact.phone'),
      value: applicantDetail.phone,
      link: false,
    },
    {
      icon: <PiEnvelope className='text-neutrals100 text-xl' />,
      title: t('personalInformation.contact.email'),
      value: applicantDetail.email,
      link: false,
    },
    {
      icon: <PiLinkedinLogo className='text-neutrals100 text-xl' />,
      title: t('personalInformation.contact.linkedIn'),
      value: applicantDetail.linkedIn,
      link: true,
    },
    {
      icon: <PiWhatsappLogo className='text-neutrals100 text-xl' />,
      title: t('personalInformation.contact.whatsapp'),
      value: applicantDetail.whatsapp,
      link: true,
    },
    {
      icon: <PiTelegramLogo className='text-neutrals100 text-xl' />,
      title: t('personalInformation.contact.telegram'),
      value: applicantDetail.telegram,
      link: true,
    },
    {
      icon: <SlLocationPin className='text-neutrals100 text-xl' />,
      title: t('personalInformation.location'),
      value: applicantDetail.location,
      link: false,
    },
  ];

  const tabsData = [
    {
      label: `Applicant Profile`,
      value: 'applicantProfile',
      desc: (
        <div className=''>
          <div className='flex flex-col gap-5'>
            {/* About */}
            <p className={`${titleStyle} capitalize font-epilogue `}>
              {t('personalInformation.about')}
            </p>
            <p className=' text-neutrals60 text-sm  '>
              {applicantDetail.aboutMe}
            </p>
            <hr className='py-2' />
            {/* skill */}
            <p className={`${titleStyle}  capitalize font-epilogue`}>
              {t('skillSets')}
            </p>
            <div className='flex gap-2 w-fit flex-wrap'>
              {applicantDetail.skills && !(applicantDetail.skills[0] === '[]')
                ? applicantDetail.skills?.map((value, index) => (
                    <Tag
                      key={index}
                      text={value}
                      textColor={'#C4897B'}
                      smallBorderRadius
                    />
                  ))
                : NOTPROVIDED}
            </div>
            <hr className='border-t border-gray-200' />

            {/* Resume */}
            <p className={`${titleStyle}  capitalize font-epilogue`}>
              {t('documents.resume')}
            </p>
            <div className='space-y-4'>
              {applicantDetail.resume_url ? (
                <a
                  target='_blank'
                  className='flex space-x-2 gap-2 w-fit flex-wrap cursor-pointer '
                  href={
                    applicantDetail.resume_url ||
                    applicantDetail.resumeFile.fileURL
                  }
                >
                  <div className=' bg-[#F8F8FD] rounded-lg p-2 flex items-center justify-center w-11 h-11 '>
                    <TbPdf size={25} color='#AAAFBE' />
                  </div>
                  <div>
                    <p className=' text-neutrals60 text-base'>
                      {applicantDetail.name + "'s Resume"}
                    </p>
                    <p className=' text-neutrals60 text-xs'>{`PDF ${resumeSizeInMB} Mb`}</p>
                  </div>
                  <BiLinkExternal className='text-[#26A4FF] text-xs' />
                </a>
              ) : (
                <div className='flex  gap-2 w-fit flex-wrap '>
                  <div className=' bg-[#F8F8FD] rounded-lg p-2 flex items-center justify-center w-11 h-11 '>
                    <TbPdf size={25} color='#AAAFBE' />
                  </div>
                  <div className='flex items-center '>{NOTPROVIDED} </div>
                </div>
              )}
              {applicantDetail.resumeScore &&
                applicantDetail.resumeScore?.score !== undefined &&
                applicantDetail.resumeScore?.explanation && (
                  <Card className='bg-gray-50 shadow-sm rounded-lg p-4'>
                    <CardBody className='flex flex-col font-poppins gap-2'>
                      <p className='font-poppins font-semibold'>
                        Resume Score:
                        <span
                          className={`ml-4 ${
                            numericScore > 75
                              ? 'text-teal-400'
                              : numericScore > 50
                              ? 'text-yellow-400'
                              : 'text-red-400'
                          }`}
                        >
                          {score} %
                        </span>
                      </p>
                      <Typography
                        variant='small'
                        className='italic text-gray-600'
                      >
                        <span className='font-semibold text-black'>
                          Resume Score Explantaion:
                        </span>{' '}
                        {explanation}
                      </Typography>
                    </CardBody>
                  </Card>
                )}
            </div>
            {/* Past Experiences Section */}
            <hr className='py-2' />

            <section>
              <PastExperiences
                id={applicantDetail.volunteerID}
                applicantName={applicantDetail.name}
              />
            </section>
          </div>
        </div>
      ),
    },
    {
      label: `Additional Responses`,
      value: 'applicantResponse',
      desc: (
        <AdditionalQuestionsResponses
          questions={opportunityData?.questions ?? []}
          responses={applicantDetail?.responses ?? {}}
        />
      ),
    },
    {
      label: 'Notes', // Label for the tab or section
      value: 'notes', // Unique identifier for the tab or section
      desc: (
        <div className='p-4 bg-white rounded-lg shadow-sm'>
          <Notes
            applicantId={applicantion_id} // Pass the applicant ID dynamically
          />
        </div>
      ),
    },
  ];

  const options = [
    applicationStatus === 'pending' && [
      <Option key='in-review' value='in-review'>
        In Review
      </Option>,
      <Option key='interview' value='interview'>
        Interview
      </Option>,
      <Option key='decline' value='declined'>
        Decline
      </Option>,
    ],
    applicationStatus === 'in-review' && [
      <Option key='interview' value='interview'>
        Interview
      </Option>,
      <Option key='decline' value='declined'>
        Decline
      </Option>,
    ],
    applicationStatus === 'interview' && [
      <Option key='offer' value='offer-extended'>
        Offer Extended
      </Option>,
      <Option key='decline' value='declined'>
        Decline
      </Option>,
    ],
    applicationStatus === 'offer-extended' && [
      <Option key='hire' value='hired'>
        Hire
      </Option>,
      <Option key='decline' value='declined'>
        Decline
      </Option>,
    ],
    applicationStatus === 'hired' && [
      <Option key='certify' value='certified'>
        Certify
      </Option>,
    ],
  ]
    .filter(Boolean)
    .flat();

  {
    return (
      <section className='font-epilogue container mx-auto py-5'>
        <PageTitle
          title={t('pageTitle')}
          onClick={() => router.back()}
          blockRightComponent
          rightComponent={
            <>
              {applicationStatus === 'certified' ? (
                <Button
                  color='amber'
                  variant='outlined'
                  size='sm'
                  onClick={onViewCertificateClick}
                  className='mr-2'
                >
                  View Certificate
                </Button>
              ) : applicationStatus === 'hired' ? (
                <Button
                  color='amber'
                  variant='outlined'
                  size='sm'
                  onClick={onCertifyClick}
                  className='mr-2'
                >
                  Certify
                </Button>
              ) : (
                <div className='w-56'>
                  <Select
                    color='amber'
                    size='lg'
                    onChange={(value) => handleStatusChange(value as string)}
                    label='Change Applicant Status'
                  >
                    {options.map((option) => option)}
                  </Select>
                </div>
              )}
            </>
          }
        />

        <main className='flex flex-col lg:flex-row gap-6 p-4 md:p-6'>
          {/* Left side */}
          <div className='rounded-2xl border border-gray-200 bg-white shadow-sm lg:basis-1/3 hover:shadow-md transition-shadow duration-200'>
            <div className='flex flex-col gap-y-2 pt-2'>
              <div className='p-6'>
                {/* profile */}
                <div className='flex gap-x-4 items-center'>
                  <Avatar
                    className='rounded-full w-20 h-20 md:w-24 md:h-24 border-2 border-white shadow-md'
                    src={getAvatar(applicantDetail?.name, undefined)}
                    alt={`${applicantDetail.name}'s profile`}
                  />
                  <div className='min-w-0'>
                    <h1 className='text-neutrals100 font-epilogue font-semibold text-xl md:text-2xl truncate'>
                      {applicantDetail.name}
                    </h1>
                    <p className='text-neutrals80 text-sm md:text-base truncate'>
                      {applicantDetail.currentPos || 'No position specified'}
                    </p>
                    <div className='mt-2'>
                      <StatusBadge status={applicationStatus} />
                    </div>
                  </div>
                </div>
              </div>
              <hr className='py-2 mx-10' />
              {/* Date and location */}
              <div className='py-6 flex flex-col gap-4 px-10 '>
                <div className='flex flex-col sm:flex-row lg:flex-row text-sm md:text-base gap-2'>
                  <p className='text-neutrals60 basis-1/2'>
                    {t('dateApplied')}
                  </p>
                  <p className='text-neutrals100 basis-1/2'>
                    {dateFormat(applicantDetail.dateApplied, 'mmm dS, yyyy')}
                  </p>
                </div>
                <div className='flex flex-col sm:flex-row lg:flex-row text-sm md:text-base gap-2'>
                  <p className='basis-1/2 text-neutrals60'>{t('status')}</p>
                  <div className='basis-1/2'>
                    <StatusBadge status={applicationStatus} />
                  </div>
                </div>
                <hr className='text-lightGrey' />

                <div className='flex flex-col sm:flex-row lg:flex-row text-sm md:text-base gap-2'>
                  <p className='text-neutrals60 basis-1/2'>Opportunity Title</p>
                  <p className='text-neutrals100 basis-1/2'>
                    {opportunityData?.title}
                  </p>
                </div>
                <div className='flex flex-col sm:flex-row lg:flex-row text-sm md:text-base gap-2'>
                  <p className='basis-1/2 text-neutrals60'>
                    Opportunity Status
                  </p>
                  <p className=' text-neutrals100 capitalize basis-1/2'>
                    {opportunityData?.status}
                  </p>
                </div>
              </div>
              <hr className='text-lightGrey py-2 mx-10' />​{/* contacts */}
              <p className={`${titleStyle} pl-10 pb-2 `}>
                {t('personalInformation.contact.title')}
              </p>
              <div className='flex flex-col gap-5 px-10'>
                {contactInfoList.map((item, index) => (
                  <OrgInfoWithIcon
                    key={index}
                    icon={
                      <div className=' bg-[#E9EBFD] rounded-full p-2  flex justify-center items-center '>
                        {item.icon}
                    </div>
                    }
                    title={item.title}
                    value={
                      !item.value ? (
                        NOTPROVIDED
                      ) : item.link ? (
                        <a
                          target='_blank'
                          className='flex space-x-2'
                          href={item.value}
                        >
                          <p className=' truncate w-60'>{item.value}</p>
                        </a>
                      ) : (
                        item.value
                      )
                    }
                    valueStyle='text-neutrals80'
                    titleStyle='text-neutrals100 font-semibold'
                  />
                ))}
              </div>
              ​
            </div>
          </div>
          {/* Right side */}
          <div className='rounded-2xl border border-gray-200 bg-white shadow-sm basis-2/3 overflow-hidden hover:shadow-md transition-shadow duration-200'>
            <UnderlineTabs data={tabsData} />​
          </div>
        </main>

        {showConfirmInReviewPopup && (
          <ApplicantStatusChangePopup
            title={t('confirmationPopup.title')}
            onConfirm={handleInReview}
            onCancel={onInReviewClick}
            subTitle={t('confirmationPopup.inReview')}
            buttonText={t('inReviewButtonText')}
          />
        )}
        {showConfirmInterviewPopup && (
          <ApplicantStatusChangePopup
            title={t('confirmationPopup.title')}
            onConfirm={handleInterview}
            onCancel={onInterviewClick}
            subTitle='Move applicant to interview stage'
            buttonText='Schedule Interview'
          />
        )}
        {showConfirmOfferPopup && (
          <ApplicantStatusChangePopup
            title={t('confirmationPopup.title')}
            onConfirm={handleOffer}
            onCancel={onOfferClick}
            subTitle='Extend offer to applicant'
            buttonText='Extend Offer'
          />
        )}
        {showConfirmHirePopup && (
          <ApplicantStatusChangePopup
            title={t('confirmationPopup.title')}
            onConfirm={handleHire}
            onCancel={onHireClick}
            subTitle='Hire the applicant'
            buttonText='Hire Applicant'
          />
        )}
        {showConfirmDeclinePopup && (
          <ApplicantStatusChangePopup
            title={t('confirmationPopup.title')}
            onConfirm={handleDecline}
            onCancel={onDeclineClick}
            subTitle={t('confirmationPopup.declined')}
            buttonText={t('declineButtonText')}
          />
        )}
        {showConfirmCertifyPopup && (
          <ApplicantStatusChangePopup
            title={t('confirmationPopup.title')}
            onConfirm={handleCertify}
            onCancel={onCertifyClick}
            subTitle='Certify the applicant'
            buttonText='Certify Applicant'
          />
        )}
        {isReviewPopupOpen && (
          <RateAndReviewPopup
            reviewerId={opportunityData?.orgID || ''}
            handleOpenPopup={handleOpenReviewPopup}
            recipientName={applicantDetail.name}
            recipientId={applicantDetail.volunteerID}
            reviewerName={opportunityData?.orgName || ''}
            reviewerProfilePicUrl={opportunityData?.logoUrl || ''}
            eventId={opportunityData?.id || ''}
          />
        )}
      </section>
    );
  }
}

export default ApplicantDetail;
