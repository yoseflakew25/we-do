'use client';

import { VolunteerApplicationForm } from '../components/ApplicationFormPopup';
import OpportunityDetailTopSection from './OpportunityDetailTopSection';
import { useCheckUserApplicationStatusQuery } from '@/app/api/slices/opportunity-api-slice';
import { useGetOrgDetailByIDQuery } from '@/app/api/slices/org-api-slice';
import { useGetProfileQuery } from '@/app/api/slices/volunteer-api-slice';
import { OpportunityDetail } from '@/app/api/types';
import ErrorPage from '@/components/ErrorPage';
import SocialShareButtons from '@/components/SocialShareButtons';
import { UnderlineTabs } from '@/features/organization/components/UnderlineTabs';
import OpportunityInfoOtherDetails from '@/features/organization/opportunities/view/OpportunityInfoOtherDetails';
import {
  Button,
  Popover,
  PopoverHandler,
  PopoverContent,
  Tooltip,
  IconButton,
} from '@material-tailwind/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ComponentProps, useEffect, useState } from 'react';
import { AiOutlineShareAlt } from 'react-icons/ai';
import { FaArrowRight } from 'react-icons/fa6';
import { TiTick } from 'react-icons/ti';

const OpportunityDetails: React.FC<{
  formData: OpportunityDetail;
}> = ({ formData: opportunityResponse }) => {
  // IDs for testing
  const shareOptions = `share-options`;
  const submitApplicationButton = `apply-button`;

  const [showApplicationPopup, setShowApplicationPopup] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useSession();
  const { data: userProfileData } = useGetProfileQuery();
  const sharableUrl =
    typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
  const socials = SocialShareButtons({ sharableUrl });
  const {
    data: orgProfileData,
    isFetching,
    isError,
  } = useGetOrgDetailByIDQuery(opportunityResponse.orgID);

  // Check if the user has already applied to this opportunity when the component mounts
  const { data: _applied, isError: alreadyApplied } =
    useCheckUserApplicationStatusQuery(opportunityResponse.id);

  useEffect(() => {
    if (alreadyApplied) {
      setIsSuccess(true);
    }
  }, [alreadyApplied]);

  const onButtonsClick = () => {
    setShowApplicationPopup(!showApplicationPopup);
  };

  const handleApplyClick = () => {
    if (
      opportunityResponse.questions &&
      opportunityResponse.questions.length > 0
    ) {
      // Navigate to the apply page
      router.push(`/talent/opportunities/${opportunityResponse.id}/apply`);
    } else {
      // Show the application popup
      setShowApplicationPopup(true);
    }
  };

  const actions = [
    {
      children: (
        <Popover placement='bottom'>
          <PopoverHandler>
            <div className='flex items-center cursor-pointer font-poppins capitalize text-white'>
              <AiOutlineShareAlt className='h-4 w-4 mr-1' />
              Share
            </div>
          </PopoverHandler>
          <PopoverContent className='flex gap-2'>
            {socials.map(({ name, renderButton, renderIcon }) => (
              <Tooltip content={name} key={name}>
                {renderButton({
                  url: sharableUrl,
                  children: (
                    <IconButton
                      className='rounded-full overflow-hidden'
                      size='sm'
                    >
                      {renderIcon({})}
                    </IconButton>
                  ),
                })}
              </Tooltip>
            ))}
          </PopoverContent>
        </Popover>
      ),
      className: 'rounded-full h-fit bg-primary py-3 px-4',
      'data-testid': shareOptions,
    },
    !user && {
      children: (
        <Link href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}>
          <span className='flex items-center gap-2 rounded-full cursor-pointer !capitalize font-poppins bg-green text-white px-4 py-3'>
            Apply
            <FaArrowRight className='text-white' />
          </span>
        </Link>
      ),
      variant: 'text',
      className: 'rounded-full h-fit p-3 text-bgPrimary hover:bg-transparent',
    },
    user?.user.role === 'user' &&
      isSuccess !== true && {
        children: (
          <div
            className='rounded-full bg-amber-500 text-white p-2 text-center cursor-pointer'
            onClick={handleApplyClick}
          >
            Apply
          </div>
        ),
        color: 'amber',
        className: 'rounded-full h-fit',
        'data-testid': submitApplicationButton,
      },
    user?.user.role === 'user' &&
      isSuccess === true && {
        children: (
          <div className='flex items-center capitalize cursor-not-allowed'>
            <TiTick className='h-4 w-4 mr-1' />
            Application Submitted
          </div>
        ),
        color: 'teal',
        className: 'rounded-full h-fit cursor-not-allowed',
        variant: 'text',
      },
  ];

  // filter out undefined elements
  const filteredActions = actions.filter(
    (action) => action !== undefined && action !== false
  ) as ComponentProps<typeof Button>[];

  if (isFetching) {
    return <div></div>;
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
  ];

  return (
    <div className='md:container'>
      <OpportunityDetailTopSection
        opportunityResponse={opportunityResponse}
        refetch={() => {}}
        orgDetail={orgDetail}
        actions={filteredActions}
      />
      <div>
        <div className=' mx-2'>
          <UnderlineTabs data={tabsData} />
        </div>
        {/* <OpportunityInfoOtherDetails formData={opportunityResponse} /> */}

        {showApplicationPopup &&
          (!opportunityResponse.questions ||
            opportunityResponse.questions?.length === 0) && (
            <VolunteerApplicationForm
              setSuccess={setIsSuccess}
              opportunityID={opportunityResponse.id}
              onConfirm={onButtonsClick}
              onCancel={onButtonsClick}
              orgLogo={orgDetail.LogoUrl}
              opportunityTitle={opportunityResponse.title}
              orgName={orgDetail.orgName}
              orgId={orgDetail.id}
              opType={opportunityResponse.opType}
              userProfileData={userProfileData?.data}
            />
          )}
      </div>
    </div>
  );
};

export default OpportunityDetails;
