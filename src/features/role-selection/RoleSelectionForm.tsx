'use client';

import { useSetRoleMutation } from '@/app/api/slices/api-slice';
import AuthLeftSection from '@/components/AuthLeftSection';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

function RoleSelectionForm() {
  const t = useTranslations('RoleSelectionPage');
  const [setRole] = useSetRoleMutation();
  const router = useRouter();
  const { data: session, update } = useSession();

  const [showTooltip, setShowTooltip] = useState({
    volunteer: false,
    organization: false,
  });

  const handleSetRoleAsVolunteer = async () => {
    await setRole({ role: 'user' })
      .unwrap()
      .then(async () => {
        await update({
          ...session,
          user: {
            ...session?.user,
            role: 'user',
          },
        });
        toast.success('You can continue using HOOPOE as a opportunity seeker', {
          theme: 'light',
        });
      })
      .catch(({ data: errorData }) => {
        toast.error(errorData.message, {
          autoClose: false,
          theme: 'light',
        });
      });

    router.refresh();
  };

  const handleSetRoleAsOrganization = async () => {
    await setRole({ role: 'org' })
      .unwrap()
      .then(async () => {
        await update({
          ...session,
          user: {
            ...session?.user,
            role: 'org',
          },
        });
        toast.success('You can continue using HOOPOE as an Organization.', {
          theme: 'light',
        });
      })
      .catch(({ data: errorData }) => {
        toast.error(errorData.message, {
          autoClose: false,
          theme: 'light',
        });
      });
    router.refresh();
  };

  return (
    <div className='md:grid md:grid-cols-2 font-epilogue flex h-screen'>
      {/* Left Side */}
      <div className='hidden md:block left-section'>
        <AuthLeftSection />
      </div>

      {/* Right side */}
      <div className='absolute top-0 right-2 my-4 mx-2'>
        <LocaleSwitcher />
      </div>
      <div className='container my-auto flex flex-col justify-center px-10 py-10 max-w-lg'>
        <div className=' md:hidden p-2 text-center pb-10'>
          <Image
            width={200}
            height={200}
            src='/assets/akil-logo.png'
            className='h-12 mx-auto'
            alt='logo'
          />
        </div>
        <h2 className='text-center title font-black text-xl font-poppins py-4 text-secondary'>
          {t('title')}
        </h2>

        <div className='md:grid md:grid-cols-2 font-epilogue flex gap-6'>
          <div
            onClick={handleSetRoleAsVolunteer}
            onMouseEnter={() =>
              setShowTooltip({ ...showTooltip, volunteer: true })
            }
            onMouseLeave={() =>
              setShowTooltip({ ...showTooltip, volunteer: false })
            }
            className='relative cursor-pointer transform transition duration-500 ease-in-out hover:scale-105 active:shadow-lg'
          >
            <Image
              src='/assets/volunteer.png'
              alt='Volunteer Icon'
              width={200}
              height={200}
            />
            {showTooltip.volunteer && (
              <div className='absolute top-0 mt-2 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 text-sm text-gray-700 p-2 rounded shadow-lg w-60'>
                {t('OpportunitySeekerDesc')}
              </div>
            )}
          </div>

          <div
            onClick={handleSetRoleAsOrganization}
            onMouseEnter={() =>
              setShowTooltip({ ...showTooltip, organization: true })
            }
            onMouseLeave={() =>
              setShowTooltip({ ...showTooltip, organization: false })
            }
            className='relative cursor-pointer transform transition duration-500 ease-in-out hover:scale-105 active:shadow-lg'
          >
            <Image
              src='/assets/organization.png'
              alt='Organization Icon'
              width={200}
              height={80}
            />
            {showTooltip.organization && (
              <div className='absolute top-0 mt-2 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 text-sm text-gray-700 p-2 rounded shadow-lg w-60'>
                {t('OrganizationRepresentativeDesc')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleSelectionForm;
