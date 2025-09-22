import LocaleSwitcher from '@/components/LocaleSwitcher';
import LoadingButton from '@/components/buttons/LoadingButton';
import { IconButton } from '@material-tailwind/react';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useState } from 'react';
import { FaPowerOff } from 'react-icons/fa';

const OrgNavbar: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const t = useTranslations('OrganizationSignupPage');

  const handleLogout = async () => {
    setLoading(true);
    if (session?.user) {
      return await signOut({ callbackUrl: '/' });
    }
    setLoading(false);
  };

  return (
    <div className='bg-tertiary sticky top-0 z-10'>
      <nav className='flex justify-between align-middle container mx-auto py-4 px-4 sm:px-0 '>
        <div className='logo flex'>
          <Image
            width={100}
            height={100}
            src='/assets/akil-logo.png'
            className='h-6 my-auto'
            alt='Logo'
          />
        </div>

        <div className='flex justify-between items-center gap-2 '>
          <IconButton
            variant='text'
            className='text-bgPrimary sm:hidden'
            onClick={handleLogout}
          >
            <FaPowerOff size={20} />
          </IconButton>
          <LoadingButton
            loading={loading}
            className='hidden sm:block text-bgPrimary py-2 font-poppins font-bold text-sm capitalize'
            color='amber'
            variant='text'
            onClick={handleLogout}
          >
            {t('buttonText.logout')}
          </LoadingButton>
          <div className='sm:hidden'>
            <LocaleSwitcher />
          </div>
          <div className='hidden sm:block'>
            <LocaleSwitcher />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default OrgNavbar;
