'use client';

import Header from '../components/Header';
import { OrganizationProfile } from '@/app/api/types';
import { Footer } from '@/components/Footer';
import OrgProfile from '@/features/organization/signup/components/OrgProfile';
import { useOrgLogo } from '@/hook';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@material-tailwind/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { MdLogin } from 'react-icons/md';

const ProfilePage: React.FC<{
  orgDetail: OrganizationProfile;
  viewOnly?: boolean;
}> = ({ orgDetail, viewOnly }) => {
  const t = useTranslations('orgProfile');
  const router = useRouter();
  const pathname = usePathname();
  const getOrgLogo = useOrgLogo();

  return (
    <>
      {/* header */}
      {viewOnly ? (
        <Header
          logoUrl='/assets/akil-logo.png'
          logoWidth={120}
          title=''
          rightComponent={
            <Link href={`/login`}>
              <Button
                variant='text'
                size='lg'
                type='submit'
                color='amber'
                className='text-bgPrimary flex sm:border-2 p-2 capitalize items-center gap-1  whitespace-nowrap'
              >
                Login as an Organization <MdLogin size={18} />
              </Button>
            </Link>
          }
        />
      ) : (
        <Header
          logoUrl={getOrgLogo(orgDetail.LogoUrl)}
          title={orgDetail.orgName}
          rightComponent={
            <Button
              variant='text'
              type='submit'
              size='sm'
              color='amber'
              className='text-bgPrimary flex sm:border-2 p-2 rounded-full border-primary/40  whitespace-nowrap'
              onClick={() => {
                router.push(`${pathname}/edit`);
              }}
            >
              <FontAwesomeIcon
                size='lg'
                className='mr-2 my-auto '
                icon={faEdit}
              />
              <span className='hidden sm:block my-auto text-lg capitalize'>
                {t('headerButtonText')}
              </span>
            </Button>
          }
        />
      )}
      <div className='container mx-auto p-6'>
        {!viewOnly && (
          <h1 className='font-poppins font-black text-2xl sm:text-3xl  text-neutrals100'>
            {t('title')}
          </h1>
        )}
        <div className='pt-10'>
          <OrgProfile formData={orgDetail} showAvatar={viewOnly} />
        </div>
      </div>
      {viewOnly && <Footer />}
    </>
  );
};

export default ProfilePage;
