'use client';

import OrgInfoWithIcon from '../../components/OrgInfoWithIcon';
import OrgTitleAndDetail from '../../components/OrgTitleAndDetail';
import { UnderlineTabs } from '../../components/UnderlineTabs';
import { OrgFormData } from '@/app/api/types';
import OrgDetailReviewsListSection from '@/features/volunteer/ngos/OrgDetailReviewsListSection';
import { useOrgLogo } from '@/hook';
import { Avatar, Typography } from '@material-tailwind/react';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { AiOutlineFire } from 'react-icons/ai';
import {
  BiLogoFacebook,
  BiLogoInstagram,
  BiLogoLinkedin,
  BiLogoTelegram,
  BiLogoWhatsapp,
  BiLogoEdge,
  BiHistory,
  BiTargetLock,
  BiLinkExternal,
} from 'react-icons/bi';
import { BsBank } from 'react-icons/bs';
import { FaLink } from 'react-icons/fa6';
import { GoLinkExternal } from 'react-icons/go';
import { MdLocationPin, MdOutlineMarkEmailUnread } from 'react-icons/md';
import { PiBuildingsLight, PiPhoneLight } from 'react-icons/pi';

function OrgProfile({
  formData: {
    id,
    file,
    files,
    credentials,
    orgName,
    orgType,
    shortHandName,
    oldName,
    year: yearFounded,
    geoLocation,
    orgArea,
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
    donateWebsite,
    bankInfo,
  },
  isReview,
  showAvatar,
}: {
  formData: OrgFormData;
  showAvatar?: boolean;
  isReview?: boolean;
}) {
  const getOrgLogo = useOrgLogo();
  const t = useTranslations('OrganizationSignupPage.reviewSection');
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

  const contacts = [
    {
      title: `${t('labelTitles.primaryPhoneNumber')}`,
      value: primaryPhone,
      icon: <PiPhoneLight className='text-lighterPrimary text-2xl' />,
    },
    {
      title: `${t('labelTitles.secondaryPhoneNumber')}`,
      value: secondaryPhone,
      icon: <PiPhoneLight className='text-lighterPrimary text-2xl' />,
    },
    {
      title: `${t('labelTitles.email')}`,
      value: email,
      icon: (
        <MdOutlineMarkEmailUnread className='text-lighterPrimary text-2xl' />
      ),
    },
    {
      title: `${t('labelTitles.website')}`,
      value: website && (
        <a target='_blank' className='flex space-x-1' href={website}>
          <span className='truncate'>{website}</span>
          <BiLinkExternal className='text-lighterPrimary text-xs shrink-0' />
        </a>
      ),
      icon: <BiLogoEdge className='text-lighterPrimary text-2xl' />,
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
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);

  useEffect(() => {
    if (isReview) {
      const reader = new FileReader();

      if (file) {
        reader.onload = function () {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }, [isReview, setPreview, file]);

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
  //add bank information to the donationOptions array
  if (bankInfo.length > 0) {
    bankInfo.forEach((bank) => {
      if (bank.bankAccount) {
        donationOptions.push({
          title: bank.bankName,
          value: bank.bankAccount,
          icon: <BsBank className='text-lighterPrimary text-2xl' />,
        });
      }
    });
  }

  if (donateWebsite) {
    donationOptions.push({
      title: 'Donation Website',
      value: donateWebsite && (
        <a target='_blank' className='flex space-x-1' href={donateWebsite}>
          <span className='truncate'>{donateWebsite}</span>
          <BiLinkExternal className='text-lighterPrimary text-xs shrink-0' />
        </a>
      ),
      icon: <FaLink className='text-lighterPrimary text-2xl' />,
    });
  }

  const tabs = [
    {
      label: `Profile`,
      value: 'profile',
      desc: (
        <div className='flex flex-col gap-x-12 lg:grid lg:grid-cols-3 lg:py-10'>
          {/* Left side: Profile Mission Vision   */}
          <div className='basis-2/3 flex flex-col gap-5 lg:col-span-2'>
            {/*  Organization Profile*/}
            <OrgTitleAndDetail
              title={t('labelTitles.about')}
              detail={description}
            />
            <div className='grid grid-cols-1 gap-x-12 gap-6 md:grid-cols-2 '>
              <div className='py-4'>
                <OrgTitleAndDetail
                  title={t('labelTitles.mission')}
                  detail={mission}
                />
              </div>
              <div className='py-4'>
                <OrgTitleAndDetail
                  title={t('labelTitles.vision')}
                  detail={vission}
                />
              </div>
              <OrgTitleAndDetail
                title={t('labelTitles.futurePlan')}
                detail={futurePlan}
              />
              <div className='mt-5'>
                {credentials && Object.entries(credentials).length > 0 && (
                  <OrgTitleAndDetail
                    title={t('labelTitles.certificateOfRegistration')}
                  />
                )}
                {files &&
                  files.map((file, index) => (
                    <div
                      key={index}
                      className='bg-white shadow-none rounded-lg p-4 '
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex'>
                          <Link
                            href={URL.createObjectURL(file)}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex flex-row items-center space-x-2 cursor-pointer'
                          >
                            <Typography className='text-sm text-tertiary font-normal'>
                              {file.name}
                            </Typography>
                            <GoLinkExternal size={15} color='#26A4FF' />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}

                {credentials &&
                  Object.entries(credentials).map(
                    ([key, { fileName, fileURL }]) => (
                      <div
                        key={key}
                        className='bg-white shadow-none rounded-lg p-4 '
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex'>
                            <Link
                              href={fileURL}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='flex flex-row items-center space-x-2 cursor-pointer'
                            >
                              <Typography className='font-poppins text-sm text-tertiary font-normal'>
                                {fileName}
                              </Typography>
                              <GoLinkExternal size={15} color='#26A4FF' />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )
                  )}
              </div>
            </div>
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
          <div className='flex flex-col py-4'>
            {/* Cause Area */}
            <div className='shadow mb-4 rounded-md'>
              <OrgTitleAndDetail
                title={t('labelTitles.areaOfCause')}
                detailElement={
                  <div className='flex flex-col'>
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
            <div className='shadow mb-4 rounded-md'>
              <OrgTitleAndDetail
                title={t('labelTitles.location')}
                detailElement={
                  <OrgInfoWithIcon
                    value={location}
                    icon={
                      <MdLocationPin className='text-lighterPrimary text-2xl' />
                    }
                  />
                }
              />
            </div>

            {/* Contact */}
            <div className='shadow mb-4 rounded-md'>
              <OrgTitleAndDetail
                title={t('labelTitles.contact')}
                detailElement={
                  <div className='flex flex-col'>
                    {contacts.map(
                      (props) =>
                        props.value && (
                          <OrgInfoWithIcon
                            key={props.title}
                            {...props}
                            truncate
                          />
                        )
                    )}
                  </div>
                }
              />
            </div>

            {/* Social Media handles */}
            <div className='shadow mb-4 rounded-md'>
              <OrgTitleAndDetail
                title={t('labelTitles.socialMedia')}
                detailElement={
                  <div className='flex flex-col space-y-4'>
                    {socials.map(
                      ({ title, ...props }) =>
                        props.value && (
                          <OrgInfoWithIcon
                            key={title}
                            title={
                              <a
                                target='_blank'
                                className='flex space-x-2 text-ellipsis'
                                href={props.value}
                              >
                                <span>{title}</span>
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

            {donationOptions.length > 0 && (
              <div className='flex flex-col shadow rounded-md'>
                <OrgTitleAndDetail
                  title='Donations'
                  detailElement={
                    <div className='flex flex-col'>
                      {donationOptions.map((item, index) => (
                        <OrgInfoWithIcon key={index} {...item} truncate />
                      ))}
                    </div>
                  }
                />
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];

  if (!isReview) {
    tabs.push({
      label: `Reviews`,
      value: 'reviews',
      desc: <OrgDetailReviewsListSection orgName={orgName} orgId={id || ''} />,
    });
  }

  const { isLoaded, loadError } = useJsApiLoader(mapOptions);

  if (loadError) {
    return <p>Google Maps API key is missing or invalid.</p>;
  }

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <section className='font-epilogue text-justify'>
      {/* About */}
      <div className='mx-auto rounded-2xl border-2 border-lightGrey md:p-6 p-5 sm:ml-7'>
        <div className='flex items-center gap-3 mb-3 text-left'>
          {showAvatar && (
            <Avatar
              withBorder
              className='border-secondary p-0.5'
              variant='rounded'
              size='lg'
              alt={orgName}
              src={getOrgLogo(isReview ? (preview as string) : logoUrl)}
            />
          )}

          {/* name*/}
          <h2 className='text-neutrals100 capitalize sm:text-2xl font-black'>
            {orgName}

            {shortHandName && (
              <span className='text-neutrals60 uppercase sm:text-xl font-black pl-1 '>
                ({shortHandName})
              </span>
            )}
          </h2>
        </div>
        {/* small details */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
          {headerItems.map((item) => (
            <OrgInfoWithIcon key={item.title} {...item} truncate />
          ))}
        </div>
      </div>

      <UnderlineTabs data={tabs} />

      {/* Details */}
    </section>
  );
}

export default OrgProfile;
