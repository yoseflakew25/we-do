import InterestCard from './IntrestCard';
import ThreeDotsLoading from '@/components/ThreeDotsLoading';
import OrgInfoWithIcon from '@/features/organization/components/OrgInfoWithIcon';
import OrgTitleAndDetail from '@/features/organization/components/OrgTitleAndDetail';
import { Tooltip, Typography } from '@material-tailwind/react';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import React from 'react';
import {
  BiLinkExternal,
  BiLogoFacebook,
  BiLogoInstagram,
  BiLogoLinkedin,
  BiLogoTelegram,
  BiLogoWhatsapp,
  BiTargetLock,
  BiPhone,
  BiGlobe,
  BiMailSend,
} from 'react-icons/bi';
import { BsBank } from 'react-icons/bs';
import { FaUnlink } from 'react-icons/fa';
import { MdLocationPin } from 'react-icons/md';

export interface OrgDetailProfileSectionProps {
  description: string;
  mission: string;
  vission: string;
  futurePlan: string;
  orgArea: string[];
  orgName: string;
  orgId: string;
  location: string;
  primaryPhone: string;
  secondaryPhone: string;
  email: string;
  facebook: string;
  instagram: string;
  linkedIn: string;
  whatsapp: string;
  telegram: string;
  website: string;
  geoLocation: { latitude: number; longitude: number };
  bankInfo: { bankName: string; bankAccount: string }[];
  donateWebsite: string;
  interestStatus: string;
}

const OrgDetailProfileSection: React.FC<OrgDetailProfileSectionProps> = ({
  description,
  mission,
  vission,
  futurePlan,
  orgArea,
  location,
  geoLocation,
  primaryPhone,
  secondaryPhone,
  email,
  facebook,
  instagram,
  linkedIn,
  whatsapp,
  website,
  telegram,
  bankInfo,
  donateWebsite,
  orgId,
  interestStatus,
}) => {
  const t = useTranslations('OrganizationSignupPage.reviewSection');
  const { data: user } = useSession();
  const contacts = [
    {
      title: `${t('labelTitles.primaryPhoneNumber')}`,
      value: primaryPhone,
      icon: <BiPhone className='text-lighterPrimary text-2xl' />,
    },
    {
      title: `${t('labelTitles.secondaryPhoneNumber')}`,
      value: secondaryPhone,
      icon: <BiPhone className='text-lighterPrimary text-2xl' />,
    },
    {
      title: `${t('labelTitles.email')}`,
      value: email,
      icon: <BiMailSend className='text-lighterPrimary text-2xl' />,
    },
    {
      title: `${t('labelTitles.website')}`,
      value: (
        <a target='_blank' className='flex space-x-2' href={website}>
          <span className='truncate'>{website}</span>
          <BiLinkExternal className='text-lighterPrimary text-xs' />
        </a>
      ),
      icon: <BiGlobe className='text-lighterPrimary text-2xl' />,
    },
  ];

  const socials = [
    {
      title: `${t('labelTitles.facebook')}`,
      value: facebook,
      icon: <BiLogoFacebook className='text-lighterPrimary text-2xl' />,
    },
    {
      title: `${t('labelTitles.instagram')}`,
      value: instagram,
      icon: <BiLogoInstagram className='text-lighterPrimary text-2xl' />,
    },
    {
      title: `${t('labelTitles.telegram')}`,
      value: telegram,
      icon: <BiLogoTelegram className='text-lighterPrimary text-2xl' />,
    },
    {
      title: `${t('labelTitles.linkedIn')}`,
      value: linkedIn,
      icon: <BiLogoLinkedin className='text-lighterPrimary text-2xl' />,
    },
    {
      title: `${t('labelTitles.whatsapp')}`,
      value: whatsapp,
      icon: <BiLogoWhatsapp className='text-lighterPrimary text-2xl' />,
    },
  ];
  const mapContainerStyle = {
    width: '100%',
    height: '300px',
  };
  type Library = 'places';
  type UseLoadScriptOptions = {
    id: string;
    googleMapsApiKey: string;
    libraries: Library[];
  };

  const mapOptions: UseLoadScriptOptions = {
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
    libraries: ['places'] as Library[], // Ensure this matches the libraries you need
  };
  const center =
    geoLocation && Object.keys(geoLocation).length > 0
      ? {
          lat: geoLocation.latitude,
          lng: geoLocation.longitude,
        }
      : {
          lat: 0,
          lng: 0,
        };
  const donationOptions: { title: any; value: any; icon: any }[] = [];

  if (bankInfo.length > 0) {
    bankInfo.forEach((bank) => {
      donationOptions.push({
        title: bank.bankName,
        value: bank.bankAccount,
        icon: <BsBank className='text-lighterPrimary text-2xl' />,
      });
    });
  }

  if (donateWebsite) {
    donationOptions.push({
      title: 'Donation website Link',
      value: donateWebsite,
      icon: <FaUnlink className='text-lighterPrimary text-2xl' />,
    });
  }

  const { isLoaded, loadError } = useJsApiLoader(mapOptions);

  if (loadError) {
    return <p>Google Maps API key is missing or invalid.</p>;
  }
  if (!isLoaded) {
    return (
      <div className='flex justify-center items-center h-40'>
        <ThreeDotsLoading />
      </div>
    );
  }

  return (
    <>
      {/* Details */}
      <div className='flex flex-col gap-x-12 lg:grid lg:grid-cols-3 lg:py-10'>
        {/* Left side: Profile Mission Vission   */}
        <div className='basis-2/3 flex flex-col gap-5 lg:col-span-2'>
          <OrgTitleAndDetail
            title={t('labelTitles.about')}
            detail={description}
          />
          <div className='grid grid-cols-1 gap-x-12 gap-6 md:grid-cols-2 '>
            <OrgTitleAndDetail
              title={t('labelTitles.mission')}
              detail={mission}
            />
            <OrgTitleAndDetail
              title={t('labelTitles.vision')}
              detail={vission}
            />
          </div>
          <OrgTitleAndDetail
            title={t('labelTitles.futurePlan')}
            detail={futurePlan}
          />
          {user?.user.role == 'user' && (
            <InterestCard interestStatus={interestStatus} orgId={orgId} />
          )}

          {/*  Location*/}
          <OrgTitleAndDetail
            title={t('labelTitles.googleMaps')}
            detailElement={
              center.lat === 0 && center.lng === 0 ? (
                <p>Google maps location not found</p>
              ) : (
                <div style={{ height: '300px', width: '100%' }}>
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={16}
                  >
                    <MarkerF position={center} />
                  </GoogleMap>
                </div>
              )
            }
          />
        </div>

        {/* Right side:  Location, contact and handles */}
        <div className='flex flex-col h-fit space-y-4'>
          {/* Cause Area */}
          <div className='shadow rounded-md'>
            <OrgTitleAndDetail
              title={t('labelTitles.areaOfCause')}
              detailElement={
                <div className='flex flex-col '>
                  {orgArea.map((value, index) => (
                    <OrgInfoWithIcon
                      key={index}
                      value={value}
                      icon={
                        <BiTargetLock className='text-lighterPrimary text-2xl' />
                      }
                    />
                  ))}
                </div>
              }
            />
          </div>

          {/* Location */}
          <div className='shadow rounded-md'>
            <OrgTitleAndDetail
              title={t('labelTitles.location')}
              detailElement={
                <Tooltip
                  animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0, y: 0 },
                  }}
                  className='border border-blue-gray-50 bg-white px-4 shadow-black/10'
                  content={
                    <div>
                      <Typography
                        variant='small'
                        color='blue-gray'
                        className='font-normal opacity-80'
                      >
                        {location}
                      </Typography>
                    </div>
                  }
                  placement='top'
                >
                  <OrgInfoWithIcon
                    value={location}
                    icon={
                      <MdLocationPin className='text-lighterPrimary text-2xl' />
                    }
                  />
                </Tooltip>
              }
            />
          </div>

          {/* Contact */}
          <div className='shadow rounded-md'>
            <OrgTitleAndDetail
              title={t('labelTitles.contact')}
              detailElement={
                <div className='flex flex-col'>
                  {contacts.map(
                    (props) =>
                      props.value && (
                        <OrgInfoWithIcon
                          key={props.title}
                          value={props.value}
                          title={props.title}
                          icon={props.icon}
                        />
                      )
                  )}
                </div>
              }
            />
          </div>

          {/* Social Media handles */}
          <div className='shadow rounded-md'>
            <OrgTitleAndDetail
              title={t('labelTitles.socialMedia')}
              detailElement={
                <div className='flex flex-col'>
                  {socials.map(
                    ({ title, ...props }) =>
                      props.value && (
                        <OrgInfoWithIcon
                          key={title}
                          value={
                            <a
                              target='_blank'
                              className='flex space-x-2'
                              href={props.value}
                            >
                              <span className='truncate'>{title}</span>
                              <BiLinkExternal className='text-lighterPrimary text-xs' />
                            </a>
                          }
                          icon={props.icon}
                        />
                      )
                  )}
                </div>
              }
            />
          </div>

          {/* Donation Info section */}
          <div className='shadow rounded-md'>
            {donationOptions.length > 0 && (
              <div className='flex flex-col  py-4 rounded-2xl'>
                <OrgTitleAndDetail title='Donations' />
                <div className='flex flex-col'>
                  {donationOptions.map((item, index) => (
                    <OrgInfoWithIcon key={index} {...item} truncate />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrgDetailProfileSection;
