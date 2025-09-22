'use client';

import OrgDetailOpportunitySection from './OrgDetailOpportunitySection';
import OrgDetailProfileSection from './OrgDetailProfileSection';
import OrgDetailReviewsListSection from './OrgDetailReviewsListSection';
import { OrgFormData } from '@/app/api/types';
import OrgInfoWithIcon from '@/features/organization/components/OrgInfoWithIcon';
import { UnderlineTabs } from '@/features/organization/components/UnderlineTabs';
import { useOrgLogo } from '@/hook';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, IconButton, Typography } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React from 'react';
import { AiOutlineFire } from 'react-icons/ai';
import { BiHistory } from 'react-icons/bi';
import { PiBuildingsLight } from 'react-icons/pi';

function OrganizationDetailsForVolunteers({
  formData: {
    id,
    orgName,
    shortHandName,
    oldName,
    year: yearFounded,
    orgArea,
    orgType,
    geoLocation,
    ngoType,
    description,
    mission,
    vission,
    futurePlan,
    location,
    primaryPhone,
    secondaryPhone,
    email,
    website,
    facebook,
    linkedIn,
    instagram,
    telegram,
    whatsapp,
    LogoUrl: logoUrl,
    average_response_time,
    bankInfo,
    donateWebsite,
    interestStatus,
  },
}: {
  formData: OrgFormData;
}) {
  const getOrgLogo = useOrgLogo();
  const t = useTranslations('OrganizationSignupPage.reviewSection');
  const router = useRouter();
  const convertSecondsToReadableTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(seconds / (24 * 3600));
    const weeks = Math.floor(seconds / (7 * 24 * 3600));
    const months = Math.floor(seconds / (30 * 24 * 3600));
    const years = Math.floor(seconds / (365 * 24 * 3600));

    if (seconds < 3600) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else if (seconds < 24 * 3600) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else if (seconds < 7 * 24 * 3600) {
      return `${days} day${days !== 1 ? 's' : ''}`;
    } else if (seconds < 30 * 24 * 3600) {
      return `${weeks} week${weeks !== 1 ? 's' : ''}`;
    } else if (seconds < 365 * 24 * 3600) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''}`;
    }
  };

  const responseTimeReadable = convertSecondsToReadableTime(
    average_response_time
  );

  const headerItems = [
    {
      title: `${t('labelTitles.yearFounded')}`,
      value: yearFounded.toString(),
      icon: <AiOutlineFire className='text-lighterPrimary text-2xl' />,
    },
    {
      title: `${t('labelTitles.ngoType')}`,
      value: ngoType,
      icon: <PiBuildingsLight className='text-lighterPrimary text-2xl' />,
    },
    {
      title: `${t('labelTitles.oldName')}`,
      value: oldName || <span className='text-gray-400 font-light'>None</span>,
      icon: <BiHistory className='text-lighterPrimary text-2xl' />,
    },
    {
      title: `${t('labelTitles.organizationType')}`,
      value: orgType,
      icon: <PiBuildingsLight className='text-lighterPrimary text-2xl' />,
    },
  ];

  return (
    <section className='container font-epilogue text-justify mt-20 md:mt-4'>
      {/* About */}
      <div className='rounded-2xl border-2  md:p-6 p-5 mx-4'>
        <div className='flex items-center gap-3 mb-3 text-left'>
          <IconButton
            className='rounded-full md:mr-2'
            variant='text'
            size='lg'
            onClick={() => router.back()}
          >
            <FontAwesomeIcon size='xl' icon={faArrowLeft} />
          </IconButton>
          <Avatar
            withBorder
            className='border-secondary p-0.5'
            variant='rounded'
            size='lg'
            alt={orgName}
            src={getOrgLogo(logoUrl)}
          />
          <div className='flex-col'>
            {/* name*/}
            <h2 className='text-primary capitalize text-md font-bold sm:text-xl md:text-2xl sm:font-black'>
              {orgName}

              {shortHandName && (
                <span className='text-tertiary font-poppins uppercase text-sm sm:text-xl font-black pl-1 '>
                  ({shortHandName})
                </span>
              )}
            </h2>
            {responseTimeReadable !== '0 minutes' && (
              <Typography className='font-poppins text-xs sm:text:sm text-tertiary'>
                This NGO usually takes {responseTimeReadable} to respond
              </Typography>
            )}
          </div>
        </div>

        {/* small details */}
        <div className='grid grid-cols-2 lg:grid-cols-4'>
          {headerItems.map((item) => (
            <OrgInfoWithIcon key={item.title} {...item} truncate />
          ))}
        </div>
      </div>

      <UnderlineTabs
        data={[
          {
            label: `Profile`,
            value: 'profile',
            desc: (
              <OrgDetailProfileSection
                description={description}
                mission={mission}
                vission={vission}
                futurePlan={futurePlan}
                orgArea={orgArea}
                orgName={orgName}
                geoLocation={geoLocation || { latitude: 0, longitude: 0 }}
                orgId={id || ''}
                website={website || ''}
                location={location}
                primaryPhone={primaryPhone}
                secondaryPhone={secondaryPhone || ''}
                email={email}
                facebook={facebook || ''}
                instagram={instagram || ''}
                linkedIn={linkedIn || ''}
                whatsapp={whatsapp || ''}
                telegram={telegram || ''}
                bankInfo={bankInfo}
                donateWebsite={donateWebsite || ''}
                interestStatus={interestStatus}
              />
            ),
          },
          {
            label: `Opportunities`,
            value: 'Opportunities',
            desc: <OrgDetailOpportunitySection orgId={id || ''} />,
          },

          {
            label: `Reviews`,
            value: 'reviews',
            desc: (
              <OrgDetailReviewsListSection orgName={orgName} orgId={id || ''} />
            ),
          },
        ]}
      />

      {/* Details */}
    </section>
  );
}

export default OrganizationDetailsForVolunteers;
